const express = require('express');

const {
  getMyProperties
} = require('../controllers/sellerController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/seller/properties',
  authMiddleware,
  authorizeRoles('Seller'),
  getMyProperties
);

module.exports = router;