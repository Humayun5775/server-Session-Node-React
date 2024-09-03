

require('dotenv').config();
const http = require('http');
const app = require('./app');
const os = require('os');



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
const server = http.createServer(app);


server.listen(PORT, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`Server is running on ${ipAddress}:${PORT}/`);
});

