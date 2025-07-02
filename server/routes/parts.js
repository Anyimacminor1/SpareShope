const express = require('express');
const router = express.Router();
const partsController = require('../controllers/partsController');

// GET /api/parts
router.get('/', partsController.getAllParts);

module.exports = router; 