const express = require('express');

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Create property with up to 5 images
router.post(
  '/properties',
  authMiddleware,
  upload.array('images', 5),
  createProperty
);

// Get all properties
router.get('/properties', getProperties);

// Get property by ID
router.get('/properties/:id', getPropertyById);

// Update property with optional new images
router.put(
  '/properties/:id',
  authMiddleware,
  upload.array('images', 5),
  updateProperty
);

// Delete property
router.delete(
  '/properties/:id',
  authMiddleware,
  deleteProperty
);

module.exports = router;