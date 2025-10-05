const express = require("express")
const authController = require("../controllers/auth.controller")
const validate = require("../middleware/validate")
const userSchema = require("../validation/userSchema")
const { rateLimiter } = require("../middleware/ratelimit.middleware")

const router = express.Router()

router.post("/register", rateLimiter(60, 5000), validate(userSchema), authController.register)

router.post("/login", rateLimiter(15, 10000), validate(userSchema), authController.login)

router.post("/refresh", rateLimiter(60, 50000), authController.refreshController)
module.exports = router