const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const commandHandler = require('../../../../../../bin/modules/apiLog/repositories/commands/command_handler');
const ApiLog = require('../../../../../../bin/modules/apiLog/repositories/commands/domain');
const mongoConnectionPool = require('../../../../../../bin/helpers/databases/mongodb/connection');

describe("Api Log Command Handler", () => {
    const document = {};
    const queryResult = {};

    describe("addLog", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success add api log to database", async () => {
            const database = {
                model: sandbox.stub().returns({ create: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ApiLog.prototype, 'addLog').resolves(queryResult);

            await commandHandler.addLog(document);
        });

        it("should fail add api log to database", async () => {
            const database = {
                model: sandbox.stub().returns({ create: sandbox.stub().resolves(queryResult) })
            }
            sandbox.stub(mongoConnectionPool, 'getConnection').returns(database);
            sandbox.stub(ApiLog.prototype, 'addLog').rejects();

            await commandHandler.addLog(document);
        });
    });
});
