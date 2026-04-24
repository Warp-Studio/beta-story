import { Router } from 'express';
import { pool } from '../db/index.js';

const router = Router();

router.post('/', async (req, res) => {
  const { template_id, name, phone, attending, guests, message } = req.body;

  const VALID_ATTENDING = ['yes', 'no', 'maybe'];
  if (!template_id?.trim() || !name?.trim() || !VALID_ATTENDING.includes(attending)) {
    return res.status(400).json({ error: "template_id, name, and attending ('yes'|'no'|'maybe') are required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO rsvps (template_id, name, phone, attending, guests, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        template_id.trim(),
        name.trim(),
        phone?.trim() || null,
        attending,
        Number(guests) || 1,
        message?.trim() || null,
      ]
    );
    return res.status(201).json({ id: rows[0].id });
  } catch (err) {
    console.error('RSVP insert error:', err.message);
    return res.status(500).json({ error: 'Failed to save RSVP' });
  }
});

export default router;
