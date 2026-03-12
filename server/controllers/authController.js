// THE KEY FIX: admin login response does NOT include subscriptionPlan
// That field being present is what caused "FREE PLAN" to show in the navbar

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── USER REGISTRATION ─────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, role: 'user' });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      role: 'user',
      subscriptionPlan: user.subscriptionPlan,
      token: generateToken(user._id, 'user'),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── OWNER REGISTRATION ────────────────────────────────────────────
exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password, phone, company, aadhaarOrPAN } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });

    const owner = await User.create({
      name, email, password, phone, company, aadhaarOrPAN,
      role: 'owner', isVerified: false,
    });
    res.status(201).json({
      _id: owner._id, name: owner.name, email: owner.email, phone: owner.phone,
      role: 'owner', company: owner.company, isVerified: owner.isVerified,
      token: generateToken(owner._id, 'owner'),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── UNIVERSAL LOGIN (user / owner / admin) ────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated. Contact support.' });

    // Portal separation — prevent admin logging in as user, etc.
    if (expectedRole && user.role !== expectedRole) {
      const portals = { user: 'User Portal (/login)', owner: 'Owner Portal (/owner/login)', admin: 'Admin Portal (/admin/login)' };
      return res.status(403).json({
        message: `This account belongs to the ${user.role} portal. Please use: ${portals[user.role]}`
      });
    }

    const token = generateToken(user._id, user.role);

    // ── CRITICAL FIX: Each role gets DIFFERENT response shape ──────
    if (user.role === 'admin') {
      // Admin NEVER gets subscriptionPlan — that's what caused "FREE PLAN" badge
      return res.json({
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: 'admin',
        // NO subscriptionPlan field here
        token,
      });
    }

    if (user.role === 'owner') {
      return res.json({
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: 'owner',
        company: user.company, isVerified: user.isVerified,
        // NO subscriptionPlan field here
        token,
      });
    }

    // role === 'user' — gets subscription info
    return res.json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, role: 'user',
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiry: user.subscriptionExpiry,
      wishlist: user.wishlist,
      token,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET ME ────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    res.json(await User.findById(req.user._id).select('-password'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, company } = req.body;
    const updates = { name, phone };
    if (req.user.role === 'owner') updates.company = company;
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
