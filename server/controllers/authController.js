const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = db.User;

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }
    if (!email && !phone) {
      return res.status(400).json({ error: 'Either email or phone number is required' });
    }
    
    // Check for existing email if provided
    if (email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Check for existing phone if provided
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ error: 'Phone already in use' });
      }
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }
    // Check if identifier is an email or phone
    let user;
    if (identifier.includes('@')) {
      user = await User.findOne({ where: { email: identifier } });
    } else {
      user = await User.findOne({ where: { phone: identifier } });
    }
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: 'Identifier required' });
    await db.ForgotPasswordRequest.create({ identifier });
    res.json({ message: 'Request submitted for admin review' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

exports.getForgotPasswordRequests = async (req, res) => {
  try {
    const requests = await db.ForgotPasswordRequest.findAll({ order: [['createdAt', 'DESC']] });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

exports.processForgotPasswordRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await db.ForgotPasswordRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    request.status = 'processed';
    await request.save();
    
    // Auto-delete processed requests after 10 minutes
    setTimeout(async () => {
      try {
        const requestToDelete = await db.ForgotPasswordRequest.findByPk(id);
        if (requestToDelete && requestToDelete.status === 'processed') {
          await requestToDelete.destroy();
          console.log(`Password reset request ${id} auto-deleted after 10 minutes`);
        }
      } catch (err) {
        console.error('Error auto-deleting password reset request:', err);
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
}; 