const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    credentials: true,
    origin: [
        'http://localhost:5173',
        'http://172.19.240.1:5173',
        'http://172.19.240.1:9000',
        'https://localhost:5173',
        'https://172.19.240.1:5173',
        'https://172.19.240.1:9000'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'Lax'
    }
    
}));

app.get('/cookies', (req, res) => {
  console.log(req.cookies); // Logs all cookies sent in the request
  res.send('Cookies logged to console');
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import and use routes
const dataRoutes = require('./routes/routes');
app.use('/api', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
