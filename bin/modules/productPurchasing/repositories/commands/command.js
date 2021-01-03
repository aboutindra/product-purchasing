const dbConnectionPool = require('../../../../helpers/databases/mongodb/connection');

class Command {
    constructor(databaseName) {
        let database = dbConnectionPool.getConnection(databaseName);
        this.model = database.model("purchaseofproducts", require('../schemas/schema'));
    }

    async upsertOne (filter, document) {
        return this.model.updateOne(filter, document, { upsert: true });
    }
}

module.exports = Command;
