const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property:  { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  text:      { type: String, required: true, maxlength: 2000 },
  mediaUrl:  { type: String, default: '' },
  mediaType: { type: String, enum: ['none', 'image'], default: 'none' },
  isRead:    { type: Boolean, default: false },
  threadId:  { type: String, required: true },
}, { timestamps: true });

messageSchema.statics.getThreadId = function(id1, id2) {
  return [id1.toString(), id2.toString()].sort().join('_');
};

module.exports = mongoose.model('Message', messageSchema);
