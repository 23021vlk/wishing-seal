"use client";
import { useEffect } from "react";

// Best-effort deterrent only — see note in the assistant's reply. This does
// NOT actually secure the source: view-source:, browser extensions, the
// Network tab, or simply disabling JavaScript all bypass it trivially.
export default function DisableInspect() {
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();

    const blockKeys = (e) => {
      const key = e.key;
      const blocked =
        key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(key)) ||
        (e.metaKey && e.altKey && ["I", "J", "C", "i", "j", "c"].includes(key)) || // Mac Safari/Chrome
        (e.ctrlKey && ["U", "u"].includes(key)) ||
        (e.metaKey && ["U", "u"].includes(key));
      if (blocked) e.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
