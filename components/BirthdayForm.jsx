"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Gift, Image as ImageIcon, Music as MusicIcon, Upload, X, Settings2, ChevronDown } from "lucide-react";
import BirthdayExperience from "./BirthdayExperience";
import { DEFAULT_MESSAGE, unescapeHtml } from "@/lib/utils";
import { THEMES, INTENSITY, PACING, PARTICLE_MIX, RELATIONS, FRAMES, DEFAULT_SETTINGS, themeOf } from "@/lib/theme";

function resizeImage(file, maxW = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    if (file.size > 12 * 1024 * 1024) return reject(new Error("Photo is too large (max 12MB)."));
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target.result);
    reader.onerror = () => reject(new Error("Could not read that photo."));
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}

function fileToDataURL(file, maxBytes = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("audio/")) return reject(new Error("Please choose an audio file."));
    if (file.size > maxBytes) return reject(new Error("That track is too large (max 8MB — try a shorter clip)."));
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Could not read that track."));
    reader.readAsDataURL(file);
  });
}

export default function BirthdayForm({ editData }) {
  const router = useRouter();
  const [name, setName] = useState(editData ? unescapeHtml(editData.name) : "");
  const editDataDefault = editData ? RELATIONS[editData.settings?.relation]?.defaultMessage || DEFAULT_MESSAGE : DEFAULT_MESSAGE;
  const [message, setMessage] = useState(
    editData?.message && editData.message !== editDataDefault ? unescapeHtml(editData.message) : ""
  );
  const [photo, setPhoto] = useState(editData?.photo_url || null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [musicData, setMusicData] = useState(editData?.music_url || null);
  const [musicChanged, setMusicChanged] = useState(false);
  const [musicName, setMusicName] = useState(editData?.music_name || "");
  const [settings, setSettings] = useState(editData?.settings || DEFAULT_SETTINGS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const photoInput = useRef(null);
  const musicInput = useRef(null);
  const theme = themeOf(settings);
  const setS = (key, val) => setSettings((s) => ({ ...s, [key]: val }));
  const pickRelation = (key) => {
    // Picking a relation also switches theme, particle mix, and photo frame to
    // that relation's defaults — still fully overridable below.
    const r = RELATIONS[key];
    setSettings((s) => ({ ...s, relation: key, theme: r.theme, particles: r.particles, frame: r.frame }));
  };
  const relationDefault = RELATIONS[settings.relation]?.defaultMessage || DEFAULT_MESSAGE;

  const handlePhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    try {
      setPhoto(await resizeImage(f));
      setPhotoChanged(true);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleMusic = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    try {
      setMusicData(await fileToDataURL(f));
      setMusicName(f.name);
      setMusicChanged(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const canSubmit = name.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) {
      setError("The birthday person's name is required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const payload = { name: name.trim(), message: message.trim() || relationDefault, musicName, settings };
      if (photoChanged) payload.photoBase64 = photo;
      if (!photo && editData?.photo_url) payload.removePhoto = true;
      if (musicChanged) payload.musicBase64 = musicData;
      if (!musicData && editData?.music_url) payload.removeMusic = true;

      const url = editData ? `/api/birthdays/${editData.id}` : "/api/birthdays";
      const res = await fetch(url, {
        method: editData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      router.push(editData ? `/result/${editData.id}` : `/result/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10 transition-[background] duration-700"
        style={{ background: theme.bg }}
      />
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] md:max-w-[560px] mx-auto px-4 py-8 md:py-12">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${theme.gold}1a` }} />
        <div className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${theme.rose}1a` }} />

        <Brand theme={theme} />

        <div className="glass rounded-[26px] p-6 sm:p-7 md:p-9 shadow-glow relative">
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-center leading-tight mt-1 mb-2">
            {editData ? "Edit the surprise" : "Create a birthday surprise"}
          </h1>
          <p className="text-sm text-muted text-center leading-relaxed mb-5">
            Fill in a few details and we&apos;ll wrap them into a page only they&apos;ll see the way you meant it.
          </p>

          <label className="block text-xs font-semibold tracking-wide text-[#D9C6DF] mt-4 mb-1.5">
            Birthday person&apos;s name<span className="text-rose"> *</span>
          </label>
          <input
            className="w-full bg-black/20 border border-white/14 rounded-2xl px-3.5 py-3 text-[15px] outline-none focus:border-gold/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leela"
            maxLength={60}
          />

          <label className="block text-xs font-semibold tracking-wide text-[#D9C6DF] mt-5 mb-2">
            Who&apos;s it for? <span className="text-mutedDim font-normal">picks a matching look</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Object.entries(RELATIONS).map(([key, r]) => {
              const active = (settings.relation || "general") === key;
              const rTheme = THEMES[r.theme];
              return (
                <button
                  key={key}
                  onClick={() => pickRelation(key)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl border-[1.5px] transition-transform active:scale-95"
                  style={{
                    borderColor: active ? rTheme.gold : "rgba(255,255,255,0.12)",
                    background: active ? `${rTheme.gold}18` : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="text-lg leading-none">{r.icon}</span>
                  <span
                    className="text-[10px] font-semibold leading-tight text-center"
                    style={{ color: active ? rTheme.gold : "#8b7691" }}
                  >
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>

        <label className="block text-xs font-semibold tracking-wide text-[#D9C6DF] mt-5 mb-1.5">
          Personal message <span className="text-mutedDim font-normal">optional</span>
        </label>
        <textarea
          className="w-full bg-black/20 border border-white/14 rounded-2xl px-3.5 py-3 text-[15px] outline-none focus:border-gold/60 min-h-[100px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={relationDefault}
          maxLength={600}
        />

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div
            onClick={() => photoInput.current?.click()}
            className="border-[1.5px] border-dashed border-white/22 rounded-2xl min-h-[112px] flex flex-col items-center justify-center gap-1 cursor-pointer text-center p-2.5 bg-white/[0.03] relative"
          >
            <input ref={photoInput} type="file" accept="image/*" hidden onChange={handlePhoto} />
            {photo ? (
              <div className="relative w-full">
                <img src={photo} alt="" className="w-full h-[84px] object-cover rounded-xl" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    setPhotoChanged(true);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon size={22} color="#B79DBE" />
                <span className="text-xs font-semibold mt-0.5">Add a photo</span>
                <span className="text-[10.5px] text-mutedDim">optional</span>
              </>
            )}
          </div>

          <div
            onClick={() => musicInput.current?.click()}
            className="border-[1.5px] border-dashed border-white/22 rounded-2xl min-h-[112px] flex flex-col items-center justify-center gap-1 cursor-pointer text-center p-2.5 bg-white/[0.03] relative"
          >
            <input ref={musicInput} type="file" accept="audio/*" hidden onChange={handleMusic} />
            {musicData ? (
              <div className="relative w-full text-center">
                <MusicIcon size={22} color={theme.gold} className="mx-auto" />
                <div className="text-xs mt-1.5 break-words">{musicName || "Custom track"}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMusicData(null);
                    setMusicName("");
                    setMusicChanged(true);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={22} color="#B79DBE" />
                <span className="text-xs font-semibold mt-0.5">Add music</span>
                <span className="text-[10.5px] text-mutedDim">default tune otherwise</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full mt-4 flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#D9C6DF]"
        >
          <Settings2 size={14} /> Advanced settings
          <ChevronDown size={14} className="ml-auto transition-transform" style={{ transform: showAdvanced ? "rotate(180deg)" : "none" }} />
        </button>

        {showAdvanced && (
          <div className="mt-2.5 pt-1">
            <GroupLabel>Theme</GroupLabel>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(THEMES).map(([key, tm]) => (
                <button
                  key={key}
                  onClick={() => setS("theme", key)}
                  className="flex flex-col items-center gap-1.5 rounded-xl overflow-hidden border-[1.5px] transition-transform active:scale-95"
                  style={{ borderColor: settings.theme === key ? tm.gold : "rgba(255,255,255,0.14)" }}
                >
                  <span
                    className="w-full h-10 flex items-end justify-center pb-1"
                    style={{ background: tm.bg }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: tm.gold, boxShadow: `0 0 6px 1px ${tm.gold}` }} />
                  </span>
                  <span className="text-[9.5px] font-medium pb-1.5" style={{ color: settings.theme === key ? tm.gold : "#B79DBE" }}>
                    {tm.label}
                  </span>
                </button>
              ))}
            </div>

            <GroupLabel>Animation intensity</GroupLabel>
            <PillRow options={INTENSITY} current={settings.intensity} onPick={(k) => setS("intensity", k)} theme={theme} />

            <GroupLabel>Reveal pacing</GroupLabel>
            <PillRow options={PACING} current={settings.pacing} onPick={(k) => setS("pacing", k)} theme={theme} />

            <GroupLabel>Particle style</GroupLabel>
            <PillRow options={PARTICLE_MIX} current={settings.particles} onPick={(k) => setS("particles", k)} theme={theme} />

            <GroupLabel>Photo frame</GroupLabel>
            <PillRow options={FRAMES} current={settings.frame || "circle"} onPick={(k) => setS("frame", k)} theme={theme} />

            <GroupLabel>Interaction</GroupLabel>
            <button
              onClick={() => setS("interactive", !(settings.interactive !== false))}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-3 border text-left"
              style={{
                background: settings.interactive !== false ? `${theme.gold}14` : "rgba(255,255,255,0.03)",
                borderColor: settings.interactive !== false ? `${theme.gold}55` : "rgba(255,255,255,0.12)",
              }}
            >
              <span>
                <span className="block text-xs font-semibold" style={{ color: settings.interactive !== false ? theme.gold : "#F3E9EF" }}>
                  Tap-to-advance
                </span>
                <span className="block text-[10.5px] text-mutedDim mt-0.5">
                  Lets them tap the screen to skip ahead instead of only waiting on the timer
                </span>
              </span>
              <span
                className="w-9 h-5 rounded-full relative shrink-0 ml-3"
                style={{ background: settings.interactive !== false ? theme.gold : "rgba(255,255,255,0.18)" }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-[#170a20] transition-all"
                  style={{ left: settings.interactive !== false ? 18 : 2 }}
                />
              </span>
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3.5 text-xs text-[#FF9AA8] bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!canSubmit}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-sm font-semibold bg-white/8 border border-white/16"
          >
            <Eye size={16} /> Preview
          </button>
          <button
            onClick={submit}
            disabled={busy || !canSubmit}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#241203]"
            style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.rose})` }}
          >
            {busy ? "Saving…" : (
              <>
                <Gift size={16} /> {editData ? "Save changes" : "Create Birthday Surprise"}
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center z-[60]"
          >
            <X size={18} />
          </button>
          <div className="w-full max-w-md">
            <BirthdayExperience
              record={{
                name: name.trim() || "Friend",
                message: message.trim() || relationDefault,
                photoUrl: photo,
                musicUrl: musicData,
                settings,
              }}
              isPreview
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
}

function Brand({ theme }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-3">
      <span style={{ color: theme.gold }}>✦</span>
      <span className="font-display italic text-xl md:text-2xl tracking-wide">VLKify</span>
    </div>
  );
}

function GroupLabel({ children }) {
  return <div className="text-[11px] text-mutedDim font-bold tracking-wide uppercase mt-3.5 mb-2">{children}</div>;
}

function PillRow({ options, current, onPick, theme }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(options).map(([key, v]) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onPick(key)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={
              active
                ? { background: `${theme.gold}22`, borderColor: theme.gold, color: theme.gold }
                : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "#B79DBE" }
            }
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
