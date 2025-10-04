const User = require("../models/user.models")
const logger = require("../utils/logger")
const bcrypt = require("bcryptjs")

class authService {
    static async registerController(data) {
        const { email, password } = data
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const existingUser = await User.findOne({ email })
            const message = existingUser ? "User already exists" : "User created successfully"
            if (existingUser) {
                return { user: existingUser, message }
            }
            const user = await User.create({ email, password: hashedPassword })
            console.log(user)
            return { user, message }
        } catch (error) {
            logger.error(`Error in register service: ${error.message}`, error)
            throw error
        }
    }
}

module.exports = authService