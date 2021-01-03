const commandHandler = require('../repositories/commands/command_handler');
const logger = require('../../../helpers/utils/logger');

const updateTransactionStatus = async (userId, transactionId, transactionStatus, additionalData) => {
    try {
        return await commandHandler.updateTransactionStatus(userId, transactionId, transactionStatus, additionalData);
    } catch (error) {
        logger.error("Failed update transaction status", error);
        throw { repeatable: true };
    }
}

module.exports = {
    updateTransactionStatus
}
