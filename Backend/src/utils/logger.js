const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;

const logFormat = printf(({ level, message, timestamp, meta }) => {
  return `${timestamp} [${level}] : ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    // for production you may prefer json(), for console dev use printf()
    process.env.NODE_ENV === 'production' ? json() : logFormat
  ),
  transports: [
    new transports.Console(), // dev friendly
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = logger;
