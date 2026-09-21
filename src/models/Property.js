const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 1
    },

    propertyType: {
      type: String,
      required: true,
      enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial']
    },

    area: {
      type: Number,
      required: true,
      min: 1
    },

    bedrooms: {
      type: Number,
      default: 0
    },

    bathrooms: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      trim: true
    },

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Property', propertySchema);