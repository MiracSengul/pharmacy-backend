const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById } = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.get('/', auth, getCustomers);
router.get('/:customerId', auth, getCustomerById);

module.exports = router;