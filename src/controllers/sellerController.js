const Property = require('../models/Property');

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id
    });

    res.status(200).json({
      message: 'Seller properties fetched successfully',
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
  getMyProperties
};