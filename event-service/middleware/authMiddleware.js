const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        
        const secretKey = Buffer.from(process.env.JWT_SECRET, 'base64');

        const decoded = jwt.verify(token, secretKey);

        console.log("DECODED TOKEN:", decoded);

        req.user = {
            email: decoded.sub,
            role: decoded.role
        };

        next();

    } catch (error) {
        console.error("JWT ERROR:", error.message);
        return res.status(401).json({ message: error.message });
    }
};

module.exports = authMiddleware;