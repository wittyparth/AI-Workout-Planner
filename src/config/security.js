const securityConfig = {
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for development
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: true,
  
  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  
  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: 'same-origin' },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Frameguard - Prevents clickjacking
  frameguard: { action: 'deny' },
  
  // Hide Powered By Header
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  
  // IE No Open - Prevents IE from executing downloads
  ieNoOpen: true,
  
  // No Sniff - Prevents MIME type sniffing
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permitted Cross Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  
  // Referrer Policy
  referrerPolicy: { policy: 'no-referrer' },
  
  // XSS Filter (legacy, but still useful)
  xssFilter: true,
};

module.exports = securityConfig