const express = require("express")
const authController = require("../controllers/auth.controller")
const validate = require("../middleware/validate")
const userSchema = require("../validation/userSchema")

const router = express.Router()

router.post("/register", validate(userSchema), authController.register)

router.post("/login", authController.login)
module.exports = router