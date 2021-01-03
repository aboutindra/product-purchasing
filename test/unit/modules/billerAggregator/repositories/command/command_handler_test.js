const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');
const commandHandler = require('../../../../../../bin/modules/billerAggregator/repositories/command/command_handler');
const BillerAggregator = require('../../../../../../bin/modules/billerAggregator/repositories/command/domain');

describe("Biller Aggregator Command Handler Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("purchaseEwalletCredit", () => {
        const params = {
            type: 4,
            code: 911,
            billNumber: "081234567890",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should return purchase e-wallet credit result", async () => {
            const database = {
                model: sandbox.stub()
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
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(BillerAggregator.prototype, 'purchaseEwalletCredit').resolves(response);

            const result = await commandHandler.purchaseEwalletCredit(params);
            assert.deepStrictEqual(result, response);
        });
    });

    describe("purchasePhoneCredit", () => {
        const params = {
            type: 1,
            code: "TMONEYTSEL",
            billNumber: "62811234567",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should return purchase phone credit result", async () => {
            const database = {
                model: sandbox.stub()
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
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(BillerAggregator.prototype, 'purchasePhoneCredit').resolves(response);

            const result = await commandHandler.purchasePhoneCredit(params);
            assert.deepStrictEqual(result, response);
        });
    });

    describe("purchaseElectricToken", () => {
        const params = {
            type: 3,
            code: "TMONEYPLNPRA",
            billNumber: "8923013801",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should return purchase electric token result", async () => {
            const database = {
                model: sandbox.stub()
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
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(BillerAggregator.prototype, 'purchaseElectricToken').resolves(response);

            const result = await commandHandler.purchaseElectricToken(params);
            assert.deepStrictEqual(result, response);
        });
    });
});
