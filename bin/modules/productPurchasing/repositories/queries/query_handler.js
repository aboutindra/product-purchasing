const ProductPurchasing = require('./domain');
const database = "product-purchasing-mongodb";

const findByTransactionId = async (transactionId) => {
    const productPurchasing = new ProductPurchasing(database);
    try {
        return await productPurchasing.findByTransactionId(transactionId);
    } catch (error) {
        throw { repeatable: true };
    }
}

module.exports = {
    findByTransactionId
}
