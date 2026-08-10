"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Share2, Eye, Pencil, Trash2, Check, ArrowLeft } from "lucide-react";
import Envelope from "./Envelope";
import { unescapeHtml } from "@/lib/utils";
import { themeOf, relationOf } from "@/lib/theme";

export default function ResultActions({ record, link }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const theme = themeOf(record.settings);
  const relation = relationOf(record.settings);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard permission denied — Copy Link button still shows the URL */
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `A birthday surprise for ${unescapeHtml(record.name)}`, url: link });
      } catch {}
    } else {
      copyLink();
    }
  };

  const del = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/birthdays/${record.id}`, { method: "DELETE" });
    } finally {
      router.push("/");
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

        <div className="glass rounded-[26px] p-6 sm:p-7 md:p-9 shadow-glow text-center relative">
          <Envelope opened theme={theme} onOpen={() => {}} />
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mt-3.5 text-[11px] font-semibold"
            style={{ background: `${theme.gold}1c`, color: theme.gold, border: `1px solid ${theme.gold}40` }}
          >
            <span>{relation.icon}</span> {relation.label}
          </div>
          <h1 className="font-display font-semibold text-2xl md:text-3xl mt-2 mb-1.5">Your birthday surprise is ready! 🎉</h1>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Share this link with {unescapeHtml(record.name)} — it opens straight into their surprise.
          </p>

          <div className="bg-black/25 border border-white/14 rounded-2xl px-3.5 py-3 mb-4 break-all">
            <span className="text-xs font-mono text-gold">{link}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={copyLink} className="chip">
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy Link"}
            </button>
            <button onClick={share} className="chip">
              <Share2 size={15} /> Share
            </button>
            <button onClick={() => router.push(`/b/${record.slug}-${record.id}`)} className="chip">
              <Eye size={15} /> Preview
            </button>
            <button onClick={() => router.push(`/edit/${record.id}`)} className="chip">
              <Pencil size={15} /> Edit
            </button>
            <button onClick={() => setConfirmDelete(true)} className="chip col-span-2 !text-[#FF9AA8] !border-danger/35 !bg-danger/10">
              <Trash2 size={15} /> Delete
            </button>
          </div>

          <button onClick={() => router.push("/")} className="mt-4 flex items-center gap-1.5 text-xs text-muted mx-auto">
            <ArrowLeft size={14} /> Create another
          </button>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-[26px] p-7 max-w-xs text-center">
              <p className="text-sm text-muted mb-4">Delete this birthday surprise? This can&apos;t be undone.</p>
              <div className="flex gap-2.5 justify-center">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold bg-white/8 border border-white/16">
                  Cancel
                </button>
                <button onClick={del} disabled={deleting} className="flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold text-white bg-danger disabled:opacity-60">
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .chip {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 12px;
            padding: 10px;
            font-size: 12.5px;
            font-weight: 600;
          }
        `}</style>
      </div>
    </>
  );
}
