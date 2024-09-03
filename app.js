const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://172.16.209.1:5173'],
    credentials: true,
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000, // 1 minute
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'Lax'
    }
}));

// Import and use routes
const dataRoutes = require('./routes/routes');
app.use('/api', dataRoutes);

module.exports = app;
