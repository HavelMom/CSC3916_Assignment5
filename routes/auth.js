// routes/auth.js
require('dotenv').config();
const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');
const router  = express.Router();
const SECRET  = process.env.SECRET_KEY;

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: 'Name, username & password required.' });
  }

  if (await User.findOne({ username })) {
    return res.status(409).json({ message: 'Username already taken.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, username, password: hash });
  await user.save();
  res.status(201).json({ message: 'User created', userId: user._id });
});

// POST /auth/signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
