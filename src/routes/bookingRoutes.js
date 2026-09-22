const Booking = require('../models/Booking');
const Property = require('../models/Property');

const createBooking = async (req, res) => {
  try {
    const { property, visitDate } = req.body;

    // Check required fields
    if (!property || !visitDate) {
      return res.status(400).json({
        message: 'Property and visit date are required'
      });
    }

    // Check if property exists
    const existingProperty = await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Only approved properties can be booked
    if (existingProperty.status !== 'Approved') {
      return res.status(400).json({
        message: 'This property is not available for booking'
      });
    }

    // Check visit date
    const selectedDate = new Date(visitDate);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid visit date'
      });
    }

    // Visit date must be in the future
    if (selectedDate <= new Date()) {
      return res.status(400).json({
        message: 'Visit date must be in the future'
      });
    }

    // Create booking
    const booking = await Booking.create({
      property,
      buyer: req.user.id,
      visitDate: selectedDate
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createBooking
};