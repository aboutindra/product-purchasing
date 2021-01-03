const connectionPool = require('./connection');

class MessageBroker {
    constructor(messageBrokerName) {
        this.client = connectionPool.getConnection(messageBrokerName);
    }

    publishMessage(data, topic) {
        const payload = [
            {
                topic: topic,
                messages: JSON.stringify(data),
                attributes: 1,
                timestamp: Date.now()
            }
        ]

        return new Promise((resolve, reject) => {
            this.client.send(payload, (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        })
    }
}

module.exports = MessageBroker;
