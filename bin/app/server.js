const kafka = require('kafka-node');
const config = require('config');
const apm = require('elastic-apm-node').start({
    serverUrl: config.get('ApmServerUrl'),
    active: config.get('ApmActive')
})
require('../helpers/databases/mongodb/connection').init();
require('../helpers/message-broker/kafka/connection').init();
const Logger = require('../helpers/utils/logger');
const productPurchasing = require('../modules/productPurchasing/handlers/handler');

async function handleIncomingMessage (consumer, message) {
    const payload = JSON.parse(message.value);
    Logger.info("Transaction " + payload.transactionId + " is being processed");
    await productPurchasing.purchaseProduct(payload);
    //Commit offset manually
    setTimeout(() => {
        consumer.commit((error, data) => {
            Logger.info("Transaction " + payload.transactionId + " has been processed");
            if (error) {
                console.error('error commiting kafka offset' + error);
            }
        })
    }, 0);
}

async function AppServer() {
    const messageBrokerConfig = {
        kafkaHost: config.get("kafkaProductPurchasingUrl"),
        groupId: config.get("kafkaGroupName"),
        autoCommit: false,
        sessionTimeout: 15000,
        fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
        protocol: ['roundrobin'],
        fromOffset: 'latest',
        outOfRangeOffset: 'earliest'
    };

    const consumerGroup = new kafka.ConsumerGroup(messageBrokerConfig, config.get("kafkaConsumedTopic").split(' '));
    /* istanbul ignore next */
    consumerGroup.on('connect', function () {
        console.info("Connected to message broker, at : ", new Date());
    })

    /* istanbul ignore next */
    consumerGroup.on('error', function onError(error) {
        console.error(error);
        apm.captureError(error)
    });

    /* istanbul ignore next */
    consumerGroup.on('message', async function (message) {
        await handleIncomingMessage(consumerGroup, message);
    });
}

module.exports = AppServer;
