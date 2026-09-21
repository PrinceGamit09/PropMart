const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone_no: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['Buyer', 'Seller', 'Admin'],
      default: 'Buyer'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);