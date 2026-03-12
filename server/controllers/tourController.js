const TourRequest = require('../models/TourRequest');
const Property = require('../models/Property');
const { createNotification } = require('./notificationController');

exports.createTourRequest = async (req, res) => {
    try {
        const { propertyId, requestedDate, notes } = req.body;
        
        // Critical Fix 8: Backend date validation
        const requestDate = new Date(requestedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestDate < today) {
            return res.status(400).json({ message: 'Tour date must be in the future.' });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const existingRequest = await TourRequest.findOne({
            property: propertyId,
            requestedBy: req.user.id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending tour request for this property.' });
        }

        const tour = await TourRequest.create({
            property: propertyId,
            requestedBy: req.user.id,
            owner: property.owner,
            requestedDate,
            notes
        });

        // Notify Owner
        await createNotification(
            property.owner,
            'New Tour Request',
            `${req.user.name} has requested a tour of ${property.title}.`,
            'tour',
            '/profile'
        );

        res.status(201).json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyTours = async (req, res) => {
    try {
        const tours = await TourRequest.find({ requestedBy: req.user.id })
            .populate('property', 'title location images')
            .sort({ requestedDate: 1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReceivedTours = async (req, res) => {
    try {
        const tours = await TourRequest.find({ owner: req.user.id })
            .populate('property', 'title location images')
            .populate('requestedBy', 'name email phone')
            .sort({ requestedDate: 1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.confirmTour = async (req, res) => {
    try {
        const tour = await TourRequest.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Tour request not found' });

        if (tour.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        tour.status = 'confirmed';
        await tour.save();

        await createNotification(
            tour.requestedBy,
            'Tour Confirmed!',
            `Your tour request has been confirmed by the owner.`,
            'tour',
            '/profile'
        );

        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
