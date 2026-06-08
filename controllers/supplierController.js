const Supplier = require('../models/Supplier');

// @desc    Tedarikçi listesi
// @route   GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const { sort, order, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = {};
    if (sort) {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 };
    }

    const suppliers = await Supplier.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tedarikçiler alınırken hata oluştu.',
    });
  }
};

// @desc    Yeni tedarikçi ekle
// @route   POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tedarikçi başarıyla eklendi.',
      data: supplier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Tedarikçi eklenirken hata oluştu.',
    });
  }
};

// @desc    Tedarikçi güncelle
// @route   PUT /api/suppliers/:supplierId
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.supplierId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Tedarikçi bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tedarikçi başarıyla güncellendi.',
      data: supplier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Tedarikçi güncellenirken hata oluştu.',
    });
  }
};