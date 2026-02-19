const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // We use await because connecting to a database takes time (it's an asynchronous action)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with failure if it cannot connect
    }
};

module.exports = connectDB; // Export this function so server.js can use it