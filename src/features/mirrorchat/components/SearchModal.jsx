"use client";

import { X, Search } from "lucide-react";
import { useEffect, useRef } from "react";

export default function SearchModal({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20 px-4">
      <div
        ref={ref}
        className="relative bg-[#111216] border border-[color:var(--mc-border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4 border-b border-[color:var(--mc-border)]/60 pb-3">
          <h2 className="text-xl font-semibold">Cari Refleksi</h2>
          <button onClick={onClose} className="p-2 rounded-full text-white/60 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Cari kata kunci, skill gap, atau riwayat…"
            className="w-full bg-[#0b0c10] text-white placeholder-white/40 py-3 pl-10 pr-4 rounded-xl focus:outline-none border border-[color:var(--mc-border)]"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
