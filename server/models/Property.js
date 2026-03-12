const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  priceType:   { type: String, enum: ['sale', 'rent'], default: 'sale' },

  location: {
    address: { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, default: '' },    // ← was required: true — FIXED
    pincode: { type: String, default: '' },    // ← was required: true — FIXED
  },

  // Keep your enum — just make sure frontend uses same values
  type: {
    type: String,
    enum: ['Residential', 'Commercial', 'Penthouse', 'Plot'],
    required: true,
  },

  // Kept as nested object (matches your existing seed.js)
  features: {
    bedrooms:  { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area:      { type: String, default: '' },
    parking:   { type: Number, default: 0 },
  },

  media:      [{ type: String }],  // image URLs
  amenities:  [{ type: String }],

  owner:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:         { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  visibilityTier: { type: String, enum: ['Free', 'Standard', 'Premium'], default: 'Free' },
  isVerified:     { type: Boolean, default: false },
  adminNote:      { type: String, default: '' },
  enquiryCount:   { type: Number, default: 0 },
  brokerFee:      { type: Number, default: 0 }, // ← NEW
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
