const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        // Find only the transactions that belong to the user who passed the security check
        const transactions = await Transaction.find({ user: req.user.id });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new income or expense
// @route   POST /api/transactions
const addTransaction = async (req, res) => {
    try {
        const { text, amount, type, category } = req.body;

        if (!text || !amount || !type || !category) {
            return res.status(400).json({ message: 'Please add all text fields' });
        }

        const transaction = await Transaction.create({
            text,
            amount,
            type,
            category,
            user: req.user.id // Attach the logged-in user's ID automatically!
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // SECURITY: Make sure the logged-in user actually owns this transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this' });
        }

        await transaction.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    deleteTransaction
};