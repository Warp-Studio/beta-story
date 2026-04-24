import { Router } from 'express';
import { pool } from '../db/index.js';
import { sendLeadNotification } from '../services/email.js';

const router = Router();

const VALID_PLANS = ['Starter', 'Pro', 'Premium'];

router.post('/', async (req, res) => {
  const { names, phone, email, wedding_date, plan } = req.body;

  if (!names?.trim() || !phone?.trim() || !email?.trim() || !plan) {
    return res.status(400).json({ error: 'names, phone, email and plan are required' });
  }
  if (!VALID_PLANS.includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO leads (names, phone, email, wedding_date, plan)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [names.trim(), phone.trim(), email.trim(), wedding_date || null, plan]
    );

    const lead = rows[0];

    // Fire-and-forget — a failed email must not fail the request
    sendLeadNotification(lead).catch(err =>
      console.error('Lead notification email failed:', err.message)
    );

    return res.status(201).json({ id: lead.id });
  } catch (err) {
    console.error('Lead insert error:', err.message);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
});

export default router;
