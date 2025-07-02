const db = require('../models');
const User = db.User;

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.name = req.body.name || user.name;
    user.whatsapp = req.body.whatsapp || user.whatsapp;
    await user.save();
    res.json({ name: user.name, whatsapp: user.whatsapp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { current, new: newPassword } = req.body;
    if (!current || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const bcrypt = require('bcryptjs');
    const match = await bcrypt.compare(current, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 