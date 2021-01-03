const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const connection = require('../../../../../bin/helpers/message-broker/kafka/connection');
const MessageBroker = require('../../../../../bin/helpers/message-broker/kafka/broker');

describe("Kafka Broker", () => {
    describe("publishMessage", () => {
        afterEach(() => {
            sandbox.restore();
        });

        const topic = "queue.redeem.point"

        it("should success to publish message", async () => {
            const data = {
                "queue.redeem.point": { '0': 1 }
            }
            const messageBrokerClient = {
                send: sandbox.stub().yields(null, data)
            }
            sandbox.stub(connection, "getConnection").returns(messageBrokerClient);

            const messageBroker = new MessageBroker(topic);
            const result = await messageBroker.publishMessage({}, topic);
            assert.deepStrictEqual(result, data);
        });

        it("should failed to publish message", async () => {
            const errorData = {

            }
            const messageBrokerClient = {
                send: sandbox.stub().yields(errorData, null)
            }
            sandbox.stub(connection, "getConnection").returns(messageBrokerClient);

            const messageBroker = new MessageBroker(topic);
            messageBroker.publishMessage({}, topic)
            .catch(error => {
                assert.deepStrictEqual(error, errorData);
            });
        });
    });
});