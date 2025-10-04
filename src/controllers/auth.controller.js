const authService = require("../services/auth.service");
const ResponseUtil = require("../utils/response");

class authController {
    static async register(req, res) {
        try {
            const data = await authService.registerController(req.body)
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
}

module.exports = authController