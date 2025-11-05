"use client";
import { Send, Trash2 } from "lucide-react";

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onClearClick,
}) {
  const canSend = value.trim() && !disabled;

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
      <div
        className="flex items-center gap-2 bg-white rounded-2xl border px-2 py-2 shadow-sm"
        style={{ borderColor: "color-mix(in oklab, var(--accent-3) 55%, var(--border))" }}
      >
        <button
          type="button"
          onClick={onClearClick}
          className="rounded-xl px-3 py-2 text-sm border hover:bg-[#FFF5EA] active:scale-[.98] transition"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          <span className="inline-flex items-center gap-2">
            <Trash2 size={16} /> Hapus chat
          </span>
        </button>

        <input
          className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ketik pesanmu di sini…"
          disabled={disabled}
          aria-label="Ketik pesan"
        />

        <button
          type="submit"
          disabled={!canSend}
          className={`rounded-xl px-3 py-2 text-sm text-white transition ${
            canSend ? "hover:opacity-90 active:scale-[.98]" : "opacity-50 cursor-not-allowed"
          }`}
          style={{ background: "var(--primary)" }}
        >
          <span className="inline-flex items-center gap-2">
            <Send size={16} /> Kirim
          </span>
        </button>
      </div>
    </form>
  );
}
