const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim alanı zorunludur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-posta alanı zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Geçerli bir e-posta adresi giriniz',
      ],
    },
    password: {
      type: String,
      required: [true, 'Şifre alanı zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    },
    role: {
      type: String,
      enum: ['admin', 'vendor', 'customer'],
      default: 'vendor',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    blacklistedTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Şifreyi hashleme
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hassas alanları JSON'dan çıkar
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.blacklistedTokens;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);