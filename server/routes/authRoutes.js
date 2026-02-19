const express = require('express');
const router = express.Router();

// Import both functions from the controller
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser); // <-- NEW: The road for logging in

module.exports = router;