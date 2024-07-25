const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/user_model');

exports.createTransaction = async (req, res) => {
  const { userId, bookId, dueDate, transactionType } = req.body;

  if (!['borrowed', 'returned'].includes(transactionType)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ error: 'User or Book not found' });
    }

    const transaction = new Transaction({
      userId,
      bookId,
      dueDate,
      transactionType
    });

    await transaction.save();
    await updateBookAvailability(transaction.bookId);
    const populatedTransaction = await Transaction.findById(transaction._id).populate('_id', 'username');

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId })
      .populate('userId', 'username')
      .populate('bookId', 'title author');


    if (transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this user' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getTransactionsByBookIdAndBorrowed = async (req, res) => {
  try {
    const { bookId, transactionType } = req.params;

    const transactions = await Transaction.find({ bookId, transactionType });

    const populatedTransactions = await Promise.all(transactions.map(async transaction => {
      const user = await User.findById(transaction.userId, 'username');
      return {
        ...transaction._doc,
        username: user ? user.username : 'Unknown User'
      };
    }));

    const book = await Book.findById(bookId);

    res.json({
      transactions: populatedTransactions,
      book: book
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};


exports.handleToggleTransactionType = async (req, res) => {
  const { transactionId } = req.params;
  const { transactionType } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    
    transaction.transactionType = transactionType; 
    
    if (transactionType === 'returned') {
      transaction.returnedDate = new Date();
    } else {
      transaction.returnedDate = null;
    }
    
    await transaction.save();
    await updateBookAvailability(transaction.bookId);

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const updateBookAvailability = async (bookId) => {
  const transactions = await Transaction.find({ bookId, transactionType: 'borrowed' });
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error('Book not found');
  }

  // console.log(book.count > transactions.length);
  book.available = book.count > transactions.length;
  await book.save(); 
};