const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to check token
function authenticateToken(req, res, next) {
    console.log("Authenticating token");
    console.log("Session ID:", req.sessionID);
    
    const token = req.session.token; // Token should be retrieved from session or headers
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token is found
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Attach user info to request
        next();
    });
}

// Protected route
router.get('/page',  (req, res) => {
   // console.log("Cookies: /page", req.cookies); // Log cookies for debugging
    res.json({ message: 'This is a protected route',  sessionID: req.sessionID , Cookies : req.cookies});
});

// Unprotected route (for testing)
router.get('/pag', (req, res) => {
    console.log("Cookies:", req.cookies); // Log cookies for debugging
    res.json({ message: 'This is an unprotected route', sessionID: req.sessionID });
});

module.exports = router;
