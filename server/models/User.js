const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  phone:    { type: String, default: '' },
  role:     { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  // ↑ CRITICAL: admin role NEVER has subscriptionPlan displayed in UI

  // Owner-specific fields (used when role === 'owner')
  company:        { type: String, default: '' },
  isVerified:     { type: Boolean, default: false }, // admin verifies owner accounts
  aadhaarOrPAN:   { type: String, default: '' },

  // User-specific fields (used when role === 'user')
  subscriptionPlan:   { type: String, enum: ['Free', 'Standard', 'Premium'], default: 'Free' },
  subscriptionExpiry: { type: Date, default: null },
  razorpayPaymentId:  { type: String, default: '' },
  wishlist:           [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],

  isActive: { type: Boolean, default: true },
  profilePic: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
