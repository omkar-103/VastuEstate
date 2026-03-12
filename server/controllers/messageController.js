const Message = require('../models/Message');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }]
    }).sort('-createdAt').populate('from to', 'name role').populate('property', 'title');

    const threads = {};
    messages.forEach(msg => {
      if (!threads[msg.threadId]) {
        const other = msg.from._id.toString() === req.user._id.toString() ? msg.to : msg.from;
        threads[msg.threadId] = { threadId: msg.threadId, otherUser: other, lastMessage: msg, unreadCount: 0 };
      }
      if (!msg.isRead && msg.to._id.toString() === req.user._id.toString()) {
        threads[msg.threadId].unreadCount++;
      }
    });

    res.json(Object.values(threads));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getThread = async (req, res) => {
  try {
    const threadId = Message.getThreadId(req.user._id, req.params.userId);
    const msgs = await Message.find({ threadId }).populate('from', 'name role').sort('createdAt');
    await Message.updateMany({ threadId, to: req.user._id, isRead: false }, { isRead: true });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { toUserId, text, propertyId, mediaUrl, mediaType } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

    if (!(await User.findById(toUserId))) return res.status(404).json({ message: 'Recipient not found' });

    const threadId = Message.getThreadId(req.user._id, toUserId);
    const msg = await Message.create({
      from: req.user._id, to: toUserId,
      text: text.trim(),
      property: propertyId || null,
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || 'none',
      threadId,
    });

    res.status(201).json(await msg.populate('from', 'name role'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ to: req.user._id, isRead: false });
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
