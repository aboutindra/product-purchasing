const apm = require("elastic-apm-node").start({
    serviceName: 'inpoin-product-purchasing-service',
    serverUrl: process.env.APM_SERVER_URL,
    index: "apm",
    activate: "dev"
})
const winston = require("winston");
const logger = winston.createLogger();

if( process.env.ELASTIC_URL ){

    var elasticsearch = require('elasticsearch');
    var winston_elasticsearch = require('winston-elasticsearch').ElasticsearchTransport;

    var client = new elasticsearch.Client({
        host: process.env.ELASTIC_URL,
        log: 'info'

    });

    logger.add( new winston_elasticsearch({
        apm,
        client,
        index:"logging"
    }));
}

module.exports = {logger, apm}
