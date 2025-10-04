const express = require("express")
const authController = require("../controllers/auth.controller")
const validate = require("../middleware/validate")
const userSchema = require("../validation/userSchema")

const router = express.Router()

router.post("/register", validate(userSchema), authController.register)

module.exports = router