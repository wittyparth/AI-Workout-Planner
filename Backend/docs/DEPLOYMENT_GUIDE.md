# FitAI Deployment Guide

Complete guide for deploying FitAI frontend to Vercel, backend to Render, and database to MongoDB Atlas.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Testing](#testing)

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project (e.g., "FitAI Production")

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 Sandbox tier
3. Select your preferred cloud provider and region (choose closest to your users)
4. Name your cluster (e.g., "fitai-cluster")
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create username and strong password (save these!)
4. Set "Database User Privileges" to "Read and write to any database"
5. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to Render's IP ranges
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "5.5 or later"
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Add database name: `mongodb+srv://user:pass@cluster.mongodb.net/fitai-prod?retryWrites=true&w=majority`

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Create `.env.production` in project root:**
```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitai-prod?retryWrites=true&w=majority

# Redis (Upstash or Redis Cloud)
REDIS_URL=redis://default:password@redis-xxxxx.upstash.io:6379

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=1d
JWT_REFRESH_EXPIRE=7d

# AI - Google Gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=fitai-media
S3_BASE_URL=https://fitai-media.s3.amazonaws.com

# Email (Gmail or SendGrid)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OAuth (Optional - can configure later)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-app.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

2. **Add build script to `package.json`** (if not already there):
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node scripts/seed-comprehensive-exercises.js"
  }
}
```

3. **Create `render.yaml` in project root:**
```yaml
services:
  - type: web
    name: fitai-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

### Step 2: Deploy to Render

1. **Push code to GitHub** (if not already):
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

2. **Create Render Account:**
   - Go to [https://render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your AI-Workout-Planner repo
   - Configure:
     - **Name**: `fitai-backend`
     - **Region**: Choose closest to your MongoDB region
     - **Branch**: `main`
     - **Root Directory**: (leave empty)
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: `Free`

4. **Add Environment Variables:**
   - Click "Environment" tab
   - Add all variables from `.env.production` above
   - **Important**: Add these first:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `GEMINI_API_KEY`
     - `FRONTEND_URL` (temporarily use `http://localhost:3000`, update after Vercel deploy)

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://fitai-backend-xxxx.onrender.com`

6. **Seed Database (One-time):**
   - Go to Render dashboard → your service → "Shell" tab
   - Run: `npm run seed`
   - This will populate exercises database

### Step 3: Set up Redis (Optional but Recommended)

**Option 1: Upstash (Free tier)**
1. Go to [https://upstash.com](https://upstash.com)
2. Create account and new Redis database
3. Choose "Global" for best performance
4. Copy the connection URL
5. Add to Render environment variables as `REDIS_URL`

**Option 2: Redis Cloud**
1. Go to [https://redis.com/try-free](https://redis.com/try-free)
2. Create free database
3. Get connection string
4. Add to Render environment variables

---

## Frontend Deployment (Vercel)

### Step 1: Update Environment Variables

1. **Update `.env.production` in Frontend folder:**
```env
# API URL - use your Render backend URL
NEXT_PUBLIC_API_URL=https://fitai-backend-xxxx.onrender.com/api/v1

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

2. **Verify `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'fitai-media.s3.amazonaws.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
```

### Step 2: Deploy to Vercel

1. **Push Frontend Changes:**
```bash
cd Frontend
git add .
git commit -m "Configure for production"
git push
```

2. **Import Project to Vercel:**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `AI-Workout-Planner` repository

3. **Configure Project:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `Frontend`
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add from `.env.production`:
     ```
     NEXT_PUBLIC_API_URL=https://fitai-backend-xxxx.onrender.com/api/v1
     NEXT_PUBLIC_ENABLE_ANALYTICS=true
     ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build (3-5 minutes)
   - Note your frontend URL: `https://fitai-xxx.vercel.app`

---

## Post-Deployment Configuration

### Step 1: Update Backend CORS

1. Go to Render dashboard → your backend service
2. Add environment variable:
   ```
   FRONTEND_URL=https://fitai-xxx.vercel.app
   ```
3. Redeploy the service

### Step 2: Update OAuth Redirect URLs

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project → APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Add Authorized redirect URIs:
   ```
   https://fitai-backend-xxxx.onrender.com/api/v1/auth/google/callback
   https://fitai-xxx.vercel.app/auth/callback
   ```

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your app
3. Update Authorization callback URL:
   ```
   https://fitai-backend-xxxx.onrender.com/api/v1/auth/github/callback
   ```

### Step 3: Configure Email Service

**Using Gmail:**
1. Enable 2-factor authentication on your Google account
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Add to Render environment:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

**Using SendGrid (Recommended for production):**
1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create API key
3. Update Render environment:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

### Step 4: Set up AWS S3 for File Uploads

1. **Create S3 Bucket:**
   - Go to AWS Console → S3
   - Create bucket (e.g., `fitai-media-prod`)
   - Region: Same as backend
   - Uncheck "Block all public access"
   - Enable versioning

2. **Configure CORS:**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": [
         "https://fitai-xxx.vercel.app",
         "https://fitai-backend-xxxx.onrender.com"
       ],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User:**
   - IAM → Users → Add user
   - Attach policy: `AmazonS3FullAccess`
   - Generate access keys
   - Add to Render environment:
     ```
     AWS_ACCESS_KEY_ID=your-key
     AWS_SECRET_ACCESS_KEY=your-secret
     AWS_S3_BUCKET=fitai-media-prod
     ```

---

## Testing

### 1. Backend Health Check
```bash
curl https://fitai-backend-xxxx.onrender.com/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 2. API Documentation
Visit: `https://fitai-backend-xxxx.onrender.com/api/v1/docs`

### 3. Test User Registration
```bash
curl -X POST https://fitai-backend-xxxx.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

### 4. Test Frontend
1. Visit `https://fitai-xxx.vercel.app`
2. Click "Sign Up"
3. Create account
4. Verify you can:
   - Login
   - View dashboard
   - Access features

---

## Troubleshooting

### Backend Issues

**"Cannot connect to database":**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

**"Redis connection failed":**
- Verify REDIS_URL format
- Check Upstash/Redis Cloud dashboard
- Redis is optional - app will work without it

**"File upload failed":**
- Check AWS credentials
- Verify S3 bucket CORS configuration
- Ensure bucket policy allows uploads

### Frontend Issues

**"Network Error" or "Failed to fetch":**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Verify CORS is configured in backend

**"Unauthorized" errors:**
- Clear browser cookies/localStorage
- Try registering new account
- Check JWT_SECRET is set in backend

**Build fails on Vercel:**
- Check build logs for specific error
- Verify all dependencies in `package.json`
- Ensure TypeScript has no errors

---

## Monitoring & Maintenance

### Set up Monitoring

1. **Render:**
   - Enable "Auto-Deploy" for automatic updates
   - Monitor logs in dashboard
   - Set up Slack/email notifications

2. **Vercel:**
   - Enable Preview Deployments
   - Set up deployment notifications
   - Monitor Web Vitals

3. **MongoDB Atlas:**
   - Set up alerts for storage/connections
   - Monitor performance metrics
   - Enable automated backups

### Regular Maintenance

- **Weekly**: Check error logs in Render & Vercel
- **Monthly**: Review MongoDB database size
- **Quarterly**: Update dependencies, rotate secrets

---

## Quick Reference

### URLs
- **Frontend**: `https://fitai-xxx.vercel.app`
- **Backend API**: `https://fitai-backend-xxxx.onrender.com/api/v1`
- **API Docs**: `https://fitai-backend-xxxx.onrender.com/api/v1/docs`
- **MongoDB**: MongoDB Atlas Dashboard

### Environment Variables Checklist

**Backend (Render):**
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] FRONTEND_URL
- [x] GEMINI_API_KEY
- [ ] REDIS_URL (optional)
- [ ] AWS credentials (for uploads)
- [ ] Email credentials
- [ ] OAuth credentials (optional)

**Frontend (Vercel):**
- [x] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID (optional)

---

## Support

If you encounter issues:
1. Check Render/Vercel logs
2. Review this guide
3. Check backend health endpoint
4. Verify all environment variables
5. Test API endpoints with curl/Postman

---

**Deployment Complete!** 🎉

Your FitAI application is now live and accessible worldwide!
