const express = require('express');
const router = express.Router();
const { createTourRequest, getMyTours, getReceivedTours, confirmTour } = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createTourRequest);
router.get('/my-tours', getMyTours);
router.get('/received', authorize('agent', 'seller', 'admin'), getReceivedTours);
router.put('/:id/confirm', authorize('agent', 'seller', 'admin'), confirmTour);

module.exports = router;
