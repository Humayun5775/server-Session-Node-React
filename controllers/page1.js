const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to check session
function authenticateToken(req, res, next) {
    console.log("auth");
    console.log(req.sessionID);
    const token = req.session.token;
    if (!token) return res.sendStatus(403); // Forbidden if no token

    jwt.verify(token, 'jwt_secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user;
        next();
    });
}

// Sample unprotected route (might be for testing)
router.get('/pag', (req, res) => {
    console.log('page12313', req.sessionID);
    res.json({ message: 'This is an unprotected route', sessionID: req.sessionID });
});

// Protected route
router.get('/page', authenticateToken, (req, res) => {
    console.log('page1', req.sessionID);
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
