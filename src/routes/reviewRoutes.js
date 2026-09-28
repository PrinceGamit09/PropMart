const express = require('express');

const {
  createReview
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/reviews',
  authMiddleware,
  authorizeRoles('Buyer'),
  createReview
);

module.exports = router;