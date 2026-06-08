const Order = require('../models/Order');

// @desc    Siparişleri listele (sıralama ve filtreleme ile)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { sort, order, status, search, startDate, endDate } = req.query;

    let query = {};

    // Statü filtresi
    if (status && status !== 'All') {
      query.status = status;
    }

    // Arama (müşteri adı veya email)
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    // Tarih aralığı filtresi
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    // Sıralama
    let sortObj = {};
    if (sort) {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortObj = { orderDate: -1 };
    }

    const orders = await Order.find(query)
      .sort(sortObj)
      .populate('customer', 'name email')
      .populate('products.product', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Siparişler alınırken hata oluştu.',
    });
  }
};