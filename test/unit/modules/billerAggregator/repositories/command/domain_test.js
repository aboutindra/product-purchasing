const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const BillerAggregator = require('../../../../../../bin/modules/billerAggregator/repositories/command/domain');
const Command = require('../../../../../../bin/modules/billerAggregator/repositories/command/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Biller Aggregator Command Domain Test", () => {
    describe("purchasePhoneCredit", () => {
        beforeEach(() => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
        });

        afterEach(() => {
            sandbox.restore();
        });

        const params = {
            type: "phone-credit",
            code: "TMONEYTSEL",
            billNumber: "62811234567",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should success to purchase phone credit", async () => {
            const responseData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            };
            const purchasingResult = {
                status: true,
                repeatable: false,
                refTransactionId: "89h9f8asdhf98",
                refNumber: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                additionalInformation: {
                    addInfo: {},
                    bit61: {}
                }
            };
            sandbox.stub(Command.prototype, 'purchasePhoneCredit').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchasePhoneCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase phone credit (repeatable false)", async () => {
            const responseData = {
                resultCode: "GMS-001",
            };
            const purchasingResult = {
                status: false,
                repeatable: false,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchasePhoneCredit').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchasePhoneCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase phone credit (repeatable true)", async () => {
            const errorData = {};
            const purchasingResult = {
                status: false,
                repeatable: true,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchasePhoneCredit').rejects(errorData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchasePhoneCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });
    });

    describe("purchaseElectricToken", () => {
        beforeEach(() => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
        });

        afterEach(() => {
            sandbox.restore();
        });

        const params = {
            type: "electric-token",
            code: "TMONEYPLNPRA",
            billNumber: "8923013801",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should success to purchase electric token", async () => {
            const responseData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            };
            const purchasingResult = {
                status: true,
                repeatable: false,
                refTransactionId: "89h9f8asdhf98",
                refNumber: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                additionalInformation: {
                    addInfo: {},
                    bit61: {}
                }
            };
            sandbox.stub(Command.prototype, 'purchaseElectricToken').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseElectricToken(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase electric token (repeatable false)", async () => {
            const responseData = {
                resultCode: "GMS-001",
            };
            const purchasingResult = {
                status: false,
                repeatable: false,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchaseElectricToken').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseElectricToken(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase electric token (repeatable true)", async () => {
            const errorData = {};
            const purchasingResult = {
                status: false,
                repeatable: true,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchaseElectricToken').rejects(errorData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseElectricToken(params);
            assert.deepStrictEqual(result, purchasingResult);
        });
    });

    describe("purchaseEwalletCredit", () => {
        beforeEach(() => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
        });

        afterEach(() => {
            sandbox.restore();
        });

        const params = {
            type: 4,
            code: 911,
            billNumber: "081234567890",
            amount: 50000,
            transactionId: "IDH1241303402402",
            refNo: "0923fjwsda9fuj03fwfe"
        }

        it("should success to purchase e-wallet credit", async () => {
            const responseData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                amount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            };
            const purchasingResult = {
                status: true,
                repeatable: false,
                refTransactionId: "89h9f8asdhf98",
                refNumber: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                additionalInformation: {
                    addInfo: {},
                    bit61: {}
                }
            };
            sandbox.stub(Command.prototype, 'purchaseEwalletCredit').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseEwalletCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase e-wallet credit (repeatable false)", async () => {
            const responseData = {
                resultCode: "GMS-001",
            };
            const purchasingResult = {
                status: false,
                repeatable: false,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchaseEwalletCredit').resolves(responseData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseEwalletCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });

        it("should failed to purchase e-wallet credit (repeatable true)", async () => {
            const errorData = {};
            const purchasingResult = {
                status: false,
                repeatable: true,
                refTransactionId: null,
                refNumber: null,
                billAmount: null,
                totalAmount: null,
                additionalInformation: null
            };
            sandbox.stub(Command.prototype, 'purchaseEwalletCredit').rejects(errorData);

            const billerAggregator = new BillerAggregator("");
            const result = await billerAggregator.purchaseEwalletCredit(params);
            assert.deepStrictEqual(result, purchasingResult);
        });
    });
});
