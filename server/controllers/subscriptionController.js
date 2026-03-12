const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { createNotification } = require('../utils/notifications');

const PLANS = {
  Standard: { price: 999,  days: 30 },
  Premium:  { price: 2999, days: 30 },
};

// ── CREATE ORDER ──────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan selected' });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
      return res.status(500).json({ message: 'Payment gateway not configured' });

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount:   PLANS[plan].price * 100,
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    });

    await Payment.create({
      user: req.user._id, plan,
      amount: PLANS[plan].price,
      razorpayOrderId: order.id,
      status: 'created',
    });

    res.json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      plan,
    });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Failed to create order: ' + err.message });
  }
};

// ── VERIFY PAYMENT ────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + PLANS[plan].days);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { subscriptionPlan: plan, subscriptionExpiry: expiry, razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' }
    );

    await createNotification(
      req.user._id,
      `🎉 Upgraded to ${plan}!`,
      `Your ${plan} plan is active until ${expiry.toLocaleDateString('en-IN')}.`,
      'payment', '/dashboard'
    );

    res.json({
      success: true,
      message: `Upgraded to ${plan}!`,
      user: { subscriptionPlan: updated.subscriptionPlan, subscriptionExpiry: updated.subscriptionExpiry },
    });
  } catch (err) {
    console.error('verifyPayment error:', err);
    res.status(500).json({ message: 'Verification failed: ' + err.message });
  }
};

// ── PAYMENT HISTORY ───────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    res.json(await Payment.find({ user: req.user._id }).sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
