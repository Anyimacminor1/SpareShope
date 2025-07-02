const db = require('../models');

// Get contact info
exports.getContactInfo = async (req, res) => {
  try {
    let info = await db.ContactInfo.findOne();
    if (!info) {
      // If not set, return default
      info = await db.ContactInfo.create({
        email: 'support@spareshop.com',
        phone: '+1 234 567 8901',
        address: '123 Land Rover Ave, London, UK',
        hours: 'Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM',
      });
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get contact info' });
  }
};

// Update contact info (admin only)
exports.updateContactInfo = async (req, res) => {
  try {
    let info = await db.ContactInfo.findOne();
    if (!info) {
      info = await db.ContactInfo.create(req.body);
    } else {
      await info.update(req.body);
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact info' });
  }
};

// Submit contact message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contactMessage = await db.ContactMessage.create({
      name,
      email,
      phone,
      message,
      status: 'pending'
    });

    res.status(201).json({ 
      message: 'Message sent successfully',
      id: contactMessage.id 
    });
  } catch (err) {
    console.error('Error submitting contact message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all contact messages (admin only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await db.ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Update message status (admin only)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const message = await db.ContactMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.update({ status });
    
    // Auto-delete responded messages after 10 minutes
    if (status === 'responded') {
      setTimeout(async () => {
        try {
          const messageToDelete = await db.ContactMessage.findByPk(id);
          if (messageToDelete && messageToDelete.status === 'responded') {
            await messageToDelete.destroy();
            console.log(`Contact message ${id} auto-deleted after 10 minutes`);
          }
        } catch (err) {
          console.error('Error auto-deleting contact message:', err);
        }
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    res.json(message);
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({ error: 'Failed to update message status' });
  }
}; 