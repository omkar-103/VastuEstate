const User = require('../models/User');

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedProperties');
        res.json(user.savedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.savedProperties.includes(req.body.propertyId)) {
            user.savedProperties.push(req.body.propertyId);
            await user.save();
        }
        res.json(user.savedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.savedProperties = user.savedProperties.filter(id => id.toString() !== req.params.id);
        await user.save();
        res.json(user.savedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
