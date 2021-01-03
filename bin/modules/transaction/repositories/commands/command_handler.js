const Transaction = require('./domain');
const transaction = new Transaction();

const updateTransactionStatus = async (userId, transactionId, transactionStatus, additionalData) => {
  return transaction.updateTransactionStatus(userId, transactionId, transactionStatus, additionalData)
};

module.exports = {
  updateTransactionStatus
};
