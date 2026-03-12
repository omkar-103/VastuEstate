const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const { createNotification } = require('./notificationController');

exports.createEnquiry = async (req, res) => {
    try {
        const { propertyId, message } = req.body;
        
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const enquiry = await Enquiry.create({
            property: propertyId,
            from: req.user.id,
            to: property.owner,
            message
        });

        await createNotification(
            property.owner,
            'New Enquiry',
            `You received a new message for ${property.title}`,
            'enquiry',
            '/profile'
        );

        res.status(201).json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({ from: req.user.id })
            .populate('property', 'title')
            .populate('to', 'name')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReceivedEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({ to: req.user.id })
            .populate('property', 'title')
            .populate('from', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnquiryStats = async (req, res) => {
    try {
        const total = await Enquiry.countDocuments();
        const newCount = await Enquiry.countDocuments({ status: 'new' });
        res.json({ total, newCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
