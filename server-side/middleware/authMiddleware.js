const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {

    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;

