const qs = require("qs");
const axios = require("axios");
const {OAuth2Client} = require("google-auth-library")

const {
  FRONTEND_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
} = require("../config/environment");
const logger = require("../utils/logger");
const User = require("../models/user.models");

class OAuthService {
  static async googleRedirectUrl() {
    try {
      const redirectUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(
          "http://localhost:5000/api/v1/auth/google/callback"
        )}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent("openid email profile")}` +
        `&access_type=offline` + // request refresh token
        `&prompt=consent`; // force user to approve again

      console.log(redirectUrl);
      return redirectUrl;
    } catch (error) {
      logger.error(`There was an error while creating the redirect url`, error);
      throw error;
    }
  }

  static async handleGoogleCallback(code) {
    try {
      console.log("In service", code);
      if (!code) {
        throw new Error("Authorization code is missing");
      }
      const tokenResponse = await axios
        .post(
          "https://oauth2.googleapis.com/token",
          qs.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5000/api/v1/auth/google/callback",
            grant_type: "authorization_code",
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .catch((error) => {
          console.error("Error in token exchange:", error.response.data);
          throw error;
        });
      console.log(tokenResponse.data);
      const userData = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        }
      );
      const user = await User.findOne({email : userData.data.email})
      console.log(user)
      return userData.data;
    } catch (error) {
      logger.error(`There was an error while handling google callback`, error);
      throw error;
    }
  }
}

module.exports = OAuthService;
