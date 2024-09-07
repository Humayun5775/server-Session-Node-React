const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { v4: uuidv4 } = require('uuid'); // For generating unique session IDs

const app = express();
app.use(express.json());

// In-memory session store (in production, use a database)
const sessionStore = {};

// Mock user data (in a real application, use a database)
const users = [
    {
        id: 1,
        username: 'testuser',
        password: bcrypt.hashSync('password', 8),
    },
];

// Passport Local Strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    }
));

// Serialize user by generating a session ID and storing the user in sessionStore
passport.serializeUser((user, done) => {
    const sessionId = uuidv4(); // Generate a unique session ID
    sessionStore[sessionId] = user; // Store user information in sessionStore
    done(null, sessionId); // Pass session ID to the next step
});

// Deserialize user by fetching the user from sessionStore using the session ID
passport.deserializeUser((sessionId, done) => {
    const user = sessionStore[sessionId]; // Retrieve the user associated with the session ID
    if (user) {
        done(null, user);
    } else {
        done(null, false); // If no user found, fail the deserialization
    }
});

// Initialize Passport
app.use(passport.initialize());

// Login route using Passport
app.post('/login', (req, res, next) => {

    console.log("asd");

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: info.message }); }

        req.login(user, { session: false }, (err) => {
            if (err) { return next(err); }

            passport.serializeUser(user, (err, sessionId) => {
                if (err) { return next(err); }

                // Send session ID as a cookie or in the response
                res.cookie('sessionId', sessionId, { httpOnly: true }); // Optionally set secure: true in production
                console.log('Login successful, Session ID:', sessionId);

                // Return the session ID in the response
                return res.json({ message: 'Login successful', sessionId });
            });
        });
    })(req, res, next);
});

// Middleware to protect routes using session ID
function authenticateSession(req, res, next) {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id']; // Get sessionId from cookie or header
    console.log(sessionId);
    if (!sessionId || !sessionStore[sessionId]) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    // Deserialize user
    passport.deserializeUser(sessionId, (err, user) => {
        if (err || !user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    });
}

// Protected route example
app.get('/protected', authenticateSession, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Unprotected route example
app.get('/unprotected', (req, res) => {
    res.json({ message: 'This is an unprotected route' });
});

