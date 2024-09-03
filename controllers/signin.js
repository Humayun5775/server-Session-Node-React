const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user data (in a real application, use a database)
const users = [
    {
        id: 1,
        username: 'testuser',
        password: bcrypt.hashSync('password', 8), 
    },
];

router.post('/loginold', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        // const token = jwt.sign({ id: user.id }, 'jwt_secret_key', { expiresIn: '1h' });

        req.session.token = "token";
        console.log('Login successful', req.sessionID);
        return res.json({ message: 'Login successful', token });
    } else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});



router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, 'jwt_secret_key', { expiresIn: '1h' });
        req.session.token = token;
        console.log('Login successful', req.sessionID);
        return res.json({ message: 'Login successful', token });
    } else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;
