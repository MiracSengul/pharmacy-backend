const express = require('express');
const router = express.Router();
const { login, logout, getUserInfo, register } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/logout', auth, logout);
router.get('/user-info', auth, getUserInfo);
router.post('/register', register); 

module.exports = router;