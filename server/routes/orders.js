const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

router.post('/', orderController.placeOrder);
router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id', auth, admin, orderController.updateOrderStatus);

module.exports = router; 