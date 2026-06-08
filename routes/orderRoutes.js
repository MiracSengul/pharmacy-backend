const express = require('express');
const router = express.Router();
const { getOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, getOrders);

module.exports = router;