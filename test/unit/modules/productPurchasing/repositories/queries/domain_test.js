const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ProductPurchasing = require('../../../../../../bin/modules/productPurchasing/repositories/queries/domain');
const query = require('../../../../../../bin/modules/productPurchasing/repositories/queries/query');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Query Domain", () => {
    const queryResult = {};

    describe("findByTransactionId", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success find one product purchasing transaction", async () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(query.prototype, 'findOne').resolves(queryResult);

            const productPurchasing = new ProductPurchasing();
            const result = await productPurchasing.findByTransactionId("IDHALX15839100012031");
            assert.equal(result, queryResult);
        });
    });
});
