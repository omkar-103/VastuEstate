const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.use(protect, requireRole('admin'));

router.get('/stats',             admin.getStats);
router.get('/proposals/pending', admin.getPendingProposals);
router.patch('/proposals/:id/approve', admin.approveProposal);
router.patch('/proposals/:id/reject',  admin.rejectProposal);

router.get('/properties',        admin.getAllProperties);
router.get('/users',             admin.getAllUsers);
router.get('/owners',            admin.getAllOwners);
router.patch('/users/:id/toggle', admin.toggleUserStatus);
router.delete('/users/:id',      admin.deleteUser);
router.patch('/owners/:id/verify', admin.verifyOwner);
router.get('/payments',          admin.getAllPayments);

module.exports = router;
