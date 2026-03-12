const express = require('express');
const router = express.Router();
const { registerUser, registerOwner, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',       registerUser);
router.post('/register-owner', registerOwner);
router.post('/login',          login);
router.get('/me',              protect, getMe);
router.put('/profile',         protect, updateProfile);

module.exports = router;
