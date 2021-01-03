const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const Command = require('../../../../../../bin/modules/billerAggregator/repositories/command/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');
const httpClient = require('../../../../../../bin/helpers/utils/httpClient');
const { error } = require('winston');
const CONFIG_KEY = "T-MONEY BILA";

describe("Biller Aggregator Command Test", () => {
    describe("getAccessToken", () => {
        beforeEach(() => {
            const database = {
                model: sandbox.stub().returns({ updateOne: sandbox.stub().resolves })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should success to get access token", async () => {
            const value = {
                idTmoney: "195276280000",
                idFusion: "+6219565000000",
                token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
            }
            const responseData = {
                user: {
                    ...value
                }
            }
            sandbox.stub(httpClient, 'sendRequest').resolves(responseData);

            const command = new Command();
            const result = await command.getAccessToken();
            assert.deepStrictEqual(result, value);
        });

        it("should fail to get access token", () => {
            sandbox.stub(httpClient, 'sendRequest').rejects(new Error());
        
            const command = new Command();
            command.getAccessToken()
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            })
        });
    });

    describe("getConfig", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to get configuration options", async () => {
            const queryResult = {
                key: CONFIG_KEY,
                value: {
                    idTmoney: "195276280000",
                    idFusion: "+6219565000000",
                    token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
                }
            };
            const database = {
                model: sandbox.stub().returns({ findOne: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);

            const command = new Command();
            const result = await command.getConfig();
            assert.deepStrictEqual(result, queryResult.value);
        });

        it("should success to get configuration options (configuration options not available on database)", async () => {
            const value = {
                idTmoney: "195276280000",
                idFusion: "+6219565000000",
                token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
            };
            const database = {
                model: sandbox.stub().returns({ findOne: sandbox.stub().resolves() })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(Command.prototype, 'getAccessToken').resolves(value);

            const command = new Command();
            const result = await command.getConfig();
            assert.deepStrictEqual(result, value);
        });

        it("should failed to get configuration options", () => {
            const queryResult = {
                message: "ERROR"
            };
            const database = {
                model: sandbox.stub().returns({ findOne: sandbox.stub().rejects(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);

            const command = new Command();
            command.getConfig()
            .catch(error => {
                assert.deepStrictEqual(error, queryResult);
            })
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

        const config = {
            idTmoney: "195276280000",
            idFusion: "+6219565000000",
            token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
        }
        const billNumber = "310480941131", amount = 50000, transactionId = "89h9f8asdhf98", refNo = "jafdsnifj39fnwk2ofnewf"

        it("should success to purchase electric token", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            sandbox.stub(httpClient, 'sendRequest').resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            const result = await command.purchaseElectricToken(billNumber, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should success to purchase electric token after refreshing token", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            const httpClientStub = sandbox.stub(httpClient, 'sendRequest');
            httpClientStub.onFirstCall().resolves({resultCode: "GL-007"});
            httpClientStub.onSecondCall().resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);
            sandbox.stub(Command.prototype, 'getAccessToken').resolves(config);

            const command = new Command();
            const result = await command.purchaseElectricToken(billNumber, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should fail to purchase electric token", async () => {
            sandbox.stub(httpClient, 'sendRequest').rejects(new Error());
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            command.purchaseElectricToken(billNumber, amount, transactionId, refNo)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should fail to purchase electric token after retrying 3 times", () => {
            const command = new Command();
            command.purchaseElectricToken(billNumber, amount, transactionId, refNo, 4)
            .catch(error => {
                assert.deepStrictEqual(error, new Error("Internal server error"));
            });
        });
    });

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

        const config = {
            idTmoney: "195276280000",
            idFusion: "+6219565000000",
            token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
        }
        const productCode = "TMONEYTSEL", billNumber = "310480941131", amount = 50000, transactionId = "89h9f8asdhf98", refNo = "jafdsnifj39fnwk2ofnewf"

        it("should success to purchase phone credit", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            sandbox.stub(httpClient, 'sendRequest').resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            const result = await command.purchasePhoneCredit(productCode, billNumber, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should success to purchase phone credit after refreshing token", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            const httpClientStub = sandbox.stub(httpClient, 'sendRequest');
            httpClientStub.onFirstCall().resolves({resultCode: "GL-007"});
            httpClientStub.onSecondCall().resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);
            sandbox.stub(Command.prototype, 'getAccessToken').resolves(config);

            const command = new Command();
            const result = await command.purchasePhoneCredit(productCode, billNumber, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should fail to purchase phone credit", async () => {
            sandbox.stub(httpClient, 'sendRequest').rejects(new Error());
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            command.purchasePhoneCredit(productCode, billNumber, amount, transactionId, refNo)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should fail to purchase phone credit after retrying 3 times", () => {
            const command = new Command();
            command.purchasePhoneCredit(productCode, billNumber, amount, transactionId, refNo, 4)
            .catch(error => {
                assert.deepStrictEqual(error, new Error("Internal server error"));
            });
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

        const config = {
            idTmoney: "195276280000",
            idFusion: "+6219565000000",
            token: "bba8b789cce3618b2e60e9090b6ab79a7810b9859d09509394982e3343713ea18b8b5cf7ddb56d9c"
        }
        const bankCode = 911, bankAccount = "310480941131", amount = 50000, transactionId = "89h9f8asdhf98", refNo = "jafdsnifj39fnwk2ofnewf";

        it("should success to purchase e-wallet credit", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            sandbox.stub(httpClient, 'sendRequest').resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            const result = await command.purchaseEwalletCredit(bankCode, bankAccount, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should success to purchase e-wallet credit after refreshing token", async () => {
            const resultData = {
                resultCode: "0",
                transactionID: "89h9f8asdhf98",
                refNo: "jafdsnifj39fnwk2ofnewf",
                billAmount: 50000,
                totalAmount: 52450,
                addInfo: {},
                bit61: {}
            }
            const httpClientStub = sandbox.stub(httpClient, 'sendRequest');
            httpClientStub.onFirstCall().resolves({resultCode: "GL-007"});
            httpClientStub.onSecondCall().resolves(resultData);
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);
            sandbox.stub(Command.prototype, 'getAccessToken').resolves(config);

            const command = new Command();
            const result = await command.purchaseEwalletCredit(bankCode, bankAccount, amount, transactionId, refNo);
            assert.deepStrictEqual(result, resultData);
        });

        it("should fail to purchase e-wallet credit", async () => {
            sandbox.stub(httpClient, 'sendRequest').rejects(new Error());
            sandbox.stub(Command.prototype, 'getConfig').resolves(config);

            const command = new Command();
            command.purchaseEwalletCredit(bankCode, bankAccount, amount, transactionId, refNo)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should fail to purchase e-wallet credit after retrying 3 times", () => {
            const command = new Command();
            command.purchaseEwalletCredit(bankCode, bankAccount, amount, transactionId, refNo, 4)
            .catch(error => {
                assert.deepStrictEqual(error, new Error("Internal server error"));
            });
        });
    });
});
