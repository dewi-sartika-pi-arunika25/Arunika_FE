"use client";

import { useMemo, useRef, useState } from "react";
import { Users, TrendingUp, Clock, Target, Briefcase, CheckCircle2 } from "lucide-react";

import Tabs from "./parts/Tabs";
import Stat from "./parts/Stat";
import SummaryCard from "./parts/SummaryCard";
import MatchRow from "./parts/MatchRow";

export default function IntelligentDashboard() {
  const rightRef = useRef(null);
  const [tab, setTab] = useState("overview");

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Ringkasan" },
      { key: "matches", label: "Job Match" },
      { key: "roadmap", label: "Roadmap" },
    ],
    []
  );

  const goMatches = () => {
    setTab("matches");
    rightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    // LEBA R: ikut parent (sama seperti Hero), tidak dibungkus max-w lain
    <section id="unik" className="py-16 sm:py-20">
      <div
        className="rounded-3xl border overflow-hidden shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="grid lg:grid-cols-2 gap-0"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in oklab, var(--primary) 18%, var(--background)), var(--background))",
          }}
        >
          {/* LEFT — copy ringkas */}
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p
              className="mb-2 text-[11px] tracking-[0.22em] font-semibold uppercase"
              style={{ color: "var(--accent-2)" }}
            >
              Arunika Insight
            </p>

            <h2
              className="text-[28px] sm:text-[34px] md:text-[40px] font-extrabold leading-[1.15]"
              style={{ color: "var(--text)" }}
            >
              Kamu berhak kerja di tempat yang bikin kamu{" "}
              <span style={{ color: "var(--primary)" }}>berkembang.</span>
              <br className="hidden sm:block" />
              Kami bantu menemukannya.
            </h2>

            <p
              className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--text) 82%, transparent)" }}
            >
              Coach bertenaga AI memetakan tujuanmu, menemukan kecocokan, dan memberi alat untuk maju—tanpa drama.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={goMatches}
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  boxShadow:
                    "0 16px 36px -18px color-mix(in oklab, var(--primary) 75%, black)",
                }}
              >
                Mulai Dari Job Match
              </button>

              <a
                href="#keunggulan"
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium border transition hover:bg-white/10"
                style={{
                  color: "var(--text)",
                  borderColor: "color-mix(in oklab, var(--text) 45%, transparent)",
                }}
              >
                Lihat Cara Kerja
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Stat
                icon={Users}
                value="1.000+"
                label="Job seekers diwawancarai sebagai dasar proses."
              />
              <Stat icon={TrendingUp} value="90%" label="Lebih terjangkau dari coaching konvensional." />
              <Stat icon={Clock} value="~15 menit" label="Rata-rata tiap langkah." />
            </div>
          </div>

          {/* RIGHT — panel ringkas */}
          <div
            ref={rightRef}
            className="p-6 sm:p-8 lg:p-10 bg-white/85"
            style={{ backdropFilter: "saturate(1.1) blur(2px)" }}
          >
            <Tabs items={tabs} active={tab} onChange={setTab} />

            <div
              className="mt-6 rounded-2xl border bg-white/92 p-5 sm:p-6 lg:p-7 shadow-sm"
              style={{ borderColor: "var(--border)" }}
            >
              {/* ======== OVERVIEW (RINGKAS) ======== */}
              {tab === "overview" && (
                <div className="space-y-5">
                  {/* 1) ROLE FIT (di atas) */}
                  <SummaryCard
                    type="role"
                    title="Role Fit"
                    className="min-h-[0]"
                    items={[
                      { title: "Product Manager", score: 92 },
                      { title: "UI/UX Researcher", score: 85 },
                      { title: "Data Analyst (Entry)", score: 81 },
                    ]}
                  />

                  {/* 2 kolom ringkas: Strengths & Gaps */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <SummaryCard
                      type="strengths"
                      title="Kekuatan Utama"
                      className="min-h-[0]"
                      items={[
                        { title: "Kreatif/Visual", note: "Kekuatan dominan dalam profilmu" },
                        { title: "Analitis", note: "Mampu menyusun insight terstruktur" },
                        { title: "Kolaboratif", note: "Cepat nyambung dalam tim lintas fungsi" },
                      ]}
                    />
                    <SummaryCard
                      type="gaps"
                      title="Skill Gap & Fokus"
                      className="min-h-[0]"
                      items={[
                        { title: "Visual Design", tags: ["High", "creative"] },
                        { title: "User Research", tags: ["High", "analysis"] },
                        { title: "Stakeholder Management", tags: ["High", "collab"] },
                      ]}
                    />
                  </div>

                  {/* 4) ANALISIS SINGKAT */}
                  <SummaryCard
                    type="analysis"
                    title="Analisis AI (Ringkas)"
                    className="min-h-[0]"
                    items={[
                      { label: "Level Saat Ini", value: "Menengah" },
                      { label: "Prioritas 90 Hari", value: "3 skill utama + 2 micro-project" },
                      { label: "Status", value: "UI/UX Designer (60%)" },
                    ]}
                  />
                </div>
              )}

              {/* ======== MATCHES ======== */}
              {tab === "matches" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Role Fit
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Job Prototypes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Best Match
                      </span>
                    </div>
                  </div>

                  <MatchRow title="Product Manager" company='Tech Startup “Inovasi Digital” — Jakarta' score={92} />
                  <MatchRow title="UI/UX Researcher" company='Creative Agency “Visuara” — Bandung' score={85} />
                  <MatchRow title="Data Analyst (Entry)" company='EduTech “Belajar Cerdas” — Remote' score={81} />
                </div>
              )}

              {/* ======== ROADMAP ======== */}
              {tab === "roadmap" && (
                <div className="space-y-4">
                  {[
                    { title: "Portfolio Mini", desc: "2 micro-project (UI audit & usability test)." },
                    { title: "Skill Penunjang", desc: "Modul ‘Metrics for Product’ — 3 jam." },
                    { title: "Mock Interview", desc: "1 sesi mentor untuk story karier." },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 hover:bg-white/60 rounded-xl p-3 transition">
                      <div
                        className="mt-0.5 h-6 w-6 shrink-0 rounded-full grid place-items-center text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 90%, black), var(--primary))",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: "var(--text)" }}>
                          {s.title}
                        </div>
                        <p className="text-sm mt-0.5" style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
