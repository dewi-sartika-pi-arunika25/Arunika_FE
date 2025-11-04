"use client";
import { Send } from "lucide-react";

export default function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form onSubmit={onSubmit} className="mt-6 relative z-20">
      <div className="flex gap-3 bg-[#0F0F14] p-3 rounded-2xl border shadow-xl"
           style={{ borderColor: "var(--mc-border)" }}>
        <input
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none placeholder-gray-500 text-sm sm:text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ketik pesan Anda di sini..."
          disabled={disabled}
        />
        <button
          type="submit"
          className={[
            "p-3 rounded-full transition",
            value.trim() && !disabled
              ? "bg-[var(--mc-primary)] hover:brightness-110 text-white"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          ].join(" ")}
          disabled={!value.trim() || disabled}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
