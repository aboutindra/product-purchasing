const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const queryHandler = require('../../../../../../bin/modules/productPurchasing/repositories/queries/query_handler');
const ProductPurchasing = require('../../../../../../bin/modules/productPurchasing/repositories/queries/domain');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Query Handler", () => {
    const queryResult = {};
    const throwResult = { repeatable: true };

    describe("findByTransactionId", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success find one product purchasing transaction", async () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ProductPurchasing.prototype, 'findByTransactionId').resolves(queryResult);

            const result = await queryHandler.findByTransactionId("");
            assert.equal(result, queryResult);
        });

        it("should fail find one product purchasing transaction", () => {
            const database = {
                model: sandbox.stub()
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ProductPurchasing.prototype, 'findByTransactionId').rejects();

            queryHandler.findByTransactionId("")
            .catch(error => {
                assert.deepStrictEqual(error, throwResult);
            });
        });
    });
});
