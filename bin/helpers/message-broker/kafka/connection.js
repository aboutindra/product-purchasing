const kafka = require('kafka-node');
const config = require('config');
const Producer = kafka.HighLevelProducer;
const connectionPool = [];

const connection = () => {
    return { index: null, config: '', client: null };
};

function addConnectionToPool() {
    const messageBrokers = config.get("KafkaProducer");
    for (let messageBroker of messageBrokers) {
        let newConnection = connection();
        newConnection.index = messageBroker.index;
        newConnection.config = messageBroker.config;
        connectionPool.push(newConnection);
    }
}

function createConnectionPool() {
    for (let connection of connectionPool) {
        const client = new kafka.KafkaClient({kafkaHost: connection.config.uri});
        connection.client = new Producer(client);
    }
}

function getConnection(index) {
    for (let connection of connectionPool) {
        if (connection.index === index) {
            return connection.client;
        }
    }
    return null;
}

function init() {
    addConnectionToPool();
    createConnectionPool();
}

function close() {
    for (let connection of connectionPool) {
        connection.client.close();
    }
}

module.exports = {
    init,
    getConnection,
    close
}
