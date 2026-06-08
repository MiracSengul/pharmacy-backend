const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// @desc    Dashboard verilerini getir
// @route   GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Toplam ürün sayısı
    const totalProducts = await Product.countDocuments({ status: 'active' });

    // Toplam tedarikçi sayısı
    const totalSuppliers = await Supplier.countDocuments({ status: 'Active' });

    // Toplam müşteri sayısı
    const totalCustomers = await Customer.countDocuments({ status: 'active' });

    // Son müşteriler (son 10)
    const recentCustomers = await Customer.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email totalSpent country');

    // Son 30 günün gelir ve giderleri
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await Order.find({
      orderDate: { $gte: thirtyDaysAgo },
    })
      .sort({ orderDate: -1 })
      .select('customerName customerEmail totalAmount type orderDate');

    // Gelir ve gider listesi
    const incomeExpenses = recentOrders.map((order) => ({
      title: order.customerName,
      email: order.customerEmail,
      amount: order.totalAmount,
      type: order.type,
      date: order.orderDate,
    }));

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalProducts,
          totalSuppliers,
          totalCustomers,
        },
        recentCustomers,
        incomeExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu.',
    });
  }
};