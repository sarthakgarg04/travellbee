# Travell Bee — Phase 1

Lead-capture travel booking site for **travellbee.com** (Travell Bee
Holidays, Indore): destinations, packages with day-by-day itineraries, an
enquiry form (no online payment yet — that's Phase 2), and a lightweight
admin page to manage incoming leads.

## Design direction

Built around the brand name itself instead of a generic travel template:

- **Signature element**: a honeycomb visual system — cards use soft
  hex-clipped corners (`.ticket-stub`), destination photos sit inside a true
  hexagon frame (`.hex-frame`), and the hero sits on a subtle honeycomb dot
  texture (`.honeycomb-bg`). One idea, reused everywhere.
- **Bee's route**: the package itinerary renders as a dotted path with
  waypoint dots — the same idea as a bee moving from flower to flower,
  applied to a day-by-day trip.
- **Logo**: a simple inline SVG bee mark + wordmark, `components/Logo.js`
  — swap this for the client's real Instagram logo art whenever it's
  available (drop an SVG/PNG in `/public` and update `Logo.js`).
- **Palette**: honey `#F5A623`, rust `#B85C1E`, hive (near-black) `#1F1710`,
  wax (cream bg) `#FFFBF0`, clover (green accent) `#3E7C4A` — set in
  `tailwind.config.js`.
- **Type**: Sora (display/headlines, modern geometric sans), Inter (body),
  Space Mono (small tag/label text).

> Note: I couldn't pull the exact colors/logo from the Instagram page
> directly (Instagram blocks automated fetches). This palette is a
> deliberate direction built from the "Travell Bee" name — if you can
> export the real logo file or share brand colors already in use on social,
> send them over and I'll match them exactly.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database** — create a free Postgres DB at
   [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech),
   copy the connection string.

3. **Environment variables**
   ```bash
   cp .env.example .env
   # then fill in DATABASE_URL, and set ADMIN_USER / ADMIN_PASS
   ```

4. **Push the schema & seed sample data**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`. Admin leads dashboard is at
   `http://localhost:3000/admin` (Basic Auth — use ADMIN_USER/ADMIN_PASS).

## Deploying

Push this repo to GitHub, import it in [Vercel](https://vercel.com) (free
tier is plenty for 100–1000 visitors/day), add the same environment
variables in the Vercel project settings, and point `travellbee.com` at it
under Project → Settings → Domains.

## What's next (Phase 2, separate scope)

- Razorpay integration for online payment/booking confirmation
- AI chatbot (Claude/OpenAI API) trained on the packages in this same
  Postgres DB, so it can answer real pricing/itinerary questions
- User accounts, reviews, and a proper admin CRUD UI for packages
  (right now packages are added via `prisma/seed.js` or Prisma Studio —
  run `npm run prisma:studio` to edit data with a GUI)

## Editing content before launch

Until the Phase 2 admin CRUD UI is built, the easiest way to add/edit real
destinations and packages is:
```bash
npm run prisma:studio
```
This opens a spreadsheet-like GUI against your database at
`http://localhost:5555` — hand this to the client for now if they want to
add packages themselves, or keep editing `prisma/seed.js` and re-running
the seed command.
