const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const commandHandler = require('../../../../../bin/modules/transaction/repositories/commands/command_handler');
const handler = require('../../../../../bin/modules/transaction/handlers/handler');

describe("Transaction Handler", () => {
    describe("updateTransactionStatus", () => {
        afterEach(() => {
            sandbox.restore();
        });

        const userId = "628123456789", transactionId = "IIAXXA12983189317391", transactionStatus = "Failed"
        
        it("should success to update transaction status", async () => {
            const responseData = {
                message: "Transaction status updated",
                status: true,
                code: 200
            }
            sandbox.stub(commandHandler, 'updateTransactionStatus').resolves(responseData);

            await handler.updateTransactionStatus(userId, transactionId, transactionStatus);
        });

        it("should failed to update transaction status", () => {
            const responseData = {
                message: "Transaction not found",
                status: false,
                code: 404
            }
            sandbox.stub(commandHandler, 'updateTransactionStatus').rejects(responseData);

            handler.updateTransactionStatus(userId, transactionId, transactionStatus)
            .catch(error => {
                assert.deepStrictEqual(error, { repeatable: true });
            });
        })
    })
})
