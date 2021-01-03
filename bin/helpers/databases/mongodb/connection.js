const mongoose = require('mongoose');
const config = require('config');
const databaseOption = {
	useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
const connectionPool = [];

const connection = () => {
    return { index: null, config: '', db: null };
};

function addConnectionToPool() {
    const databases = config.get("MongoDB");
    for (let database of databases) {
        let newConnection = connection();
        newConnection.index = database.index;
        newConnection.config = database.config;
        connectionPool.push(newConnection);
    }
}

async function createConnectionPool() {
    for (const connection of connectionPool) {
        try {
            connection.db = await mongoose.createConnection(connection.config.uri, databaseOption)
            /* istanbul ignore next */
            connection.db.on('error', (error) => {
                console.error('mongodb error');
                console.error(error)
            });
        } catch (error) {
            console.error(error)
        }
    }
}

/* istanbul ignore next */
function getConnection(index) {
    for (const connection of connectionPool) {
        if (connection.index === index) {
            return connection.db;
        }
    }
    return null;
}

async function init() {
  addConnectionToPool();
  await createConnectionPool();
}

function close() {
    mongoose.connection.close(false, () => {
        console.log('Database connection closed.');
    });
}

module.exports = {
    init,
    getConnection,
    close
}
