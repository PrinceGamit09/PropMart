const express = require('express');

const {
  getAllUsers,
  getAllProperties
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/admin/users',
  authMiddleware,
  authorizeRoles('Admin'),
  getAllUsers
);

router.get(
  '/admin/properties',
  authMiddleware,
  authorizeRoles('Admin'),
  getAllProperties
);

module.exports = router;