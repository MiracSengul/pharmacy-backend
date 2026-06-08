const express = require('express');
const router = express.Router();
const { login, logout, getUserInfo } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/logout', auth, logout);
router.get('/user-info', auth, getUserInfo);

module.exports = router;