const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// 1. Authentication Shield: Ensures the user is logged in via a valid JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if the request header contains a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Split "Bearer <TOKEN_STRING>" to grab just the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key from the .env file
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user data from the database using the token payload ID (skip the password)
            req.user = await User.findById(decoded.id).select('-password');

            // Everything is verified! Move to the next route controller
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no security token provided' });
    }
};

// 2. Authorization Shield: Restricts endpoints to specific roles (Employee, Technician, Admin)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user was securely injected by the 'protect' middleware right above
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Access denied for role '${req.user ? req.user.role : 'Unknown'}'` 
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };