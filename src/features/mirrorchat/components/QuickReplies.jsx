"use client";

const presets = [
  "Rekomendasi karir",
  "Skill yang perlu ditingkatkan",
  "Rencana 2 minggu ke depan",
  "Tes kepribadian singkat",
];

export default function QuickReplies({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p}
          onClick={() => onPick(p)}
          className="px-3 py-1.5 rounded-full text-xs bg-white/8 hover:bg-white/12 border border-[color:var(--mc-border)] transition"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
