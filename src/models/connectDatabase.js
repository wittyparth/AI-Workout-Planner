// const mongoose = require('mongooose');
const { MONGODB_URI } = require("../config/environment");
const logger = require('../utils/logger');
const mongoose = require('mongoose');
console.log(MONGODB_URI);
async function connectToDatabase() {
    try {
        console.log("Connecting to database")
        const client = await mongoose.connect(MONGODB_URI);
        if (client) {
            logger.info(`Connected to database: ${MONGODB_URI}`);
            return client
        }
    } catch (error) {
        logger.error(`Error connecting to database: ${error.message}`, error);
        throw error
    }
}

module.exports = connectToDatabase;