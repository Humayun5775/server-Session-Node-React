const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user data (use a database in a real application)
const users = [
    {
        id: 1,
        username: 'testuser',
        password: bcrypt.hashSync('password', 8), // Hashing password with bcrypt
    },
];

router.post('/login', (req, res) => {
    console.log("Attempting login"); // Log for debugging
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1h' });
        
        // Store JWT in session (optional)
        req.session.token = token; 
        
        // Set cookie with JWT
        res.cookie('tokens', token, {
            maxAge: 3600000 // Cookie expiration time in milliseconds (1 hour)
        });
        console.log('Cookies: login', req.cookies); // Log cookies for debugging
        
        return res.json({ message: 'Login successful', token , sessionID: req.sessionID , Cookies : req.cookies});
    } else {
        // Invalid username or password
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;
