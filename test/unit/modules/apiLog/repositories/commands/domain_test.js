const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ApiLog = require('../../../../../../bin/modules/apiLog/repositories/commands/domain');
const command = require('../../../../../../bin/modules/apiLog/repositories/commands/command');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Api Log Domain Command", () => {
    const document = {};
    const queryResult = {};

    describe("addLog", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success insert one api log to database", async () => {
            const database = {
                model: sandbox.stub().returns({ create: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(command.prototype, 'insertOne').resolves(queryResult);

            const apiLog = new ApiLog();
            const result = await apiLog.addLog(document);
            assert.equal(result, queryResult);
        });
    });
});
