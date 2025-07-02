const db = require('../models');
const Product = db.Product;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, model, year, compatibility, partNumber } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }
    const product = await Product.create({ 
      name, 
      description, 
      price, 
      imageUrl, 
      stock,
      model,
      year,
      compatibility,
      partNumber
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const { name, description, price, stock, model, year, compatibility, partNumber } = req.body;
    let imageUrl = req.body.imageUrl || product.imageUrl;
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }
    await product.update({ 
      name, 
      description, 
      price, 
      imageUrl, 
      stock,
      model,
      year,
      compatibility,
      partNumber
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
}; 