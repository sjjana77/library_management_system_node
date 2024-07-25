const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(201).json({ error: error.message });
  }
}

async function register(req, res) {
  const { name, email_id, mobile, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email_id });
    if (existingUser) {
      return res.status(203).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: name,
      email: email_id,
      mobile,
      role,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    res.status(200).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      mobile: savedUser.mobile,
      role: savedUser.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email_id, password } = req.body;

  try {
    const user = await User.findOne({ email: email_id });
    if (!user) {
      return res.status(201).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(201).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(201).json({ error: error.message });
  }
}


module.exports = {
  getUsers,
  register,
  login
};
