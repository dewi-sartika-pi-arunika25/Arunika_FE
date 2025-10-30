"use client";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import {
  Loader,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function DashboardContent() {
  const {
    profile,
    user,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    nextSteps,
    formattedJobs,
    skillGaps,
  } = usePersonalizedProfile();

  // === 🧠 Semua hook harus dipanggil sebelum kondisi render ===
  const userName = user?.name || "Pengguna Arunika";

  const pieData = useMemo(() => {
    const value = Math.round(roleFit ?? 0);
    return [
      { name: "Role Fit", value },
      { name: "Gap", value: 100 - value },
    ];
  }, [roleFit]);

  const radarData = useMemo(() => {
    return (
      strengths?.topThree?.map((s, i) => ({
        subject: s,
        A: Math.max(20, 100 - i * 15),
      })) || []
    );
  }, [strengths]);

  const jobData = useMemo(() => {
    return (
      formattedJobs?.slice(0, 6).map((j) => ({
        name: j.role.length > 18 ? j.role.slice(0, 18) + "..." : j.role,
        match: j.match,
        badge: j.badge,
      })) || []
    );
  }, [formattedJobs]);

  const skillGapData = useMemo(() => {
    return (
      skillGaps?.map((g) => ({
        skill: g.name,
        gap: g.gapPercent ?? 0,
        target: g.targetPercent ?? (100 - (g.gapPercent ?? 0)),
      })) || []
    );
  }, [skillGaps]);

  const levelCompetence = useMemo(() => {
    const m =
      summaryMetrics?.find((x) =>
        ["kompeten", "kompetensi", "competency", "level"].some((k) =>
          x.title?.toLowerCase().includes(k)
        )
      )?.value ?? null;

    if (typeof m === "number") return Math.round(m);
    if (typeof m === "string") {
      const n = parseFloat(m.replace("%", "").trim());
      if (!Number.isNaN(n)) return Math.round(n);
    }

    if (radarData.length > 0) {
      const avg = Math.round(
        radarData.reduce((s, r) => s + (r.A || 0), 0) / radarData.length
      );
      return avg;
    }
    return 72;
  }, [summaryMetrics, radarData]);

  const levelSkillGap = useMemo(() => {
    if (skillGapData.length > 0) {
      const avg = Math.round(
        skillGapData.reduce((s, r) => s + (r.gap || 0), 0) /
          skillGapData.length
      );
      return avg;
    }
    return Math.max(0, Math.min(100, 100 - Math.round(levelCompetence * 0.9)));
  }, [skillGapData, levelCompetence]);

  const roleDetail =
    profile?.roleDescription ||
    "Role ini menggambarkan kombinasi unik antara kemampuan analisis, komunikasi, dan kepemimpinan. Kamu cenderung mengelola proses secara efisien sekaligus menginspirasi tim menuju tujuan bersama.";

  const COLORS = ["#E4B200", "#FFE89C"];
  const pct = (n) => `${Math.round(n ?? 0)}%`;

  // === Kondisi loading & error setelah semua hook ===
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-[#FFFDF5] border border-[#E4B200]/40 shadow-md">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-[#E4B200]" />
            <p className="text-gray-600">Memuat dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-red-700">
            {error || "Gagal memuat profil"}
          </CardContent>
        </Card>
      </div>
    );
  }

  // === Tampilan utama ===
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="p-8 pt-6 space-y-6"
    >
      {/* ==== TOP SUMMARY ==== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-8">
          <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-sm">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2C2C2C]">Ringkasan Cepat</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Selamat datang, <span className="font-medium">{userName}</span>. Berikut ringkasan
                  metrik utama berdasarkan analisis AI.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {[
                  { title: "Role Fit", value: pct(roleFit), color: "#E4B200" },
                  { title: "Level Kompetensi", value: pct(levelCompetence), color: "#E4B200" },
                  { title: "Level Skill Gap", value: pct(levelSkillGap), color: "#FF8C00" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white shadow-inner min-w-[140px] text-center"
                  >
                    <div className="text-xs text-gray-500">{item.title}</div>
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <div className="flex gap-3 justify-end">
            <button className="px-4 py-2 rounded-xl bg-[#E4B200] text-white font-semibold shadow-sm">
              Take Action
            </button>
            <button className="px-4 py-2 rounded-xl border border-[#E4B200] text-[#2C2C2C]">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ==== MAIN GRID ==== */}
      <div className="grid grid-cols-12 gap-6">
        {/* Role Fit */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-4 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <PieChart size={18} className="text-[#E4B200]" />
              Visualisasi Role Fit
            </h4>
            <div className="text-sm text-gray-600">Kesiapan</div>
          </div>

          <div className="h-[210px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">Keterangan:</div>
            <div className="flex items-center gap-3">
              {COLORS.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                  <span className="text-sm text-gray-700">
                    {i === 0 ? "Role Fit" : "Gap"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Strengths */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-5 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <Sparkles size={18} className="text-[#E4B200]" />
              Kekuatan Utama
            </h4>
            <div className="text-sm text-gray-600">Insight & fokus pengembangan</div>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-6 h-44">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar dataKey="A" stroke="#E4B200" fill="#FFD84D" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  Tidak ada data kekuatan.
                </div>
              )}
            </div>

            <div className="col-span-6 space-y-3">
              {(strengths?.topThree?.length > 0
                ? strengths.topThree
                : radarData.map((r) => r.subject)
              ).map((s, idx) => {
                const score =
                  strengths?.scores?.[s] ??
                  (radarData?.[idx]?.A ?? Math.max(40, 90 - idx * 12));
                return (
                  <motion.div
                    key={s + idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="p-3 rounded-lg border border-[#F3E7B7] bg-[#FFFDF5]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-semibold text-[#2C2C2C]">{s}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {idx === 0 ? "Kekuatan utama" : "Kekuatan"}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#E4B200]">{pct(score)}</div>
                    </div>
                    <div className="mt-2 h-2 bg-[#FFF6DC] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(0, score))}%`,
                          background: "linear-gradient(90deg,#FFD84D,#E4B200)",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Skill Gap */}
        <motion.div
          layout
          className="col-span-3 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <TrendingUp size={18} className="text-[#E4B200]" />
              Skill Gap & Pengembangan
            </h4>
            <div className="text-sm text-gray-600">Rata-rata: {pct(levelSkillGap)}</div>
          </div>

          <div className="h-[220px]">
            {skillGapData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapData} layout="vertical" margin={{ left: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="skill" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gap" name="Saat Ini" fill="#FFE89C" />
                  <Bar dataKey="target" name="Target" fill="#E4B200" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Tidak ada data skill gap.
              </div>
            )}
          </div>
        </motion.div>

        {/* Role Fit Detail */}
        <motion.div
          layout
          className="col-span-8 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <Target size={18} className="text-[#E4B200]" /> Detail Peran & Potensi
            </h4>
            <div className="text-sm text-gray-600">Rekomendasi pengembangan</div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{roleDetail}</p>
        </motion.div>

        {/* Job Matches */}
        {jobData.length > 0 && (
          <motion.div
            layout
            className="col-span-4 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <BarChart3 size={18} className="text-[#E4B200]" />
                Lowongan Terbaik
              </h4>
              <div className="text-xs text-gray-500">Top matches</div>
            </div>

            <div className="space-y-2">
              {jobData.map((j, i) => (
                <div
                  key={j.name + i}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#FFFDF5] border border-[#F4E8BB]"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#2C2C2C]">{j.name}</div>
                    <div className="text-xs text-gray-500">{j.badge || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#E4B200]">{pct(j.match)}</div>
                    <div className="text-xs text-gray-500">Cocok</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {nextSteps?.length > 0 && (
          <motion.div
            layout
            className="col-span-12 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#2C2C2C]">Langkah Selanjutnya</h4>
              <div className="text-sm text-gray-600">Action plan</div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {nextSteps.map((step) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border-l-4 ${
                    step.priority === "URGENT"
                      ? "border-red-500 bg-red-50"
                      : step.priority === "HIGH"
                      ? "border-[#E4B200] bg-yellow-50"
                      : "border-[#FFD84D] bg-[#FFFDF5]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-[#2C2C2C]">{step.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-white">
                      {step.timeline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
