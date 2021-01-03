const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const axios = require('axios');

const httpMethod = require('../../../../bin/helpers/http-method/method');
const httpClient = require('../../../../bin/helpers/utils/httpClient');
const ApiLog = require('../../../../bin/modules/apiLog/repositories/commands/command_handler');

describe("HTTP Client", () => {
    describe("sendRequest", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should resolve response", async () => {
            const responseData = {
                status: 200,
                statusText: "OK",
                data: {
                    message: "Success",
                    status: true,
                    code: 200
                }
            }
            sandbox.stub(axios.default, 'request').resolves(responseData);
            sandbox.stub(ApiLog, 'addLog').resolves();

            const result = await httpClient.sendRequest(httpMethod.GET, "", "", null, null, null);
            assert.deepStrictEqual(result, responseData.data);
        });

        it("should resolve response (without data)", async () => {
            const responseData = {
                status: 200,
                statusText: "OK"
            }
            sandbox.stub(axios.default, 'request').resolves(responseData);
            sandbox.stub(ApiLog, 'addLog').resolves();

            const result = await httpClient.sendRequest(httpMethod.GET, "", "", null, null, null);
            assert.deepStrictEqual(result, responseData.data);
        });

        it("should reject error", () => {
            const errorData = {
                response: {
                    status: 200,
                    statusText: "OK",
                    data: {
                        message: "Success",
                        status: true,
                        code: 200
                    }
                }
            }
            sandbox.stub(axios.default, 'request').rejects(errorData);
            sandbox.stub(ApiLog, 'addLog').resolves();

            httpClient.sendRequest(httpMethod.GET, "", "", null, null, null)
            .catch (error => {
                assert.deepStrictEqual(error, errorData.response);
            });
        });

        it("should reject error (without data)", () => {
            const errorData = {
                response: {
                    status: 200,
                    statusText: "OK"
                }
            }
            sandbox.stub(axios.default, 'request').rejects(errorData);
            sandbox.stub(ApiLog, 'addLog').resolves();

            httpClient.sendRequest(httpMethod.GET, "", "", null, null, null)
            .catch (error => {
                assert.deepStrictEqual(error, errorData.response);
            });
        });
    });
});
