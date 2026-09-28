const express = require('express');

const {
  createInquiry
} = require('../controllers/inquiryController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/inquiries',
  authMiddleware,
  authorizeRoles('Buyer'),
  createInquiry
);

module.exports = router;