# Day 6 Learning Guide: OAuth 2.0 Social Authentication System
## Problem Discovery & Advanced Professional Solutions

### 🔥 **The Story: The Password Fatigue Crisis**

Your email verification system from Day 5 is working beautifully! Users are verifying their emails, error handling is solid, and everything feels professional.

Then reality hits:
- **60% of users abandon registration** at the password creation step
- Support tickets flooding in: *"I forgot my password AGAIN"*, *"Can I just use my Google account?"*
- Your friend testing the app: *"Seriously? Another password to remember? Just add Google login like everyone else!"*
- You check competitor apps - they ALL have social authentication

**Morning confusion:** You think "Just add a Google button, how hard can it be?" You start reading OAuth 2.0 documentation. **It's COMPLEX.** Authorization flows, callback URLs, state parameters, CSRF protection, token exchanges... this isn't a simple button.

**Afternoon chaos:** You get the Google redirect working, but the callback fails mysteriously. Google returns the user data, but now you have a MASSIVE problem: What if a user already registered with `john@gmail.com` using password, then tries to sign in with Google using the SAME email? Do you create two accounts? Link them? What if the emails don't match but it's the same person?

**Evening crisis:** You finally get OAuth working, but during testing your friend says: *"I tried using Google, and now I have TWO accounts! One with password, one with Google. They don't talk to each other!"* Plus you read horror stories about OAuth security vulnerabilities - state parameter attacks, authorization code interception, token leakage...

**Today's Advanced Mission:** Build enterprise-grade OAuth 2.0 social authentication with intelligent account linking, multiple provider support (Google + GitHub), and bulletproof security.

---

## 🎯 **Today's Mission: Multi-Provider OAuth with Account Linking**
1. **OAuth 2.0 architecture** → Authorization Code Flow implementation
2. **Google OAuth integration** → Full authentication flow
3. **GitHub OAuth integration** → Second provider for flexibility  
4. **Intelligent account linking** → Merge social and password accounts
5. **OAuth security hardening** → State parameters, PKCE, token security
6. **Provider management UI** → Users control their linked accounts

---

## 📚 **Advanced Professional Learning Requirements**

### **1. OAuth 2.0 Authorization Code Flow Deep Dive (65 minutes learning)**
**The Challenge:** OAuth is NOT just authentication - it's authorization delegation
**Professional Understanding:**

**What OAuth Actually Does:**
```javascript
// Common misconception
"OAuth lets users log in with Google" ❌

// Reality
"OAuth lets our app access Google's API on behalf of the user,
and we can use their Google identity for authentication" ✅

// The difference matters for security and architecture
```

**Authorization Code Flow (The Secure Way):**
```javascript
/*
Step 1: Initiate Authorization
User clicks "Sign in with Google"
→ Your server redirects to Google with:
  - client_id: Your app's Google OAuth ID
  - redirect_uri: Where Google sends user back
  - scope: What data you want (profile, email)
  - state: Random string for CSRF protection
  - response_type: 'code' (we want authorization code)

Step 2: User Authorizes on Google
User sees Google's consent screen
→ Approves access
→ Google redirects back to your callback URL with:
  - code: Authorization code (short-lived, single-use)
  - state: Your CSRF protection string

Step 3: Exchange Code for Token
Your server validates state
→ Makes server-to-server call to Google with:
  - code: The authorization code
  - client_id: Your app ID
  - client_secret: Your secret key (NEVER exposed to client)
→ Google returns:
  - access_token: To call Google APIs
  - id_token: JWT with user info (profile, email)
  - refresh_token: To get new access tokens

Step 4: Get User Profile
Your server decodes id_token
→ Extract user info (email, name, profile pic)
→ Create or link account in your database
→ Issue YOUR OWN JWT tokens
→ Redirect user to your app's dashboard
*/
```

**Why This Flow is Secure:**
```javascript
// Authorization code never exposed to browser
// Only backend sees authorization code
// Client secret never leaves your server
// Short-lived codes (10 min expiry)
// State parameter prevents CSRF attacks
// PKCE can add extra security layer

// vs Implicit Flow (DEPRECATED - insecure)
// Access token exposed in browser URL
// No client secret validation
// Vulnerable to token theft
```

**Database Schema for OAuth:**
```javascript
// User model - OAuth fields
{
  email: String,
  password: String, // Optional now (might use OAuth only)
  
  // Password auth fields
  emailVerified: Boolean,
  
  // OAuth fields
  oauthProviders: [{
    provider: { type: String, enum: ['google', 'github', 'apple'] },
    providerId: String, // User's ID in that provider
    providerEmail: String, // Email from provider
    accessToken: String, // Encrypted
    refreshToken: String, // Encrypted
    profilePicture: String,
    connectedAt: Date,
    lastUsed: Date
  }],
  
  // Account linking
  accountLinkedAt: Date,
  primaryAuthMethod: { 
    type: String, 
    enum: ['password', 'google', 'github'],
    default: 'password'
  }
}
```

### **2. Account Linking Strategy Architecture (55 minutes learning)**
**The Challenge:** Users might register multiple ways - need intelligent merging
**Professional Solution:** Multi-scenario account linking with user consent

**Account Linking Scenarios:**
```javascript
// Scenario 1: OAuth user exists, tries password registration
User: john@gmail.com (registered via Google OAuth)
Tries: Register with john@gmail.com + password
Solution: 
  → Detect existing OAuth account
  → Ask: "You already have an account with Google. Link password?"
  → If yes: Add password to existing account
  → If no: Suggest using Google sign-in

// Scenario 2: Password user exists, tries OAuth
User: john@gmail.com (registered with password)
Tries: Sign in with Google (john@gmail.com)
Solution:
  → Detect existing password account
  → If email verified: Auto-link (safe assumption - same person)
  → If not verified: Require verification first, then link
  → Add Google OAuth to existing account

// Scenario 3: Multiple OAuth providers
User: Has Google account (john@gmail.com)
Tries: Sign in with GitHub (different email)
Solution:
  → After GitHub auth, show: "Link to existing account?"
  → Let user choose to link or create separate account
  → If linked: Multiple providers for same user

// Scenario 4: OAuth without existing account
User: New user, clicks "Sign in with Google"
Solution:
  → Create new account with OAuth info
  → Mark as verified (Google verified the email)
  → No password required
  → Offer password setup later (optional)
```

**Linking Logic Flow:**
```javascript
async function handleOAuthCallback(provider, oauthProfile) {
  const email = oauthProfile.email;
  const providerId = oauthProfile.id;
  
  // Check if OAuth provider already connected
  const existingOAuthUser = await User.findOne({
    'oauthProviders.provider': provider,
    'oauthProviders.providerId': providerId
  });
  
  if (existingOAuthUser) {
    // User already connected this provider - just log them in
    return { user: existingOAuthUser, scenario: 'existing_oauth' };
  }
  
  // Check if email exists (password account or different OAuth)
  const existingEmailUser = await User.findOne({ email });
  
  if (existingEmailUser) {
    // Email exists - link or require verification
    if (existingEmailUser.emailVerified || existingEmailUser.oauthProviders.length > 0) {
      // Safe to auto-link
      existingEmailUser.oauthProviders.push({
        provider,
        providerId,
        providerEmail: email,
        accessToken: encryptToken(oauthProfile.accessToken),
        profilePicture: oauthProfile.picture,
        connectedAt: new Date()
      });
      await existingEmailUser.save();
      return { user: existingEmailUser, scenario: 'auto_linked' };
    } else {
      // Email not verified - risky to auto-link
      return { 
        scenario: 'verification_required',
        message: 'Please verify your email before linking social accounts',
        email 
      };
    }
  }
  
  // No existing account - create new OAuth user
  const newUser = await User.create({
    email,
    emailVerified: true, // OAuth emails are pre-verified
    oauthProviders: [{
      provider,
      providerId,
      providerEmail: email,
      accessToken: encryptToken(oauthProfile.accessToken),
      profilePicture: oauthProfile.picture,
      connectedAt: new Date()
    }],
    primaryAuthMethod: provider,
    firstName: oauthProfile.firstName,
    lastName: oauthProfile.lastName
  });
  
  return { user: newUser, scenario: 'new_oauth_user' };
}
```

### **3. OAuth Security Hardening (60 minutes learning)**
**The Challenge:** OAuth has many attack vectors - must protect against all
**Professional Security Layers:**

**Layer 1: State Parameter (CSRF Protection)**
```javascript
// Generate cryptographically random state
const state = crypto.randomBytes(32).toString('hex');

// Store in session or Redis with short TTL
await redis.setex(`oauth_state:${state}`, 600, JSON.stringify({
  userId: req.user?.userId, // If logged in
  timestamp: Date.now(),
  returnUrl: req.query.returnUrl || '/dashboard'
}));

// Include in OAuth redirect
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
  `scope=${encodeURIComponent('profile email')}&` +
  `state=${state}&` +
  `response_type=code`;

// In callback: MUST validate state
const stateData = await redis.get(`oauth_state:${req.query.state}`);
if (!stateData) {
  throw new Error('Invalid or expired state - possible CSRF attack');
}
await redis.del(`oauth_state:${req.query.state}`); // One-time use
```

**Layer 2: PKCE (Proof Key for Code Exchange)**
```javascript
// Additional security for authorization code flow
// Prevents authorization code interception attacks

// Step 1: Generate code verifier (random string)
const codeVerifier = crypto.randomBytes(32).toString('base64url');

// Step 2: Generate code challenge (hash of verifier)
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Step 3: Store verifier in session
req.session.codeVerifier = codeVerifier;

// Step 4: Send challenge in auth request
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${clientId}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256&` +
  `...other params`;

// Step 5: Send verifier when exchanging code for token
const tokenResponse = await axios.post(tokenUrl, {
  code: authorizationCode,
  code_verifier: req.session.codeVerifier, // Prove you initiated the request
  client_id: clientId,
  ...
});
```

**Layer 3: Token Security**
```javascript
// NEVER store OAuth tokens in plain text
const crypto = require('crypto');

class TokenEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
  }

  encrypt(token) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return iv + authTag + encrypted (all needed for decryption)
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedToken) {
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

**Layer 4: Scope Minimization**
```javascript
// Only request what you need
// Bad - requesting unnecessary permissions
const scopes = 'profile email contacts calendar drive';

// Good - minimal necessary scopes
const scopes = 'profile email'; // Just for authentication

// Users are more likely to authorize minimal scopes
// Reduces security impact if tokens are compromised
```

### **4. Google OAuth Integration (50 minutes learning)**
**The Setup:** Register app in Google Cloud Console
**Professional Implementation:**

**Google OAuth Setup Steps:**
```javascript
/*
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project: "FitAI Backend"
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: 
     - http://localhost:3000/auth/google/callback (dev)
     - https://api.fitai.com/auth/google/callback (prod)
5. Get Client ID and Client Secret
6. Add to .env:
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
*/
```

**Google OAuth Response Structure:**
```javascript
// After successful token exchange, Google returns:
{
  access_token: "ya29.a0AfH6SMB...", // To call Google APIs
  expires_in: 3599, // Seconds until expiry
  refresh_token: "1//0gK8...", // To get new access tokens (only on first auth)
  scope: "openid https://www.googleapis.com/auth/userinfo.email ...",
  token_type: "Bearer",
  id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6..." // JWT with user info
}

// Decoded id_token contains:
{
  iss: "https://accounts.google.com", // Issuer
  azp: "your-client-id",
  aud: "your-client-id",
  sub: "117539846312345678901", // Google user ID (unique)
  email: "john@gmail.com",
  email_verified: true,
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/a/...",
  given_name: "John",
  family_name: "Doe",
  iat: 1635789012,
  exp: 1635792612
}
```

### **5. GitHub OAuth Integration (45 minutes learning)**
**The Challenge:** GitHub OAuth flow is similar but with key differences
**Professional Understanding:**

**GitHub vs Google OAuth Differences:**
```javascript
// Google: Returns JWT id_token with user info
// GitHub: Requires separate API call to get user info

// Google: Email in id_token
// GitHub: Email in separate /user/emails endpoint (might be private)

// Google: Single callback URL
// GitHub: Can register multiple callback URLs

// GitHub Setup:
/*
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Register new OAuth App:
   - Application name: FitAI
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/auth/github/callback
3. Get Client ID and Client Secret
4. Add to .env:
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
*/
```

**GitHub OAuth Flow:**
```javascript
// Step 1: Redirect to GitHub
GET https://github.com/login/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_CALLBACK_URL&
  scope=read:user user:email&
  state=RANDOM_STATE

// Step 2: GitHub callback with code
GET /auth/github/callback?code=AUTHORIZATION_CODE&state=RANDOM_STATE

// Step 3: Exchange code for token
POST https://github.com/login/oauth/access_token
Body: {
  client_id: YOUR_CLIENT_ID,
  client_secret: YOUR_CLIENT_SECRET,
  code: AUTHORIZATION_CODE,
  redirect_uri: YOUR_CALLBACK_URL
}
Response: { access_token: "gho_...", token_type: "bearer", scope: "read:user,user:email" }

// Step 4: Get user profile
GET https://api.github.com/user
Headers: { Authorization: "Bearer ACCESS_TOKEN" }
Response: { id: 12345, login: "johndoe", name: "John Doe", ... }

// Step 5: Get user email (separate call)
GET https://api.github.com/user/emails
Headers: { Authorization: "Bearer ACCESS_TOKEN" }
Response: [{ email: "john@example.com", primary: true, verified: true }]
```

### **6. OAuth Provider Management (40 minutes learning)**
**The Challenge:** Users need to manage their connected providers
**Professional Solution:** Provider linking/unlinking with safeguards

**Provider Management Rules:**
```javascript
// Rule 1: Must always have at least ONE auth method
// Can't unlink last provider if no password set

// Rule 2: Can link multiple providers to same account
// User can sign in with any linked provider

// Rule 3: Can unlink provider if another method exists
// Must have password OR another OAuth provider

// Rule 4: Can set primary auth method
// Determines default sign-in suggestion

// Rule 5: Show last used date for each provider
// Help users track which providers they use

// Implementation
const canUnlinkProvider = (user, provider) => {
  const hasPassword = !!user.password;
  const linkedProviders = user.oauthProviders.length;
  const isLastProvider = linkedProviders === 1;
  
  if (isLastProvider && !hasPassword) {
    return {
      allowed: false,
      reason: 'Cannot unlink last authentication method. Set up a password first.'
    };
  }
  
  return { allowed: true };
};
```

---

## 🛠 **Advanced Professional Implementation Requirements**

### **1. Google OAuth Initiation Endpoint:**
```javascript
GET /auth/google?returnUrl=/dashboard

Success Response (302 Redirect):
Location: https://accounts.google.com/o/oauth2/v2/auth?
  client_id=xxx&
  redirect_uri=http://localhost:3000/auth/google/callback&
  scope=profile email&
  state=random_csrf_token&
  response_type=code&
  access_type=offline

// Sets session/cookie with state for validation
```

### **2. Google OAuth Callback Endpoint:**
```javascript
GET /auth/google/callback?code=AUTHORIZATION_CODE&state=CSRF_TOKEN

Success Response (302 Redirect):
// If new user or successful link
Location: http://localhost:3000/dashboard?auth=success

// Sets cookies with JWT tokens
Set-Cookie: accessToken=jwt_token; HttpOnly; Secure
Set-Cookie: refreshToken=jwt_token; HttpOnly; Secure

Error Response (302 Redirect):
Location: http://localhost:3000/login?error=oauth_failed&message=Could+not+authenticate

// Possible error scenarios:
- Invalid state (CSRF attack)
- Code exchange failed
- Email verification required
- Account linking conflict
```

### **3. GitHub OAuth Endpoints (same pattern):**
```javascript
GET /auth/github
GET /auth/github/callback?code=xxx&state=xxx

// Same response structure as Google
```

### **4. Get Connected Providers:**
```javascript
GET /auth/providers
Authorization: Bearer <access_token>

Success Response (200):
{
  "success": true,
  "providers": [
    {
      "provider": "google",
      "connectedAt": "2025-10-01T10:30:00Z",
      "lastUsed": "2025-10-07T08:15:00Z",
      "email": "john@gmail.com",
      "profilePicture": "https://lh3.googleusercontent.com/...",
      "isPrimary": true
    },
    {
      "provider": "github",
      "connectedAt": "2025-10-05T14:20:00Z",
      "lastUsed": "2025-10-06T16:45:00Z",
      "email": "john@example.com",
      "profilePicture": "https://avatars.githubusercontent.com/...",
      "isPrimary": false
    }
  ],
  "hasPassword": true,
  "primaryAuthMethod": "google"
}
```

### **5. Unlink Provider:**
```javascript
DELETE /auth/providers/:provider
Authorization: Bearer <access_token>

// provider = 'google' | 'github'

Success Response (200):
{
  "success": true,
  "message": "Google account unlinked successfully",
  "remainingProviders": ["github"],
  "hasPassword": true
}

Error Response (400):
{
  "success": false,
  "message": "Cannot unlink last authentication method",
  "details": "Set up a password before unlinking your last social account",
  "requestId": "uuid"
}
```

---

## 🏗 **Advanced Professional Implementation Plan**

### **Phase 1: OAuth Service Foundation (110 minutes)**

**Step 1:** Create OAuth configuration
```javascript
// config/oauth.config.js
module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email'],
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    userInfoURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
    scope: ['read:user', 'user:email'],
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    userInfoURL: 'https://api.github.com/user',
    userEmailURL: 'https://api.github.com/user/emails'
  }
};
```

**Step 2:** Enhanced User model with OAuth
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String, // Optional - OAuth users might not have password
  firstName: String,
  lastName: String,
  
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: Date,
  
  // OAuth providers
  oauthProviders: [{
    provider: { 
      type: String, 
      enum: ['google', 'github'],
      required: true
    },
    providerId: { type: String, required: true }, // User's ID in provider system
    providerEmail: String,
    accessToken: String, // Encrypted
    refreshToken: String, // Encrypted
    profilePicture: String,
    connectedAt: { type: Date, default: Date.now },
    lastUsed: Date
  }],
  
  primaryAuthMethod: {
    type: String,
    enum: ['password', 'google', 'github'],
    default: 'password'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for OAuth queries
userSchema.index({ 'oauthProviders.provider': 1, 'oauthProviders.providerId': 1 });
userSchema.index({ email: 1 });

// Method to check if user can unlink provider
userSchema.methods.canUnlinkProvider = function(provider) {
  const hasPassword = !!this.password;
  const linkedProviders = this.oauthProviders.filter(p => p.provider !== provider);
  
  if (linkedProviders.length === 0 && !hasPassword) {
    return {
      allowed: false,
      reason: 'Cannot unlink last authentication method. Set up a password first.'
    };
  }
  
  return { allowed: true };
};
```

**Step 3:** Token encryption utility
```javascript
// utils/encryption.js
const crypto = require('crypto');

class Encryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    
    // Generate or use existing encryption key
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY must be set in environment variables');
    }
    
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }
  }

  encrypt(text) {
    if (!text) return null;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText) {
    if (!encryptedText) return null;
    
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

module.exports = new Encryption();
```

### **Phase 2: OAuth Service Implementation (100 minutes)**

**Step 1:** Create OAuth service
```javascript
// services/oauth.service.js
const axios = require('axios');
const crypto = require('crypto');
const oauthConfig = require('../config/oauth.config');
const encryption = require('../utils/encryption');
const User = require('../models/User');
const logger = require('../config/logger');

class OAuthService {
  // Generate authorization URL for provider
  generateAuthUrl(provider, state) {
    const config = oauthConfig[provider];
    
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
    
    const params = new URLSearchParams({
      client_id: config.clientID,
      redirect_uri: config.callbackURL,
      scope: config.scope.join(' '),
      state: state,
      response_type: 'code'
    });
    
    // Google-specific: request offline access for refresh token
    if (provider === 'google') {
      params.append('access_type', 'offline');
      params.append('prompt', 'consent'); // Force consent to get refresh token
    }
    
    return `${config.authorizationURL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(provider, code) {
    const config = oauthConfig[provider];
    
    try {
      const response = await axios.post(
        config.tokenURL,
        {
          client_id: config.clientID,
          client_secret: config.clientSecret,
          code: code,
          redirect_uri: config.callbackURL,
          grant_type: 'authorization_code'
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error('Token exchange failed', {
        provider,
        error: error.response?.data || error.message
      });
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  // Get user profile from provider
  async getUserProfile(provider, accessToken) {
    const config = oauthConfig[provider];
    
    try {
      if (provider === 'google') {
        return await this.getGoogleProfile(accessToken, config);
      } else if (provider === 'github') {
        return await this.getGitHubProfile(accessToken, config);
      }
    } catch (error) {
      logger.error('Failed to get user profile', {
        provider,
        error: error.message
      });
      throw new Error('Failed to retrieve user profile from provider');
    }
  }

  async getGoogleProfile(accessToken, config) {
    // Google returns user info in id_token, but we can also call userinfo endpoint
    const response = await axios.get(config.userInfoURL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return {
      id: response.data.sub,
      email: response.data.email,
      emailVerified: response.data.email_verified,
      firstName: response.data.given_name,
      lastName: response.data.family_name,
      name: response.data.name,
      picture: response.data.picture
    };
  }

  async getGitHubProfile(accessToken, config) {
    // GitHub requires two API calls: one for profile, one for email
    const [profileResponse, emailsResponse] = await Promise.all([
      axios.get(config.userInfoURL, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }),
      axios.get(config.userEmailURL, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      })
    ]);
    
    // Find primary verified email
    const primaryEmail = emailsResponse.data.find(e => e.primary && e.verified);
    
    if (!primaryEmail) {
      throw new Error('No verified email found in GitHub account');
    }
    
    const nameParts = (profileResponse.data.name || '').split(' ');
    
    return {
      id: profileResponse.data.id.toString(),
      email: primaryEmail.email,
      emailVerified: true,
      firstName: nameParts[0] || profileResponse.data.login,
      lastName: nameParts.slice(1).join(' ') || '',
      name: profileResponse.data.name || profileResponse.data.login,
      picture: profileResponse.data.avatar_url
    };
  }

  // Handle account linking logic
  async handleOAuthCallback(provider, profile, tokens) {
    const { id: providerId, email, emailVerified, firstName, lastName, picture } = profile;
    
    // Scenario 1: Check if this OAuth provider already linked
    let user = await User.findOne({
      'oauthProviders.provider': provider,
      'oauthProviders.providerId': providerId
    });
    
    if (user) {
      // Update last used time and tokens
      const providerIndex = user.oauthProviders.findIndex(
        p => p.provider === provider && p.providerId === providerId
      );
      
      user.oauthProviders[providerIndex].lastUsed = new Date();
      user.oauthProviders[providerIndex].accessToken = encryption.encrypt(tokens.access_token);
      
      if (tokens.refresh_token) {
        user.oauthProviders[providerIndex].refreshToken = encryption.encrypt(tokens.refresh_token);
      }
      
      await user.save();
      
      logger.info('Existing OAuth user logged in', {
        userId: user._id,
        provider
      });
      
      return { user, scenario: 'existing_oauth', isNewUser: false };
    }
    
    // Scenario 2: Check if email exists (potential account linking)
    user = await User.findOne({ email });
    
    if (user) {
      // Email exists - determine if safe to auto-link
      const canAutoLink = user.emailVerified || user.oauthProviders.length > 0;
      
      if (canAutoLink) {
        // Auto-link: verified email or already has OAuth = safe
        user.oauthProviders.push({
          provider,
          providerId,
          providerEmail: email,
          accessToken: encryption.encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token ? encryption.encrypt(tokens.refresh_token) : null,
          profilePicture: picture,
          connectedAt: new Date(),
          lastUsed: new Date()
        });
        
        // If this is first OAuth, update verification status
        if (!user.emailVerified && emailVerified) {
          user.emailVerified = true;
          user.emailVerifiedAt = new Date();
        }
        
        await user.save();
        
        logger.info('OAuth account linked to existing user', {
          userId: user._id,
          provider,
          autoLinked: true
        });
        
        return { user, scenario: 'auto_linked', isNewUser: false };
      } else {
        // Unverified email account - require verification first
        logger.warn('OAuth link blocked - email not verified', {
          email,
          provider
        });
        
        return {
          user: null,
          scenario: 'verification_required',
          message: 'Please verify your email before linking social accounts',
          email
        };
      }
    }
    
    // Scenario 3: New user - create OAuth account
    user = await User.create({
      email,
      firstName,
      lastName,
      emailVerified: emailVerified,
      emailVerifiedAt: emailVerified ? new Date() : null,
      oauthProviders: [{
        provider,
        providerId,
        providerEmail: email,
        accessToken: encryption.encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encryption.encrypt(tokens.refresh_token) : null,
        profilePicture: picture,
        connectedAt: new Date(),
        lastUsed: new Date()
      }],
      primaryAuthMethod: provider
    });
    
    logger.info('New OAuth user created', {
      userId: user._id,
      provider
    });
    
    return { user, scenario: 'new_oauth_user', isNewUser: true };
  }

  // Unlink OAuth provider
  async unlinkProvider(userId, provider) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if can unlink
    const canUnlink = user.canUnlinkProvider(provider);
    if (!canUnlink.allowed) {
      throw new Error(canUnlink.reason);
    }
    
    // Remove provider
    user.oauthProviders = user.oauthProviders.filter(p => p.provider !== provider);
    
    // If unlinking primary method, switch to another
    if (user.primaryAuthMethod === provider) {
      if (user.password) {
        user.primaryAuthMethod = 'password';
      } else if (user.oauthProviders.length > 0) {
        user.primaryAuthMethod = user.oauthProviders[0].provider;
      }
    }
    
    await user.save();
    
    logger.info('OAuth provider unlinked', {
      userId: user._id,
      provider
    });
    
    return user;
  }
}

module.exports = new OAuthService();
```

### **Phase 3: OAuth Routes & Controllers (90 minutes)**

**Step 1:** OAuth state management
```javascript
// utils/oauthState.js
const crypto = require('crypto');

// In-memory store for development (use Redis in production)
const stateStore = new Map();

class OAuthStateManager {
  generate(userId = null, returnUrl = '/dashboard') {
    const state = crypto.randomBytes(32).toString('hex');
    
    stateStore.set(state, {
      userId,
      returnUrl,
      timestamp: Date.now()
    });
    
    // Auto-cleanup after 10 minutes
    setTimeout(() => stateStore.delete(state), 10 * 60 * 1000);
    
    return state;
  }

  validate(state) {
    const data = stateStore.get(state);
    
    if (!data) {
      return { valid: false, reason: 'Invalid or expired state' };
    }
    
    // Check if expired (10 min)
    const age = Date.now() - data.timestamp;
    if (age > 10 * 60 * 1000) {
      stateStore.delete(state);
      return { valid: false, reason: 'State expired' };
    }
    
    // Delete after use (one-time)
    stateStore.delete(state);
    
    return { valid: true, data };
  }
}

module.exports = new OAuthStateManager();
```

**Step 2:** OAuth controller
```javascript
// controllers/oauth.controller.js
const oauthService = require('../services/oauth.service');
const oauthStateManager = require('../utils/oauthState');
const authService = require('../services/auth.service');
const logger = require('../config/logger');

// Initiate OAuth flow
const initiateOAuth = (provider) => {
  return async (req, res, next) => {
    try {
      const returnUrl = req.query.returnUrl || '/dashboard';
      const userId = req.user?.userId; // If already logged in
      
      // Generate state for CSRF protection
      const state = oauthStateManager.generate(userId, returnUrl);
      
      // Generate authorization URL
      const authUrl = oauthService.generateAuthUrl(provider, state);
      
      logger.info('OAuth flow initiated', {
        provider,
        userId: userId || 'anonymous',
        requestId: req.id
      });
      
      // Redirect to provider
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  };
};

// Handle OAuth callback
const handleOAuthCallback = (provider) => {
  return async (req, res, next) => {
    try {
      const { code, state, error: oauthError } = req.query;
      
      // Check for OAuth errors
      if (oauthError) {
        logger.warn('OAuth provider returned error', {
          provider,
          error: oauthError,
          requestId: req.id
        });
        return res.redirect(`/login?error=oauth_failed&message=${encodeURIComponent(oauthError)}`);
      }
      
      // Validate required parameters
      if (!code || !state) {
        logger.warn('OAuth callback missing parameters', {
          provider,
          hasCode: !!code,
          hasState: !!state,
          requestId: req.id
        });
        return res.redirect('/login?error=invalid_callback');
      }
      
      // Validate state (CSRF protection)
      const stateValidation = oauthStateManager.validate(state);
      if (!stateValidation.valid) {
        logger.error('OAuth state validation failed', {
          provider,
          reason: stateValidation.reason,
          requestId: req.id
        });
        return res.redirect('/login?error=invalid_state');
      }
      
      const { returnUrl } = stateValidation.data;
      
      // Exchange code for tokens
      const tokens = await oauthService.exchangeCodeForToken(provider, code);
      
      // Get user profile
      const profile = await oauthService.getUserProfile(provider, tokens.access_token);
      
      // Handle account linking/creation
      const result = await oauthService.handleOAuthCallback(provider, profile, tokens);
      
      // Handle special scenarios
      if (result.scenario === 'verification_required') {
        return res.redirect(
          `/login?error=verification_required&message=${encodeURIComponent(result.message)}`
        );
      }
      
      // Generate JWT tokens
      const accessToken = authService.generateAccessToken(result.user);
      const refreshToken = authService.generateRefreshToken(result.user);
      
      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      logger.info('OAuth authentication successful', {
        userId: result.user._id,
        provider,
        scenario: result.scenario,
        isNewUser: result.isNewUser,
        requestId: req.id
      });
      
      // Redirect to return URL
      const successUrl = result.isNewUser 
        ? '/welcome?provider=' + provider
        : returnUrl;
      
      res.redirect(successUrl + '?auth=success');
    } catch (error) {
      logger.error('OAuth callback error', {
        provider,
        error: error.message,
        stack: error.stack,
        requestId: req.id
      });
      
      res.redirect('/login?error=oauth_failed&message=' + encodeURIComponent('Authentication failed'));
    }
  };
};

// Get connected providers
const getConnectedProviders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('oauthProviders password primaryAuthMethod');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const providers = user.oauthProviders.map(p => ({
      provider: p.provider,
      connectedAt: p.connectedAt,
      lastUsed: p.lastUsed,
      email: p.providerEmail,
      profilePicture: p.profilePicture,
      isPrimary: user.primaryAuthMethod === p.provider
    }));
    
    res.json({
      success: true,
      providers,
      hasPassword: !!user.password,
      primaryAuthMethod: user.primaryAuthMethod,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

// Unlink provider
const unlinkProvider = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { provider } = req.params;
    
    // Validate provider
    if (!['google', 'github'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider',
        requestId: req.id
      });
    }
    
    const user = await oauthService.unlinkProvider(userId, provider);
    
    const remainingProviders = user.oauthProviders.map(p => p.provider);
    
    res.json({
      success: true,
      message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account unlinked successfully`,
      remainingProviders,
      hasPassword: !!user.password,
      primaryAuthMethod: user.primaryAuthMethod,
      requestId: req.id
    });
  } catch (error) {
    if (error.message.includes('Cannot unlink')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        requestId: req.id
      });
    }
    next(error);
  }
};

module.exports = {
  initiateOAuth,
  handleOAuthCallback,
  getConnectedProviders,
  unlinkProvider
};
```

**Step 3:** OAuth routes
```javascript
// routes/oauth.routes.js
const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// OAuth initiation (public)
router.get('/google', oauthController.initiateOAuth('google'));
router.get('/github', oauthController.initiateOAuth('github'));

// OAuth callbacks (public)
router.get('/google/callback', oauthController.handleOAuthCallback('google'));
router.get('/github/callback', oauthController.handleOAuthCallback('github'));

// Provider management (protected)
router.get('/providers', authenticateToken, oauthController.getConnectedProviders);
router.delete('/providers/:provider', authenticateToken, oauthController.unlinkProvider);

module.exports = router;
```

**Step 4:** Integrate routes in server
```javascript
// server.js
const oauthRoutes = require('./routes/oauth.routes');

// ... other middleware ...

// OAuth routes
app.use('/auth', oauthRoutes);
```

### **Phase 4: Environment & Security Setup (60 minutes)**

**Step 1:** Update environment variables
```javascript
// .env
# Existing variables
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
# ... other vars ...

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Encryption Key (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=your_64_character_hex_encryption_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Step 2:** Generate encryption key script
```javascript
// scripts/generate-encryption-key.js
const crypto = require('crypto');

console.log('Generated Encryption Key (add to .env):');
console.log('ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('hex'));
console.log('\nThis key is used to encrypt OAuth tokens in the database.');
console.log('Keep it secret and never commit it to version control!');
```

**Step 3:** Update authentication middleware to handle OAuth users
```javascript
// middleware/auth.middleware.js
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Fetch fresh user data (OAuth users might have updated providers)
    const User = require('../models/User');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = {
      userId: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
      oauthProviders: user.oauthProviders.map(p => p.provider)
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

### **Phase 5: Testing & Documentation (60 minutes)**

**Step 1:** Create OAuth testing guide
```javascript
// docs/oauth-testing.md
/*
# OAuth Testing Guide

## Setup:
1. Register OAuth apps:
   - Google: https://console.cloud.google.com/
   - GitHub: https://github.com/settings/developers

2. Add credentials to .env

3. Generate encryption key:
   node scripts/generate-encryption-key.js

## Manual Testing:

### Google OAuth:
1. Visit: http://localhost:3000/auth/google
2. Should redirect to Google consent screen
3. After approval, redirects to callback
4. Should redirect to dashboard with success

### GitHub OAuth:
1. Visit: http://localhost:3000/auth/github
2. Should redirect to GitHub authorization
3. After approval, redirects to callback
4. Should redirect to dashboard with success

### Account Linking:
1. Register with password (user@example.com)
2. Logout
3. Sign in with Google (same email)
4. Should auto-link accounts
5. Check /auth/providers - should show both methods

### Provider Management:
1. GET /auth/providers - see connected providers
2. DELETE /auth/providers/google - unlink Google
3. Try unlinking last provider - should fail
*/
```

---

## 🧪 **Comprehensive Testing Strategy**

### **Test Suite 1: Google OAuth Flow**
```bash
# Manual test (browser):
# 1. Navigate to http://localhost:3000/auth/google
# 2. Complete Google sign-in
# 3. Check redirect to dashboard
# 4. Verify cookies set (accessToken, refreshToken)

# Check logs for:
# - "OAuth flow initiated" with provider=google
# - "OAuth authentication successful" with scenario
# - Request IDs for debugging
```

### **Test Suite 2: GitHub OAuth Flow**
```bash
# Manual test:
# 1. Navigate to http://localhost:3000/auth/github
# 2. Authorize app
# 3. Check redirect
# 4. Verify authentication

# Check database:
# User should have oauthProviders array with github entry
```

### **Test Suite 3: Account Linking**
```bash
# Test auto-linking:
# 1. Register with password: test@example.com
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test"
  }'

# 2. Verify email (from Day 5)

# 3. Sign in with Google using SAME email
# Browser: http://localhost:3000/auth/google
# Should auto-link to existing account

# 4. Check providers
curl -X GET http://localhost:3000/auth/providers \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should show both password and google
```

### **Test Suite 4: Provider Management**
```bash
# Get connected providers
curl -X GET http://localhost:3000/auth/providers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unlink provider (when multiple exist)
curl -X DELETE http://localhost:3000/auth/providers/google \
  -H "Authorization: Bearer YOUR_TOKEN"

# Try unlinking last provider (should fail)
curl -X DELETE http://localhost:3000/auth/providers/github \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return 400 with message about last auth method
```

### **Test Suite 5: Security Testing**
```bash
# Test CSRF protection (state parameter)
# 1. Initiate OAuth, capture state parameter
# 2. Try callback with different state
curl -X GET "http://localhost:3000/auth/google/callback?code=test&state=invalid_state"
# Should redirect with error

# Test expired state (wait 11 minutes after initiating)
# Should reject with "expired state" error

# Test token encryption in database
# Check MongoDB - accessToken and refreshToken should be encrypted (not readable)
```

---

## 🎯 **Success Criteria for Day 6**

### **OAuth Infrastructure:**
- [ ] Google OAuth fully functional (initiation → callback → authentication)
- [ ] GitHub OAuth fully functional
- [ ] State parameter CSRF protection implemented
- [ ] Authorization code to token exchange working
- [ ] User profile retrieval from both providers

### **Account Linking:**
- [ ] Auto-linking verified email accounts
- [ ] Manual linking prevention for unverified emails
- [ ] Multiple OAuth providers per user supported
- [ ] No duplicate accounts created

### **Security:**
- [ ] OAuth tokens encrypted before database storage
- [ ] State parameter validation (CSRF protection)
- [ ] One-time use state tokens (deleted after validation)
- [ ] Secure token exchange (server-to-server only)
- [ ] Client secrets never exposed to frontend

### **Provider Management:**
- [ ] GET /auth/providers lists connected providers
- [ ] DELETE /auth/providers/:provider unlinks provider
- [ ] Cannot unlink last authentication method
- [ ] Primary auth method tracked and displayed

### **User Experience:**
- [ ] Smooth OAuth flow with proper redirects
- [ ] Clear error messages for OAuth failures
- [ ] New users welcomed with onboarding
- [ ] Returning users logged in seamlessly
- [ ] Profile pictures from OAuth displayed

---

## 🚨 **Common Pitfalls & Solutions**

### **Pitfall 1: Storing Plain OAuth Tokens**
```javascript
// BAD - Security risk
user.oauthProviders.push({
  accessToken: tokens.access_token
});

// GOOD - Encrypted
user.oauthProviders.push({
  accessToken: encryption.encrypt(tokens.access_token)
});
```

### **Pitfall 2: Missing State Validation**
```javascript
// BAD - Vulnerable to CSRF
app.get('/auth/google/callback', (req, res) => {
  const { code } = req.query;
  // Exchange code... NO STATE CHECK!
});

// GOOD - CSRF protected
app.get('/auth/google/callback', (req, res) => {
  const { code, state } = req.query;
  const validation = oauthStateManager.validate(state);
  if (!validation.valid) {
    return res.redirect('/login?error=invalid_state');
  }
  // Continue...
});
```

### **Pitfall 3: Auto-Linking Unverified Accounts**
```javascript
// BAD - Security risk (email not verified)
if (existingUser) {
  // Link without checking verification
  existingUser.oauthProviders.push(...);
}

// GOOD - Verify first
if (existingUser.emailVerified || existingUser.oauthProviders.length > 0) {
  // Safe to link
} else {
  // Require verification first
}
```

### **Pitfall 4: Not Handling GitHub Email Privacy**
```javascript
// BAD - Assumes email is always public
const email = githubProfile.email;

// GOOD - Fetch from emails endpoint
const emailsResponse = await axios.get('https://api.github.com/user/emails');
const primaryEmail = emailsResponse.data.find(e => e.primary && e.verified);
```

---

## ⏰ **Time Budget**
- **Phase 1 - OAuth Foundation:** 1.8 hours
- **Phase 2 - OAuth Service:** 1.7 hours
- **Phase 3 - Routes & Controllers:** 1.5 hours
- **Phase 4 - Security Setup:** 1 hour
- **Phase 5 - Testing & Docs:** 1 hour
- **Total:** ~7 hours

---

## 💡 **Pro Tips**

### **1. OAuth Development Setup:**
```bash
# Use ngrok for testing OAuth callbacks in development
ngrok http 3000
# Use ngrok URL in OAuth app settings
# Update .env: GOOGLE_CALLBACK_URL=https://abc123.ngrok.io/auth/google/callback
```

### **2. Error Logging:**
```javascript
// Log OAuth errors with full context
logger.error('OAuth error', {
  provider,
  step: 'token_exchange', // or 'profile_fetch', 'account_linking'
  error: error.message,
  response: error.response?.data,
  requestId: req.id
});
```

### **3. Token Refresh Strategy:**
```javascript
// Save refresh tokens for future use
// Can implement background job to refresh expired access tokens
// Google access tokens expire in 1 hour
// Refresh tokens last until revoked
```

### **4. Production Checklist:**
```javascript
// Before deploying OAuth:
- [ ] Register production OAuth apps
- [ ] Update callback URLs to production domain
- [ ] Use Redis for state management (not in-memory)
- [ ] Enable HTTPS (OAuth requires secure callbacks)
- [ ] Set secure cookies (secure: true)
- [ ] Implement rate limiting on OAuth endpoints
- [ ] Monitor failed OAuth attempts
```

---

## 🚀 **Tomorrow's Preview: Day 7**

Day 7 will tackle "Database Connection & Performance" - MongoDB integration with connection pooling, indexing strategies, query optimization, and health monitoring!

**Remember:** OAuth seems simple ("just add a button") but is complex under the hood. Today you built enterprise-grade social authentication that's secure, flexible, and user-friendly. You can now offer users the convenience they expect! 💪🔒🌟