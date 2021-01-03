const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const Command = require('../../../../../../bin/modules/apiLog/repositories/commands/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Api Log Command", () => {
    const document = {}
    const queryResult = {};

    describe("insertOne", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to insert data to database", async () => {
            const database = {
                model: sandbox.stub().returns({ create: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);

            const command = new Command();
            const result = await command.insertOne(document);
            assert.equal(result, queryResult);
        });
    });
});
