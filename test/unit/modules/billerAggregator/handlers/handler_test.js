const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const commandHandler = require('../../../../../bin/modules/billerAggregator/repositories/command/command_handler');
const handler = require('../../../../../bin/modules/billerAggregator/handlers/handler');

describe("BillerAggregator Handler Test", () => {
    describe("purchasePhoneCredit", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should return purchase phone credit result", async () => {
            let params = {
                type: "phone-credit",
                code: "TMONEYTSEL",
                billNumber: "62811234567",
                amount: 50000,
                transactionId: "IDH1241303402402",
                refNo: "0923fjwsda9fuj03fwfe"
            }
            const response = {
                status: false,
                repeatable: true,
                transactionRefId: null,
                transactionRefNumber: null,
                nominal: null,
                priceAmount: null,
                additionalInformation: null
            }
            sandbox.stub(commandHandler, 'purchasePhoneCredit').resolves(response);

            const result = await handler.purchasePhoneCredit(params);
            assert.deepStrictEqual(result, response);
        });
    });

    describe("purchaseElectricToken", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should return purchase electric token result", async () => {
            let params = {
                type: "electric-token",
                code: "TMONEYPLNPRA",
                billNumber: "8923013801",
                amount: 50000,
                transactionId: "IDH1241303402402",
                refNo: "0923fjwsda9fuj03fwfe"
            }
            const response = {
                status: false,
                repeatable: true,
                transactionRefId: null,
                transactionRefNumber: null,
                nominal: null,
                priceAmount: null,
                additionalInformation: null
            }
            sandbox.stub(commandHandler, 'purchaseElectricToken').resolves(response);

            const result = await handler.purchaseElectricToken(params);
            assert.deepStrictEqual(result, response);
        });
    });

    describe('topUpLinkAja', () => {
        it('Should return topup linkaja', async () => {
            let params = {
                walletNumber: "62811234567",
                amount: 50000,
                transactionId: "IDH1241303402402",
                refNo: "0923fjwsda9fuj03fwfe"
            }
            const response = {
                status: false,
                repeatable: true,
                transactionRefId: null,
                transactionRefNumber: null,
                nominal: null,
                priceAmount: null,
                additionalInformation: null
            }
            sandbox.stub(commandHandler, 'purchaseEwalletCredit').resolves(response);

            const result = await handler.purchaseEwalletCredit(params);
            assert.deepStrictEqual(result, response);
        });
    })

});
