const express = require('express');

const {
  getAllUsers
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

module.exports = router;