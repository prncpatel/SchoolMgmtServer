const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        token = token.split(' ')[1];  // Extract token from Bearer header

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;  // Attach the decoded token data to the request object
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};

const adminProtect = (req, res, next) => {
    if (req.body.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

module.exports = { protect, adminProtect };
