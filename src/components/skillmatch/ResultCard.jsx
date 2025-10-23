"use client";

import Pill from "@/components/ui/Pill";
import { Sparkles, X } from "lucide-react";

export default function ResultCard({ score, strengths, onClose }) {
  return (
    <>
      {/* header */}
      <div
        className="rounded-t-2xl px-6 py-5 text-center"
        style={{ background: "linear-gradient(180deg, rgba(250,225,60,.25), rgba(255,253,244,.0))" }}
      >
        <h3
          className="text-lg font-semibold"
          style={{
            background: "linear-gradient(90deg, var(--accent-1), var(--primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: ".02em",
          }}
        >
          Rekomendasi Peran Untukmu
        </h3>
      </div>

      {/* close icon only */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 p-2 rounded-full hover:bg-neutral-100"
        aria-label="Tutup"
      >
        <X className="w-5 h-5 text-neutral-600" />
      </button>

      <div className="px-6 pb-6">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-3"
            style={{ background: "rgba(250,225,60,.22)" }}
          >
            <Sparkles className="w-4 h-4" />
            {score.role}
          </span>

        <div className="text-[56px] sm:text-[64px] leading-none font-extrabold">
            {score.fit}
            <span className="text-neutral-500 align-top text-2xl">%</span>
          </div>
          <div className="text-neutral-500 -mt-1">Fit Score</div>
        </div>

        <div className="mt-7">
          <h4 className="font-semibold mb-2">Kekuatan Utamamu</h4>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-2">Saran Aksi</h4>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex gap-2">
              <span
                className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              Ambil mini-project 1–2 minggu sesuai peran.
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              Tulis studi kasus singkat untuk portofolio.
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              Minta feedback mentor/komunitas.
            </li>
          </ul>

          <div
            className="h-px w-full my-6"
            style={{ background: "rgba(0,0,0,.06)" }}
          />
        </div>

        {/* Hanya CTA utama, center */}
        <div className="flex justify-center">
          <a
            href="/lab-career"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-white font-semibold shadow-md hover:opacity-95 transition"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-1), var(--primary))",
            }}
          >
            Jelajahi Lab Career →
          </a>
        </div>
      </div>
    </>
  );
}
