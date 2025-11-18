const { JWT_SECRET } = require("../config/environment")
const { RefreshTokenModel, PasswordResetTokenModel } = require("../models/auth.models")
const User = require("../models/user.models")
const logger = require("../utils/logger")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const util = require('util')
const EmailService = require("./email.service")

class authService {
    static async register(data) {
        const { email, password, name } = data
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const existingUser = await User.findOne({ email }).lean()
            if (existingUser) {
                return { user: null, message: "User already exists" }
            }
            
            // Parse name into firstName and lastName
            let firstName = name
            let lastName = ''
            if (name) {
                const nameParts = name.trim().split(' ')
                firstName = nameParts[0]
                lastName = nameParts.slice(1).join(' ')
            }
            
            const userDoc = await User.create({ 
                email, 
                password: hashedPassword,
                profile: {
                    firstName,
                    lastName
                }
            })
            
            // Generate tokens
            const accessToken = jwt.sign({ id: userDoc._id }, JWT_SECRET, { expiresIn: "1h" })
            const refreshToken = jwt.sign({ id: userDoc._id }, JWT_SECRET, { expiresIn: "30d" })
            
            // Store refresh token
            const tokenObj = {
                token: refreshToken,
                userId: userDoc._id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            }
            await RefreshTokenModel.create(tokenObj)
            
            // Get user without password
            const user = await User.findById(userDoc._id).select('-password').lean()
            
            return { user, accessToken, refreshToken, message: "User created successfully" }
        } catch (error) {
            logger.error(`Error in register service: ${error.message}`, error)
            throw error
        }
    }

    static async login(data) {
        try {
            const { email, password } = data
            const userDoc = await User.findOne({ email })
            if (!userDoc) {
                return { user: null, message: "invalid" }
            }
            
            const passwordCheck = await bcrypt.compare(password, userDoc.password)
            if (!passwordCheck) {
                return { user: null, message: "invalid" }
            }
            
            const accessToken = jwt.sign({ id: userDoc._id }, JWT_SECRET, { expiresIn: "1h" })
            const refreshToken = jwt.sign({ id: userDoc._id }, JWT_SECRET, { expiresIn: "30d" })
            const tokenObj = {
                token: refreshToken,
                userId: userDoc._id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            }

            try {
                // Delete old refresh tokens for this user
                await RefreshTokenModel.deleteMany({ userId: userDoc._id })
                await RefreshTokenModel.create(tokenObj)
            } catch (createError) {
                logger.error('Failed to create refresh token', {
                    error: createError && createError.message,
                    tokenObj: util.inspect(tokenObj, { depth: 2 }),
                })
                throw createError
            }
            
            // Update last login
            userDoc.lastLoginAt = new Date()
            await userDoc.save()
            
            // Get user without password
            const user = await User.findById(userDoc._id).select('-password').lean()
            
            return { user, accessToken, refreshToken, message: "success" }
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


    static async generatePasswordResetToken(email, ip) {
        try {
            const user = await User.findOne({ email }).lean()
            if (!user) throw new Error("User not found")
            const randomToken = crypto.randomBytes(32).toString("hex")
            const hashedRandomToken = crypto.createHash("sha256").update(randomToken).digest("hex")
            const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour from now
            console.log(user)
            const generatedToken = await PasswordResetTokenModel.create({
                userId: user._id,
                token: hashedRandomToken,
                expiresAt,
                used: false,
                ipAddress: ip
            })
            await EmailService.sendPasswordResetEmail(email, randomToken)
            return randomToken
        } catch (error) {
            logger.error(`Error generating password reset token in auth.service.js - ${error.message}`, error)
            throw error
        }
    }
    static async resetPassword(data) {
        try {
            const { token, newPassword } = data
            console.log(data)
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
            const isValidToken = await PasswordResetTokenModel.findOne({ token: hashedToken }).lean()
            console.log(isValidToken)
            if (!isValidToken) return { message: "Invalid token" }
            if (isValidToken.used) return { message: "Token already used" }
            if (isValidToken.expiresAt < Date.now()) return { message: "Token expired" }
            await PasswordResetTokenModel.findByIdAndUpdate(isValidToken._id, { $set: { used: true } })
            const hashedPassword = await bcrypt.hash(newPassword, 12)
            const user = await User.findByIdAndUpdate(isValidToken.userId, { $set: { password: hashedPassword } })
            return { message: "success", user }
        }
        catch (error) {
            logger.error(`Error in resetPassword service - ${error.message}`, error)
            throw error
        }
    }

    static async logout(data) {
        try {
            const { refreshToken } = data
            await RefreshTokenModel.findByIdAndDelete({ token: refreshToken }).lean()
        } catch (error) {
            logger.error(`Error in logout service - ${error.message}`, error)
            throw error
        }
    }


}

module.exports = authService