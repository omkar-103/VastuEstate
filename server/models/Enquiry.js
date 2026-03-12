const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toOwner:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:  { type: String, required: true, maxlength: 1000 },
  phone:    { type: String, default: '' },
  status:   { type: String, enum: ['new', 'seen', 'replied'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
