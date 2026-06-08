const Product = require('../models/Product');

// @desc    Ürünleri listele + kategoriler
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { sort, order, category, search, minStock, maxStock } = req.query;

    let query = {};

    // Kategori filtresi
    if (category && category !== 'All') {
      query.category = category;
    }

    // Arama
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Stok aralığı
    if (minStock || maxStock) {
      query.stock = {};
      if (minStock) query.stock.$gte = parseInt(minStock);
      if (maxStock) query.stock.$lte = parseInt(maxStock);
    }

    // Sıralama
    let sortObj = {};
    if (sort) {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortObj)
      .populate('suppliers', 'name company');

    // Kategorileri topla
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      count: products.length,
      categories,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürünler alınırken hata oluştu.',
    });
  }
};

// @desc    Yeni ürün ekle
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi.',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Ürün eklenirken hata oluştu.',
    });
  }
};

// @desc    Ürün güncelle
// @route   PUT /api/products/:productId
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi.',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Ürün güncellenirken hata oluştu.',
    });
  }
};

// @desc    Ürün sil
// @route   DELETE /api/products/:productId
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla silindi.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu.',
    });
  }
};