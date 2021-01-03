const apm = require('elastic-apm-node');
const Command = require('./command');

class BillerAggregator {
    constructor(databaseName) {
        this.command = new Command(databaseName);
    }

    async purchasePhoneCredit(params) {
        let response = {
            status: false,
            repeatable: true,
            refTransactionId: null,
            refNumber: null,
            billAmount: null,
            totalAmount: null,
            additionalInformation: null
        }
        try {
            const { code, billNumber, amount, transactionId, refNo } = params;
            const result = await this.command.purchasePhoneCredit(code, billNumber, amount, transactionId, refNo);
            if (result.resultCode === '0' || result.resultCode === 0) {
                response.status = true;
                response.repeatable = false;
                response.refTransactionId = result.transactionID;
                response.refNumber = result.refNo;
                response.billAmount = result.billAmount;
                response.totalAmount = result.totalAmount;
                response.additionalInformation = {
                    addInfo: result.addInfo,
                    bit61: result.bit61
                }
            } else {
                response.repeatable = false;
            }
        } catch (error) {
            response.repeatable = true;
            apm.captureError(error);
        }
        return response;
    }

    async purchaseElectricToken(params) {
        let response = {
            status: false,
            repeatable: true,
            refTransactionId: null,
            refNumber: null,
            billAmount: null,
            totalAmount: null,
            additionalInformation: null
        }
        try {
            const { billNumber, amount, transactionId, refNo } = params;
            const result = await this.command.purchaseElectricToken(billNumber, amount, transactionId, refNo);
            if (result.resultCode === '0' || result.resultCode === 0) {
                response.status = true;
                response.repeatable = false;
                response.refTransactionId = result.transactionID;
                response.refNumber = result.refNo;
                response.billAmount = result.billAmount;
                response.totalAmount = result.totalAmount;
                response.additionalInformation = {
                    addInfo: result.addInfo,
                    bit61: result.bit61
                }
            } else {
                response.repeatable = false
            }
        } catch (error) {
            response.repeatable = true;
            apm.captureError(error);
        }

        return response;
    }

    async purchaseEwalletCredit(params){
        let response = {
            status: false,
            repeatable: true,
            refTransactionId: null,
            refNumber: null,
            billAmount: null,
            totalAmount: null,
            additionalInformation: null
        }
        try {
            const { code, billNumber, amount, transactionId, refNo } = params;
            let result = await this.command.purchaseEwalletCredit(code, billNumber, amount, transactionId, refNo);
            if (result.resultCode === '0' || result.resultCode === 0) {
                response.status = true;
                response.repeatable = false;
                response.refTransactionId = result.transactionID;
                response.refNumber = result.refNo;
                response.billAmount = result.amount;
                response.totalAmount = result.totalAmount;
                response.additionalInformation = {
                    addInfo: result.addInfo,
                    bit61: result.bit61
                }
            } else {
                response.repeatable = false
            }
        } catch (error) {
            response.repeatable = true;
            apm.captureError(error);
        }

        return response;
    }

}

module.exports = BillerAggregator;
