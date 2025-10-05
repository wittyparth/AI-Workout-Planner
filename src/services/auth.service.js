const { JWT_SECRET } = require("../config/environment")
const RefreshTokenModel = require("../models/auth.models")
const User = require("../models/user.models")
const logger = require("../utils/logger")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const util = require('util')

class authService {
    static async register(data) {
        const { email, password } = data
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const existingUser = await User.findOne({ email }).lean()
            const message = existingUser ? "User already exists" : "User created successfully"
            if (existingUser) {
                return { user: existingUser, message }
            }
            const userDoc = await User.create({ email, password: hashedPassword })
            const user = await User.findById(userDoc._id).lean()
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
                const accessToken = jwt.sign({ id: userData._id }, JWT_SECRET, { expiresIn: "1hr" })
                const refreshToken = jwt.sign({ id: userData._id }, JWT_SECRET, { expiresIn: "30d" })
                const tokenObj = {
                    token: refreshToken,
                    userId: userData._id,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
                }
                console.log(tokenObj)

                try {
                    await RefreshTokenModel.create(tokenObj)
                } catch (createError) {
                    // Log full diagnostic info before rethrowing
                    logger.error('Failed to create refresh token', {
                        error: createError && createError.message,
                        tokenObj: util.inspect(tokenObj, { depth: 2 }),
                        userType: "admin",
                    })
                    throw createError
                }
                return { user: { id: userData._id, accessToken, refreshToken }, message: "success" }
            }

            return { user: {}, message: "invalid" }
        } catch (error) {
            logger.error(`There was an error while login in authServices - ${error}`)
            throw error
        }
    }

    static async refreshToken(token) {
        try {
            const tokenDoc = await RefreshTokenModel.find({ token: token })
            console.log(tokenDoc)
            console.log(token)
            const userData = jwt.decode(token)
            console.log(userData)
            const user = await User.findById(userData.id).lean()
            console.log(user)
            if (!user) return { message: "invalid", token: "" }
            const acessToken = jwt.sign({ id: userData.id }, JWT_SECRET, { expiresIn: "1h" })

            return { message: "success", acessToken }
        }
        catch (error) {
            logger.error(`There was an error while refreshing token - ${JSON.stringify(error)}`, error)
            console.log(error)
            throw error
        }
    }
}

module.exports = authService