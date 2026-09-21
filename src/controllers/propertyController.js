const Property = require('../models/Property');

const createProperty = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      description,
      amenities,
      images
    } = req.body;

    // Check required fields
    if (!title || !location || !price || !area || !propertyType) {
      return res.status(400).json({
        message: 'Title, location, price, area and property type are required'
      });
    }

    // Create property
    const property = await Property.create({
      title,
      location,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      description,
      amenities,
      images,
      owner: req.user.id
    });

    res.status(201).json({
      message: 'Property created successfully',
      property
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const getProperties = async (req, res) => {
  try {
    const {
      location,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      minArea,
      maxArea
    } = req.query;

    const filter = {
      status: 'Approved'
    };

    // Location filter
    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i'
      };
    }

    // Property type filter
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Price filters
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Bedrooms filter
    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }

    // Area filters
    if (minArea || maxArea) {
      filter.area = {};

      if (minArea) {
        filter.area.$gte = Number(minArea);
      }

      if (maxArea) {
        filter.area.$lte = Number(maxArea);
      }
    }

    const properties = await Property.find(filter);

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


const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    res.status(200).json({
      message: 'Property fetched successfully',
      property
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Check if logged-in user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to update this property'
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: 'Property updated successfully',
      property: updatedProperty
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Check if logged-in user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to delete this property'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Property deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};