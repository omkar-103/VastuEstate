require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');
const Message = require('./models/Message');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas...');

    // Clean start
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Notification.deleteMany({}),
      Payment.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log('🗑️  Database cleared.');

    // ── CREATE ADMIN ────────────────────────────────────────────────
    const admin = await User.create({
      name: 'Vastu Admin', email: 'admin@vastu.com', password: 'password123', role: 'admin'
    });
    console.log('👑 Admin created: admin@vastu.com / password123');

    // ── CREATE OWNERS ───────────────────────────────────────────────
    const owner1 = await User.create({
      name: 'Raj Properties', email: 'owner@vastu.com', password: 'password123',
      role: 'owner', isVerified: true, company: 'Raj Real Estate Pvt Ltd', phone: '9876543210'
    });
    const owner2 = await User.create({
      name: 'Priya Builders', email: 'priya@vastu.com', password: 'password123',
      role: 'owner', isVerified: true, company: 'Priya Construction Co.', phone: '9988776655'
    });
    console.log('🏢 Owners created');

    // ── CREATE USERS ────────────────────────────────────────────────
    const userFree = await User.create({
      name: 'Swayam More', email: 'swayam111', password: '77HvWxQi2Ek7kchb',
      role: 'user', subscriptionPlan: 'Free', phone: '9112233445'
    });
    const userStandard = await User.create({
      name: 'Ankit Sharma', email: 'user@vastu.com', password: 'password123',
      role: 'user', subscriptionPlan: 'Free', phone: '9223344556'
    });
    const userPremium = await User.create({
      name: 'Sneha Gupta', email: 'premium@vastu.com', password: 'password123',
      role: 'user', subscriptionPlan: 'Premium',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      phone: '9334455667'
    });
    console.log('👥 Users created');

    // ── CREATE INDIAN PROPERTIES ────────────────────────────────────
    const properties = [
      // ── FREE TIER (visible to everyone) ──
      {
        title: 'Modern 2BHK in Andheri West',
        description: 'Spacious 2BHK apartment with modular kitchen, vitrified flooring, and 24/7 water supply. Walking distance to Andheri Metro station. Ideal for young professionals.',
        price: 25000, priceType: 'rent',
        location: { address: 'Lokhandwala Complex, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053' },
        type: 'Residential',
        features: { bedrooms: 2, bathrooms: 2, area: '850 sqft', parking: 1 },
        media: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Free',
      },
      {
        title: 'Cozy 1BHK Near Hinjewadi IT Park',
        description: 'Fully furnished 1BHK apartment near Hinjewadi Phase 1. Perfect for IT professionals. Includes AC, geyser, and washing machine.',
        price: 14000, priceType: 'rent',
        location: { address: 'Wakad, Near Hinjewadi', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
        type: 'Residential',
        features: { bedrooms: 1, bathrooms: 1, area: '550 sqft', parking: 0 },
        media: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Furnished', 'AC', 'Geyser', 'Security'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Free',
      },
      {
        title: 'Budget Studio Apartment in Whitefield',
        description: 'Compact studio apartment in the heart of Whitefield IT corridor. Close to ITPL and Forum Shantiniketan Mall.',
        price: 12000, priceType: 'rent',
        location: { address: 'ITPL Main Road, Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066' },
        type: 'Residential',
        features: { bedrooms: 1, bathrooms: 1, area: '400 sqft', parking: 0 },
        media: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Security', 'Power Backup', 'Water Supply'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Free',
      },
      {
        title: '2BHK Independent Floor in Sector 62',
        description: 'Newly built independent floor with car parking. Close to Noida City Centre Metro and sector markets.',
        price: 18000, priceType: 'rent',
        location: { address: 'Block A, Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
        type: 'Residential',
        features: { bedrooms: 2, bathrooms: 2, area: '950 sqft', parking: 1 },
        media: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Parking', 'Park', 'Market Nearby'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Free',
      },

      // ── STANDARD TIER ──
      {
        title: 'Luxury 3BHK in Bandra West',
        description: 'Premium sea-facing 3BHK apartment in Pali Hill, Bandra West. Italian marble flooring, modular kitchen with chimney, and panoramic sea views.',
        price: 85000, priceType: 'rent',
        location: { address: 'Pali Hill, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
        type: 'Residential',
        features: { bedrooms: 3, bathrooms: 3, area: '1800 sqft', parking: 2 },
        media: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Concierge', 'Valet Parking', 'Club House'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Standard',
      },
      {
        title: 'Furnished Office in Cyber City',
        description: 'Plug-and-play office space in DLF Cyber City, Gurgaon. Comes with 20 workstations, conference room, pantry, and dedicated parking.',
        price: 120000, priceType: 'rent',
        location: { address: 'DLF Cyber City, Phase 2', city: 'Gurgaon', state: 'Haryana', pincode: '122002' },
        type: 'Commercial',
        features: { bedrooms: 0, bathrooms: 2, area: '2500 sqft', parking: 5 },
        media: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
        amenities: ['AC', 'Furnished', 'Cafeteria', 'Conference Room', 'High Speed Internet', 'Power Backup'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Standard',
      },
      {
        title: 'Spacious 3BHK Villa in Koramangala',
        description: 'Independent villa with private garden in Koramangala 5th Block. Ideal for families. Close to schools, hospitals and restaurants.',
        price: 65000, priceType: 'rent',
        location: { address: '5th Block, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095' },
        type: 'Residential',
        features: { bedrooms: 3, bathrooms: 3, area: '2200 sqft', parking: 2 },
        media: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Garden', 'Terrace', 'Parking', 'Servant Room', 'Modular Kitchen'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Standard',
      },
      {
        title: '2BHK with Rooftop Terrace in Connaught Place',
        description: 'Charming 2BHK apartment with private rooftop terrace in the heart of Delhi. Heritage building with modern interiors.',
        price: 45000, priceType: 'rent',
        location: { address: 'Connaught Place, Block B', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
        type: 'Residential',
        features: { bedrooms: 2, bathrooms: 2, area: '1200 sqft', parking: 1 },
        media: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Rooftop Terrace', 'Metro Nearby', 'Market Access', 'Security'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Standard',
      },

      // ── PREMIUM TIER ──
      {
        title: 'Sea-View Penthouse in Worli',
        description: 'Ultra-luxury 4BHK penthouse in Worli Seaface with 360° views of the Arabian Sea. Private terrace, infinity pool, and home automation system.',
        price: 500000, priceType: 'rent',
        location: { address: 'Worli Seaface Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400018' },
        type: 'Penthouse',
        features: { bedrooms: 4, bathrooms: 5, area: '5500 sqft', parking: 3 },
        media: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Private Pool', 'Home Automation', 'Concierge', 'Sea View', 'Helipad Access', 'Private Elevator'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Premium', isVerified: true,
      },
      {
        title: 'Premium Villa in Jubilee Hills',
        description: 'Sprawling 5BHK villa in the most prestigious locality of Hyderabad. Landscaped garden, swimming pool, and dedicated staff quarters.',
        price: 250000, priceType: 'rent',
        location: { address: 'Road No. 36, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
        type: 'Residential',
        features: { bedrooms: 5, bathrooms: 6, area: '8000 sqft', parking: 4 },
        media: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Swimming Pool', 'Landscaped Garden', 'Staff Quarters', 'Home Theatre', 'Gym', 'Security'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Premium', isVerified: true,
      },
      {
        title: 'Commercial Plot on MG Road',
        description: 'Prime commercial plot on MG Road, Bangalore. Ideal for retail showroom, restaurant, or boutique hotel. High footfall area.',
        price: 350000, priceType: 'rent',
        location: { address: 'MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        type: 'Plot',
        features: { bedrooms: 0, bathrooms: 0, area: '4000 sqft', parking: 10 },
        media: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Prime Location', 'High Footfall', 'Metro Access', 'Clearance Ready'],
        owner: owner1._id, status: 'Approved', visibilityTier: 'Premium', isVerified: true,
      },
      {
        title: 'Smart Home 3BHK in OMR',
        description: 'Fully automated smart home in Sholinganallur. Voice-controlled lighting, smart locks, and EV charging point. Gated community with club house.',
        price: 55000, priceType: 'rent',
        location: { address: 'Sholinganallur, OMR', city: 'Chennai', state: 'Tamil Nadu', pincode: '600119' },
        type: 'Residential',
        features: { bedrooms: 3, bathrooms: 3, area: '1650 sqft', parking: 2 },
        media: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Smart Home', 'EV Charging', 'Club House', 'Children Play Area', 'Gym', 'Swimming Pool'],
        owner: owner2._id, status: 'Approved', visibilityTier: 'Premium', isVerified: true,
      },
    ];

    await Property.insertMany(properties);
    console.log(`🏠 ${properties.length} Indian properties seeded!`);
    console.log('\n────────────────────────────────────────');
    console.log('  LOGIN CREDENTIALS:');
    console.log('  Admin:   admin@vastu.com / password123');
    console.log('  Owner1:  owner@vastu.com / password123');
    console.log('  Owner2:  priya@vastu.com / password123');
    console.log('  User:    swayam111 / 77HvWxQi2Ek7kchb');
    console.log('  User2:   user@vastu.com / password123');
    console.log('  Premium: premium@vastu.com / password123');
    console.log('────────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
