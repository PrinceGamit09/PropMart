const express = require('express');

const {
  createBooking
} = require('../controllers/bookingController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Create booking
router.post(
  '/bookings',
  authMiddleware,
  authorizeRoles('Buyer'),
  createBooking
);

module.exports = router;