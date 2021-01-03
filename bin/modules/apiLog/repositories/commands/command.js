const dbConnectionPool = require('../../../../helpers/databases/mongodb/connection');

class Command {
    constructor(databaseName) {
        const database = dbConnectionPool.getConnection(databaseName);
        this.model = database.model("apilogs", require('../schema/schema'));
    }

    async insertOne (document) {
        return this.model.create(document);
    }
}

module.exports = Command;
