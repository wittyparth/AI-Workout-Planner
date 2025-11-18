const qs = require("qs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const {
  FRONTEND_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = require("../config/environment");
const logger = require("../utils/logger");
const User = require("../models/user.models");
const { RefreshTokenModel } = require("../models/auth.models");

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
      let user = await User.findOne({ email: userData.data.email });
      if (!user) {
         user = await User.create({
          email: userData.data.email,
          oauthProviders: [
            {
              provider: "google",
              providerId: userData.data.id,
              providerEmail: userData.data.email,
              accessToken: tokenResponse.data.access_token,
              refreshToken: tokenResponse.data.refresh_token,
              profilePicture: userData.data.picture,
              connectedAt: new Date(),
              lastUsed: new Date(),
            },
          ],
          emailVerified: true,
        });
    }
        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1hr",
        });
        const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "30d",
        });
        const tokenObj = {
          token: refreshToken,
          userId: user._id,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        };

        try {
          await RefreshTokenModel.create(tokenObj);
        } catch (createError) {
          // Log full diagnostic info before rethrowing
          logger.error("Failed to create refresh token", {
            error: createError && createError.message,
            tokenObj: util.inspect(tokenObj, { depth: 2 }),
            userType: "admin",
          });
          throw createError;
        }
        user.oauthProviders = user.oauthProviders.map((provider) => {
          if (provider.provider === "google") {
            provider.accessToken = tokenResponse.data.access_token;
            provider.refreshToken = tokenResponse.data.refresh_token;
            provider.lastUsed = new Date();
          }
          return provider;
        });
        await User.findByIdAndUpdate(user._id, { $set: { oauthProviders: user.oauthProviders } });
        return {
          user: { id: user._id, accessToken, refreshToken },
          message: "success",
        };
    } catch (error) {
      logger.error(`There was an error while handling google callback`, error);
      throw error;
    }
  }

  static async githubRedirectUrl() {
    try {
      const redirectUrl =
        `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}` +  
        `&redirect_uri=http://localhost:5000/api/v1/auth/github/callback` +
        `&scope=user:email`;
      return redirectUrl;
    } catch (error) {
      logger.error(`There was an error while creating the redirect url`, error);
      throw error;
    }
  }

  static async handleGithubCallback(code) {
    try {
      if (!code) {
        throw new Error("Authorization code is missing");
      }
      const tokenResponse = await axios
        .post(
          "https://github.com/login/oauth/access_token",
          {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
          },
          { headers: { Accept: "application/json" } }
        )
        .catch((error) => {
          console.error("Error in token exchange:", error.response.data);
          throw error;
        });
      const userData = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });
      const emailData = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });
      let user = await User.findOne({ email: emailData.data.find(email => email.primary).email });
      if (!user) {
        user = await User.create({
          email: emailData.data.find(email => email.primary).email,
          oauthProviders: [
            {
              provider: "github",
              providerId: userData.data.id,
              providerEmail: emailData.data.find(email => email.primary).email,
              accessToken: tokenResponse.data.access_token,
              refreshToken: tokenResponse.data.refresh_token,
              profilePicture: userData.data.avatar_url,
              connectedAt: new Date(),
              lastUsed: new Date(),
            },
          ],
          emailVerified: true,
        });
      }
      const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "1hr",
      });
      const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "30d",
      });
      const tokenObj = {
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      };

      try {
        await RefreshTokenModel.create(tokenObj);
      } catch (createError) {
        // Log full diagnostic info before rethrowing
        logger.error("Failed to create refresh token", {
          error: createError && createError.message,
          tokenObj: util.inspect(tokenObj, { depth: 2 }),
          userType: "admin",
        });
        throw createError;
      }
      user.oauthProviders = user.oauthProviders.map((provider) => {
        if (provider.provider === "github") {
          provider.accessToken = tokenResponse.data.access_token;
          provider.refreshToken = tokenResponse.data.refresh_token;
          provider.lastUsed = new Date();
        }
        return provider;
      });
      await User.findByIdAndUpdate(user._id, { $set: { oauthProviders: user.oauthProviders } });
      return {
        user: { id: user._id, accessToken, refreshToken },
        message: "success",
      };
    } catch (error) {
      logger.error(`There was an error while handling github callback`, error);
      throw error;
    }
  }
}

module.exports = OAuthService;
