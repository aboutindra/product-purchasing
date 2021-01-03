const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const Query = require('../../../../../../bin/modules/productPurchasing/repositories/queries/query');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Query", () => {
    const filter = {}
    const queryResult = {};
    
    describe("findOne", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to find data from database", async () => {
            const database = {
                model: sandbox.stub().returns({ findOne: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);

            const query = new Query();
            const result = await query.findOne(filter);
            assert.equal(result, queryResult);
        })
    })
});
