const { User } = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Check if role is already in req.user (from JWT)
    if (!req.user || req.user.role !== 'instructor') {
      // Fallback to database check if role is missing
      const user = await User.findById(req.user?.id);
      if (!user || user.role !== 'instructor') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Instructor role required.'
        });
      }
      req.user = { ...req.user, ...user.toObject() }; // Merge database data if needed
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying instructor role',
      error: error.message
    });
  }
};