const { JWT_SECRET } = require("../config/environment")
const User = require("../models/user.models")
const logger = require("../utils/logger")
const ResponseUtil = require("../utils/response")
const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    console.log("From verifyToken")
    try {
        const tokenHeader = req.headers.authorization
        if (!tokenHeader) return ResponseUtil.error(res, "Authorization token not present", 401)
        const token = tokenHeader.split(" ")[1]
        const user = jwt.decode(token)
        const verified = jwt.verify(token, JWT_SECRET)
        if (!verified) throw new Error("Invalid JWT token")
        const userData = await User.findById(user.id).lean()
        req.user = userData
        next()
    } catch (error) {
        logger.error(`There was an error while verifyingToken - {error}`, error)
        return ResponseUtil.error(res, "Authentication failed", 401)
    }
}

const verifyEmail = (req,res,next) => {
    console.log(req.user)
    try {
        if(!req.user.emailVerified){
            return res.status(401).json({
                timeStamp : new Date().toISOString(),
                message : "Verfiy your email"
            })
        }
        next()
    } catch (error) {
        logger.error(`There was an error in verifying email - ${JSON.stringify(error)}`,error)
        return ResponseUtil.error(res, "Email verification failed", 500)
    }
}


const warnIfUnverified = (req, res, next) => {
  if (req.user && !req.user.emailVerified) {
    res.locals.verificationWarning = {
      message: 'Please verify your email for full access',
      daysRemaining: calculateGracePeriod(req.user.createdAt)
    };
  }
  next();
};


const verifyEmailWithGrace = (graceDays = 7) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    
    // Check if verified
    if (req.user.emailVerified) return next();
    
    // Check grace period
    const accountAge = Date.now() - req.user.createdAt;
    const gracePeriod = graceDays * 24 * 60 * 60 * 1000;
    
    if (accountAge < gracePeriod) {
      res.locals.gracePeriod = {
        daysRemaining: Math.ceil((gracePeriod - accountAge) / (24 * 60 * 60 * 1000))
      };
      return next();
    }
    
    // Grace period expired
    return res.status(403).json({
      message: 'Email verification required. Your grace period has expired.',
      action: 'verify_email'
    });
  };
}

module.exports = {verifyToken,verifyEmail,verifyEmailWithGrace}