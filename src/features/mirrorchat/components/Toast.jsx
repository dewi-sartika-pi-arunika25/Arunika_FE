"use client";

import { useEffect } from "react";

export default function Toast({ open, text, onClose, timeout = 1800 }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, timeout);
    return () => clearTimeout(id);
  }, [open, timeout, onClose]);

  if (!open) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg"
         style={{ background: "#1f2937" }}>
      {text}
    </div>
  );
}
