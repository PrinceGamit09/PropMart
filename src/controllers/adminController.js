const User = require('../models/User');
const Property = require('../models/Property');

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

module.exports = {
  getAllUsers,
  getAllProperties
};