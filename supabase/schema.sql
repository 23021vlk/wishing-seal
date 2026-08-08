-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

create extension if not exists "pgcrypto";

create table if not exists birthdays (
  id text primary key,
  slug text not null,
  name text not null,
  message text not null,
  photo_url text,
  music_url text,
  music_name text,
  settings jsonb not null default '{"theme":"midnight","intensity":"balanced","pacing":"cinematic","particles":"confetti"}'::jsonb,
  owner_token uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists birthdays_slug_idx on birthdays (slug);

alter table birthdays enable row level security;

-- Public can read (that's the point of a shareable link).
-- All writes happen only through the Next.js API routes using the
-- service role key, which bypasses RLS — so no write policy is needed here.
drop policy if exists "public read" on birthdays;
create policy "public read" on birthdays for select using (true);

-- ── Storage buckets ──────────────────────────────────────────────
-- Create these two buckets in Supabase → Storage → New bucket:
--   photos   (public bucket, no size/type restriction needed here —
--             the API route already validates type + size before upload)
--   music    (public bucket)
-- Public buckets allow public SELECT (read) automatically; inserts/
-- deletes still require the service role key used by the API routes,
-- so end users can never write directly to storage.
