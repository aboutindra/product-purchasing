const BillerAggregator = require('./domain');
const databaseName = "product-purchasing-mongodb";

const purchasePhoneCredit = (params) => {
    const billerAggregator = new BillerAggregator(databaseName);
    return billerAggregator.purchasePhoneCredit(params);
}

const purchaseElectricToken = (params) => {
    const billerAggregator = new BillerAggregator(databaseName);
    return billerAggregator.purchaseElectricToken(params);
}

const purchaseEwalletCredit = (params) => {
    const billerAggregator = new BillerAggregator(databaseName);
    return billerAggregator.purchaseEwalletCredit(params);
}

module.exports = {
    purchasePhoneCredit,
    purchaseElectricToken,
    purchaseEwalletCredit
};
