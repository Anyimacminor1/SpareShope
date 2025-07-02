const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, userController.listUsers);
router.put('/:id/role', auth, admin, userController.changeRole);
router.delete('/:id', auth, admin, userController.deleteUser);
router.patch('/me', auth, userController.updateProfile);
router.patch('/me/password', auth, userController.changePassword);

module.exports = router; 