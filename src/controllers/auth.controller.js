const authService = require("../services/auth.service");
const logger = require("../utils/logger");
const ResponseUtil = require("../utils/response");

class authController {
    static async register(req, res) {
        try {
            const data = await authService.register(req.body)
            console.log(data)
            if (data.message === "User already exists") {
                return ResponseUtil.error(res, data.message, 400)
            }
            if (data.user) {
                const details = {
                    timeStamp: new Date().toISOString(),
                    event: "login_sucess",
                    userId: data.user._id,
                    userAgent: "web",
                    sucess: true
                }
                logger.info("user_registered", details)
                return ResponseUtil.success(res, data.user, "User registered successfully", 201)
            }
        } catch (error) {
            logger.error(`Error while registering user: ${error.message}`, error);
            return ResponseUtil.error(res, "Error while registering user", 500)
        }
    }

    static async login(req, res) {
        try {
            const { user, message } = await authService.login(req.body)
            console.log(user, message)
            if (message === "success") {
                const details = {
                    timeStamp: new Date().toISOString(),
                    event: "login_sucess",
                    userId: user._id,
                    userAgent: "web",
                    sucess: true
                }
                logger.info("login_sucess", details)
                return ResponseUtil.success(res, user, "Succesfully logged in", 203)
            }
            else if (message === "invalid") {
                return ResponseUtil.error(res, "Invalid email or password", 403)
            }
        } catch (error) {
            logger.error(`There was an error while login - ${error}`, error)
            return ResponseUtil.error(res, "Error while login", 500)
        }
    }

    static async refreshController(req, res) {
        try {
            const { refreshToken: userToken } = req.body
            const { acessToken, message } = await authService.refreshToken(userToken)
            if (message === "invalid") {
                ResponseUtil.error(res, "Invalid Refresh token", 401)
            }
            return ResponseUtil.success(res, { acessToken }, "Succesfully fetched token from refresh token")
        } catch (error) {
            logger.error(`Error while trying to create refresh token - ${error}`)
            return ResponseUtil.error(res, "There was an error while getting token with refresh token", 500)
        }
    }

    static async forgotPassword(req,res){
        try {
            const {email} = req.body
            const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
            const resetToken = await authService.generatePasswordResetToken(email,ip)
            console.log("Email will be sent to user with reset token:", resetToken)
            return ResponseUtil.success(res,{resetToken},"Password reset token generated successfully")
        } catch (error) {
            logger.error(`Error in forgot password controller - ${error.message}`, error)
            return ResponseUtil.error(res, "Error in forgot password controller", 500)
        }
    }

    static async resetPassword(req,res){
        try {
            const data = req.body
            const result = await authService.resetPassword(data)
            if(result.message !== "success") return ResponseUtil.error(res,result.message,400)
            return ResponseUtil.success(res,result.user,"Password reset successfully")
        } catch (error) {
            logger.error(`Error in reset password controller - ${error.message}`, error)
            return ResponseUtil.error(res, "Error in reset password controller", 500)
        }
    }

    static async logout(req,res){
        try {
            const { refreshToken } = req.body
            const result = await authService.logout({ refreshToken })
            if (!result) return ResponseUtil.error(res, "Error while logging out", 500)
            return ResponseUtil.success(res, result, "Successfully logged out")
        } catch (error) {
            logger.error(`Error in logout controller - ${error.message}`, error)
        }
    }

    static async confirmRegistration(req,res){
        try {
            const { emailVerificationToken } = req.query
            console.log("In auth controller ",JSON.stringify(req.query))
            const result = await authService.confirmEmail(emailVerificationToken)
            if (result.message === "success") {
                return ResponseUtil.success(res, result.user, "Email confirmed successfully")
            }
            return ResponseUtil.error(res, result.message, 400)
        } catch (error) {
            logger.error(`Error in confirm registration controller - ${error.message}`, error)
        }
    }
}

module.exports = authController