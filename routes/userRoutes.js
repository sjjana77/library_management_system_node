const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/get_users', verifyToken, isAdmin, userController.getUsers);

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
