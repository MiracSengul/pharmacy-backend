require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route dosyaları
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS yapılandırması
app.use(
  cors({
    origin: '*', // Tüm originlere izin ver (geliştirme için)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route'lar
app.use('/api/user', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Pharmacy API çalışıyor',
    version: '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota bulunamadı: ${req.originalUrl}`,
  });
});

// Hata yakalama middleware
app.use(errorHandler);

// Sunucuyu başlat
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
    console.log(`Ortam: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();