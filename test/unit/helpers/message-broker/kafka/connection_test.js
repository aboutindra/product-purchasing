const connection = require('../../../../../bin/helpers/message-broker/kafka/connection');

describe("Kafka Connection", () => {
    describe("init", () => {
        it("should init message broker connection", () => {
            connection.init();
        });
    });

    describe("getConnection", () => {
        it("should return message broker connection", () => {
            const conn = connection.getConnection("index");
        });
    });

    describe("getConnection", () => {
        it("should return message broker connection", () => {
            const conn = connection.getConnection("product-purchasing-kafka");
        });
    });

    describe("close", () => {
        it("should close all message broker connection", () => {
            connection.close();
        });
    })
});