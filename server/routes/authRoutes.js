const express = require('express');
const router = express.Router();

// Import the logic we wrote in the last step
const { registerUser } = require('../controllers/authController');

// Define the road: When someone sends a POST request to '/register', trigger the 'registerUser' function
router.post('/register', registerUser);

// Export the router so server.js can see it
module.exports = router;