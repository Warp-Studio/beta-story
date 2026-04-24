-- Run this once against your database: psql $DATABASE_URL -f server/db/schema.sql
-- Re-running is safe — all statements use CREATE TABLE IF NOT EXISTS

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS leads (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  names        TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  wedding_date DATE,
  plan         TEXT        NOT NULL CHECK (plan IN ('Starter', 'Pro', 'Premium')),
  status       TEXT        NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT        NOT NULL,
  name        TEXT        NOT NULL,
  phone       TEXT,
  attending   TEXT        NOT NULL CHECK (attending IN ('yes', 'no', 'maybe')),
  guests      INTEGER     NOT NULL DEFAULT 1,
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id              UUID        REFERENCES leads(id),
  razorpay_order_id    TEXT        UNIQUE NOT NULL,
  razorpay_payment_id  TEXT        UNIQUE,
  amount               INTEGER     NOT NULL,  -- in paise (₹1 = 100 paise)
  currency             TEXT        NOT NULL DEFAULT 'INR',
  plan                 TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
