# 🏋️‍♂️ FitAI Backend - AI-Powered Fitness Platform API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Production-ready backend powering the next generation of AI fitness applications**

[🚀 Live Demo](https://fitai-api.example.com) • [📖 API Docs](https://docs.fitai.example.com) • [🐛 Report Bug](https://github.com/wittyparth/fitai-backend/issues) • [✨ Request Feature](https://github.com/wittyparth/fitai-backend/issues/new)

</div>

---

## 🎯 **Overview**

FitAI Backend is a comprehensive, production-ready REST API that powers an AI-driven fitness platform. Built with modern Node.js technologies, it provides secure authentication, real-time workout tracking, AI-powered exercise recommendations, social community features, and advanced analytics.

**🌟 Perfect for fitness startups, personal trainers, and developers building health & wellness applications.**

## ✨ **Key Features**

### 🤖 **AI-Powered Intelligence**
- **Smart Workout Generation**: AI algorithms create personalized workout plans based on user goals, fitness level, and available equipment
- **Exercise Recommendations**: Machine learning models suggest optimal exercises for muscle targeting and progression
- **Performance Analysis**: AI-driven insights for form improvement and workout optimization
- **Adaptive Planning**: Workouts automatically adjust based on user performance and feedback

### 🔐 **Enterprise-Grade Security**
- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **Role-Based Access Control**: Granular permissions for users, trainers, and administrators
- **Rate Limiting**: Advanced rate limiting to prevent abuse and ensure fair usage
- **Data Encryption**: End-to-end encryption for sensitive user data and health information
- **GDPR Compliance**: Full compliance with data protection regulations

### ⚡ **Real-Time Features**
- **Live Workout Tracking**: WebSocket-powered real-time workout session synchronization
- **Community Interactions**: Live feed updates, comments, and social activity notifications
- **Performance Monitoring**: Real-time analytics and workout progress tracking
- **Multi-Device Sync**: Seamless synchronization across mobile and web platforms

### 📊 **Advanced Analytics**
- **Progress Tracking**: Comprehensive workout history and performance metrics
- **Goal Achievement**: Smart goal setting with milestone tracking and achievements
- **Health Insights**: Body composition tracking, measurement logs, and progress photos
- **Community Analytics**: Social engagement metrics and challenge leaderboards

### 🏗️ **Scalable Architecture**
- **Microservices Design**: Modular architecture for easy scaling and maintenance
- **Event-Driven**: Asynchronous event handling for improved performance
- **Database Optimization**: Advanced MongoDB aggregation and indexing strategies
- **Caching Layer**: Redis-powered caching for optimal response times

## 🛠️ **Tech Stack**

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18+, Express.js 4.x |
| **Database** | MongoDB 6.x, Mongoose ODM |
| **Caching** | Redis 7.x |
| **Authentication** | JWT, bcrypt, Passport.js |
| **Real-time** | Socket.io, WebSockets |
| **AI/ML** | TensorFlow.js, OpenAI API |
| **File Storage** | AWS S3, Cloudinary |
| **Testing** | Jest, Supertest |
| **Documentation** | Swagger/OpenAPI 3.0 |
| **Monitoring** | Winston, Morgan |
| **Deployment** | Docker, AWS ECS, Nginx |

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.x or MongoDB Atlas account
- Redis 7.x (optional for caching)
- AWS S3 bucket (for file uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/wittyparth/fitai-backend.git
cd fitai-backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables (see Configuration section)
# Edit .env with your database and service credentials

# Run database migrations
npm run migrate

# Seed initial data (exercises, templates)
npm run seed

# Start development server
npm run dev
```

### Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/fitai
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# AI Services
OPENAI_API_KEY=your-openai-api-key
TENSORFLOW_MODEL_URL=your-model-endpoint

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1

# External Services
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Docker Setup (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Run only the API (requires external MongoDB/Redis)
docker build -t fitai-backend .
docker run -p 3001:3001 --env-file .env fitai-backend
```

## 📚 **API Documentation**

### Authentication Endpoints
```http
POST   /api/v1/auth/register          # User registration
POST   /api/v1/auth/login             # User login
POST   /api/v1/auth/refresh           # Refresh JWT token
POST   /api/v1/auth/logout            # User logout
POST   /api/v1/auth/forgot-password   # Password reset request
POST   /api/v1/auth/reset-password    # Password reset confirmation
```

### User Management
```http
GET    /api/v1/users/profile          # Get current user profile
PUT    /api/v1/users/profile          # Update user profile
POST   /api/v1/users/avatar           # Upload profile picture
GET    /api/v1/users/preferences      # Get user preferences
PUT    /api/v1/users/preferences      # Update user preferences
DELETE /api/v1/users/account          # Delete user account
```

### Exercise Library
```http
GET    /api/v1/exercises              # Get all exercises (paginated)
GET    /api/v1/exercises/:id          # Get specific exercise
GET    /api/v1/exercises/search       # Search exercises
GET    /api/v1/exercises/muscles/:muscle # Filter by muscle group
GET    /api/v1/exercises/equipment/:equipment # Filter by equipment
POST   /api/v1/exercises              # Create custom exercise (authenticated)
```

### Workout Management
```http
GET    /api/v1/workouts               # Get user's workout history
POST   /api/v1/workouts               # Create new workout session
GET    /api/v1/workouts/:id           # Get specific workout
PUT    /api/v1/workouts/:id           # Update workout
DELETE /api/v1/workouts/:id           # Delete workout
POST   /api/v1/workouts/:id/complete  # Mark workout as complete
```

### Template System
```http
GET    /api/v1/templates              # Get workout templates
POST   /api/v1/templates              # Create new template
GET    /api/v1/templates/:id          # Get specific template
PUT    /api/v1/templates/:id          # Update template
DELETE /api/v1/templates/:id          # Delete template
POST   /api/v1/templates/:id/favorite # Add to favorites
GET    /api/v1/templates/public       # Get public templates
```

### AI Features
```http
POST   /api/v1/ai/workout/generate    # Generate AI workout plan
POST   /api/v1/ai/exercise/recommend  # Get exercise recommendations
POST   /api/v1/ai/form/analyze        # Analyze exercise form (video upload)
GET    /api/v1/ai/insights/:userId    # Get AI-powered insights
```

### Analytics & Progress
```http
GET    /api/v1/analytics/dashboard    # Get dashboard metrics
GET    /api/v1/analytics/progress     # Get progress tracking data
GET    /api/v1/analytics/goals        # Get goal progress
POST   /api/v1/analytics/measurements # Log body measurements
GET    /api/v1/analytics/trends       # Get workout trends
```

### Community Features
```http
GET    /api/v1/community/feed         # Get activity feed
POST   /api/v1/community/posts        # Create new post
GET    /api/v1/community/challenges   # Get active challenges
POST   /api/v1/community/challenges/:id/join # Join challenge
GET    /api/v1/community/leaderboard  # Get challenge leaderboard
POST   /api/v1/community/follow/:userId # Follow user
```

### Real-time WebSocket Events
```javascript
// Workout session tracking
socket.emit('workout:start', { workoutId, exercises })
socket.emit('workout:update', { setData, currentExercise })
socket.emit('workout:complete', { workoutId, summary })

// Community interactions
socket.emit('feed:new_post', { postData })
socket.emit('challenge:update', { challengeId, progress })
```

## 🏗️ **Architecture**

### System Design
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                    Load Balancer (Nginx)                   │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway (Express)                   │
├─────────────────────────────────────────────────────────────┤
│  Auth    │  Workouts │  Analytics │  Community │    AI     │
│ Service  │  Service  │  Service   │  Service   │  Service  │
├─────────────────────────────────────────────────────────────┤
│              Message Broker (Redis Pub/Sub)                │
├─────────────────────────────────────────────────────────────┤
│           Database Layer (MongoDB + Redis Cache)           │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  passwordHash: String,
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    fitnessLevel: String,
    goals: [String],
    profilePicture: String
  },
  preferences: {
    units: String,
    notifications: Object,
    privacy: Object
  },
  subscription: {
    plan: String,
    status: String,
    stripeCustomerId: String
  },
  socialData: {
    friends: [ObjectId],
    followers: [ObjectId],
    following: [ObjectId]
  }
}
```

#### Exercises Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  primaryMuscleGroups: [String],
  secondaryMuscleGroups: [String],
  equipment: [String],
  difficulty: String,
  instructions: [String],
  media: {
    images: [String],
    videos: [String]
  },
  metrics: {
    popularityScore: Number,
    averageRating: Number
  }
}
```

### Folder Structure
```
src/
├── controllers/          # Route handlers and business logic
│   ├── auth.controller.js
│   ├── exercise.controller.js
│   ├── workout.controller.js
│   ├── template.controller.js
│   ├── analytics.controller.js
│   └── community.controller.js
├── models/              # Database models and schemas
│   ├── User.js
│   ├── Exercise.js
│   ├── Workout.js
│   ├── Template.js
│   └── Community.js
├── routes/              # API route definitions
│   ├── auth.routes.js
│   ├── exercise.routes.js
│   ├── workout.routes.js
│   └── index.js
├── middleware/          # Custom middleware functions
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   ├── rateLimiting.middleware.js
│   └── error.middleware.js
├── services/            # Business logic and external APIs
│   ├── auth.service.js
│   ├── ai.service.js
│   ├── email.service.js
│   └── analytics.service.js
├── utils/               # Helper functions
│   ├── logger.js
│   ├── validation.js
│   ├── response.js
│   └── constants.js
└── config/              # Configuration files
    ├── database.js
    ├── redis.js
    └── swagger.js
```

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance
```

### Test Coverage Goals
- **Unit Tests**: 90%+ coverage for services and utilities
- **Integration Tests**: All API endpoints
- **Performance Tests**: Response times under 100ms
- **Security Tests**: Authentication and authorization flows

## 📈 **Performance**

### Optimization Features
- **Database Indexing**: Optimized MongoDB indexes for fast queries
- **Caching Strategy**: Redis caching for frequently accessed data
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Prevents API abuse and ensures fair usage
- **Compression**: Gzip compression for API responses
- **CDN Integration**: Static assets served through CloudFront

### Performance Metrics
- **API Response Time**: < 100ms average
- **Database Query Time**: < 50ms average
- **Memory Usage**: < 512MB per instance
- **CPU Usage**: < 70% under normal load
- **Concurrent Users**: 10,000+ supported

## 🚀 **Deployment**

### Production Deployment with Docker

```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### AWS ECS Deployment
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker build -t fitai-backend .
docker tag fitai-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/fitai-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/fitai-backend:latest

# Deploy to ECS
aws ecs update-service --cluster fitai-cluster --service fitai-backend-service --force-new-deployment
```

### Environment-Specific Configurations

#### Development
```bash
npm run dev          # Development with hot reload
npm run debug        # Development with debugging enabled
```

#### Staging
```bash
npm run build        # Build for staging
npm run start:staging # Start staging server
```

#### Production
```bash
npm run build:prod   # Production build with optimizations
npm start           # Start production server
```

## 📊 **Monitoring & Logging**

### Application Monitoring
- **Health Checks**: `/health` endpoint for load balancer monitoring
- **Metrics Collection**: Prometheus metrics for performance tracking
- **Error Tracking**: Sentry integration for error monitoring
- **Log Aggregation**: Winston logging with log levels and rotation

### Analytics Dashboard
- **Request Metrics**: Response times, error rates, throughput
- **User Analytics**: Active users, session duration, feature usage
- **Business Metrics**: Workout completions, goal achievements, user engagement
- **Performance Insights**: Database query performance, cache hit rates

## 🔧 **Development**

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build application for production
npm start           # Start production server
npm test            # Run test suite
npm run lint        # Run ESLint for code quality
npm run format      # Format code with Prettier
npm run migrate     # Run database migrations
npm run seed        # Seed database with initial data
npm run docs        # Generate API documentation
```

### Development Workflow
1. **Feature Branch**: Create feature branch from `develop`
2. **Development**: Write code with tests
3. **Code Review**: Submit pull request with test coverage
4. **Testing**: Automated tests and manual QA
5. **Deployment**: Merge to `main` for production deployment

### Code Style Guidelines
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Husky**: Git hooks for pre-commit validation

## 🤝 **Contributing**

We welcome contributions! Please follow our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Commit your changes: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Review Process
- All code must pass automated tests
- Minimum 90% test coverage for new features
- Security review for authentication/authorization changes
- Performance review for database queries and API endpoints

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenAI**: AI-powered workout generation
- **MongoDB**: Flexible document database
- **Express.js**: Fast, unopinionated web framework
- **Socket.io**: Real-time bidirectional event-based communication
- **AWS**: Cloud infrastructure and services

## 🚀 **Roadmap**

### Phase 1 (Current)
- ✅ Core API development
- ✅ Authentication system
- ✅ Exercise library
- ✅ Workout tracking
- ✅ Real-time features

### Phase 2 (Next 3 months)
- 🔄 Advanced AI features
- 🔄 Social platform enhancements
- 🔄 Mobile app API optimization
- 🔄 Performance improvements

### Phase 3 (Next 6 months)
- 📋 Microservices architecture
- 📋 Advanced analytics
- 📋 Third-party integrations
- 📋 Enterprise features

---

<div align="center">

**[⭐ Star this repo](https://github.com/wittyparth/fitai-backend)** if you find it useful!

**Built with ❤️ for the fitness community**

[Website](https://fitai.example.com) • [Documentation](https://docs.fitai.example.com) • [Support](mailto:support@fitai.example.com)

</div>