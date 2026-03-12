const Property = require('../models/Property');
const { createNotification } = require('../utils/notifications');

// ── GET ALL APPROVED ──────────────────────────────────────────────
exports.getProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, sortBy } = req.query;
    const query = { status: 'Approved' };

    if (city)     query['location.city'] = { $regex: city, $options: 'i' };
    if (type)     query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) };

    const sortMap = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'newest':     { createdAt: -1 },
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    let properties = await Property.find(query)
      .populate('owner', 'name email phone company')
      .sort(sort);

    // Determine user's subscription plan
    const userPlan = req.user?.subscriptionPlan || 'Free';
    const isExpired = req.user?.subscriptionExpiry && new Date(req.user.subscriptionExpiry) < new Date();
    const effectivePlan = (isExpired) ? 'Free' : userPlan;

    // For Free users: show only 50% of properties, mark rest as locked
    if (effectivePlan === 'Free') {
      const halfCount = Math.ceil(properties.length / 2);
      properties = properties.map((prop, idx) => {
        const p = prop.toObject();
        if (idx < halfCount) {
          // Visible but hide owner contact info
          if (p.owner) {
            p.owner = { name: p.owner.name, company: p.owner.company };
          }
          p._isLocked = false;
          p._contactLocked = true;
        } else {
          // Locked — blur on frontend
          if (p.owner) {
            p.owner = { name: '***', company: '***' };
          }
          p._isLocked = true;
          p._contactLocked = true;
        }
        return p;
      });
    } else if (effectivePlan === 'Standard') {
      // Standard: see all properties, unlock Standard+Free contact, lock Premium contact
      properties = properties.map(prop => {
        const p = prop.toObject();
        if (p.visibilityTier === 'Premium') {
          if (p.owner) {
            p.owner = { name: p.owner.name, company: p.owner.company };
          }
          p._isLocked = false;
          p._contactLocked = true;
        } else {
          p._isLocked = false;
          p._contactLocked = false;
        }
        return p;
      });
    } else {
      // Premium: everything unlocked
      properties = properties.map(prop => {
        const p = prop.toObject();
        p._isLocked = false;
        p._contactLocked = false;
        return p;
      });
    }

    // Add metadata for frontend
    const totalCount = await Property.countDocuments({ status: 'Approved' });
    res.json({
      properties,
      totalCount,
      userPlan: effectivePlan,
    });
  } catch (err) {
    console.error('getProperties error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── GET SINGLE PROPERTY ───────────────────────────────────────────
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone company');
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const p = property.toObject();
    const userPlan = req.user?.subscriptionPlan || 'Free';
    const isExpired = req.user?.subscriptionExpiry && new Date(req.user.subscriptionExpiry) < new Date();
    const effectivePlan = isExpired ? 'Free' : userPlan;

    // Determine access
    if (effectivePlan === 'Free') {
      p._contactLocked = true;
      if (p.visibilityTier !== 'Free') p._isLocked = true;
      else p._isLocked = false;
      
      if (p.owner) {
        p.owner = { name: p.owner.name, company: p.owner.company };
      }
    } else if (effectivePlan === 'Standard') {
      if (p.visibilityTier === 'Premium') {
        p._contactLocked = true;
        p._isLocked = true;
        if (p.owner) {
          p.owner = { name: p.owner.name, company: p.owner.company };
        }
      } else {
        p._contactLocked = false;
        p._isLocked = false;
      }
    } else {
      p._contactLocked = false;
      p._isLocked = false;
    }

    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── CREATE PROPERTY (owner submits proposal) ──────────────────────
exports.createProperty = async (req, res) => {
  try {
    const { 
      title, description, price, priceType, address, city, state, pincode, 
      type, bedrooms, bathrooms, area, parking, mediaUrls, amenities, brokerFee 
    } = req.body;

    if (!title || !description || !price || !address || !city || !type)
      return res.status(400).json({ message: 'Title, description, price, address, city and type are required' });

    const property = await Property.create({
      title, description,
      price: Number(price),
      priceType: priceType || 'rent',
      location: { address, city, state: state || '', pincode: pincode || '' },
      type,
      features: {
        bedrooms:  Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        area:      area || '',
        parking:   Number(parking) || 0,
      },
      media:     Array.isArray(mediaUrls) ? mediaUrls : (mediaUrls ? mediaUrls.split(',').map(u => u.trim()).filter(Boolean) : []),
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : []),
      brokerFee: Number(brokerFee) || 0,
      owner:     req.user._id,
      status:    'Pending',
    });

    // Notify admin (find first admin)
    const admin = await require('../models/User').findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        '🏠 New Property Proposal',
        `${req.user.name} submitted "${title}" for review.`,
        'proposal', '/admin/dashboard'
      );
    }

    res.status(201).json({ message: 'Property submitted for review', property });
  } catch (err) {
    console.error('createProperty error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── OWNER'S OWN PROPERTIES ────────────────────────────────────────
exports.getMyProperties = async (req, res) => {
  try {
    const props = await Property.find({ owner: req.user._id }).sort('-createdAt');
    res.json(props);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE PROPERTY ───────────────────────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
