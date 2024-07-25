const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken);

// Admin user routes
router.post('/', isAdmin, bookController.createBook);
router.put('/:id', isAdmin, bookController.updateBook);
router.delete('/:id', isAdmin, bookController.deleteBook);
router.get('/:id', isAdmin, bookController.getBookById);

// Other user routes
router.get('/', bookController.getAllBooks);

module.exports = router;