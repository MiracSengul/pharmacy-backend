const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
} = require('../controllers/supplierController');
const auth = require('../middleware/auth');

router.get('/', auth, getSuppliers);
router.post('/', auth, createSupplier);
router.put('/:supplierId', auth, updateSupplier);

module.exports = router;