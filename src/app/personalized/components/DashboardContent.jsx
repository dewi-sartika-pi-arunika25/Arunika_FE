"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardLogic } from "@/hooks/useDashboardLogic";
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
  CartesianGrid,
} from "recharts";

export default function DashboardContent({ filters = null }) {
  // ✅ Semua logic dipindahkan ke useDashboardLogic hook
  const {
    profile,
    userName,
    loading,
    error,
    roleFitInfo,
    recommendedRole,
    pieData,
    radarData,
    skillGapData,
    topStrengths,
    competenceLevel,
    levelSkillGap,
    roleDetail,
    workStyleText,
    jobData,
    nextSteps,
    chartColors,
    pct,
  } = useDashboardLogic();

  // Apply filters jika tersedia
  const filteredJobs = filters ? filters.filterJobs(jobData) : jobData;
  const filteredSkillGaps = filters ? filters.filterSkillGaps(skillGapData) : skillGapData;
  const filteredNextSteps = filters ? filters.filterNextSteps(nextSteps) : nextSteps;
  const filteredStrengths = filters ? filters.filterStrengths(topStrengths) : topStrengths;

  // === Kondisi loading & error setelah semua hook ===
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-[#FFFDF5] border border-[#E4B200]/40 shadow-md">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#E4B200' }} />
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
      className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6"
    >
      {/* ==== TOP SUMMARY ==== */}
      <div className="space-y-4">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#2C2C2C] mb-1">Ringkasan Cepat</h3>
                <p className="text-sm text-gray-600">
                  Selamat datang, <span className="font-medium text-[#E4B200]">{userName}</span>. Berikut ringkasan
                  metrik utama berdasarkan analisis AI.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-xl text-white font-semibold shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#E4B200' }}>
                  Take Action
                </button>
                <button className="px-4 py-2 rounded-xl border border-[#E4B200] text-[#2C2C2C] hover:bg-[#FFF6DC] transition-colors">
                  Export
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid - Redesign dengan icon dan layout lebih baik */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: "Role Cocok", 
              value: recommendedRole === "Frontend Developer" ? "Frontend" : 
                     recommendedRole === "Backend Developer" ? "Backend" :
                     recommendedRole === "Project Manager" ? "PM" :
                     recommendedRole === "UI/UX Designer" ? "UI/UX" : recommendedRole, 
              color: "#E4B200",
              icon: Sparkles,
              bgGradient: "from-blue-50 to-blue-100"
            },
            { title: "Role Fit", value: pct(roleFitInfo.fit || roleFit), color: "#E4B200", icon: Target, bgGradient: "from-yellow-50 to-yellow-100" },
            { title: "Level Kompetensi", value: competenceLevel, color: "#E4B200", icon: TrendingUp, bgGradient: "from-green-50 to-green-100" },
            { title: "Skill Gap", value: pct(levelSkillGap), color: "#FF8C00", icon: BarChart3, bgGradient: "from-orange-50 to-orange-100" },
            
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                    key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${item.bgGradient} border border-[#E4B200]/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon size={20} className="text-gray-600" />
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">{item.title}</div>
                    <div className="text-2xl lg:text-3xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                  </div>
              </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==== MAIN GRID ==== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Role Fit */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-[#E4B200]/20 p-4 pr-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <PieChart size={18} className="text-[#E4B200]" />
              Visualisasi Role Fit
            </h4>
            <div className="text-sm text-gray-600">Kesiapan</div>
          </div>

          <div className="w-full flex items-center justify-center" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <RePieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="text-sm text-gray-600">Keterangan:</div>
            <div className="flex items-center gap-3">
              {chartColors.map((c, i) => (
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
          className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <Sparkles size={18} className="text-[#E4B200]" />
              Kekuatan Utama
            </h4>
            <div className="text-sm text-gray-600">Insight & fokus pengembangan</div>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-6">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={176}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 12, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} hide />
                    <Radar dataKey="A" stroke="#E4B200" fill="#FFD84D" fillOpacity={0.6} />
                    <Tooltip 
                      formatter={(value) => [`${Math.round(value)}%`, "Skor"]}
                      labelFormatter={(label) => radarData.find(r => r.subject === label)?.fullName || label}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E4B200' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  Tidak ada data kekuatan.
                </div>
              )}
            </div>

            <div className="col-span-6 space-y-3">
              {filteredStrengths.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  {topStrengths.length === 0 ? "Tidak ada data kekuatan." : "Tidak ada hasil yang cocok dengan filter."}
                </div>
              ) : (
                filteredStrengths.map((strength, idx) => (
                  <motion.div
                    key={strength.code + idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="p-3 rounded-lg border border-[#F3E7B7] bg-[#FFFDF5]"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#2C2C2C]">{strength.name}</div>
                      </div>
                      <div className="text-sm font-bold text-[#E4B200] ml-2">{pct(strength.score)}</div>
                    </div>
                    <div className="mt-2 h-2 bg-[#FFF6DC] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, strength.score))}%`,
                          background: "linear-gradient(90deg,#FFD84D,#E4B200)",
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Skill Gap - Sekarang di sebelah Strengths */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <TrendingUp size={18} className="text-[#E4B200]" />
              Skill Gap & Pengembangan 
              {filteredSkillGaps.length !== skillGapData.length && ` (${filteredSkillGaps.length}/${skillGapData.length})`}
            </h4>
            <div className="text-sm text-gray-600">Rata-rata: {pct(levelSkillGap)}</div>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            {filteredSkillGaps && filteredSkillGaps.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart 
                  data={filteredSkillGaps} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 25, bottom: 40 }}
                  barCategoryGap="20%"
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}%`}
                    stroke="#D1D5DB"
                  />
                  <YAxis 
                    dataKey="skill" 
                    type="category"
                    width={80}
                    tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                    interval={0}
                    stroke="#D1D5DB"
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${Math.round(value)}%`, name === "gap" ? "Saat Ini" : "Target"]}
                  labelFormatter={(label) => {
                    const item = filteredSkillGaps.find(d => d.skill === label);
                    return item?.skillFull || label;
                  }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#1F2937' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #E4B200',
                      backgroundColor: '#FFFDF5',
                      padding: '8px 12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '12px', fontSize: '11px', color: '#4B5563' }}
                    iconType="rect"
                    iconSize={10}
                    align="right"
                    verticalAlign="bottom"
                  />
                  <Bar 
                    dataKey="gap" 
                    name="Saat Ini" 
                    fill="#FFE89C"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                    isAnimationActive={true}
                  />
                  <Bar 
                    dataKey="target" 
                    name="Target" 
                    fill="#E4B200"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                {skillGapData && skillGapData.length > 0 
                  ? "Tidak ada hasil yang cocok dengan filter." 
                  : "Data skill gap belum tersedia"}
              </div>
            )}
          </div>
        </motion.div>

        {/* Role Fit Detail & Rekomendasi Pengembangan */}
        <motion.div
          layout
          className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
              <Target size={18} className="text-[#E4B200]" /> Detail Peran & Potensi
            </h4>
            <div className="text-sm text-gray-600">Rekomendasi pengembangan</div>
          </div>

          <div className="space-y-4">
            {/* Karir yang Cocok / Role Fit */}
            {roleFitInfo.role !== "Belum Tersedia" && (
              <div>
                <h5 className="text-sm font-semibold text-[#2C2C2C] mb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#E4B200]" />
                  Karir yang Cocok
                </h5>
                <div className="mb-3">
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#FFF6DC] to-[#FFE89C] rounded-lg mb-2">
                    <span className="text-sm font-semibold text-[#2C2C2C]">
                      {roleFitInfo.role}
                    </span>
                  </div>
                  {roleFitInfo.personality && (
                    <p className="text-sm text-gray-700 leading-relaxed mt-2">
                      {roleFitInfo.personality}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Gaya Kerja - Selalu tampilkan jika ada data DISC/RIASEC */}
            {workStyleText && (
              <div>
                <h5 className="text-sm font-semibold text-[#2C2C2C] mb-2 flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#E4B200]" />
                  Gaya Kerja
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {workStyleText}
                </p>
              </div>
            )}

            {/* Lingkungan Kerja Ideal */}
            {roleFitInfo.workEnvironment && (
              <div>
                <h5 className="text-sm font-semibold text-[#2C2C2C] mb-2 flex items-center gap-2">
                  <BarChart3 size={14} className="text-[#E4B200]" />
                  Lingkungan Kerja Ideal
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {roleFitInfo.workEnvironment}
                </p>
              </div>
            )}

            {/* Strengths */}
            {roleFitInfo.strengths && roleFitInfo.strengths.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-[#2C2C2C] mb-2 flex items-center gap-2">
                  <Target size={14} className="text-[#E4B200]" />
                  Kekuatan Utama untuk Role Ini
                </h5>
                <div className="flex flex-wrap gap-2">
                  {roleFitInfo.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FFF6DC] text-[#2C2C2C] rounded-lg text-xs font-medium border border-[#E4B200]/30"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Job Matches */}
        {filteredJobs.length > 0 && (
          <motion.div
            layout
            className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <BarChart3 size={18} className="text-[#E4B200]" />
                Lowongan Terbaik {filteredJobs.length !== jobData.length && `(${filteredJobs.length}/${jobData.length})`}
              </h4>
              <div className="text-xs text-gray-500">Top matches</div>
            </div>

            <div className="space-y-2">
              {filteredJobs.map((j, i) => {
                // Generate query untuk job search berdasarkan role
                const roleQuery = j.name.toLowerCase().replace(/\s+/g, '+');
                const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${roleQuery}`;
                const jobstreetUrl = `https://www.jobstreet.co.id/id/job-search/${roleQuery}-jobs/`;
                
                return (
                  <motion.div
                  key={j.name + i}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      // Navigate ke rec_pekerjaan dengan query parameter
                      const roleParam = encodeURIComponent(j.name);
                      const currentUrl = new URL(window.location.href);
                      const idParam = currentUrl.searchParams.get('id') || '';
                      window.location.href = `/personalized?id=${idParam}&menu=rekom-pekerjaan&role=${roleParam}`;
                    }}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#FFFDF5] border border-[#F4E8BB] cursor-pointer hover:bg-[#FFF6DC] transition-colors"
                  >
                    <div className="flex-1">
                    <div className="text-sm font-semibold text-[#2C2C2C]">{j.name}</div>
                    <div className="text-xs text-gray-500">{j.badge || "—"}</div>
                  </div>
                    <div className="text-right ml-3">
                    <div className="text-sm font-bold text-[#E4B200]">{pct(j.match)}</div>
                    <div className="text-xs text-gray-500">Cocok</div>
                  </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {filteredNextSteps?.length > 0 && (
          <motion.div
            layout
            className="col-span-12 bg-white rounded-2xl border border-[#E4B200]/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#2C2C2C]">
                Langkah Selanjutnya 
                {filteredNextSteps.length !== nextSteps.length && ` (${filteredNextSteps.length}/${nextSteps.length})`}
              </h4>
              <div className="text-sm text-gray-600">Action plan</div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {filteredNextSteps.map((step) => (
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
