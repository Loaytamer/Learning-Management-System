const { User } = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Check if user exists and is an instructor
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'instructor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Instructor role required.'
            });
        }

        // Add user info to request
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying instructor role'
        });
    }
};