const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if the request has an authorization header that starts with "Bearer"
    // (It is an industry standard to send tokens as "Bearer <token_string>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token from the header
            // .split(' ')[1] takes "Bearer sdfgsdfgsdfg" and just grabs the "sdfgsdfgsdfg" part
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the database using the ID hidden inside the token
            // .select('-password') tells MongoDB: "Return the user data, but DO NOT include the scrambled password!"
            req.user = await User.findById(decoded.id).select('-password');

            // 5. The token is valid! Call next() to let them pass to the actual controller
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // 6. If there is no token at all, kick them out immediately
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };