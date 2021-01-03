const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const Command = require('../../../../../../bin/modules/transaction/repositories/commands/command');
const httpClient = require('../../../../../../bin/helpers/utils/httpClient');

describe("Transaction Command", () => {
    describe("updateOneTransaction", () => {
        afterEach(() => {
            sandbox.restore();
        });

        const userId = "628123456789", transactionId = "IIAXXA12983189317391", transactionStatus = "Failed"
        const responseData = {
            message: "Transaction status updated",
            status: true,
            code: 200
        }

        it("should return update transaction result", async () => {
            sandbox.stub(httpClient, 'sendRequest').resolves(responseData);

            const command = new Command();
            let result = await command.updateOneTransaction(userId, transactionId, transactionStatus);
            assert.equal(result, responseData);
        })
    })
})
