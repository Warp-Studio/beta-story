# beta-story

To get started:

Copy env files and fill in your values:


cp .env.example .env
cp server/.env.example server/.env
Create the database tables (once):


psql $DATABASE_URL -f server/db/schema.sql
Run both servers (two terminals):


# Terminal 1 — frontend
npm run dev

# Terminal 2 — backend
cd server && npm run dev

Files created:

File	Purpose
src/data/templates.ts	Template registry — add new templates here with their defaults and colors
src/components/templates/FloralBlue.astro	First template (matches the invite in the image) — blue/navy, Arabic bismillah, gold ampersand, styled date block
src/components/CurtainReveal.astro	Curtain split-open animation using GSAP — left panel slides left, right panel slides right on tap
src/pages/preview/[template].astro	Full-screen preview page, client JS reads URL params and injects into data-field elements
src/pages/templates/index.astro	Gallery with live-updating iframes — type names/date and the preview updates in real time
How to share a preview link with a client:


/preview/floral-blue?partner1=Priya+Sharma&partner2=Arjun+Mehta&date=2025-11-14&time=6pm&venue=The+Grand+Palace&rsvp=9876543210
To add a new template:

Add an entry to src/data/templates.ts
Create src/components/templates/YourTemplate.astro
Add its render to the if block in src/pages/preview/[template].astro
For the floral corner images — the template expects PNG images at public/florals/corner-tl.png, corner-tr.png, etc. Drop in watercolor floral PNGs (like from the invite image) and they'll appear at the corners. Without them the invite still looks clean — just without the illustrated flowers.