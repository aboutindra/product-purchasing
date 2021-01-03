const Query = require('./query');

class ProductPurchasing {
    constructor(databaseName){
        this.query = new Query(databaseName);
    }

    async findByTransactionId(transactionId){
        let filter = {
            transactionId
        }

        return this.query.findOne(filter);
    }
}

module.exports = ProductPurchasing;
