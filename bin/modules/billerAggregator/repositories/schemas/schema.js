const Schema = require('mongoose').Schema;

const configSchema = new Schema({
	key: { type: String, required: true, unique: true },
    value: {}
}, {timestamps: true, strict: true});

module.exports = configSchema;
