const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

const addToWishlist = async (req, res) => {
  try {
    const { property } = req.body;

    // Check required field
    if (!property) {
      return res.status(400).json({
        message: 'Property is required'
      });
    }

    // Check if property exists
    const existingProperty = await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Only approved properties can be added
    if (existingProperty.status !== 'Approved') {
      return res.status(400).json({
        message: 'Only approved properties can be added to wishlist'
      });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      property
    });

    if (existingWishlist) {
      return res.status(400).json({
        message: 'Property is already in your wishlist'
      });
    }

    // Create wishlist entry
    const wishlist = await Wishlist.create({
      user: req.user.id,
      property
    });

    res.status(201).json({
      message: 'Property added to wishlist',
      wishlist
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id
    }).populate('property');

    res.status(200).json({
      message: 'Wishlist fetched successfully',
      wishlist
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist item not found'
      });
    }

    await Wishlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Property removed from wishlist'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


module.exports = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist
};