const express = require('express');
const router = express.Router();

// 1. Import the controllers
const {
    getTransactions,
    addTransaction,
    deleteTransaction
} = require('../controllers/transactionController');

// 2. Import the security bouncer
const { protect } = require('../middleware/authMiddleware');

// 3. Define the roads and station the bouncer!
// Any request coming here MUST pass 'protect' first.
router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .delete(protect, deleteTransaction);

module.exports = router;