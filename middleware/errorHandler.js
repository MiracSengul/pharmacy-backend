const errorHandler = (err, req, res, next) => {
  console.error('Hata:', err);

  // Mongoose validation hatası
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: messages,
    });
  }

  // Mongoose duplicate key hatası
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Bu ${field} zaten kullanımda.`,
    });
  }

  // CastError (geçersiz ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz ID formatı.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;