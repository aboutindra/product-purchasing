const Handler = require('./commonHandler');
const Products = require('../../../enums/products');
const billerAggregatorService = require('../../billerAggregator/handlers/handler');

const phoneCredits = new Handler(Products.PHONE_CREDIT, billerAggregatorService.purchasePhoneCredit);
const electricTokens = new Handler(Products.ELECTRIC_TOKEN, billerAggregatorService.purchaseElectricToken);
const eWallet = new Handler(Products.TOPUP_BALANCE, billerAggregatorService.purchaseEwalletCredit);

phoneCredits.setNextHandler(electricTokens).setNextHandler(eWallet);

module.exports = phoneCredits;
