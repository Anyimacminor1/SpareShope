const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, admin, upload.single('image'), productController.createProduct);
router.put('/:id', auth, admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);
router.post('/upload', auth, admin, upload.single('image'), productController.uploadImage);

module.exports = router; 