const Logger = require('../../../helpers/utils/logger');

var Handler = function (type, handler) {
    this.requestHandler = handler;
    this.type = type;
    this.nextHandler = null;
}

Handler.prototype.setNextHandler =  function(handler) {
    this.nextHandler = handler;
    return handler;
}

/* istanbul ignore next */
Handler.prototype.handleRequest = function(params) {
    if (params['type'] && this.type === params['type']) {
        return this.requestHandler(params);
    } else if (params['type'] && this.nextHandler !== null){
        return this.nextHandler.handleRequest(params);
    } else {
        Logger.error("Product not available", params);
		throw { repeatable: false };
	}
}

module.exports = Handler;
