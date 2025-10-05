const { NODE_ENV } = require("../config/environment")

class Logger {
    info(message, meta = {}) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta)
    }
    warn(message, meta = {}) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta)
    }
    error(message, meta = {}) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta)
    }
    debug(message, meta = {}) {
        if (NODE_ENV === "development") {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta)
        }
    }
    security(event, meta = {}) {
        console.log(`[SECURITY] ${new Date().toISOString()} ${event} - ${JSON.stringify(meta)} `)
    }
}

module.exports = new Logger()