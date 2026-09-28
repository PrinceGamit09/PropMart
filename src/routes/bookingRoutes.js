const express = require('express');

const {
  createBooking,
  getMyBookings,
  getSellerBookings,
  confirmBooking,
  cancelBooking
} = require('../controllers/bookingController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/bookings',
  authMiddleware,
  authorizeRoles('Buyer'),
  createBooking
);

router.get(
  '/bookings',
  authMiddleware,
  authorizeRoles('Buyer'),
  getMyBookings
);

router.get(
  '/seller/bookings',
  authMiddleware,
  authorizeRoles('Seller'),
  getSellerBookings
);

router.put(
  '/bookings/:id/confirm',
  authMiddleware,
  authorizeRoles('Seller'),
  confirmBooking
);

router.put(
  '/bookings/:id/cancel',
  authMiddleware,
  authorizeRoles('Buyer', 'Seller'),
  cancelBooking
);

module.exports = router;