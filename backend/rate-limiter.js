const rateLimit = {}; // Object to track requests per tenant
const tenantLimits = {}; // Object to store custom limits per tenant

// Default limit is 100 requests per minute
const DEFAULT_LIMIT = 100;
const WINDOW_MS = 60000; // 1 minute in milliseconds

/**
 * Sets a custom request limit for a specific tenant
 * @param {string} tenantId - The tenant identifier
 * @param {number} limit - Maximum number of requests per minute
 */
function setTenantLimit(tenantId, limit) {
  if (!tenantId || typeof limit !== 'number' || limit <= 0) {
    throw new Error('Invalid tenant ID or limit');
  }
  tenantLimits[tenantId] = limit;
}

function rateLimiter(req, res, next) {
  const tenant = req.headers["x-tenant-id"];
  if (!tenant) return res.status(400).json({ error: "Missing tenant ID" });

  // Get tenant-specific limit or use default
  const limit = tenantLimits[tenant] || DEFAULT_LIMIT;

  if (!rateLimit[tenant]) {
    rateLimit[tenant] = { count: 1, startTime: Date.now() };
  } else {
    let elapsed = Date.now() - rateLimit[tenant].startTime;
    if (elapsed > WINDOW_MS) { // Reset every minute
      rateLimit[tenant] = { count: 1, startTime: Date.now() };
    } else {
      rateLimit[tenant].count++;
      if (rateLimit[tenant].count > limit) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
    }
  }
  next();
}

module.exports = { 
  rateLimiter, 
  setTenantLimit,
  // Export these for testing or configuration
  getRateLimits: () => ({ ...rateLimit }),
  getTenantLimits: () => ({ ...tenantLimits })
};const rateLimit = {}; // Object to track requests per tenant
const tenantLimits = {}; // Object to store custom limits per tenant

// Default limit is 100 requests per minute
const DEFAULT_LIMIT = 100;
const WINDOW_MS = 60000; // 1 minute in milliseconds

/**
 * Sets a custom request limit for a specific tenant
 * @param {string} tenantId - The tenant identifier
 * @param {number} limit - Maximum number of requests per minute
 */
function setTenantLimit(tenantId, limit) {
  if (!tenantId || typeof limit !== 'number' || limit <= 0) {
    throw new Error('Invalid tenant ID or limit');
  }
  tenantLimits[tenantId] = limit;
}

function rateLimiter(req, res, next) {
  const tenant = req.headers["x-tenant-id"];
  if (!tenant) return res.status(400).json({ error: "Missing tenant ID" });

  // Get tenant-specific limit or use default
  const limit = tenantLimits[tenant] || DEFAULT_LIMIT;

  if (!rateLimit[tenant]) {
    rateLimit[tenant] = { count: 1, startTime: Date.now() };
  } else {
    let elapsed = Date.now() - rateLimit[tenant].startTime;
    if (elapsed > WINDOW_MS) { // Reset every minute
      rateLimit[tenant] = { count: 1, startTime: Date.now() };
    } else {
      rateLimit[tenant].count++;
      if (rateLimit[tenant].count > limit) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
    }
  }
  next();
}

module.exports = { 
  rateLimiter, 
  setTenantLimit,
  // Export these for testing or configuration
  getRateLimits: () => ({ ...rateLimit }),
  getTenantLimits: () => ({ ...tenantLimits })
};