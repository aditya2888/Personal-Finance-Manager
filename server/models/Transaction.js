const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        // This is the crucial link to the User model
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please add a text description (e.g., Groceries, Salary)']
        },
        amount: {
            type: Number,
            required: [true, 'Please add a positive number']
        },
        type: {
            type: String,
            enum: ['income', 'expense'], // Forces the data to be exactly one of these two words
            required: [true, 'Please specify if this is an income or expense']
        },
        category: {
            type: String,
            required: [true, 'Please add a category']
        }
    },
    {
        timestamps: true // Automatically tracks when the transaction was created
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);