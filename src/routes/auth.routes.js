const express = require("express")
const authController = require("../controllers/auth.controller")
const validate = require("../middleware/validate")
const userSchema = require("../validation/userSchema")
const { rateLimiter } = require("../middleware/ratelimit.middleware")

const router = express.Router()

router.post("/register", rateLimiter(60, 5000), validate(userSchema.userSchema), authController.register)

router.post("/login", rateLimiter(15, 10000), validate(userSchema.userSchema), authController.login)

router.post("/logout", rateLimiter(15, 10000), validate(userSchema.refreshTokenSchema), authController.logout)

router.post("/refresh", rateLimiter(60, 50000), validate(userSchema.refreshTokenSchema),authController.refreshController)

router.post("/forgot-password", rateLimiter(5, 60000),validate(userSchema.forgotPasswordSchema),authController.forgotPassword)

router.post("/reset-password", rateLimiter(5, 60000), validate(userSchema.resetPasswordSchema),authController.resetPassword)

router.get("/confirm-email", rateLimiter(10, 60000), authController.confirmRegistration)
module.exports = router