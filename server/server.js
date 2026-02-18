// 1. Import the tools we installed
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Load environment variables
dotenv.config();

// 3. Initialize the Express application
const app = express();

// 4. Set up Middlewares (The translators and security guards)
app.use(express.json()); // Allows us to accept JSON data in the body of requests
app.use(cors());         // Allows cross-origin requests from our frontend

// 5. Create a simple test route (To check if the server is alive)
app.get('/', (req, res) => {
    res.send('Personal Finance Manager API is running!');
});

// 6. Define the port and start listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in development mode on port ${PORT}`);
});