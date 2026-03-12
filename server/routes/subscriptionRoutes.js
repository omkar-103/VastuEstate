const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getHistory } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify',       protect, verifyPayment);
router.get('/history',       protect, getHistory);

module.exports = router;
