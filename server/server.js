require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/', (req, res) => {
  res.send('<h1>Spare Shop API</h1><p>Welcome! Visit <a href="/api/products">/api/products</a> for products, or use the /api endpoints for full functionality.</p>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`)); 