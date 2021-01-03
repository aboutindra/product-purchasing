const Command = require('./command');

class Package {

  constructor(){
    this.command = new Command();
  }

  async updateTransactionStatus(userId, transactionId, transactionStatus, additionalData){
    return this.command.updateOneTransaction(userId, transactionId, transactionStatus, additionalData);
  }
}

module.exports = Package;
