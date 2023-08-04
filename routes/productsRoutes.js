const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Otras rutas relacionadas con la gestión de productos
// Puedes agregar rutas para crear, actualizar o eliminar productos según tus necesidades.

module.exports = router;
