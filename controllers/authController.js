const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'e-pharmacy-jwt-secret-key-2024';

// @desc    Kullanıcı girişi
// @route   POST /api/user/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Email doğrulama
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Geçerli bir e-posta adresi giriniz.',
    });
  }

  // Şifre varlığı ve uzunluğu kontrolü
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Şifre en az 6 karakter olmalıdır.',
    });
  }

  // Kullanıcıyı email ile bul
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'E-posta veya şifre hatalı.',
    });
  }

  // Şifre kontrolü
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'E-posta veya şifre hatalı.',
    });
  }

  // Token oluştur
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '2h',
  });

  res.status(200).json({
    success: true,
    message: 'Giriş başarılı.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email formatı kontrolü
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi giriniz.',
      });
    }

    // Şifre uzunluğu kontrolü
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır.',
      });
    }

    // İsim kontrolü
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'İsim en az 2 karakter olmalıdır.',
      });
    }

    // Kullanıcı zaten var mı?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kayıtlı.',
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer', // Müşteri tarafından kayıt olanlar 'customer' rolünde
    });

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı. Giriş yapabilirsiniz.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu.',
    });
  }
};

// @desc    Kullanıcı çıkışı
// @route   GET /api/user/logout
exports.logout = async (req, res) => {
  try {
    const token = req.token;

    // Token'ı kara listeye ekle
    const decoded = jwt.decode(token);
    req.user.blacklistedTokens.push({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    // Eski süresi dolmuş token'ları temizle
    req.user.blacklistedTokens = req.user.blacklistedTokens.filter(
      (bt) => bt.expiresAt > new Date()
    );

    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Çıkış başarılı.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Çıkış işlemi sırasında hata oluştu.',
    });
  }
};

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/user/user-info
exports.getUserInfo = async (req, res) => {
  // İstenen sabit değerleri döndür
  res.status(200).json({
    success: true,
    data: {
      name: 'Clayton Santos',
      email: 'vendor@gmail.com',
    },
  });
};