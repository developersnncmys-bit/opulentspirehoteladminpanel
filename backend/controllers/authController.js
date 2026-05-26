const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'User with this email already exists' });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, me };
