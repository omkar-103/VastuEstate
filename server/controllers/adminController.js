const User = require('../models/User');
const Property = require('../models/Property');
const Payment = require('../models/Payment');
const { createNotification } = require('../utils/notifications');

// ── STATS ─────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalOwners, totalProperties, pendingProposals, paidPayments] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Property.countDocuments({ status: 'Approved' }),
      Property.countDocuments({ status: 'Pending' }),
      Payment.find({ status: 'paid' }).select('amount plan'),
    ]);

    const totalRevenue     = paidPayments.reduce((s, p) => s + p.amount, 0);
    const standardRevenue  = paidPayments.filter(p => p.plan === 'Standard').reduce((s, p) => s + p.amount, 0);
    const premiumRevenue   = paidPayments.filter(p => p.plan === 'Premium').reduce((s, p) => s + p.amount, 0);

    const [freeCount, stdCount, premCount] = await Promise.all([
      User.countDocuments({ role: 'user', subscriptionPlan: 'Free' }),
      User.countDocuments({ role: 'user', subscriptionPlan: 'Standard' }),
      User.countDocuments({ role: 'user', subscriptionPlan: 'Premium' }),
    ]);

    res.json({
      totalUsers, totalOwners, totalProperties, pendingProposals,
      totalRevenue, standardRevenue, premiumRevenue,
      planDistribution: { Free: freeCount, Standard: stdCount, Premium: premCount },
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── PENDING PROPOSALS ─────────────────────────────────────────────
exports.getPendingProposals = async (req, res) => {
  try {
    const proposals = await Property.find({ status: 'Pending' })
      .populate('owner', 'name email phone company')
      .sort('-createdAt');
    res.json(proposals);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── APPROVE PROPOSAL ──────────────────────────────────────────────
exports.approveProposal = async (req, res) => {
  try {
    const { visibilityTier } = req.body;
    if (!['Free', 'Standard', 'Premium'].includes(visibilityTier))
      return res.status(400).json({ message: 'Invalid visibility tier' });

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', isVerified: true, visibilityTier },
      { new: true }
    ).populate('owner');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    await createNotification(
      property.owner._id,
      '✅ Property Approved!',
      `Your property "${property.title}" is now live with ${visibilityTier} tier visibility.`,
      'approval', '/owner/dashboard'
    );

    res.json({ message: 'Property approved', property });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── REJECT PROPOSAL ───────────────────────────────────────────────
exports.rejectProposal = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', adminNote: adminNote || 'Does not meet listing requirements' },
      { new: true }
    ).populate('owner');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    await createNotification(
      property.owner._id,
      '❌ Property Rejected',
      `Your property "${property.title}" was rejected. Reason: ${property.adminNote}`,
      'rejection', '/owner/dashboard'
    );

    res.json({ message: 'Property rejected', property });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ALL PROPERTIES ────────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const props = await Property.find({}).populate('owner', 'name email').sort('-createdAt');
    res.json(props);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ALL USERS ─────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    res.json(await User.find({ role: 'user' }).select('-password').sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ALL OWNERS ────────────────────────────────────────────────────
exports.getAllOwners = async (req, res) => {
  try {
    res.json(await User.find({ role: 'owner' }).select('-password').sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── TOGGLE USER ACTIVE ────────────────────────────────────────────
exports.toggleUserStatus = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    u.isActive = !u.isActive;
    await u.save();
    res.json({ message: `User ${u.isActive ? 'activated' : 'deactivated'}`, isActive: u.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE USER ───────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── VERIFY OWNER ──────────────────────────────────────────────────
exports.verifyOwner = async (req, res) => {
  try {
    const owner = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    await createNotification(owner._id, '✅ Account Verified', 'You can now submit property listings.', 'system', '/owner/dashboard');
    res.json({ message: 'Owner verified', owner });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ALL PAYMENTS ──────────────────────────────────────────────────
exports.getAllPayments = async (req, res) => {
  try {
    res.json(await Payment.find({}).populate('user', 'name email').sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
