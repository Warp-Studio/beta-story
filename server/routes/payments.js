import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { pool } from '../db/index.js';
import { sendPaymentConfirmation } from '../services/email.js';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Amounts in paise (₹1 = 100 paise)
const PLAN_AMOUNTS = {
  Starter: 199900,
  Pro:     599900,
  Premium: 2999900,
};

// POST /api/payments/create-order
// Body: { lead_id, plan }
// Creates a Razorpay order and records it in the DB.
router.post('/create-order', async (req, res) => {
  const { lead_id, plan } = req.body;

  if (!lead_id || !plan || !PLAN_AMOUNTS[plan]) {
    return res.status(400).json({ error: 'lead_id and a valid plan are required' });
  }

  const { rows } = await pool.query('SELECT id FROM leads WHERE id = $1', [lead_id]);
  if (!rows.length) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNTS[plan],
      currency: 'INR',
      receipt: lead_id,
    });

    await pool.query(
      `INSERT INTO payments (lead_id, razorpay_order_id, amount, plan)
       VALUES ($1, $2, $3, $4)`,
      [lead_id, order.id, PLAN_AMOUNTS[plan], plan]
    );

    return res.json({
      order_id: order.id,
      amount: PLAN_AMOUNTS[plan],
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the HMAC signature from Razorpay, marks payment as paid.
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE payments
       SET razorpay_payment_id = $1, status = 'paid'
       WHERE razorpay_order_id = $2
       RETURNING lead_id, amount, plan`,
      [razorpay_payment_id, razorpay_order_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    const payment = rows[0];
    const { rows: leadRows } = await pool.query(
      'SELECT * FROM leads WHERE id = $1',
      [payment.lead_id]
    );

    if (leadRows.length) {
      sendPaymentConfirmation(leadRows[0], payment).catch(err =>
        console.error('Payment confirmation email failed:', err.message)
      );
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Verify error:', err.message);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;
