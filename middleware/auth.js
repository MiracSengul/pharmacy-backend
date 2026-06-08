const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'e-pharmacy-jwt-secret-key-2024';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama token\'ı bulunamadı. Lütfen giriş yapın.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Bu token\'a ait kullanıcı bulunamadı.',
      });
    }

    // Token kara listede mi kontrol et
    if (user.blacklistedTokens && user.blacklistedTokens.length > 0) {
      const isBlacklisted = user.blacklistedTokens.some(
        (bt) => bt.token === token && bt.expiresAt > new Date()
      );
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: 'Oturum sonlandırılmış. Lütfen tekrar giriş yapın.',
        });
      }
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası.',
    });
  }
};

module.exports = auth;