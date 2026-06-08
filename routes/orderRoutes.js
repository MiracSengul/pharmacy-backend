const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, getOrders);
router.post('/', createOrder);  

module.exports = router;