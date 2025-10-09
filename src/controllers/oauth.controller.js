const OAuthService = require("../services/oauth.service")
const logger = require("../utils/logger")
const ResponseUtil = require("../utils/response")

class OAuthController{
    static async googleRedirectController(req,res){
        try {
            const redirectUrl = await OAuthService.googleRedirectUrl()
            return res.redirect(redirectUrl)
        } catch (error) {
            logger.error(`There was an error in redirect controller`,error)
            return res.status(500).json({error: "Internal Server Error"})
        }
    }

    static async googleCallbackController(req,res){
        try {
            const { code } = req.query
            console.log(req.query)
            console.log(req.params)
            const userData = await OAuthService.handleGoogleCallback(code)
            return res.status(200).json({ user: userData })
        } catch (error) {
            logger.error(`There was an error in google callback controller`,error)
            return ResponseUtil.error(res, "Error while handling Google callback", 500)
        }
    }

    static async githubRedirectController(req,res){
        try {
            const redirectUrl = await OAuthService.githubRedirectUrl()
            return res.redirect(redirectUrl)
        } catch (error) {
            logger.error(`There was an error in redirect controller`,error)
            return res.status(500).json({error: "Internal Server Error"})
        }
    }

    static async githubCallbackController(req,res){
        try {
            const { code } = req.query
            const userData = await OAuthService.handleGithubCallback(code)
            return res.status(200).json({ user: userData })
        } catch (error) {
            logger.error(`There was an error in github callback controller`,error)
            return ResponseUtil.error(res, "Error while handling GitHub callback", 500)
        }
    }
}

module.exports = OAuthController