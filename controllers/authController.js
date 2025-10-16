import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// helper
const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// register (profile picture optional via route upload)
export const register = async (req, res) => {
  const { name, email, password, gender } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;
  const user = await User.create({ name, email, password, gender, profilePicture });

  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture },
    token
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture }, token });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
