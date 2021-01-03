const config = require('config');
const apm = require('elastic-apm-node');
const commandHandler = require('../repositories/commands/command_handler');
const queryHandler = require('../repositories/queries/query_handler');
const Logger = require('../../../helpers/utils/logger');
const purchasingHandler = require('../utils/purchasingHandler');
const MessageBroker = require('../../../helpers/message-broker/kafka/broker');
const transactionHandler = require('../../transaction/handlers/handler');

const purchaseProduct = async (payload) => {
    try {
        if (payload.retry > 2) {
            Logger.info("Can't retry processing transaction " + payload.transactionId);
            throw { repeatable: false };
        }

        let transaction = await queryHandler.findByTransactionId(payload.transactionId);
        if (transaction && transaction.isPurchaseSuccess) {
            Logger.info("Transaction " + transaction.transactionId + " has been completed");
            return;
        }

        transaction = {
            transactionId: payload.transactionId,
            userId: payload.userId,
            product: payload.product,
            discountAmount: payload.discountAmount,
            transactionAmount: payload.transactionAmount,
            isPurchaseSuccess: payload.isPurchaseSuccess || false,
            additionalInformation: payload.additionalInformation || {}
        }

        if (payload.isPurchaseSuccess) {
            await commandHandler.createOne(transaction);
            return;
        }

        Logger.info("Purchase product "+ payload.product.productCode + ", for id: " + payload.userId + " , transaction id : " + payload.transactionId);
        const params = {
            type: transaction.product.productType,
            code: transaction.product.productCode,
            billNumber: transaction.product.billNumber,
            amount: transaction.product.billAmount,
            transactionId: transaction.product.refTransactionId,
            refNo: transaction.product.refNumber
        }

        const purchasingResult = await purchasingHandler.handleRequest(params);
        if (purchasingResult.status) {
            Logger.info("Successfully purchase " + payload.product.productCode + ", for transaction id " + payload.transactionId + ", user id " + payload.userId);
            transaction.isPurchaseSuccess = true;
            transaction.product.totalAmount = purchasingResult.totalAmount;
            transaction.additionalInformation = purchasingResult.additionalInformation;

            payload.isPurchaseSuccess = true;
            payload.product.totalAmount = purchasingResult.totalAmount;
            payload.additionalInformation = purchasingResult.additionalInformation;
        } else {
            Logger.info("Failed to purchase " + payload.productCode + ", repeatable: " + purchasingResult.repeatable + ", for user id: " + payload.userId
            + " , transaction id : " + payload.transactionId);
            await commandHandler.createOne(transaction);
            apm.captureError("Failed to purchase " + payload.productCode + ", repeatable: " + purchasingResult.repeatable + ", for user id: " + payload.userId)
            throw { repeatable: purchasingResult.repeatable };
        }

        await commandHandler.createOne(transaction);
        await requestAccountMutation(payload);
        await transactionHandler.updateTransactionStatus(payload.userId, payload.transactionId, "Success", purchasingResult.additionalInformation);
        return;
    } catch (error) {
        const messageBroker = new MessageBroker("product-purchasing-kafka");
        apm.captureError(error)
        payload.retry += 1;
        if (error.repeatable) {
            await messageBroker.publishMessage(payload, config.get("kafkaProductPurchasingTopic"));
            return;
        } else {
            payload.retry = 0;
            await messageBroker.publishMessage(payload, config.get("refundPointTopic"));
            transactionHandler.updateTransactionStatus(payload.userId, payload.transactionId, "Failed")
            .catch(error => {
                Logger.error("Failed to update transaction status (transaction is failed) ");
                return;
            });
        }
    }
}

const requestAccountMutation = async (transaction) => {
    try {
        const messageBroker = new MessageBroker("product-purchasing-kafka");
        const virtualAccountMutationPayload = {
            transactionId: transaction.transactionId,
            userId: transaction.userId,
            mutations: [
                {
                    sourcePartnerCode: transaction.source.code,
                    targetPartnerCode: "INP",
                    amount: transaction.transactionAmount + transaction.source.costInCurrency
                }
            ],
            retry: 0
        }
        await messageBroker.publishMessage(virtualAccountMutationPayload, config.get("virtualAccountMutationTopic"));
    } catch (error) {
        Logger.error(error);
        throw { repeatable: true };
    }
}

module.exports = {
    purchaseProduct
}
