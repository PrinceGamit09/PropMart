const express = require('express');

const {
  approveProperty
} = require('../controllers/verificationController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.put(
  '/verification/:id/approve',
  authMiddleware,
  authorizeRoles('Admin'),
  approveProperty
);

module.exports = router;