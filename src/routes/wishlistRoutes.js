const express = require('express');

const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Add property to wishlist
router.post(
  '/wishlist',
  authMiddleware,
  authorizeRoles('Buyer'),
  addToWishlist
);

// Get my wishlist
router.get(
  '/wishlist',
  authMiddleware,
  authorizeRoles('Buyer'),
  getMyWishlist
);

// Remove property from wishlist
router.delete(
  '/wishlist/:id',
  authMiddleware,
  authorizeRoles('Buyer'),
  removeFromWishlist
);

module.exports = router;