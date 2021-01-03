const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const handler = require('../../../../../bin/modules/productPurchasing/handlers/handler');
const commandHandler = require('../../../../../bin/modules/productPurchasing/repositories/commands/command_handler');
const queryHandler = require('../../../../../bin/modules/productPurchasing/repositories/queries/query_handler');
const purchasingHandler = require('../../../../../bin/modules/productPurchasing/utils/purchasingHandler');
const transactionHandler = require('../../../../../bin/modules/transaction/handlers/handler');
const MessageBroker = require('../../../../../bin/helpers/message-broker/kafka/broker');

describe("Product Purchasing Handler", () => {
    describe("purchaseProduct", () => {
        afterEach(() => {
            sandbox.restore();
        });

        const payload = {
            transactionId: '5622dc05-a5aa-4a40-87b4-84f519a75015',
            userId: '621234567890',
            source: {
                code: 'OMO',
                name: 'OMO Points',
                serviceNumber: '621234567890',
                amount: 17700,
                exchangeRate: 1,
                costInCurrency: 300
            },
            product: {
                productType: 4,
                refTransactionId: '195201208183955265',
                refNumber: '004504262192',
                productCode: '911',
                productName: 'LinkAja',
                billNumber: '082316727390',
                billAmount: 10000,
                feeAmount: 7700,
                totalAmount: 17700
            },
            discountAmount: 0,
            transactionAmount: 17700,
            targetTransaction: 'queue.purchase.product',
            retry: 0
      }

        it("should failed to find transaction by id", async () => {
            sandbox.stub(queryHandler, 'findByTransactionId').rejects({ repeatable: true });
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();

            await handler.purchaseProduct(payload);
        });

        it("should reject completed transaction", async () => {
            const transaction = {
                transactionId: payload.transactionId,
                userId: payload.userId,
                productType: payload.productType,
                productCode: payload.productCode,
                billNumber: payload.billNumber,
                nominal: payload.nominal,
                priceAmount: 0,
                feeAmount: payload.feeAmount,
                discountAmount: payload.discountAmount,
                transactionRefNumber: payload.transactionRefNumber,
                transactionRefId: payload.transactionRefId,
                isPurchaseSuccess: true,
                additionalInformation: {}
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(transaction);
            sandbox.stub(transactionHandler, 'updateTransactionStatus').resolves();

            await handler.purchaseProduct(payload);
        });

        it("should stop retry processing transaction after 3 times retry", async () => {
            payload.retry = 3;
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(transactionHandler, 'updateTransactionStatus').resolves();
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();
        
            await handler.purchaseProduct(payload);
            payload.retry = 0;
        });

        it("should save new transaction (retry after failed save transaction data)", async () => {
            payload.isPurchaseSuccess = true;
            payload.additionalInformation = { addInfo: {}, bit61: {} };
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(commandHandler, 'createOne').resolves();
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();
        
            await handler.purchaseProduct(payload);
            payload.isPurchaseSuccess = undefined;
            payload.additionalInformation = undefined;
        });

        it("should failed to purchase product (repeatable false)", async () => {
            const purchasingResult = {
                status: false,
                repeatable: false
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(purchasingHandler, 'handleRequest').returns(purchasingResult);
            sandbox.stub(commandHandler, 'createOne').resolves();
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();
            sandbox.stub(transactionHandler, 'updateTransactionStatus').resolves();
        
            await handler.purchaseProduct(payload);
        });

        it("should failed to purchase product (repeatable false and fail to update transaction status)", async () => {
            const purchasingResult = {
                status: false,
                repeatable: false
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(purchasingHandler, 'handleRequest').returns(purchasingResult);
            sandbox.stub(commandHandler, 'createOne').resolves();
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();
            sandbox.stub(transactionHandler, 'updateTransactionStatus').rejects();
        
            await handler.purchaseProduct(payload);
        });

        it("should failed to purchase product (repeatable true)", async () => {
            const purchasingResult = {
                status: false,
                repeatable: true
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(purchasingHandler, 'handleRequest').resolves(purchasingResult);
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();

            await handler.purchaseProduct(payload);
        });

        it("should success to purchase product", async () => {
            const purchasingResult = {
                status: true,
                repeatable: false,
                priceAmount: 52450,
                additionalInformation: { addInfo: {}, bit61: {} }
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(purchasingHandler, 'handleRequest').resolves(purchasingResult);
            sandbox.stub(commandHandler, 'createOne').resolves(null);
            sandbox.stub(transactionHandler, 'updateTransactionStatus').resolves(null);
            sandbox.stub(MessageBroker.prototype, 'publishMessage').resolves();
        
            await handler.purchaseProduct(payload);
        });

        it("should success to purchase product but fail to forward request to VA service", async () => {
            const purchasingResult = {
                status: true,
                repeatable: false,
                totalAmount: 52450,
                additionalInformation: { addInfo: {}, bit6: {} }
            }
            sandbox.stub(queryHandler, 'findByTransactionId').resolves(null);
            sandbox.stub(purchasingHandler, 'handleRequest').resolves(purchasingResult);
            sandbox.stub(commandHandler, 'createOne').resolves(null);
            sandbox.stub(transactionHandler, 'updateTransactionStatus').resolves(null);
            const messageBrokerStub = sandbox.stub(MessageBroker.prototype, 'publishMessage');
            messageBrokerStub.onFirstCall().rejects(new Error("Fail to send message"));
            messageBrokerStub.onSecondCall().resolves();
        
            await handler.purchaseProduct(payload);
        });
    });
});
