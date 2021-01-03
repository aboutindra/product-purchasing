const httpClient = require('../../../../helpers/utils/httpClient');
const httpMethod = require('../../../../helpers/http-method/method');
const querystring = require('querystring');
const dbConnectionPool = require('../../../../helpers/databases/mongodb/connection');
const CryptoJS = require('crypto-js');
const CONFIG_KEY = "T-MONEY BILA";

class Command {
    constructor(databaseName) {
        const database = dbConnectionPool.getConnection(databaseName);
        this.configModel = database.model("configs", require('../schemas/schema'));
    }

    async getAccessToken() {
        const timestamp = new Date();
        const dateString = timestamp.getUTCFullYear() + '-' + (timestamp.getUTCMonth() + 1) + '-' + timestamp.getUTCDate()
         + " " + timestamp.getUTCHours() + ":" + timestamp.getUTCMinutes() + ":" + timestamp.getUTCSeconds();
        const body = querystring.stringify({
            userName: process.env.TMONEY_USERNAME,
            password: process.env.TMONEY_PASSWORD,
            terminal: process.env.TMONEY_TERMINAL,
            signature: getSignature(dateString),
            datetime: dateString,
            apiKey: process.env.TMONEY_PUBLIC_KEY
        });
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        try {
            const result = await httpClient.sendRequest(httpMethod.POST, process.env.TMONEY_URL, process.env.TMONEY_LOGIN_PATH, null, headers, body);
            const value = {
                idTmoney: result.user.idTmoney,
                idFusion: result.user.idFusion,
                token: result.user.token
            }
            await this.configModel.updateOne({ key: CONFIG_KEY }, { $set: { value } }, { upsert: true });
            return value;
        } catch (error) {
            throw error;
        }
    }

    async getConfig(){
        try {
            const tmoneyConfig = await this.configModel.findOne({ key: CONFIG_KEY });
            if ((!tmoneyConfig || !tmoneyConfig.value.token)) {
                return await this.getAccessToken();
            }
            return tmoneyConfig.value;
        } catch (error) {
            throw error;
        }
    }

    async purchaseElectricToken(billNumber, amount, transactionID, refNo, retry = 1) {
        if (retry > 3) {
            throw new Error("Internal server error");
        }
        try {
            const tmoneyConfig = await this.getConfig();
            const body = querystring.stringify({
                transactionType: 2,
                terminal: process.env.TMONEY_TERMINAL,
                idTmoney: tmoneyConfig.idTmoney,
                idFusion: tmoneyConfig.idFusion,
                token: tmoneyConfig.token,
                productCode : "TMONEYPLNPRA",
                billNumber,
                amount,
                pin: process.env.TMONEY_PIN,
                transactionID,
                refNo,
                apiKey: process.env.TMONEY_PUBLIC_KEY
            });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            const result = await httpClient.sendRequest(httpMethod.POST, process.env.TMONEY_URL, process.env.TMONEY_BILL_PAYMENT_PATH, null, headers, body);
            if (result.resultCode === "GL-007") {
                await this.getAccessToken();
                retry++;
                return this.purchaseElectricToken(billNumber, amount, transactionID, refNo, retry);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async purchasePhoneCredit(productCode, billNumber, amount, transactionID, refNo, retry = 1) {
        if (retry > 3) {
            throw new Error("Internal server error");
        }
        try {
            const tmoneyConfig = await this.getConfig();
            const body = querystring.stringify({
                transactionType: 2,
                terminal: process.env.TMONEY_TERMINAL,
                idTmoney: tmoneyConfig.idTmoney,
                idFusion: tmoneyConfig.idFusion,
                token: tmoneyConfig.token,
                productCode,
                billNumber,
                amount,
                pin: process.env.TMONEY_PIN,
                transactionID,
                refNo,
                apiKey: process.env.TMONEY_PUBLIC_KEY
            });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            const result = await httpClient.sendRequest(httpMethod.POST, process.env.TMONEY_URL, process.env.TMONEY_TOPUP_PREPAID_PATH, null, headers, body);
            if (result.resultCode === "GL-007") {
                await this.getAccessToken();
                retry++;
                return this.purchasePhoneCredit(productCode, billNumber, amount, transactionID, refNo, retry);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async purchaseEwalletCredit(bankCode, bankAccount, amount, transactionID, refNo, retry = 1) {
        if (retry > 3) {
            throw new Error("Internal server error");
        }
        try {
            const tmoneyConfig = await this.getConfig();
            const body = querystring.stringify({
                transactionType: 2,
                terminal: process.env.TMONEY_TERMINAL,
                idTmoney: tmoneyConfig.idTmoney,
                idFusion: tmoneyConfig.idFusion,
                token: tmoneyConfig.token,
                bankCode,
                bankAccount,
                amount,
                pin: process.env.TMONEY_PIN,
                description: "Top up LinkAja via myInpoin platform",
                transactionID,
                refNo,
                apiKey: process.env.TMONEY_PUBLIC_KEY,
                thirdpartyEmail: process.env.TMONEY_USERNAME
            });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            const result = await httpClient.sendRequest(httpMethod.POST, process.env.TMONEY_URL, process.env.TMONEY_TOPUP_WALLET, null, headers, body);
            if (result.resultCode === "GL-007") {
                await this.getAccessToken();
                retry++;
                return this.purchaseEwalletCredit(bankCode, bankAccount, amount, transactionID, refNo, retry);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}

function getSignature(timestamp){
    const payload = process.env.TMONEY_USERNAME + timestamp + process.env.TMONEY_TERMINAL + process.env.TMONEY_PUBLIC_KEY;

    const hmacSignature = CryptoJS.HmacSHA256(payload, process.env.TMONEY_PRIVATE_KEY).toString();
    return hmacSignature;
}

module.exports = Command;
