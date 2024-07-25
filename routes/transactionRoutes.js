const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactionsByUserId,
  getTransactionsByBookIdAndBorrowed,
  handleToggleTransactionType
} = require('../controllers/transactionController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.post('/create', isAdmin, createTransaction);

router.get('/user/:userId', getTransactionsByUserId);

router.get('/bookId/:bookId/transactionType/:transactionType', isAdmin, getTransactionsByBookIdAndBorrowed);

router.put('/toggle/:transactionId', isAdmin, handleToggleTransactionType);

module.exports = router;
