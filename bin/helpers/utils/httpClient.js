const axios = require('axios');
const ApiLog = require('../../modules/apiLog/repositories/commands/command_handler');

function sendRequest (method, baseUrl, route, params, headers, body) {
    return new Promise((resolve, reject) => {
        let requestTimestamp = new Date();
        axios.request({
            method: method,
            url: baseUrl + route,
            data: body,
            params: params,
            headers: headers
        }).then(async (result) => {
            let apiLog = {
                url: baseUrl,
                path: route,
                method: method,
                requestData: body,
                requestTime: requestTimestamp,
                responseStatus: result.statusText,
                responseCode: result.status,
                responseData: result.data || null,
                responseTime: new Date()
            };
            await ApiLog.addLog(apiLog)
            resolve(result.data);
        }).catch(async (error) => {
            let apiLog = {
                url: baseUrl,
                path: route,
                method: method,
                requestData: body,
                requestTime: requestTimestamp,
                responseStatus: error.response.statusText,
                responseCode: error.response.status,
                responseData: error.response.data || null,
                responseTime: new Date()
            };
            await ApiLog.addLog(apiLog)
            reject(error.response.data);
        });
    })
}

module.exports = { sendRequest };
