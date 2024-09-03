const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to check session and authenticate the JWT
function authenticateToken(req, res, next) {
    const token = req.session.token;
    if (!token) return res.sendStatus(403); // Forbidden if no token

    jwt.verify(token, 'jwt_secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user;
        next();
    });
}

// Protected route 2
router.get('/page2', authenticateToken, (req, res) => {
    console.log('Page 2 accessed by session ID:', req.sessionID);
    res.json({ message: 'This is page 2', user: req.user });
});

module.exports = router;
