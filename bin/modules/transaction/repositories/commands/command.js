const httpClient = require('../../../../helpers/utils/httpClient');
const httpMethod = require('../../../../helpers/http-method/method');
const config = require('config');

class Command {

  constructor() {}

  async updateOneTransaction(userId, transactionId, transactionStatus, additionalData){
    const payload = {
      transactionStatus,
      additionalData
    }
    const headers = {
      'user-id': userId
    }

    return httpClient.sendRequest(httpMethod.PATCH, config.get('transactionServiceUrl'), config.get('transactionPath') + transactionId, null,
    headers, payload);
  }
}

module.exports = Command;
