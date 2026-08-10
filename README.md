# VLKify 🎂

A personalized, cinematic birthday-greeting generator. Pick who it's for, write a message
(or don't — it'll write something fitting), add a photo and music, and get one shareable
link. They open it to an animated reveal: an envelope that unseals, their name, photo,
your message, confetti, and music.

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
   - `NEXT_PUBLIC_SITE_URL` → your deployed domain (e.g. `https://vlkify.vercel.app`)
4. Click **Deploy**.

Generated links look like `https://vlkify.vercel.app/b/leela-a1b2c3d4` — one domain,
unlimited unique greeting pages.

## How it works

- `/` — the creation form: name, "who's it for," message, photo, music, live preview,
  and Advanced Settings.
- `POST /api/birthdays` — validates input, uploads photo/music to Supabase Storage,
  inserts the row, sets an `httpOnly` cookie so only the creator's browser can later
  edit or delete this specific page.
- `/result/[id]` — the generated link with Copy / Share / Preview / Edit / Delete, styled
  to match the chosen relation and theme.
- `/b/[slug]` — the public recipient page. Server-rendered for fast loads and a correct
  Open Graph title.
- `/edit/[id]` and `PATCH /api/birthdays/[id]` — update a page (owner-cookie protected).

## Music

If the creator doesn't upload a track, the reveal plays a bundled default recording —
`public/audio/default-happy-birthday.wav`, an original synthesized rendering of the
"Happy Birthday to You" melody (public domain in the US since 2016). It plays through a
plain HTML `<audio>` element, triggered directly inside the "Open it" tap — the same
reliable path used for custom uploads, and the most autoplay-policy-friendly way to start
audio on both mobile and desktop.

## Who's it for — relationship modes

Sister, Brother, Girlfriend, Boyfriend, Mom, Dad, Friend, Relative, Junior, Senior, or
Just because. Picking one auto-applies a matching theme, particle style, and photo frame
(hearts for girlfriend/boyfriend), and swaps in a message written for that relationship —
still fully editable.

## Advanced settings

- **Theme** — 8 options, each with a genuinely different palette: Midnight Romance,
  Golden Hour, Blush Mauve, Galaxy Night, Rose Gold, Ocean Breeze, Emerald Luxe, Classic
  Ivory. Changing it re-skins the whole app, not just the reveal screen.
- **Animation intensity** — Subtle / Balanced / Extra — particle count and speed.
- **Reveal pacing** — Quick / Cinematic / Slow burn.
- **Particle style** — Confetti / Stars & sparkles / Hearts / Everything.
- **Photo frame** — Circle / Rounded / Heart.
- **Tap-to-advance** — lets the recipient tap the screen to skip ahead instead of only
  waiting on the timer.

## Mobile

Uses `100dvh` (not `100vh`, which is wrong on mobile browsers with a collapsing address
bar), respects the iPhone notch/home-indicator via safe-area insets, scales text with
`clamp()` so nothing overflows on narrow screens, and disables the double-tap-zoom delay
and long-press callouts on buttons. Layout widens gracefully on tablet/laptop instead of
staying pinned to a narrow mobile column.

## Security notes already handled

- File type and size are validated **server-side** in the API route (not just the
  `accept` attribute, which is only a UI hint).
- All text is HTML-escaped before it's stored.
- The Supabase **service role key** is only ever read inside `app/api/**` and
  `lib/supabaseServer.js` — never imported into a `"use client"` file.
- Edit/delete require an `httpOnly` cookie matching the row's `owner_token`.
- `settings` values (theme, relation, etc.) are checked against an allow-list
  server-side, so a tampered request can't inject arbitrary values.
