const assert = require('assert');

const CommonHandler = require('../../../../../bin/modules/productPurchasing/utils/commonHandler');

describe("Product Purchasing Common Handler Utils", () => {
    describe("setNextHandler", () => {
        it("should success to set next handler", () => {
            const handler = new CommonHandler("handler1", function () {});
            const nextHandler = new CommonHandler("handler2", function () {});
            handler.setNextHandler(nextHandler);
        });
    });

    describe("handleRequest", () => {
        it("should success to handle request", () => {
            const params = {
                type: "handler2"
            }
            const handler = new CommonHandler("handler1", function () { return 1 });
            const nextHandler = new CommonHandler("handler2", function () { return 2 });
            handler.setNextHandler(nextHandler);
            const result = handler.handleRequest(params);
            assert.strictEqual(result, 2);
        });

        it("should failed to handle request", () => {
            const params = {
                type: "handler3"
            }
            const handler = new CommonHandler("handler1", function () { return 1 });
            const nextHandler = new CommonHandler("handler2", function () { return 2 });
            handler.setNextHandler(nextHandler);
            try {
                const result = handler.handleRequest(params)
            } catch (error) {
                assert.deepStrictEqual(error, { repeatable: false });
            }
        });
    });
});