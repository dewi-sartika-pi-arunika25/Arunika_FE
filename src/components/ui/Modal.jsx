"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Tutup" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-xl rounded-2xl border bg-white/95 shadow-2xl"
          style={{ boxShadow: "0 20px 50px rgba(0,0,0,.18), 0 6px 20px rgba(0,0,0,.10)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
