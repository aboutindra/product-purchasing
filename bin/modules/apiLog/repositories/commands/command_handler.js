const ApiLog = require('./domain');
const database = "product-purchasing-mongodb";

const addLog = async (document) => {
    const apiLog = new ApiLog(database);
    try {
        await apiLog.addLog(document);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    addLog
}
