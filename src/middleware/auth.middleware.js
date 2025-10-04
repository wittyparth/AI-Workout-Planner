const { JWT_SECRET } = require("../config/environment")
const User = require("../models/user.models")
const logger = require("../utils/logger")
const ResponseUtil = require("../utils/response")
const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    console.log("From verifyToken")
    try {
        const tokenHeader = req.headers.authorization
        if (!tokenHeader) return ResponseUtil.error(res, "Authorization token not present", 401)
        const token = tokenHeader.split(" ")[1]
        const user = jwt.decode(token)
        const verified = jwt.verify(token, JWT_SECRET)
        if (!verified) throw new Error("Invalid JWT token")
        req.user = user
        // console.log(req)
        next()
    } catch (error) {
        logger.error(`There was an error while verifyingToken - {error}`, error)
        throw error
    }
}

module.exports = verifyToken