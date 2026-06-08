const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tedarikçi adı zorunludur'],
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);