const express = require('express');

const {
  getPropertyReviews,
  createReview,
  updateReview
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/reviews/:propertyId',
  getPropertyReviews
);

router.post(
  '/reviews',
  authMiddleware,
  authorizeRoles('Buyer'),
  createReview
);

router.put(
  '/reviews/:id',
  authMiddleware,
  authorizeRoles('Buyer'),
  updateReview
);

module.exports = router;