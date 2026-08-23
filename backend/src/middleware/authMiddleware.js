const jwt = require('jsonwebtoken');

/**
 * Middleware: verifyToken
 * Validates Bearer JWT on protected routes.
 * Sets req.user = decoded payload on success.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartlib_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Session expired. Please sign in again.',
        expired: true,
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

/**
 * Middleware: requireRole
 * Usage: requireRole('librarian') or requireRole(['librarian', 'student'])
 */
const requireRole = (roles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This resource requires role: ${allowedRoles.join(' or ')}.`,
    });
  }
  next();
};

module.exports = { verifyToken, requireRole };
