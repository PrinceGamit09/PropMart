const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'propmart/properties',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

const uploadPropertyImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const imageUrls = await Promise.all(
    files.map((file) =>
      uploadImageToCloudinary(file)
    )
  );

  return imageUrls;
};

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
      amenities
    } = req.body;

    if (
      !title ||
      !location ||
      !price ||
      !area ||
      !propertyType
    ) {
      return res.status(400).json({
        message:
          'Title, location, price, area and property type are required'
      });
    }

    const imageUrls =
      await uploadPropertyImages(req.files);

    let parsedAmenities = amenities;

    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch {
        parsedAmenities = amenities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    const property = await Property.create({
      title,
      location,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      description,
      amenities: parsedAmenities,
      images: imageUrls,
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

    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i'
      };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }

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
    const property = await Property.findById(
      req.params.id
    );

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
    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    if (
      property.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          'You are not authorized to update this property'
      });
    }

    const updateData = {
      ...req.body
    };

    /*
     * Handle amenities when sent through FormData.
     */
    if (typeof updateData.amenities === 'string') {
      try {
        updateData.amenities = JSON.parse(
          updateData.amenities
        );
      } catch {
        updateData.amenities = updateData.amenities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    /*
     * If a new image is uploaded,
     * replace the existing images.
     *
     * If no new image is uploaded,
     * keep the existing images.
     */
    if (
      req.files &&
      req.files.length > 0
    ) {
      const newImageUrls =
        await uploadPropertyImages(req.files);

      updateData.images = newImageUrls;
    }

    const updatedProperty =
      await Property.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    res.status(200).json({
      message:
        'Property updated successfully',
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
    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    if (
      property.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          'You are not authorized to delete this property'
      });
    }

    await Property.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        'Property deleted successfully'
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