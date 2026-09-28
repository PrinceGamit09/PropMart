const Review = require('../models/Review');
const Property = require('../models/Property');

const createReview = async (req, res) => {
  try {
    const { property, rating, comment } = req.body;

    if (!property || !rating || !comment) {
      return res.status(400).json({
        message: 'Property, rating and comment are required'
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
        message: 'You can only review an approved property'
      });
    }

    const existingReview = await Review.findOne({
      property,
      buyer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this property'
      });
    }

    const review = await Review.create({
      property,
      buyer: req.user.id,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createReview
};