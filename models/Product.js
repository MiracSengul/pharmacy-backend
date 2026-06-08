const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stok miktarı zorunludur'],
      min: [0, 'Stok negatif olamaz'],
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
      },
    ],
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);