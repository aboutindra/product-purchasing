const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const commandHandler = require('../../../../../../bin/modules/productPurchasing/repositories/commands/command_handler');
const ProductPurchasing = require('../../../../../../bin/modules/productPurchasing/repositories/commands/domain');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Command Handler", () => {
    const document = {}
    const queryResult = {};
    const throwResult = { repeatable: true };

    describe("createOne", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success create one product purchasing transaction", async () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ProductPurchasing.prototype, 'createOne').resolves(queryResult);

            const result = await commandHandler.createOne(document);
            assert.equal(result, queryResult);
        });

        it("should fail create one product purchasing transaction", () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ProductPurchasing.prototype, 'createOne').rejects();

            commandHandler.createOne(document)
            .catch(error => {
                assert.deepStrictEqual(error, throwResult);
            });
        });
    });
});
