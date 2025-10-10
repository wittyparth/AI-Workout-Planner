# Day 7 Learning Guide: Database Connection & Performance Optimization
## Problem Discovery & Production-Ready Solutions

### 🔥 **The Story: The Database Nightmare**

Your OAuth system from Day 6 is incredible! Users can sign in with Google, GitHub, and passwords. Account linking works flawlessly. You're feeling unstoppable.

Then you invite 50 beta testers to stress test your app:
- **Registration takes 5-8 seconds** instead of instant
- Users complain: *"Is the app frozen? Nothing is happening..."*
- Check logs: Database queries taking **3000-6000ms** (should be <100ms)
- Some requests timeout completely after 30 seconds
- Server crashes randomly with "MongoServerSelectionError: connection timed out"

**Morning panic:** You realize your database connection is amateur-level. You're creating a NEW connection for EVERY request. No connection pooling. No error handling. No retries. Your app would crash in production within minutes.

**Afternoon investigation:** You check the User collection: 50 users, but queries are SLOW. Find a user by email? **2500ms**. Why? No indexes! MongoDB is scanning ALL documents for every query. You read about database indexes - mind blown. Adding indexes makes queries **100x faster**.

**Evening crisis:** Deploy a "quick fix" for performance. App crashes at 2 AM. Friend texts: *"Your app is down!"* You check logs - connection pool exhausted, database replica set failed, no health monitoring to catch it early. You spend 4 hours debugging production issues that could've been prevented with proper monitoring.

**Today's Advanced Mission:** Build enterprise-grade database architecture with connection pooling, intelligent indexing, query optimization, and comprehensive health monitoring.

---

## 🎯 **Today's Mission: Production Database Architecture**
1. **MongoDB connection pooling** → Handle thousands of concurrent requests
2. **Database indexing strategy** → 100x faster queries
3. **Query optimization** → Projection, lean queries, pagination
4. **Health monitoring system** → Catch problems before users notice
5. **Database error handling** → Graceful degradation and retries
6. **Performance profiling** → Identify and fix slow queries

---

## 📚 **Advanced Professional Learning Requirements**

### **1. MongoDB Connection Pooling Deep Dive (60 minutes learning)**
**The Challenge:** Database connections are expensive - must reuse efficiently
**Professional Understanding:**

**What Connection Pooling Solves:**
```javascript
// BAD - Creating connection per request (DISASTER)
app.get('/users', async (req, res) => {
  const connection = await mongoose.connect(MONGO_URI); // NEW CONNECTION!
  const users = await User.find();
  await connection.close(); // CLOSE CONNECTION!
  res.json(users);
});
// Result: 
// - Each request takes 200-500ms just for connection
// - MongoDB has connection limits (100 default)
// - App crashes when limits hit

// GOOD - Connection pooling (PROFESSIONAL)
// Create pool once at app startup
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10, // Max 10 concurrent connections
  minPoolSize: 2,  // Keep 2 connections always ready
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

// All requests reuse connections from pool
app.get('/users', async (req, res) => {
  const users = await User.find(); // Reuses pooled connection
  res.json(users);
});
// Result:
// - Queries execute in 10-50ms
// - Efficient resource usage
// - Handles high traffic
```

**Connection Pool Configuration:**
```javascript
const dbConfig = {
  // Connection Pool Settings
  maxPoolSize: 10,        // Max connections in pool
  minPoolSize: 2,         // Min connections to maintain
  
  // Timeout Settings
  serverSelectionTimeoutMS: 5000,  // Time to find a server
  socketTimeoutMS: 45000,          // Time before socket timeout
  connectTimeoutMS: 10000,         // Initial connection timeout
  
  // Retry Settings
  retryWrites: true,               // Retry failed writes
  retryReads: true,                // Retry failed reads
  
  // Monitoring
  heartbeatFrequencyMS: 10000,     // Check server health every 10s
  
  // Replica Set (Production)
  replicaSet: 'rs0',               // Name of replica set
  readPreference: 'primaryPreferred', // Read from primary, fallback to secondary
  
  // Authentication
  authSource: 'admin',
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
};
```

**Why This Matters:**
```javascript
// Without pooling:
// 100 concurrent requests = 100 connection attempts
// MongoDB max connections: 100 (default)
// Request 101: CONNECTION REFUSED → App crashes

// With pooling:
// 100 concurrent requests = 10 connections (reused)
// Pool manages connection lifecycle
// Request 101: Waits in queue → Handled gracefully
```

### **2. Database Indexing Strategy (65 minutes learning)**
**The Challenge:** MongoDB scans ALL documents without indexes (O(n) complexity)
**Professional Solution:** Strategic indexes for O(log n) or O(1) lookups

**Index Performance Impact:**
```javascript
// Without index:
// Collection: 10,000 users
// Query: User.findOne({ email: 'john@example.com' })
// MongoDB behavior: SCANS all 10,000 documents
// Time: 2000-5000ms
// Resources: High CPU, memory

// With index on email:
// Collection: 10,000 users
// Query: User.findOne({ email: 'john@example.com' })
// MongoDB behavior: B-tree lookup, finds in ~10 comparisons
// Time: 5-20ms (100-500x faster!)
// Resources: Minimal CPU, memory
```

**Index Types:**
```javascript
// 1. Single Field Index (Most common)
userSchema.index({ email: 1 }); // 1 = ascending, -1 = descending
// Use case: Login (find by email)

// 2. Compound Index (Multiple fields)
userSchema.index({ email: 1, emailVerified: 1 });
// Use case: Find verified users by email
// Order matters! Email then emailVerified

// 3. Unique Index (Enforce uniqueness)
userSchema.index({ email: 1 }, { unique: true });
// Use case: Prevent duplicate emails
// MongoDB throws error on duplicate

// 4. Sparse Index (Skip null values)
userSchema.index({ 'oauthProviders.providerId': 1 }, { sparse: true });
// Use case: OAuth users only (some users don't have OAuth)
// Saves space by not indexing null values

// 5. Text Index (Full-text search)
userSchema.index({ firstName: 'text', lastName: 'text' });
// Use case: Search users by name
// Supports partial word matching

// 6. TTL Index (Auto-delete documents)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
// Use case: Auto-delete sessions after 24 hours
// MongoDB automatically removes expired docs
```

**Index Strategy for FitAI:**
```javascript
// User Model Indexes
userSchema.index({ email: 1 }, { unique: true });
// Fast login lookup, enforce uniqueness

userSchema.index({ emailVerified: 1, createdAt: 1 });
// Find unverified users for reminder emails

userSchema.index({ 'oauthProviders.provider': 1, 'oauthProviders.providerId': 1 });
// OAuth login lookup

userSchema.index({ 'refreshTokens.token': 1 }, { sparse: true });
// Fast refresh token validation

// Session Model Indexes (future)
sessionSchema.index({ userId: 1, createdAt: -1 });
// Get user's sessions, newest first

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Auto-delete expired sessions
```

**Index Trade-offs:**
```javascript
// Benefits:
- Faster queries (100-1000x improvement)
- Lower CPU usage
- Better scalability
- Happy users (fast response times)

// Costs:
- Slower writes (must update indexes)
- Storage space (indexes consume disk)
- Memory usage (indexes loaded in RAM)

// Rule of thumb:
// Index fields you query frequently
// Don't over-index (diminishing returns)
// Monitor index usage with explain()
```

### **3. Query Optimization Techniques (55 minutes learning)**
**The Challenge:** Even with indexes, queries can be inefficient
**Professional Solutions:** Projection, lean queries, pagination, aggregation

**Optimization 1: Field Projection**
```javascript
// BAD - Fetch everything (wasteful)
const user = await User.findById(userId);
// Returns ALL fields: password, tokens, OAuth data, etc.
// Size: 5KB per document
// Time: 50ms

// GOOD - Fetch only what you need
const user = await User.findById(userId).select('firstName lastName email');
// Returns only: firstName, lastName, email
// Size: 200 bytes per document (25x smaller!)
// Time: 10ms (5x faster)

// Use cases:
// API responses: Only send public fields
// List views: Only fetch displayed fields
// Internal logic: Only fetch fields you'll use
```

**Optimization 2: Lean Queries**
```javascript
// BAD - Full Mongoose document (heavy)
const users = await User.find({ emailVerified: true });
// Returns Mongoose documents with methods, virtuals, etc.
// Memory: ~10KB per document
// Can't use .save(), but do you need it?

// GOOD - Plain JavaScript objects (lightweight)
const users = await User.find({ emailVerified: true }).lean();
// Returns plain objects (no Mongoose overhead)
// Memory: ~2KB per document (5x less!)
// Perfect for read-only operations

// Rule: Use .lean() for queries where you only READ data
```

**Optimization 3: Pagination**
```javascript
// BAD - Fetch all users (crashes with scale)
const users = await User.find();
// 10 users: Works fine
// 10,000 users: 50MB response, 5 second query
// 100,000 users: App crashes (out of memory)

// GOOD - Cursor-based pagination (scalable)
const page = parseInt(req.query.page) || 1;
const limit = 20; // Items per page
const skip = (page - 1) * limit;

const users = await User.find()
  .select('firstName lastName email')
  .lean()
  .limit(limit)
  .skip(skip)
  .sort({ createdAt: -1 });

const total = await User.countDocuments();

res.json({
  users,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});
// Works with millions of users!
```

**Optimization 4: Aggregation Pipeline**
```javascript
// Complex queries use aggregation (powerful & efficient)
const stats = await User.aggregate([
  // Stage 1: Match verified users
  { $match: { emailVerified: true } },
  
  // Stage 2: Group by auth method
  {
    $group: {
      _id: '$primaryAuthMethod',
      count: { $sum: 1 },
      avgAccountAge: { 
        $avg: { $subtract: [new Date(), '$createdAt'] }
      }
    }
  },
  
  // Stage 3: Sort by count
  { $sort: { count: -1 } }
]);

// Result: 
// [
//   { _id: 'password', count: 120, avgAccountAge: 2592000000 },
//   { _id: 'google', count: 85, avgAccountAge: 1296000000 },
//   { _id: 'github', count: 15, avgAccountAge: 864000000 }
// ]
```

### **4. Health Monitoring Architecture (50 minutes learning)**
**The Challenge:** Need to detect database issues before users do
**Professional Solution:** Multi-layer health checks with alerting

**Health Check Layers:**
```javascript
// Layer 1: Connection Health (Basic)
const isConnected = mongoose.connection.readyState === 1;
// readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

// Layer 2: Ping Check (Latency)
const startTime = Date.now();
await mongoose.connection.db.admin().ping();
const latency = Date.now() - startTime;
// Acceptable: <100ms, Warning: 100-500ms, Critical: >500ms

// Layer 3: Read/Write Check (Functional)
const testDoc = await HealthCheck.create({ timestamp: new Date() });
await HealthCheck.deleteOne({ _id: testDoc._id });
// Verifies database can read AND write

// Layer 4: Replica Set Health (Production)
const status = await mongoose.connection.db.admin().replSetGetStatus();
const healthyNodes = status.members.filter(m => m.health === 1).length;
// Ensures replica set has healthy nodes for failover
```

**Health Endpoint Response:**
```javascript
GET /health

Response:
{
  "status": "healthy", // healthy | degraded | unhealthy
  "timestamp": "2025-10-10T10:30:00.000Z",
  "uptime": 86400, // seconds
  "checks": {
    "database": {
      "status": "healthy",
      "connection": "connected",
      "latency": 15, // milliseconds
      "poolSize": {
        "available": 8,
        "inUse": 2,
        "max": 10
      }
    },
    "memory": {
      "status": "healthy",
      "usage": 45.6, // percentage
      "heapUsed": 123456789, // bytes
      "heapTotal": 234567890
    },
    "cpu": {
      "status": "healthy",
      "usage": 23.4 // percentage
    }
  },
  "version": "1.0.0",
  "environment": "production"
}
```

### **5. Database Error Handling & Resilience (45 minutes learning)**
**The Challenge:** Database connections fail - must handle gracefully
**Professional Solution:** Retry logic, circuit breakers, graceful degradation

**Error Types & Handling:**
```javascript
// Error 1: Connection Timeout (Network issue)
// Strategy: Retry with exponential backoff
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true
});

// Error 2: Duplicate Key (User error)
// Strategy: Return clear error message
try {
  await User.create({ email: 'existing@example.com' });
} catch (error) {
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
      field: Object.keys(error.keyPattern)[0]
    });
  }
}

// Error 3: Validation Error (User error)
// Strategy: Return field-specific errors
try {
  await User.create(invalidData);
} catch (error) {
  if (error.name === 'ValidationError') {
    const errors = Object.keys(error.errors).map(key => ({
      field: key,
      message: error.errors[key].message
    }));
    return res.status(400).json({ success: false, errors });
  }
}

// Error 4: Connection Lost (Replica set failover)
// Strategy: Mongoose auto-reconnects, queue operations
mongoose.connection.on('disconnected', () => {
  logger.error('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
```

**Connection Retry Logic:**
```javascript
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, dbConfig);
      logger.info('MongoDB connected successfully');
      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${i + 1} failed`, {
        error: error.message,
        retriesRemaining: retries - i - 1
      });
      
      if (i === retries - 1) {
        logger.error('All connection attempts failed. Exiting...');
        process.exit(1);
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      logger.info(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};
```

### **6. Query Performance Profiling (40 minutes learning)**
**The Challenge:** Identify which queries are slow
**Professional Tool:** MongoDB explain() and profiling

**Using Explain:**
```javascript
// Profile any query
const explanation = await User.find({ email: 'test@example.com' })
  .explain('executionStats');

console.log(explanation.executionStats);
/*
{
  executionTimeMillis: 2,
  totalKeysExamined: 1,      // Used index
  totalDocsExamined: 1,      // Only examined 1 doc (efficient!)
  executionStages: {
    stage: 'IXSCAN',         // Index scan (good!)
    indexName: 'email_1',    // Used this index
    keysExamined: 1
  }
}

// Without index, would show:
{
  executionTimeMillis: 850,
  totalDocsExamined: 10000,  // Scanned ALL documents (bad!)
  executionStages: {
    stage: 'COLLSCAN',       // Collection scan (slow!)
  }
}
*/
```

**Mongoose Query Logging:**
```javascript
// Enable in development
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.debug('Mongoose Query', {
    collection: collectionName,
    method,
    query,
    doc
  });
});

// Shows every query:
// Mongoose Query { collection: 'users', method: 'findOne', query: { email: 'test@example.com' } }
```

---

## 🛠 **Advanced Professional Implementation Requirements**

### **1. Health Check Endpoint:**
```javascript
GET /health

Success Response (200):
{
  "status": "healthy",
  "timestamp": "2025-10-10T10:30:00.000Z",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "connection": "connected",
      "latency": 15,
      "poolSize": {
        "available": 8,
        "inUse": 2,
        "max": 10
      }
    },
    "memory": {
      "status": "healthy",
      "usage": 45.6,
      "heapUsed": 123456789,
      "heapTotal": 234567890
    }
  }
}

Degraded Response (200):
{
  "status": "degraded",
  "checks": {
    "database": {
      "status": "degraded",
      "latency": 450,
      "message": "High database latency detected"
    }
  }
}

Unhealthy Response (503):
{
  "status": "unhealthy",
  "checks": {
    "database": {
      "status": "unhealthy",
      "connection": "disconnected",
      "error": "Connection timeout"
    }
  }
}
```

### **2. Database Stats Endpoint (Admin):**
```javascript
GET /admin/database/stats
Authorization: Bearer <admin_token>

Success Response (200):
{
  "success": true,
  "stats": {
    "collections": {
      "users": {
        "count": 1250,
        "size": 5242880,
        "avgObjSize": 4194,
        "indexes": 5,
        "indexSize": 245760
      }
    },
    "connections": {
      "current": 5,
      "available": 95,
      "totalCreated": 127
    },
    "performance": {
      "avgQueryTime": 23,
      "slowQueries": 3
    }
  }
}
```

---

## 🏗 **Advanced Professional Implementation Plan**

### **Phase 1: Database Connection Architecture (90 minutes)**

**Step 1:** Create database configuration
```javascript
// config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  getConnectionConfig() {
    return {
      // Connection Pool
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      minPoolSize: 2,
      
      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      
      // Retry Logic
      retryWrites: true,
      retryReads: true,
      
      // Monitoring
      heartbeatFrequencyMS: 10000,
      
      // Naming
      dbName: process.env.DB_NAME || 'fitai',
      
      // Authentication
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      authSource: 'admin'
    };
  }

  async connect() {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const config = this.getConnectionConfig();
    
    return this.connectWithRetry(uri, config);
  }

  async connectWithRetry(uri, config, retryDelay = 5000) {
    while (this.connectionAttempts < this.maxRetries) {
      try {
        this.connectionAttempts++;
        
        logger.info('Attempting MongoDB connection', {
          attempt: this.connectionAttempts,
          maxRetries: this.maxRetries
        });

        await mongoose.connect(uri, config);
        
        this.isConnected = true;
        this.connectionAttempts = 0; // Reset on success
        
        logger.info('MongoDB connected successfully', {
          host: mongoose.connection.host,
          database: mongoose.connection.name,
          poolSize: config.maxPoolSize
        });

        this.setupEventListeners();
        return mongoose.connection;
      } catch (error) {
        logger.error('MongoDB connection failed', {
          attempt: this.connectionAttempts,
          error: error.message,
          retriesRemaining: this.maxRetries - this.connectionAttempts
        });

        if (this.connectionAttempts >= this.maxRetries) {
          logger.error('Max connection retries reached. Exiting...');
          process.exit(1);
        }

        // Exponential backoff
        const waitTime = retryDelay * Math.pow(2, this.connectionAttempts - 1);
        logger.info(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  setupEventListeners() {
    const conn = mongoose.connection;

    conn.on('connected', () => {
      logger.info('MongoDB connection established');
      this.isConnected = true;
    });

    conn.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      this.isConnected = false;
    });

    conn.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      this.isConnected = true;
    });

    conn.on('error', (error) => {
      logger.error('MongoDB connection error', {
        error: error.message,
        stack: error.stack
      });
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async disconnect() {
    if (this.isConnected) {
      logger.info('Closing MongoDB connection...');
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB connection closed');
    }
  }

  getConnectionStatus() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
      isConnected: this.isConnected,
      readyState: states[mongoose.connection.readyState],
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }

  async getPoolStats() {
    if (!this.isConnected) {
      return null;
    }

    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();
      
      return {
        current: serverStatus.connections.current,
        available: serverStatus.connections.available,
        totalCreated: serverStatus.connections.totalCreated,
        active: serverStatus.connections.active || 0
      };
    } catch (error) {
      logger.error('Failed to get pool stats', { error: error.message });
      return null;
    }
  }
}

module.exports = new DatabaseConnection();
```

**Step 2:** Update User model with indexes
```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: String,
  firstName: String,
  lastName: String,
  
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: Date,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  
  oauthProviders: [{
    provider: { type: String, enum: ['google', 'github'] },
    providerId: String,
    providerEmail: String,
    accessToken: String,
    refreshToken: String,
    profilePicture: String,
    connectedAt: Date,
    lastUsed: Date
  }],
  
  primaryAuthMethod: {
    type: String,
    enum: ['password', 'google', 'github'],
    default: 'password'
  },
  
  // Token blacklist
  refreshTokens: [{
    token: String,
    createdAt: Date,
    expiresAt: Date
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt/updatedAt
});

// ===== INDEXES =====

// Primary lookup index (most common query)
userSchema.index({ email: 1 }, { unique: true });

// OAuth login lookup
userSchema.index({ 
  'oauthProviders.provider': 1, 
  'oauthProviders.providerId': 1 
});

// Email verification reminders (find unverified users)
userSchema.index({ 
  emailVerified: 1, 
  createdAt: 1 
});

// Refresh token validation
userSchema.index({ 
  'refreshTokens.token': 1 
}, { 
  sparse: true // Only index documents that have refresh tokens
});

// ===== METHODS =====

userSchema.methods.canUnlinkProvider = function(provider) {
  const hasPassword = !!this.password;
  const linkedProviders = this.oauthProviders.filter(p => p.provider !== provider);
  
  if (linkedProviders.length === 0 && !hasPassword) {
    return {
      allowed: false,
      reason: 'Cannot unlink last authentication method'
    };
  }
  
  return { allowed: true };
};

// ===== STATICS =====

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByOAuthProvider = function(provider, providerId) {
  return this.findOne({
    'oauthProviders.provider': provider,
    'oauthProviders.providerId': providerId
  });
};

// ===== MIDDLEWARE =====

// Update timestamps automatically
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
```

**Step 3:** Initialize database in server
```javascript
// server.js
const express = require('express');
const dbConnection = require('./config/database');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(express.json());
// ... other middleware ...

// Initialize database connection
const startServer = async () => {
  try {
    // Connect to database
    await dbConnection.connect();
    
    // Start server only after database is connected
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV,
        database: dbConnection.getConnectionStatus()
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

startServer();
```

### **Phase 2: Health Monitoring System (80 minutes)**

**Step 1:** Create health service
```javascript
// services/health.service.js
const mongoose = require('mongoose');
const os = require('os');
const dbConnection = require('../config/database');

class HealthService {
  async checkDatabase() {
    try {
      const status = dbConnection.getConnectionStatus();
      
      if (!status.isConnected) {
        return {
          status: 'unhealthy',
          connection: status.readyState,
          error: 'Database not connected'
        };
      }

      // Ping database to check latency
      const startTime = Date.now();
      await mongoose.connection.db.admin().ping();
      const latency = Date.now() - startTime;

      // Get pool statistics
      const poolStats = await dbConnection.getPoolStats();

      // Determine health based on latency
      let healthStatus = 'healthy';
      if (latency > 500) healthStatus = 'unhealthy';
      else if (latency > 100) healthStatus = 'degraded';

      return {
        status: healthStatus,
        connection: status.readyState,
        latency,
        poolSize: poolStats ? {
          current: poolStats.current,
          available: poolStats.available,
          active: poolStats.active,
          total: poolStats.current + poolStats.available
        } : null,
        host: status.host,
        database: status.name
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  checkMemory() {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercentage = (usedMem / totalMem) * 100;

    let status = 'healthy';
    if (memPercentage > 90) status = 'unhealthy';
    else if (memPercentage > 75) status = 'degraded';

    return {
      status,
      usage: parseFloat(memPercentage.toFixed(2)),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      rss: memUsage.rss,
      external: memUsage.external
    };
  }

  checkCPU() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);

    let status = 'healthy';
    if (usage > 90) status = 'unhealthy';
    else if (usage > 70) status = 'degraded';

    return {
      status,
      usage: parseFloat(usage.toFixed(2)),
      cores: cpus.length
    };
  }

  async getFullHealthReport() {
    const database = await this.checkDatabase();
    const memory = this.checkMemory();
    const cpu = this.checkCPU();

    // Overall status (worst of all checks)
    const statuses = [database.status, memory.status, cpu.status];
    let overallStatus = 'healthy';
    if (statuses.includes('unhealthy')) overallStatus = 'unhealthy';
    else if (statuses.includes('degraded')) overallStatus = 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database,
        memory,
        cpu
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  async getDatabaseStats() {
    try {
      const db = mongoose.connection.db;
      const admin = db.admin();

      // Get database stats
      const dbStats = await db.stats();
      
      // Get collection stats
      const collections = await db.listCollections().toArray();
      const collectionStats = {};

      for (const collection of collections) {
        const stats = await db.collection(collection.name).stats();
        collectionStats[collection.name] = {
          count: stats.count,
          size: stats.size,
          avgObjSize: stats.avgObjSize,
          indexes: stats.nindexes,
          indexSize: stats.totalIndexSize
        };
      }

      // Get connection stats
      const poolStats = await dbConnection.getPoolStats();

      return {
        database: {
          name: dbStats.db,
          collections: dbStats.collections,
          dataSize: dbStats.dataSize,
          indexSize: dbStats.indexSize,
          storageSize: dbStats.storageSize
        },
        collections: collectionStats,
        connections: poolStats,
        performance: {
          avgQueryTime: 0, // Would need query profiling
          slowQueries: 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }
}

module.exports = new HealthService();
```

**Step 2:** Create health controller
```javascript
// controllers/health.controller.js
const healthService = require('../services/health.service');
const logger = require('../config/logger');

const getHealth = async (req, res) => {
  try {
    const health = await healthService.getFullHealthReport();
    
    // Log health check
    logger.info('Health check performed', {
      status: health.status,
      requestId: req.id
    });

    // Return appropriate status code
    const statusCode = health.status === 'unhealthy' ? 503 : 200;
    
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      requestId: req.id
    });

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

const getDatabaseStats = async (req, res) => {
  try {
    // Verify admin access (implement your admin check)
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const stats = await healthService.getDatabaseStats();
    
    logger.info('Database stats retrieved', {
      userId: req.user.userId,
      requestId: req.id
    });

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get database stats', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve database statistics',
      requestId: req.id
    });
  }
};

module.exports = {
  getHealth,
  getDatabaseStats
};
```

**Step 3:** Create health routes
```javascript
// routes/health.routes.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Public health endpoint (for load balancers, monitoring tools)
router.get('/health', healthController.getHealth);

// Admin-only database stats
router.get('/admin/database/stats', authenticateToken, healthController.getDatabaseStats);

module.exports = router;
```

### **Phase 3: Query Optimization Utilities (70 minutes)**

**Step 1:** Create pagination utility
```javascript
// utils/pagination.js
class Pagination {
  static DEFAULT_LIMIT = 20;
  static MAX_LIMIT = 100;

  static getParams(query) {
    const page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || this.DEFAULT_LIMIT;

    // Enforce max limit
    if (limit > this.MAX_LIMIT) {
      limit = this.MAX_LIMIT;
    }

    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  static async paginate(model, query = {}, options = {}) {
    const { page, limit, skip } = this.getParams(options);
    
    // Build query
    let dbQuery = model.find(query);

    // Apply select (projection)
    if (options.select) {
      dbQuery = dbQuery.select(options.select);
    }

    // Apply populate
    if (options.populate) {
      dbQuery = dbQuery.populate(options.populate);
    }

    // Apply sort
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    } else {
      dbQuery = dbQuery.sort({ createdAt: -1 }); // Default: newest first
    }

    // Use lean for better performance (read-only)
    if (options.lean !== false) {
      dbQuery = dbQuery.lean();
    }

    // Execute query with pagination
    const [results, total] = await Promise.all([
      dbQuery.skip(skip).limit(limit),
      model.countDocuments(query)
    ]);

    return {
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  static formatResponse(data, pagination) {
    return {
      success: true,
      data,
      pagination
    };
  }
}

module.exports = Pagination;
```

**Step 2:** Create query helper utilities
```javascript
// utils/queryHelpers.js
class QueryHelpers {
  // Safe field projection
  static projectFields(fields) {
    if (!fields) return null;
    
    // Remove sensitive fields
    const sensitive = ['password', 'refreshTokens', '__v'];
    const fieldArray = fields.split(',').filter(f => !sensitive.includes(f));
    
    return fieldArray.join(' ');
  }

  // Build filter from query params
  static buildFilter(queryParams) {
    const filter = {};

    // Email verification filter
    if (queryParams.verified === 'true') {
      filter.emailVerified = true;
    } else if (queryParams.verified === 'false') {
      filter.emailVerified = false;
    }

    // Primary auth method filter
    if (queryParams.authMethod) {
      filter.primaryAuthMethod = queryParams.authMethod;
    }

    // Date range filter
    if (queryParams.createdAfter) {
      filter.createdAt = { $gte: new Date(queryParams.createdAfter) };
    }
    if (queryParams.createdBefore) {
      if (filter.createdAt) {
        filter.createdAt.$lte = new Date(queryParams.createdBefore);
      } else {
        filter.createdAt = { $lte: new Date(queryParams.createdBefore) };
      }
    }

    // Search by name (text search)
    if (queryParams.search) {
      filter.$or = [
        { firstName: new RegExp(queryParams.search, 'i') },
        { lastName: new RegExp(queryParams.search, 'i') },
        { email: new RegExp(queryParams.search, 'i') }
      ];
    }

    return filter;
  }

  // Build sort from query params
  static buildSort(sortParam) {
    if (!sortParam) return { createdAt: -1 };

    const sortMap = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'name': { firstName: 1, lastName: 1 },
      'email': { email: 1 }
    };

    return sortMap[sortParam] || { createdAt: -1 };
  }

  // Explain query (for debugging)
  static async explainQuery(query) {
    const explanation = await query.explain('executionStats');
    
    return {
      executionTime: explanation.executionStats.executionTimeMillis,
      totalDocsExamined: explanation.executionStats.totalDocsExamined,
      totalKeysExamined: explanation.executionStats.totalKeysExamined,
      indexUsed: explanation.executionStats.executionStages.indexName || 'none',
      stage: explanation.executionStats.executionStages.stage
    };
  }
}

module.exports = QueryHelpers;
```

**Step 3:** Update user controller with optimization
```javascript
// controllers/user.controller.js (example endpoint)
const User = require('../models/User');
const Pagination = require('../utils/pagination');
const QueryHelpers = require('../utils/queryHelpers');

const getUsers = async (req, res, next) => {
  try {
    // Build filter from query params
    const filter = QueryHelpers.buildFilter(req.query);
    
    // Build sort
    const sort = QueryHelpers.buildSort(req.query.sort);
    
    // Safe field projection
    const select = QueryHelpers.projectFields(req.query.fields);

    // Paginate results
    const { results, pagination } = await Pagination.paginate(
      User,
      filter,
      {
        select: select || 'firstName lastName email emailVerified primaryAuthMethod createdAt',
        sort,
        page: req.query.page,
        limit: req.query.limit,
        lean: true // Lightweight objects
      }
    );

    res.json(Pagination.formatResponse(results, pagination));
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
```

### **Phase 4: Database Error Handling Middleware (60 minutes)**

**Step 1:** Create database error handler
```javascript
// middleware/databaseError.middleware.js
const logger = require('../config/logger');

const handleDatabaseError = (error, req, res, next) => {
  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    
    logger.warn('Duplicate key error', {
      field,
      value,
      requestId: req.id
    });

    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      field,
      code: 'DUPLICATE_KEY',
      requestId: req.id
    });
  }

  // MongoDB validation error
  if (error.name === 'ValidationError') {
    const errors = Object.keys(error.errors).map(key => ({
      field: key,
      message: error.errors[key].message,
      kind: error.errors[key].kind
    }));

    logger.warn('Validation error', {
      errors,
      requestId: req.id
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      code: 'VALIDATION_ERROR',
      requestId: req.id
    });
  }

  // MongoDB cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    logger.warn('Cast error', {
      path: error.path,
      value: error.value,
      requestId: req.id
    });

    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path}: ${error.value}`,
      code: 'INVALID_ID',
      requestId: req.id
    });
  }

  // Connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
    logger.error('Database connection error', {
      name: error.name,
      message: error.message,
      requestId: req.id
    });

    return res.status(503).json({
      success: false,
      message: 'Database connection issue. Please try again.',
      code: 'DATABASE_ERROR',
      requestId: req.id
    });
  }

  // Pass to general error handler
  next(error);
};

module.exports = handleDatabaseError;
```

**Step 2:** Integrate into server
```javascript
// server.js
const databaseErrorHandler = require('./middleware/databaseError.middleware');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// ... routes ...

// Error handling (order matters!)
app.use(databaseErrorHandler); // Handle DB errors first
app.use(notFound);             // Then 404s
app.use(errorHandler);         // Finally general errors
```

---

## 🧪 **Comprehensive Testing Strategy**

### **Test Suite 1: Connection Pool Testing**
```bash
# Test 1: Server startup with database connection
npm start
# Check logs for:
# - "Attempting MongoDB connection"
# - "MongoDB connected successfully"
# - Pool size configuration

# Test 2: Connection retry on failure
# Stop MongoDB temporarily
sudo systemctl stop mongod

# Start server
npm start
# Should see retry attempts with exponential backoff

# Restart MongoDB
sudo systemctl start mongod
# Should see successful connection
```

### **Test Suite 2: Health Endpoint Testing**
```bash
# Test healthy state
curl http://localhost:3000/health

# Should return 200 with:
# {
#   "status": "healthy",
#   "checks": {
#     "database": { "status": "healthy", "latency": 15 }
#   }
# }

# Test unhealthy state
# Stop MongoDB
curl http://localhost:3000/health
# Should return 503 with:
# { "status": "unhealthy", "checks": { "database": { "error": "..." } } }
```

### **Test Suite 3: Index Performance Testing**
```bash
# Test query without index (create temp collection)
node scripts/test-index-performance.js

# Script content:
const User = require('./models/User');
const mongoose = require('mongoose');

async function testPerformance() {
  // Remove index temporarily
  await User.collection.dropIndex('email_1');
  
  console.time('Without Index');
  await User.findOne({ email: 'test@example.com' });
  console.timeEnd('Without Index');
  // Result: ~500-2000ms (collection scan)
  
  // Re-create index
  await User.collection.createIndex({ email: 1 });
  
  console.time('With Index');
  await User.findOne({ email: 'test@example.com' });
  console.timeEnd('With Index');
  // Result: ~5-20ms (index scan - 100x faster!)
}

testPerformance();
```

### **Test Suite 4: Query Optimization Testing**
```bash
# Test pagination
curl "http://localhost:3000/users?page=1&limit=20"

# Test with field projection
curl "http://localhost:3000/users?fields=firstName,lastName,email"

# Test with filters
curl "http://localhost:3000/users?verified=true&authMethod=google"

# Test sorting
curl "http://localhost:3000/users?sort=newest"

# All should return quickly (<100ms)
```

### **Test Suite 5: Database Stats (Admin)**
```bash
# Get database statistics
curl -X GET http://localhost:3000/admin/database/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Should return collection counts, sizes, index info
```

---

## 🎯 **Success Criteria for Day 7**

### **Connection Management:**
- [ ] Connection pooling configured (maxPoolSize: 10, minPoolSize: 2)
- [ ] Automatic reconnection on disconnect
- [ ] Retry logic with exponential backoff (5 retries)
- [ ] Graceful shutdown on process termination
- [ ] Connection status monitoring

### **Database Indexes:**
- [ ] Unique index on email field
- [ ] Compound index on OAuth provider lookup
- [ ] Index on emailVerified + createdAt
- [ ] Sparse index on refresh tokens
- [ ] All indexes verified with explain()

### **Query Optimization:**
- [ ] Pagination utility implemented
- [ ] Field projection for all list endpoints
- [ ] Lean queries for read-only operations
- [ ] Query execution time <100ms
- [ ] Proper sorting and filtering

### **Health Monitoring:**
- [ ] GET /health endpoint returns full report
- [ ] Database latency checking
- [ ] Connection pool statistics
- [ ] Memory and CPU monitoring
- [ ] Appropriate status codes (200/503)

### **Error Handling:**
- [ ] Duplicate key errors handled gracefully
- [ ] Validation errors return field details
- [ ] Cast errors (invalid IDs) handled
- [ ] Connection errors return 503
- [ ] All errors logged with request ID

### **Performance:**
- [ ] User lookup by email: <20ms
- [ ] List users (paginated): <100ms
- [ ] Health check: <50ms
- [ ] No collection scans (verify with explain)
- [ ] Server startup: <3 seconds

---

## 🚨 **Common Pitfalls & Solutions**

### **Pitfall 1: No Connection Pooling**
```javascript
// BAD - Creates new connection per request
app.get('/users', async (req, res) => {
  const conn = await mongoose.connect(URI);
  // ...
  await conn.close();
});

// GOOD - Reuse pool
// Connect once at startup
await mongoose.connect(URI, { maxPoolSize: 10 });

app.get('/users', async (req, res) => {
  // Automatically uses pooled connection
  const users = await User.find();
});
```

### **Pitfall 2: Missing Indexes**
```javascript
// Check if query uses index
const explanation = await User.find({ email: 'test@example.com' })
  .explain('executionStats');

console.log(explanation.executionStats.executionStages.stage);
// COLLSCAN = bad (collection scan)
// IXSCAN = good (index scan)
```

### **Pitfall 3: Not Using Lean Queries**
```javascript
// BAD - Full Mongoose documents (heavy)
const users = await User.find();
// 10KB per user, slower

// GOOD - Plain objects (lightweight)
const users = await User.find().lean();
// 2KB per user, 5x faster
```

### **Pitfall 4: No Pagination**
```javascript
// BAD - Fetches everything
const users = await User.find();
// Works with 100 users
// Crashes with 100,000 users

// GOOD - Paginated
const users = await User.find()
  .limit(20)
  .skip((page - 1) * 20);
```

---

## ⏰ **Time Budget**
- **Phase 1 - Connection Architecture:** 1.5 hours
- **Phase 2 - Health Monitoring:** 1.3 hours
- **Phase 3 - Query Optimization:** 1.2 hours
- **Phase 4 - Error Handling:** 1 hour
- **Testing & Validation:** 1 hour
- **Total:** ~6 hours

---

## 💡 **Pro Tips**

### **1. Index Analysis:**
```javascript
// Find slow queries in production
db.setProfilingLevel(1, { slowms: 100 });
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

### **2. Connection Pool Sizing:**
```javascript
// Formula: poolSize = (core_count * 2) + effective_spindle_count
// For 4-core server with SSD: (4 * 2) + 1 = 9
// Use maxPoolSize: 10
```

### **3. Monitoring in Production:**
```javascript
// Set up automated health checks
// Ping /health every 30 seconds
// Alert if status !== "healthy" for 2+ consecutive checks
```

### **4. Index Maintenance:**
```javascript
// Analyze index usage periodically
db.users.aggregate([{ $indexStats: {} }])

// Drop unused indexes to save space
// But keep essential ones!
```

---

## 🚀 **Tomorrow's Preview: Day 8**

Day 8 will tackle "Security Audit & Testing" - Comprehensive auth system testing, penetration testing, rate limiting strategies, security headers, and documentation!

**Remember:** A fast, reliable database is the foundation of every great application. Today you learned how professionals build scalable, monitored, and optimized database layers. Your app can now handle thousands of users! 💪⚡🎯
