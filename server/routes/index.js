const express = require('express');
const router = express.Router();

const partsRoutes = require('./parts');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const userRoutes = require('./users');
const contactController = require('../controllers/contactController');
const { auth, admin } = require('../middleware/auth');
const authController = require('../controllers/authController');
// TODO: Add other route imports (etc.)

router.use('/parts', partsRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.get('/contact-info', contactController.getContactInfo);
router.put('/contact-info', auth, admin, contactController.updateContactInfo);
router.post('/contact', contactController.submitMessage);
router.get('/contact-messages', auth, admin, contactController.getMessages);
router.put('/contact-messages/:id/status', auth, admin, contactController.updateMessageStatus);
router.get('/forgot-password-requests', auth, admin, authController.getForgotPasswordRequests);
router.put('/forgot-password-requests/:id/process', auth, admin, authController.processForgotPasswordRequest);

module.exports = router; 