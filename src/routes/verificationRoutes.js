const express = require('express');

const {
  approveProperty,
  rejectProperty
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

router.put(
  '/verification/:id/reject',
  authMiddleware,
  authorizeRoles('Admin'),
  rejectProperty
);

module.exports = router;