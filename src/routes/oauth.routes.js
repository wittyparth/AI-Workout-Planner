const express = require("express")
const { googleRedirectController, googleCallbackController } = require("../controllers/oauth.controller")

const router = express.Router()

router.get("/google",googleRedirectController)

router.get("/google/callback",googleCallbackController)

module.exports = router