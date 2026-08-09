import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sanitize, DEFAULT_MESSAGE } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "@/lib/theme";

const ALLOWED_THEME = ["midnight", "golden", "pastel", "galaxy", "roseGold", "ocean", "neon", "ivory"];
const ALLOWED_INTENSITY = ["subtle", "balanced", "extra"];
const ALLOWED_PACING = ["quick", "cinematic", "slow"];
const ALLOWED_PARTICLES = ["confetti", "stars", "hearts", "mixed"];
const ALLOWED_RELATION = ["sister","brother","girlfriend","boyfriend","mom","dad","friend","relative","junior","senior","general"];
const ALLOWED_FRAME = ["circle","rounded","heart"];

function cleanSettings(input) {
  const s = { ...DEFAULT_SETTINGS, ...(input || {}) };
  return {
    theme: ALLOWED_THEME.includes(s.theme) ? s.theme : "midnight",
    intensity: ALLOWED_INTENSITY.includes(s.intensity) ? s.intensity : "balanced",
    pacing: ALLOWED_PACING.includes(s.pacing) ? s.pacing : "cinematic",
    particles: ALLOWED_PARTICLES.includes(s.particles) ? s.particles : "confetti",
    interactive: s.interactive === false ? false : true,
    relation: ALLOWED_RELATION.includes(s.relation) ? s.relation : "general",
    frame: ALLOWED_FRAME.includes(s.frame) ? s.frame : "circle",
  };
}

function decodeDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || "");
  if (!match) return null;
  return { contentType: match[1], buffer: Buffer.from(match[2], "base64") };
}

function checkOwner(req, id) {
  const cookie = req.cookies.get(`owner_${id}`);
  return cookie?.value || null;
}

export async function GET(req, { params }) {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("birthdays").select("*").eq("id", params.id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { owner_token, ...safe } = data;
  return NextResponse.json(safe);
}

export async function PATCH(req, { params }) {
  const supabase = supabaseServer();
  const { data: existing, error: findError } = await supabase
    .from("birthdays")
    .select("owner_token")
    .eq("id", params.id)
    .single();
  if (findError || !existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ownerCookie = checkOwner(req, params.id);
  if (!ownerCookie || ownerCookie !== existing.owner_token) {
    return NextResponse.json({ error: "You can only edit a surprise you created." }, { status: 403 });
  }

  const body = await req.json();
  const { name, message, photoBase64, musicBase64, musicName, removePhoto, removeMusic, settings } = body || {};
  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "The birthday person's name is required." }, { status: 400 });
  }

  const update = {
    name: sanitize(name.trim(), 60),
    message: sanitize((message || "").trim() || DEFAULT_MESSAGE, 600),
    settings: cleanSettings(settings),
    updated_at: new Date().toISOString(),
  };

  try {
    if (photoBase64) {
      const decoded = decodeDataUrl(photoBase64);
      if (decoded) {
        const path = `${params.id}/photo.jpg`;
        await supabase.storage.from("photos").upload(path, decoded.buffer, { contentType: decoded.contentType, upsert: true });
        update.photo_url = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      }
    } else if (removePhoto) {
      update.photo_url = null;
    }

    if (musicBase64) {
      const decoded = decodeDataUrl(musicBase64);
      if (decoded) {
        const ext = decoded.contentType.split("/")[1]?.split(";")[0] || "mp3";
        const path = `${params.id}/track.${ext}`;
        await supabase.storage.from("music").upload(path, decoded.buffer, { contentType: decoded.contentType, upsert: true });
        update.music_url = supabase.storage.from("music").getPublicUrl(path).data.publicUrl;
        update.music_name = musicName ? sanitize(musicName, 120) : null;
      }
    } else if (removeMusic) {
      update.music_url = null;
      update.music_name = null;
    }

    const { error } = await supabase.from("birthdays").update(update).eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const supabase = supabaseServer();
  const { data: existing, error: findError } = await supabase
    .from("birthdays")
    .select("owner_token")
    .eq("id", params.id)
    .single();
  if (findError || !existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ownerCookie = checkOwner(req, params.id);
  if (!ownerCookie || ownerCookie !== existing.owner_token) {
    return NextResponse.json({ error: "You can only delete a surprise you created." }, { status: 403 });
  }

  await supabase.storage.from("photos").remove([`${params.id}/photo.jpg`]);
  await supabase.storage
    .from("music")
    .list(params.id)
    .then(({ data }) => data?.length && supabase.storage.from("music").remove(data.map((f) => `${params.id}/${f.name}`)));

  const { error } = await supabase.from("birthdays").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
