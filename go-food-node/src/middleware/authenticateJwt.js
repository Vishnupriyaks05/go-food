const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const authenticateJWT = (req, res, next) => {

    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.headers["authorization"]?.split(" ")[1];

    console.log("Authorization header:", req.headers["authorization"]);
    console.log("Extracted token:", token);

    if (!token) return res.status(403).json({ message: 'Token missing' });

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        // if (err) return res.status(403).json({ message: 'Invalid token' });
        if (err) {
            console.error("JWT verification failed:", err); 
            return res.status(403).json({ message: "Token is not valid" });
        }

        req.user = user;
        next();
    });
};



module.exports = authenticateJWT;

// const jwt = require('jsonwebtoken');

// const authenticateJWT = (req, res, next) => {
//     console.log("Incoming Headers:", req.headers); // Log all headers

//     const authHeader = req.headers['authorization']; // Note: 'authorization' is case-sensitive

//     if (!authHeader) {
//         console.log("Authorization header missing");
//         return res.status(401).json({ message: 'Token missing' });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         console.log("Token missing in Authorization header");
//         return res.status(401).json({ message: 'Token missing' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error("JWT verification error:", err);
//             return res.status(403).json({ message: 'Invalid token' });
//         }

//         req.user = user;
//         next();
//     });
// };

// module.exports = authenticateJWT;
