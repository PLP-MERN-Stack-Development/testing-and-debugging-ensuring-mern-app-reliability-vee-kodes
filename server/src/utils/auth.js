const jwt = require('jsonwebtoken');

// Generate JWT token for a user (used in tests)
const generateToken = (user) => {
    return jwt.sign(
        {_id: user._id, username: user.username, email: user.email},
        process.env.JWT_SECRET || 'test-secret',
        {expiresIn: '24h'}
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };