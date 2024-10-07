// middleware/verifySuperAdmin.js
const jwt = require('jsonwebtoken');

const verifySuperAdmin = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(403).send('No token provided.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Failed to authenticate token.');
    }

    if (decoded.role !== 'superadmin') {
      return res.status(403).send('Permission denied. Only super admin can perform this action.');
    }

    req.userId = decoded.userId; // Store the user ID in the request for later use
    next();
  });
};

module.exports = verifySuperAdmin;
