const commandHandler = require('../repositories/command/command_handler');

const purchasePhoneCredit = async (params) => {
    return commandHandler.purchasePhoneCredit(params);
}

const purchaseElectricToken = (params) => {
    return commandHandler.purchaseElectricToken(params);
}

const purchaseEwalletCredit = (params) => {
    return commandHandler.purchaseEwalletCredit(params);
}

module.exports = {
    purchasePhoneCredit,
    purchaseElectricToken,
    purchaseEwalletCredit
}
