const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Inquiry = require('../models/Inquiry');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      message: 'Users fetched successfully',
      users
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json({
      message: 'Properties fetched successfully',
      properties
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProperties = await Property.countDocuments();

    const pendingProperties = await Property.countDocuments({
      status: 'Pending'
    });

    const approvedProperties = await Property.countDocuments({
      status: 'Approved'
    });

    const rejectedProperties = await Property.countDocuments({
      status: 'Rejected'
    });

    const totalBookings = await Booking.countDocuments();

    const totalReviews = await Review.countDocuments();

    const totalInquiries = await Inquiry.countDocuments();

    res.status(200).json({
      message: 'Dashboard statistics fetched successfully',
      statistics: {
        totalUsers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalBookings,
        totalReviews,
        totalInquiries
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllProperties,
  getDashboardStats
};