const Property = require('../models/Property');

const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    if (property.status === 'Approved') {
      return res.status(400).json({
        message: 'Property is already approved'
      });
    }

    property.status = 'Approved';

    await property.save();

    res.status(200).json({
      message: 'Property approved successfully',
      property
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  approveProperty
};