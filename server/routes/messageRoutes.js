const express = require('express');
const router = express.Router();
const { getConversations, getThread, sendMessage, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/conversations', getConversations);
router.get('/unread-count',  getUnreadCount);
router.get('/thread/:userId', getThread);
router.post('/send',         sendMessage);

module.exports = router;
