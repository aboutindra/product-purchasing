const Command = require('./command');

class ProductPurchasing {
    constructor(databaseName){
        this.command = new Command(databaseName);
    }

    async createOne(document){
        const filter = {
            transactionId: document.transactionId
        }

        return this.command.upsertOne(filter, document);
    }
}

module.exports = ProductPurchasing;
