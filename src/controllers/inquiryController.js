const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

const createInquiry = async (req, res) => {
  try {
    const { property, message } = req.body;

    if (!property || !message) {
      return res.status(400).json({
        message: 'Property and message are required'
      });
    }

    const existingProperty = await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    if (existingProperty.status !== 'Approved') {
      return res.status(400).json({
        message: 'You can only contact the seller of an approved property'
      });
    }

    const inquiry = await Inquiry.create({
      property,
      buyer: req.user.id,
      seller: existingProperty.owner,
      message
    });

    res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createInquiry
};