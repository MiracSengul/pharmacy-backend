const Customer = require('../models/Customer');
const Order = require('../models/Order');

// @desc    Tüm müşterileri listele
// @route   GET /api/customers
exports.getCustomers = async (req, res) => {
  try {
    const { sort, order, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = {};
    if (sort) {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 };
    }

    const customers = await Customer.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Müşteriler alınırken hata oluştu.',
    });
  }
};

// @desc    Tek müşteri detayı
// @route   GET /api/customers/:customerId
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Müşteri bulunamadı.',
      });
    }

    // İşlem geçmişini getir
    const transactions = await Order.find({
      customer: customer._id,
    })
      .sort({ orderDate: -1 })
      .select('products totalAmount status orderDate type');

    res.status(200).json({
      success: true,
      data: {
        customer,
        transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Müşteri bilgisi alınırken hata oluştu.',
    });
  }
};