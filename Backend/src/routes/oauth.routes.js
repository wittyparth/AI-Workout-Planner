const express = require("express")
const OAuthController = require("../controllers/oauth.controller")

const router = express.Router()

router.get("/google", OAuthController.googleRedirectController)

router.get("/google/callback", OAuthController.googleCallbackController)

router.get("/github", OAuthController.githubRedirectController)

router.get("/github/callback", OAuthController.githubCallbackController)

module.exports = router