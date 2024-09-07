require('dotenv').config();
const http = require('http');
const app = require('./app'); // Assuming this is your Express app
const os = require('os');
const Cookies = require('cookies');

const PORT = process.env.PORT || 9000;

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Optionally define keys to sign cookie values
const keys = ['keyboard cat'];

// Middleware to handle cookies in your Express app
app.use((req, res, next) => {
  const cookies = new Cookies(req, res, { keys: keys });

  // Get a cookie
  const lastVisit = cookies.get('LastVisit', { signed: true });

  // Set the cookie to a value
  cookies.set('LastVisit', new Date().toISOString(), { signed: true });

  if (!lastVisit) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome, first time visitor!');
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.');
  }

  // Pass control to the next middleware/route handler
  next();
});

// Create the HTTP server using your Express app
const server = http.createServer(app);

server.listen(PORT, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`Server is running on http://${ipAddress}:${PORT}/`);
});
