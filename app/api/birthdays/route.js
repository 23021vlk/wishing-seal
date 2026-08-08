import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";
import { sanitize, slugify, generateId, DEFAULT_MESSAGE } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "@/lib/theme";

const ALLOWED_THEME = ["midnight", "golden", "pastel", "galaxy"];
const ALLOWED_INTENSITY = ["subtle", "balanced", "extra"];
const ALLOWED_PACING = ["quick", "cinematic", "slow"];
const ALLOWED_PARTICLES = ["confetti", "stars", "hearts", "mixed"];

function cleanSettings(input) {
  const s = { ...DEFAULT_SETTINGS, ...(input || {}) };
  return {
    theme: ALLOWED_THEME.includes(s.theme) ? s.theme : "midnight",
    intensity: ALLOWED_INTENSITY.includes(s.intensity) ? s.intensity : "balanced",
    pacing: ALLOWED_PACING.includes(s.pacing) ? s.pacing : "cinematic",
    particles: ALLOWED_PARTICLES.includes(s.particles) ? s.particles : "confetti",
  };
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_MUSIC_BYTES = 8 * 1024 * 1024;

function decodeDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || "");
  if (!match) return null;
  return { contentType: match[1], buffer: Buffer.from(match[2], "base64") };
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, message, photoBase64, musicBase64, musicName, settings } = body || {};
  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "The birthday person's name is required." }, { status: 400 });
  }

  const supabase = supabaseServer();
  const id = generateId(8);
  const slug = slugify(name);

  let photo_url = null;
  let music_url = null;

  try {
    if (photoBase64) {
      const decoded = decodeDataUrl(photoBase64);
      if (!decoded || !decoded.contentType.startsWith("image/")) {
        return NextResponse.json({ error: "Photo must be an image file." }, { status: 400 });
      }
      if (decoded.buffer.length > MAX_PHOTO_BYTES) {
        return NextResponse.json({ error: "Photo is too large (max 5MB)." }, { status: 400 });
      }
      const path = `${id}/photo.jpg`;
      const { error } = await supabase.storage
        .from("photos")
        .upload(path, decoded.buffer, { contentType: decoded.contentType, upsert: true });
      if (error) throw error;
      photo_url = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
    }

    if (musicBase64) {
      const decoded = decodeDataUrl(musicBase64);
      if (!decoded || !decoded.contentType.startsWith("audio/")) {
        return NextResponse.json({ error: "Music must be an audio file." }, { status: 400 });
      }
      if (decoded.buffer.length > MAX_MUSIC_BYTES) {
        return NextResponse.json({ error: "That track is too large (max 8MB)." }, { status: 400 });
      }
      const ext = decoded.contentType.split("/")[1]?.split(";")[0] || "mp3";
      const path = `${id}/track.${ext}`;
      const { error } = await supabase.storage
        .from("music")
        .upload(path, decoded.buffer, { contentType: decoded.contentType, upsert: true });
      if (error) throw error;
      music_url = supabase.storage.from("music").getPublicUrl(path).data.publicUrl;
    }

    const owner_token = randomUUID();
    const { error: insertError } = await supabase.from("birthdays").insert({
      id,
      slug,
      name: sanitize(name.trim(), 60),
      message: sanitize((message || "").trim() || DEFAULT_MESSAGE, 600),
      photo_url,
      music_url,
      music_name: musicName ? sanitize(musicName, 120) : null,
      settings: cleanSettings(settings),
      owner_token,
    });
    if (insertError) throw insertError;

    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const res = NextResponse.json({ id, slug, link: `${site}/b/${slug}-${id}` });
    res.cookies.set(`owner_${id}`, owner_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save your surprise. Please try again." }, { status: 500 });
  }
}
