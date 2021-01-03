const ProductPurchasing = require('./domain');
const database = "product-purchasing-mongodb";

const createOne = async (document) => {
    const productPurchasing = new ProductPurchasing(database);
    try {
        return await productPurchasing.createOne(document);
    } catch (error) {
        throw { repeatable: true };
    }
}

module.exports = {
    createOne
}
