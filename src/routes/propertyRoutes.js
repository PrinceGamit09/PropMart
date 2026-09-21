const express = require('express');

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create property
router.post('/properties', authMiddleware, createProperty);

// Get all properties
router.get('/properties', getProperties);

// Get property by ID
router.get('/properties/:id', getPropertyById);

// Update property
router.put('/properties/:id', authMiddleware, updateProperty);

// Delete property
router.delete('/properties/:id', authMiddleware, deleteProperty);

module.exports = router;