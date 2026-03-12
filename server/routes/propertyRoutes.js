const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, getMyProperties, deleteProperty } = require('../controllers/propertyController');
const { protect, requireRole, optionalProtect } = require('../middleware/authMiddleware');

router.get('/',      optionalProtect, getProperties);
router.get('/:id',   optionalProtect, getPropertyById);
router.post('/',     protect, requireRole('owner'), createProperty);
router.get('/my/all', protect, requireRole('owner'), getMyProperties);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
