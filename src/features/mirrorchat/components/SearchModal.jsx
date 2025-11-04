"use client";
import { useEffect, useRef } from "react";
import { X, Search } from "lucide-react";

export default function SearchModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20 px-4">
      <div ref={modalRef} className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800/60 pb-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Cari Refleksi</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Cari kata kunci, skill gap, atau riwayat..."
            className="w-full bg-gray-800 text-white placeholder-gray-500 py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mc-primary)] border border-gray-800"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
