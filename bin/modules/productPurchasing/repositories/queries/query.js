const dbConnectionPool = require('../../../../helpers/databases/mongodb/connection');

class Query {
    constructor(databaseName) {
        let database = dbConnectionPool.getConnection(databaseName);
        this.model = database.model("purchaseofproducts", require('../schemas/schema'));
    }

    async findOne (filter) {
        return this.model.findOne(filter);
    }
}

module.exports = Query;
