const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const Command = require('../../../../../../bin/modules/productPurchasing/repositories/commands/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Product Purchasing Command", () => {
    const document = {}
    const queryResult = {};
    
    describe("upsertOne", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to upsert data to database", async () => {
            const database = {
                model: sandbox.stub().returns({ updateOne: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);

            const command = new Command();
            const result = await command.upsertOne(document);
            assert.equal(result, queryResult);
        })
    })
});
