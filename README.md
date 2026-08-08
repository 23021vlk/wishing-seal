# Wishing Seal 🎂

A personalized, cinematic birthday-surprise page generator. Create a page for someone,
get one shareable link, and they open it to an animated reveal — their name, photo,
your message, confetti, and music, wrapped like a sealed letter.

## Stack

Next.js 14 (App Router) · Supabase (Postgres + Storage) · Tailwind CSS · deployed on Vercel.

## 1 — Set up Supabase (5 min)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
3. Go to **Storage** → create two **public** buckets: `photos` and `music`.
4. Go to **Project Settings → API** and copy the **Project URL** and the
   **`service_role` secret key** (not the `anon` key — this app only uses the service
   role, server-side, so end users never touch the database directly).

## 2 — Run it locally

```bash
npm install
cp .env.local.example .env.local   # fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Open http://localhost:3000.

## 3 — Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Under **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://<your-vercel-domain>.vercel.app` (update this once
     you attach a custom domain, and redeploy)
4. Click **Deploy**.

Generated links will look like `https://yourdomain.com/b/priyanka-a1b2c3d4` — one domain,
unlimited unique birthday pages, exactly as specced.

## How it works

- `/` — the creation form (name, message, photo, music, live preview, and an **Advanced
  settings** panel: theme, animation intensity, reveal pacing, particle style).
- `POST /api/birthdays` — validates input, uploads photo/music to Supabase Storage,
  inserts the row (including the chosen `settings`), and sets an `httpOnly` cookie so
  only the creator's browser can later edit or delete this specific page.
- `/result/[id]` — shows the generated link with Copy / Share / Preview / Edit / Delete.
- `/b/[slug]` — the public recipient page. Server-rendered, so it loads fast and works
  as a proper shareable link (correct Open Graph title too).
- `/edit/[id]` and `PATCH /api/birthdays/[id]` — update a page (owner-cookie protected).
- If no music is uploaded, the reveal plays a short synthesized "Happy Birthday" tune
  client-side (via Tone.js) instead of shipping a licensed MP3.
- If no photo is uploaded, a glowing party-popper icon fills that beat of the reveal
  instead, so the experience always feels complete.

## Advanced settings

Each surprise carries its own `settings` object, chosen in the creation form and stored
alongside it (validated server-side against an allow-list so a tampered request can't
inject arbitrary values):

- **Theme** — Midnight Romance / Golden Hour / Pastel Dream / Galaxy Night. Recolors the
  whole experience: background gradients, gold/rose accents, particle hues.
- **Animation intensity** — Subtle / Balanced / Extra. Controls particle count and fall
  speed for the confetti and sparkle field.
- **Reveal pacing** — Quick / Cinematic / Slow burn. Stretches or compresses the timing
  between each stage of the reveal.
- **Particle style** — Confetti / Stars & sparkles / Hearts / Everything.

## The reveal sequence

1. **Envelope intro** — a wax-sealed envelope; tapping it plays a 3D flap-opening
   animation before the letter slides out.
2. **Name reveal** — the title fades in word-by-word with a soft blur-to-focus stagger.
3. **Photo** — pops in with a shine-sweep highlight across the frame (skipped gracefully
   if no photo was uploaded).
4. **Message** — same staggered word reveal, over a floating heart.
5. **Final** — the closing line with a slow glowing pulse, plus a Replay button.

Confetti/star/heart particles fall with per-particle rotation and horizontal drift, and a
twinkling sparkle field runs underneath the whole sequence for depth.

## Security notes already handled

- File type and size are validated **server-side** in the API route (not just the
  `accept` attribute, which is only a UI hint).
- All text is HTML-escaped before it's stored.
- The Supabase **service role key** is only ever read inside `app/api/**` and
  `lib/supabaseServer.js` — it is never imported into a `"use client"` file, so it
  never reaches the browser bundle.
- Edit/delete require an `httpOnly` cookie matching the row's `owner_token`; there's no
  way to edit someone else's page just by knowing its id.

## Extending it further

- Swap the synthesized default tune for a licensed royalty-free MP3 in `public/audio/`
  if you'd rather ship a real recording.
- Add rate limiting (e.g. Vercel's built-in or `@upstash/ratelimit`) on
  `POST /api/birthdays` if you expect public, unauthenticated traffic.
- Re-encode uploaded photos server-side (e.g. with `sharp`) to strip EXIF data before
  storing, for extra safety with user uploads.
