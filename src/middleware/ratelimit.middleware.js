const rateLimit = require("express-rate-limit")
const mongoStore = require("rate-limit-mongo")
const { ipKeyGenerator } = require("express-rate-limit")
const { MONGODB_URI } = require("../config/environment")

const rateLimiter = (time, limit) => {
    return rateLimit({
        windowMs: time * 60 * 1000,
        max: limit,
        standardHeaders: true,
        keyGenerator: (req, res) => {
            return req.user?.id?.toString()
        },
        handler: (req, res, next, options) => {
            res.status(429).json({
                success: false,
                message: "Too many requests for this user",
            });
        },
        store: new mongoStore({
            uri: MONGODB_URI,
            collectionName: "userRateLimits",
            expireTimeMs: 15 * 60 * 1000
        }),

    })
}


module.exports = { rateLimiter }