const Schema = require('mongoose').Schema;

const apiLogSchema = new Schema({
	url : {type: String},
    path :  {type: String},
    method: {type: String},
    requstHeader : {},
    requestData : {},
    requestTime: {type: Date},
    responseStatus : {type: String},
    responseCode : {type: String},
    responseData : {},
    responseTime : {type: Date}
}, {timestamps: true, strict: true});

module.exports = apiLogSchema;
