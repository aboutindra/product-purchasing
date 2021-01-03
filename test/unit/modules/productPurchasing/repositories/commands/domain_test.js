const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ProductPurchasing = require('../../../../../../bin/modules/productPurchasing/repositories/commands/domain');
const command = require('../../../../../../bin/modules/productPurchasing/repositories/commands/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Command Domain", () => {
    const document = {}
    const queryResult = {};

    describe("createOne", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success create one product purchasing transaction", async () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(command.prototype, 'upsertOne').resolves(queryResult);

            const productPurchasing = new ProductPurchasing();
            const result = await productPurchasing.createOne(document);
            assert.equal(result, queryResult);
        });
    });
});
