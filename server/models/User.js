const mongoose = require('mongoose');

// 1. Define the Blueprint (Schema)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'] // The array allows us to provide a custom error message
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true // No two users can have the same email
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // The role MUST be one of these two exact words
            default: 'user'          // If no role is specified, they become a standard user
        }
    },
    {
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt' dates to every user!
    }
);

// 2. Export the Model so our controllers can use it
module.exports = mongoose.model('User', userSchema);