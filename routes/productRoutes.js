const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', auth, getProducts);
router.post('/', auth, createProduct);
router.put('/:productId', auth, updateProduct);
router.delete('/:productId', auth, deleteProduct);

module.exports = router;