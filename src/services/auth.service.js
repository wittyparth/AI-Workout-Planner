const { JWT_SECRET } = require("../config/environment")
const User = require("../models/user.models")
const logger = require("../utils/logger")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

class authService {
    static async register(data) {
        const { email, password } = data
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const existingUser = await User.findOne({ email })
            const message = existingUser ? "User already exists" : "User created successfully"
            if (existingUser) {
                return { user: existingUser, message }
            }
            const user = await User.create({ email, password: hashedPassword })
            return { user, message }
        } catch (error) {
            logger.error(`Error in register service: ${error.message}`, error)
            throw error
        }
    }

    static async login(data) {
        try {
            const { email, password } = data
            const { password: userPassword, ...userData } = await User.findOne({ email }).lean()
            const passwordCheck = await bcrypt.compare(password, userPassword)
            if (passwordCheck) {
                const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "1hr" })
                return { user: { ...userData, token }, message: "success" }
            }
            return { user: {}, message: "invalid" }
        } catch (error) {
            logger.error(`There was an error while login - ${error}`)
            throw error
        }
    }
}

module.exports = authService