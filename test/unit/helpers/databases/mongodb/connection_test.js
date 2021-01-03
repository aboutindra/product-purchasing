const sandbox = require('sinon').createSandbox();
const mongoose = require('mongoose');

const connection = require('../../../../../bin/helpers/databases/mongodb/connection');

describe("MongoDB Connection", () => {
    describe("init", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to init mongodb connection", async () => {
            sandbox.stub(mongoose, 'createConnection').resolves({ on: sandbox.stub() });
            await connection.init();
        });

        it("should failed to init mongodb connection", async () => {
            sandbox.stub(mongoose, 'createConnection').rejects({});
            await connection.init();
        });
    });

    describe("getConnection", () => {
        it("should return mongodb connection", async () => {
            const conn = connection.getConnection("");
        });
    });

    describe("getConnection", () => {
        it("should return mongodb connection", async () => {
            const conn = connection.getConnection("point-redeem-mongodb");
        });
    });

    describe("close", () => {
        it("should close all mongodb connection", () => {
            connection.close();
        });
    });
});
