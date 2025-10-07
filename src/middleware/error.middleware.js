const logger = require("../utils/logger")
const { NODE_ENV } = require("../config/environment")

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with full context
  const errorLog = {
    requestId: req.id,
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      isOperational: err.isOperational
    },
    request: {
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      params: req.params,
      user: req.user ? { id: req.user.userId, email: req.user.email } : null,
      ip: req.ip
    },
    timestamp: new Date().toISOString()
  };

  // Different logging based on environment
  if (NODE_ENV === 'development') {
    logger.error('Error occurred', errorLog);
    
    // Development response (full details)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId: req.id,
      stack: err.stack,
      details: err.details
    });
  }

  // Production response (safe details only)
  if (err.isOperational) {
    // Trusted error: send details
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId: req.id,
      details: err.details
    });
  }

  // Programming error: don't leak details
  logger.error('Programming error', errorLog);
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    requestId: req.id
  });
};

const requestContextMiddleware = (req, res, next) => {
  req.id = crypto.randomUUID()
  req.startTime = Date.now()
  res.setHeader('X-Request-ID', req.id)

  logger.info(`Request started`,{
    requestId : req.id,
    method : req.method,
    path : req.path,
    ip : req.ip,
    userAgent : req.get('User-Agent') || '',
    timestamp : new Date().toISOString()
  })

  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId
    });
  });
  
  next()

}

module.exports = {errorHandler, requestContextMiddleware}