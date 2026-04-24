import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import leadsRouter    from './routes/leads.js';
import paymentsRouter from './routes/payments.js';
import rsvpRouter     from './routes/rsvp.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4321' }));
app.use(express.json());

// 5 lead submissions per IP per hour
const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many submissions from this IP, please try again later.' },
});

// 10 payment attempts per IP per hour
const paymentsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many payment attempts from this IP, please try again later.' },
});

// 20 RSVP submissions per IP per hour
const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many submissions from this IP, please try again later.' },
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/leads',    leadsLimiter,    leadsRouter);
app.use('/api/payments', paymentsLimiter, paymentsRouter);
app.use('/api/rsvp',     rsvpLimiter,     rsvpRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
