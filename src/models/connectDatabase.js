// const mongoose = require('mongooose');
const { MONGODB_URI } = require("../config/environment");
const logger = require('../utils/logger');
const { default: mongoose } = require('mongoose');
console.log(MONGODB_URI);
async function connectToDatabase() {
    try {
        const client = await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        if (client) {
            logger.info(`Connected to database: ${MONGODB_URI}`);
            return client
        }
    } catch (error) {
        logger.error(`Error connecting to database: ${error.message}`, error);
        // throw new Error("Database connection failed");
        return error
    }
}

module.exports = connectToDatabase;