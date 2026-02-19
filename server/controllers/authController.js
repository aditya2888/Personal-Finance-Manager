const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        // 1. Get the data the user typed in the frontend form
        const { name, email, password } = req.body;

        // 2. Validation: Check if they left any fields blank
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // 3. Check if a user with this email already exists in our database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 4. Hash the password (Security step!)
        // 'salt' is random data added to the password before hashing to make it completely uncrackable
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create the new user in the database using our Model blueprint
        const user = await User.create({
            name,
            email,
            password: hashedPassword // We save the scrambled password, NEVER the real one
        });

        // 6. If the user was created successfully, send back a success message
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: 'User registered successfully!'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export the function so our routes can use it
module.exports = {
    registerUser
};