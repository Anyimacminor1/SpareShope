const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

exports.placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body; // items: [{productId, quantity, price}]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must have items' });
    }
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each item must have productId, quantity, and price' });
      }
    }
    
    // Handle both authenticated and non-authenticated users
    const userId = req.user ? req.user.id : null;
    const order = await Order.create({ userId, total });
    
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user && req.user.role === 'admin') {
      orders = await Order.findAll({ include: [{ model: db.OrderItem }, { model: db.User, attributes: ['id', 'name', 'email', 'phone'] }] });
    } else if (req.user) {
      orders = await Order.findAll({ where: { userId: req.user.id }, include: [{ model: db.OrderItem }, { model: db.User, attributes: ['id', 'name', 'email', 'phone'] }] });
    } else {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: db.OrderItem }, { model: db.User, attributes: ['id', 'name', 'email', 'phone'] }] });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    
    // Auto-delete completed/cancelled orders after 24 hours
    if (req.body.status === 'completed' || req.body.status === 'cancelled') {
      setTimeout(async () => {
        try {
          const orderToDelete = await Order.findByPk(req.params.id);
          if (orderToDelete && (orderToDelete.status === 'completed' || orderToDelete.status === 'cancelled')) {
            await orderToDelete.destroy();
            console.log(`Order ${req.params.id} auto-deleted after 24 hours`);
          }
        } catch (err) {
          console.error('Error auto-deleting order:', err);
        }
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 