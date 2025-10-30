"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Target, BookOpenCheck, CheckCircle2, Briefcase } from "lucide-react";

import Tabs from "./parts/Tabs";
import SummaryCard from "./parts/SummaryCard";
import SkillRow from "./parts/SkillRow";
import JobRow from "./parts/JobRow";

export default function IntelligentDashboard() {
  const rightRef = useRef(null);

  const [tab, setTab] = useState("overview");
  const tabs = useMemo(
    () => [
      { key: "overview", label: "Ringkasan" },
      { key: "matches", label: "Skill Match" },
      { key: "skills", label: "Skill Up Connector" },
    ],
    []
  );

  // state accordion (auto-close)
  const [openSkill, setOpenSkill] = useState(null);
  const [openJob, setOpenJob] = useState(null);
  const openOnlySkill = (key) => setOpenSkill((curr) => (curr === key ? null : key));
  const openOnlyJob = (key) => setOpenJob((curr) => (curr === key ? null : key));

  // pindah tab = tutup semua accordion
  useEffect(() => {
    setOpenSkill(null);
    setOpenJob(null);
  }, [tab]);

  const goMatches = () => {
    setTab("matches");
    rightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="unik" className="py-16 sm:py-20">
      <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div
          className="grid lg:grid-cols-2 gap-0"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in oklab, var(--primary) 18%, var(--background)), var(--background))",
          }}
        >
          {/* LEFT */}
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="mb-2 text-[11px] tracking-[0.22em] font-semibold uppercase" style={{ color: "var(--accent-2)" }}>
              Arunika Insight
            </p>

            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-extrabold leading-[1.15]" style={{ color: "var(--text)" }}>
              Kamu berhak kerja di tempat yang bikin kamu{" "}
              <span style={{ color: "var(--primary)" }}>berkembang.</span>
              <br className="hidden sm:block" />
              Kami bantu menemukannya.
            </h2>

            <p
              className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--text) 82%, transparent)" }}
            >
              Coach bertenaga AI memetakan tujuanmu, menemukan kecocokan, dan memberi alat yang jelas untuk maju.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={goMatches}
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  boxShadow: "0 16px 36px -18px color-mix(in oklab, var(--primary) 75%, black)",
                }}
              >
                Mulai Dari Skill Match
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
          </div>

          {/* RIGHT */}
          <div
            ref={rightRef}
            className="p-6 sm:p-8 lg:p-10 bg-white/85"
            style={{ backdropFilter: "saturate(1.1) blur(2px)" }}
          >
            <Tabs items={tabs} active={tab} onChange={setTab} />

            {/* panel stabil (tanpa scrollbar), cross-fade tipis */}
            <div
              className="mt-6 rounded-2xl border bg-white/92 p-5 sm:p-6 lg:p-7 shadow-sm"
              style={{
                borderColor: "var(--border)",
                minHeight: "clamp(480px, 56vh, 640px)",
                transition: "opacity .18s ease",
              }}
            >
              {tab === "overview" && (
                <div className="space-y-5">
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

              {tab === "matches" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Fokus Skill
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Materi & Sumber
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Rekomendasi AI
                      </span>
                    </div>
                  </div>

                  <SkillRow
                    open={openSkill === "user-research"}
                    onToggle={() => openOnlySkill("user-research")}
                    skill="User Research"
                    level={86}
                    tags={["Riset", "Wawancara", "Insight"]}
                    summary="Dasar memahami kebutuhan pengguna dan memvalidasi hipotesis."
                    learnItems={[
                      "Teknik wawancara dan probing",
                      "Menyusun research plan efisien",
                      "Ubah temuan jadi rekomendasi produk",
                    ]}
                  />
                  <SkillRow
                    open={openSkill === "visual-design"}
                    onToggle={() => openOnlySkill("visual-design")}
                    skill="Visual Design"
                    level={78}
                    tags={["UI", "Hierarchy", "Consistency"]}
                    summary="Tingkatkan kualitas UI melalui hirarki visual dan konsistensi."
                    learnItems={[
                      "Grid dan spacing rapi",
                      "Kontras, tipografi, warna sesuai WCAG",
                      "Komponen reusable via design system",
                    ]}
                  />
                  <SkillRow
                    open={openSkill === "stakeholder"}
                    onToggle={() => openOnlySkill("stakeholder")}
                    skill="Stakeholder Management"
                    level={71}
                    tags={["Kolaborasi", "Komunikasi"]}
                    summary="Selaraskan prioritas dan bangun kepercayaan lintas fungsi."
                    learnItems={[
                      "Update ringkas berbasis data",
                      "Menangani feedback bertentangan",
                      "Negosiasi prioritas fitur",
                    ]}
                  />
                </div>
              )}

              {tab === "skills" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Pekerjaan
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Kecocokan
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        Siap Dilamar
                      </span>
                    </div>
                  </div>

                  <JobRow
                    open={openJob === "pm"}
                    onToggle={() => openOnlyJob("pm")}
                    title="Product Manager"
                    company='Tech Startup “Inovasi Digital” — Jakarta'
                    score={92}
                    summary="Menggerakkan siklus produk dari riset sampai rilis, menyelaraskan user value dan bisnis."
                    bullets={[
                      "Menentukan prioritas backlog dan roadmap",
                      "Kolaborasi rapat sprint lintas fungsi",
                      "Validasi fitur via eksperimen & metrik",
                    ]}
                    tags={["Roadmap", "Prioritas", "Eksperimen"]}
                  />
                  <JobRow
                    open={openJob === "uxr"}
                    onToggle={() => openOnlyJob("uxr")}
                    title="UI/UX Researcher"
                    company='Creative Agency “Visuara” — Bandung'
                    score={85}
                    summary="Menggali insight untuk keputusan desain melalui metode kualitatif dan kuantitatif."
                    bullets={[
                      "Riset formatif & evaluatif",
                      "Usability testing & analisis",
                      "Pelaporan insight yang actionable",
                    ]}
                    tags={["Wawancara", "Testing", "Insight"]}
                  />
                  <JobRow
                    open={openJob === "da"}
                    onToggle={() => openOnlyJob("da")}
                    title="Data Analyst (Entry)"
                    company='EduTech “Belajar Cerdas” — Remote'
                    score={81}
                    summary="Mengubah data menjadi insight untuk meningkatkan pengalaman dan performa produk."
                    bullets={[
                      "Menyusun dashboard KPI",
                      "Eksplorasi data & A/B testing",
                      "Storytelling berbasis data",
                    ]}
                    tags={["SQL", "Dashboard", "A/B Test"]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
