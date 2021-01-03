const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const Transaction = require('../../../../../../bin/modules/transaction/repositories/commands/domain');
const commandHandler = require('../../../../../../bin/modules/transaction/repositories/commands/command_handler');

describe("Transaction Command Handler", () => {
    describe("updateTransactionStatus", () => {
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
            sandbox.stub(Transaction.prototype, 'updateTransactionStatus').resolves(responseData);

            let result = await commandHandler.updateTransactionStatus(userId, transactionId, transactionStatus);
            assert.equal(result, responseData);
        })
    })
})
