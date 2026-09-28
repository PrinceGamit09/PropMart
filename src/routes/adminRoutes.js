const express = require('express');

const {
  getAllUsers,
  getAllProperties,
  getDashboardStats
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

router.get(
  '/admin/dashboard',
  authMiddleware,
  authorizeRoles('Admin'),
  getDashboardStats
);

module.exports = router;