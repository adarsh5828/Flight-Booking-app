import User from '../models/User.js';

// get profile
// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// update profile (upload handled by route)
export const updateProfile = async (req, res) => {
  const updates = {};
  const { name, email, password, gender } = req.body;
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (gender) updates.gender = gender;
  if (req.file) updates.profilePicture = `/uploads/${req.file.filename}`;
  if (password) updates.password = password; // pre-save will hash

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  Object.assign(user, updates);
  await user.save();
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture } });
};