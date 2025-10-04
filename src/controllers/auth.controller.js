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
}

module.exports = authController