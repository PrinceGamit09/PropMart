const Booking = require('../models/Booking');
const Property = require('../models/Property');

const createBooking = async (req, res) => {
  try {
    const { property, visitDate } = req.body;

    if (!property || !visitDate) {
      return res.status(400).json({
        message: 'Property and visit date are required'
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
        message: 'This property is not available for booking'
      });
    }

    const selectedDate = new Date(visitDate);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid visit date'
      });
    }

    if (selectedDate <= new Date()) {
      return res.status(400).json({
        message: 'Visit date must be in the future'
      });
    }

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

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      buyer: req.user.id
    }).populate('property');

    res.status(200).json({
      message: 'Bookings fetched successfully',
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getSellerBookings = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id
    }).select('_id');

    const propertyIds = properties.map(property => property._id);

    const bookings = await Booking.find({
      property: { $in: propertyIds }
    })
      .populate('property')
      .populate('buyer', 'name email phone_no');

    res.status(200).json({
      message: 'Seller bookings fetched successfully',
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (booking.property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to confirm this booking'
      });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending bookings can be confirmed'
      });
    }

    booking.status = 'Confirmed';

    await booking.save();

    res.status(200).json({
      message: 'Booking confirmed successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (
      booking.property.owner.toString() !== req.user.id &&
      booking.buyer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'You are not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'Cancelled';

    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
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
  createBooking,
  getMyBookings,
  getSellerBookings,
  confirmBooking,
  cancelBooking
};