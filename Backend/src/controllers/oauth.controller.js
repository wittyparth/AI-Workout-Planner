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
            
            // Redirect to frontend with tokens
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const callbackUrl = `${frontendUrl}/auth/oauth-callback?accessToken=${userData.user.accessToken}&refreshToken=${userData.user.refreshToken}&userId=${userData.user.id}`;
            return res.redirect(callbackUrl);
        } catch (error) {
            logger.error(`There was an error in google callback controller`,error)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
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
            
            // Redirect to frontend with tokens
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const callbackUrl = `${frontendUrl}/auth/oauth-callback?accessToken=${userData.user.accessToken}&refreshToken=${userData.user.refreshToken}&userId=${userData.user.id}`;
            return res.redirect(callbackUrl);
        } catch (error) {
            logger.error(`There was an error in github callback controller`,error)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
        }
    }
}

module.exports = OAuthController