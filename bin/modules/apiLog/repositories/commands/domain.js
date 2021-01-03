const Command = require('./command');

class ApiLog {
    constructor(databaseName){
        this.command = new Command(databaseName);
    }

    async addLog(document){
        const ctx = 'ApiLog-addLog';

        return this.command.insertOne(document);
    }
}

module.exports = ApiLog;
