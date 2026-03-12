const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:              { type: String, enum: ['Standard', 'Premium'], required: true },
  amount:            { type: Number, required: true },
  razorpayOrderId:   { type: String, required: true },
  razorpayPaymentId: { type: String, default: '' },
  razorpaySignature: { type: String, default: '' },
  status:            { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
