const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// GET - listele (admin için korumalı)
router.get('/', auth, getOrders);

// POST - yeni sipariş oluştur (korumasız, müşteri tarafı)
router.post('/', createOrder);

module.exports = router;