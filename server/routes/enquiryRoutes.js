const express = require('express');
const router = express.Router();
const { createEnquiry, getMyEnquiries, getReceivedEnquiries, getEnquiryStats } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createEnquiry);
router.get('/my-enquiries', getMyEnquiries);
router.get('/received', authorize('agent', 'seller', 'admin'), getReceivedEnquiries);
router.get('/count', authorize('admin'), getEnquiryStats);

module.exports = router;
