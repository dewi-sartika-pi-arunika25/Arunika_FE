"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalisisAI } from "@/hooks/useAnalisisAI";
import {
  Briefcase,
  Target,
  TrendingUp,
  Sparkles,
  Loader,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getDimensionExplanation, getDimensionFullName } from "@/lib/utils/dimensionDescriptions";

export default function AnalisisAI() {
  // ✅ Semua logic dipindahkan ke useAnalisisAI hook
  const {
    profile,
    userName,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    skillGaps,
    nextSteps,
    formattedJobs,
    aiStatus,
    hasAIInsight,
    expanded,
    toggle,
    refreshAIAnalysis,
    refreshingAI,
    isStaticFallback,
  } = useAnalisisAI();

  if (loading) {
    return (
      <div className="p-8 pt-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Memuat dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 pt-24">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-red-700 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error || "Gagal memuat profil"}</div>
          </CardContent>
        </Card>
      </div>
    );
  }




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-8 space-y-4"
    >
      {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#2C2C2C] mb-1">Analisis Detail</h3>
                <p className="text-sm text-gray-600">
                  Selamat datang, <span className="font-medium text-[#E4B200]">{userName}</span>. Berikut analisis detail
                  berdasarkan profil karir Anda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* === AI STATUS INDICATOR === */}
      {(!hasAIInsight && aiStatus && aiStatus !== 'completed') && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardContent className="p-4 text-sm text-yellow-900 flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            AI sedang memproses analisis Anda. Halaman ini akan menampilkan hasil begitu siap.
          </CardContent>
        </Card>
      )}

      {/* === MANUAL REFRESH / TRIGGER AI === */}
      {(!hasAIInsight || aiStatus === 'failed') && (
        <div className="flex items-center gap-2">
          <Button
            disabled={refreshingAI || aiStatus === 'pending'}
            onClick={refreshAIAnalysis}
            className="bg-[#FF8C00] hover:bg-[#E67600] text-white"
          >
            {refreshingAI ? 'Memulai ulang…' : 'Regenerasi Analisis AI'}
          </Button>
          {aiStatus && (
            <span className="text-xs text-gray-500">Status: {aiStatus}</span>
          )}
        </div>
      )}

      {/* === AI ANALYSIS (from backend or static fallback) === */}
      {hasAIInsight && (
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF8C00]" />
              Analisis AI
              {isStaticFallback && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                  Contoh Data
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#2C2C2C]">
            {typeof profile.ai_insight === 'object' ? (
              <div className="space-y-4">
                {profile.ai_insight.personality_summary && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Ringkasan Kepribadian</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('personality')}>
                        {expanded.personality ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.personality && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.personality_summary}
                      </div>
                    )}
                  </div>
                )}
                {profile.ai_insight.detail_peran && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Detail Peran & Potensi</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('jobfit')}>
                        {expanded.jobfit ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.jobfit && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.detail_peran}
                      </div>
                    )}
                  </div>
                )}
                {profile.ai_insight.potensi_karir && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Potensi Karir</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('potensi')}>
                        {expanded.potensi ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.potensi && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.potensi_karir}
                      </div>
                    )}
                  </div>
                )}
                {/* Fallback untuk job_fit_analysis (format lama) */}
                {!profile.ai_insight.detail_peran && profile.ai_insight.job_fit_analysis && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Analisis Job Fit</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('jobfit')}>
                        {expanded.jobfit ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.jobfit && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.job_fit_analysis}
                      </div>
                    )}
                  </div>
                )}
                {profile.ai_insight.development_areas && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Area Pengembangan</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('development')}>
                        {expanded.development ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.development && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.development_areas}
                      </div>
                    )}
                  </div>
                )}
                {profile.ai_insight.next_steps && (
                  <div className="bg-[#FFFDF5] rounded-lg border border-[#E4B200]/20">
                    <div className="flex items-center justify-between p-3">
                      <p className="font-semibold">Langkah Selanjutnya</p>
                      <Button size="sm" variant="outline" onClick={() => toggle('next')}>
                        {expanded.next ? 'Sembunyikan' : 'Lihat selengkapnya'}
                      </Button>
                    </div>
                    {expanded.next && (
                      <div className="px-3 pb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {profile.ai_insight.next_steps}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-700">{String(profile.ai_insight)}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* === STRENGTHEN (KEKUATAN UTAMA) === */}
      {strengths.topThree && strengths.topThree.length > 0 && (() => {
        // Helper untuk get dimension info dengan handling conflict
        const getDimensionInfo = (dimensionCode) => {
          // Cek apakah ini dari DISC atau RIASEC berdasarkan profile scores
          const discScores = profile?.disc_profile?.scores || profile?.disc_profile?.scores_detail || {};
          const riasecScores = profile?.riasec_profile?.scores || profile?.riasec_profile?.scores_detail || {};
          
          const isDISC = discScores[dimensionCode] !== undefined;
          const isRIASEC = riasecScores[dimensionCode] !== undefined;
          
          // Mapping untuk handle conflict I dan S
          let correctCode = dimensionCode;
          let dimensionName = dimensionCode;
          
          // Handle conflict: I bisa DISC Influence atau RIASEC Investigative
          if (dimensionCode === 'I') {
            if (isDISC) {
              correctCode = 'I';
              dimensionName = 'Influence';
            } else if (isRIASEC) {
              correctCode = 'I_RIASEC';
              dimensionName = 'Investigative';
            } else {
              // Default ke DISC jika tidak jelas
              correctCode = 'I';
              dimensionName = 'Influence';
            }
          } 
          // Handle conflict: S bisa DISC Steadiness atau RIASEC Social
          else if (dimensionCode === 'S') {
            if (isDISC) {
              correctCode = 'S';
              dimensionName = 'Steadiness';
            } else if (isRIASEC) {
              correctCode = 'S_RIASEC';
              dimensionName = 'Social';
            } else {
              correctCode = 'S';
              dimensionName = 'Steadiness';
            }
          }
          // Handle conflict: C bisa DISC Conscientiousness atau RIASEC Conventional
          else if (dimensionCode === 'C') {
            if (isDISC) {
              correctCode = 'C';
              dimensionName = 'Conscientiousness';
            } else if (isRIASEC) {
              correctCode = 'C_RIASEC';
              dimensionName = 'Conventional';
            } else {
              correctCode = 'C';
              dimensionName = 'Conscientiousness';
            }
          }
          // Non-conflict dimensions
          else {
            dimensionName = getDimensionFullName(dimensionCode) || dimensionCode;
          }

          // Get insight/explanation
          const insight = getDimensionExplanation(correctCode) || 
                        getDimensionExplanation(dimensionCode) ||
                        'Salah satu kekuatan utama dalam profil karir Anda yang membantu Anda mencapai kesuksesan di bidang yang sesuai.';

          return {
            name: dimensionName,
            letter: dimensionCode,
            insight: insight
          };
        };

        return (
          <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-md mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#FF8C00]" />
                Strengthen (Kekuatan Utama)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strengths.topThree.map((dimensionCode, i) => {
                const dimensionInfo = getDimensionInfo(dimensionCode);
                return (
                  <motion.div
                    key={`${dimensionCode}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 bg-[#FFFDF5] rounded-xl border border-[#E4B200]/20 p-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF8C00] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{dimensionInfo.letter}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#2C2C2C] mb-1">{dimensionInfo.name}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {dimensionInfo.insight}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        );
      })()}

      {skillGaps.length > 0 && (
        <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-[#E4B200]" />
                <span>Skill Gap & Pengembangan</span>
              </div>
              <Button
                onClick={() => {
                  // Navigate ke rekom-skill page
                  const currentUrl = new URL(window.location.href);
                  const idParam = currentUrl.searchParams.get('id') || '';
                  window.location.href = `/personalized?id=${idParam}&menu=rekom-skill`;
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillGaps.slice(0, 5).map((gap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-between items-center border-b border-[#E4B200]/30 pb-3 last:border-none"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#2C2C2C]">{gap.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-[#FFF6DC] text-[#A56400] px-2 py-1 rounded">
                      {gap.priorityLabel}
                    </span>
                    <span className="text-xs bg-[#E4B200]/20 text-[#A56400] px-2 py-1 rounded">
                      {gap.trait}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate ke rekom-skill page
                    const currentUrl = new URL(window.location.href);
                    const idParam = currentUrl.searchParams.get('id') || '';
                    window.location.href = `/personalized?id=${idParam}&menu=rekom-skill`;
                  }}
                  className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1"
                >
                  Pelajari
                </Button>
              </motion.div>
            ))}
            {skillGaps.length > 5 && (
              <p className="text-xs text-gray-500 mt-2">
                +{skillGaps.length - 5} skill gap lainnya
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md p-6">
        <h3 className="text-lg font-bold text-[#2C2C2C] mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#FF8C00]" />
          Analisis Profil Karir
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-[#FFF6DC] rounded-lg border border-[#E4B200]/30">
            <p className="text-sm text-[#2C2C2C]">
              <span className="font-semibold">Level Saat Ini:</span>{" "}
              {profile.level}
            </p>
          </div>
          <div className="p-3 bg-[#FFF6DC] rounded-lg border border-[#E4B200]/30">
            <p className="text-sm text-[#2C2C2C]">
              <span className="font-semibold">Target Pengembangan:</span>{" "}
              {profile.gap}
            </p>
          </div>
          <div className="p-3 bg-[#FFF6DC] rounded-lg border border-[#E4B200]/30">
            <p className="text-sm text-[#2C2C2C]">
              <span className="font-semibold">Status:</span>{" "}
              {profile.role_fit}
            </p>
          </div>
        </div>
      </Card>

      {nextSteps.length > 0 && (
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C]">
              Rekomendasi Tindakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-l-4 ${
                  step.priority === "URGENT"
                    ? "border-red-500 bg-red-50"
                    : step.priority === "HIGH"
                    ? "border-[#FF8C00] bg-orange-50"
                    : "border-[#E4B200] bg-yellow-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-[#2C2C2C]">{step.title}</p>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-white">
                    {step.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <p className="text-xs text-gray-500">Timeline: {step.timeline}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {/* === NEXT STEPS === */}
      {nextSteps.length > 0 && (
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C]">
              Langkah Selanjutnya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextSteps.map((step) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border-l-4 ${
                  step.priority === "URGENT"
                    ? "border-red-500 bg-red-50"
                    : step.priority === "HIGH"
                    ? "border-[#FF8C00] bg-orange-50"
                    : "border-[#E4B200] bg-yellow-50"
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
          </CardContent>
        </Card>
      )}

      {/* === JOB MATCHES === */}
      {formattedJobs.length > 0 && (
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center justify-between">
              <span>Lowongan Terbaik Untukmu</span>
              <Button
                onClick={() => {
                  // Navigate ke rekom-pekerjaan page
                  const currentUrl = new URL(window.location.href);
                  const idParam = currentUrl.searchParams.get('id') || '';
                  window.location.href = `/personalized?id=${idParam}&menu=rekom-pekerjaan`;
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formattedJobs.slice(0, 3).map((job, idx) => (
              <motion.div
                key={job.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  // Navigate ke rekom-pekerjaan dengan role parameter
                  const roleParam = encodeURIComponent(job.role);
                  const currentUrl = new URL(window.location.href);
                  const idParam = currentUrl.searchParams.get('id') || '';
                  window.location.href = `/personalized?id=${idParam}&menu=rekom-pekerjaan&role=${roleParam}`;
                }}
                className="flex justify-between items-center p-3 bg-[#FFF6DC] rounded-lg border border-[#E4B200]/30 hover:shadow-md transition-shadow cursor-pointer hover:bg-[#FFE89C]"
              >
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{job.role}</p>
                  <p className="text-xs text-gray-600">{job.bidang}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FF8C00]">{job.match}%</p>
                  <p className="text-xs text-gray-600">{job.badge}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
