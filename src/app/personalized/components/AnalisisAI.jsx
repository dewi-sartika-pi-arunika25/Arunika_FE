"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
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


export default function AnalisisAI() {
  const {
    profile,
    user,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    skillGaps,
    nextSteps,
    formattedJobs,
  } = usePersonalizedProfile();

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

  const userName = user?.name || "Pengguna Arunika";



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-24 space-y-8"
    >
      {/* === WELCOME CARD === */}
      <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-md text-[#2C2C2C]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Selamat Datang, {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Role Fit Anda: <span className="font-bold text-[#FF8C00]">{roleFit}%</span>
            {roleFit >= 75 && " - Sudah siap untuk apply!"}
            {roleFit < 60 && " - Fokus pada skill gap di bawah."}
            {roleFit >= 60 && roleFit < 75 && " - Tingkatkan beberapa skill lagi."}
          </p>
        </CardContent>
      </Card>

      {/* === SUMMARY === */}
      <div className="grid grid-cols-3 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className={`${metric.color} mb-2`}>
                {metric.title === "Role Fit" && <Target className="h-5 w-5" />}
                {metric.title === "Level" && <TrendingUp className="h-5 w-5" />}
                {metric.title === "Skill Gaps" && <Briefcase className="h-5 w-5" />}
              </div>
              <p className="text-lg font-bold text-[#2C2C2C]">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.title}</p>
              {metric.benchmark && (
                <p className="text-xs text-[#FF8C00] font-semibold mt-1">
                  {metric.benchmark}
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* === ANALISIS AI (DARI AnalisisAI.jsx) === */}
      {strengths.topThree && strengths.topThree.length > 0 && (
        <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-md mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF8C00]" />
              Strengthen (Kekuatan Utama)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.topThree.map((strength, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 bg-[#FFFDF5] rounded-xl border border-[#E4B200]/20 p-3"
              >
                <CheckCircle2 className="h-5 w-5 text-[#FF8C00] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{strength}</p>
                  <p className="text-sm text-gray-700">
                    Salah satu kekuatan utama dalam profil karir Anda
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {skillGaps.length > 0 && (
        <Card className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF6DC] border border-[#E4B200]/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-[#E4B200]" />
              Skill Gap & Pengembangan
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
                <Button className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1">
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
            <CardTitle className="text-lg font-bold text-[#2C2C2C]">
              Lowongan Terbaik Untukmu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formattedJobs.slice(0, 3).map((job, idx) => (
              <div
                key={job.id || idx}
                className="flex justify-between items-center p-3 bg-[#FFF6DC] rounded-lg border border-[#E4B200]/30 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{job.role}</p>
                  <p className="text-xs text-gray-600">{job.bidang}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FF8C00]">{job.match}%</p>
                  <p className="text-xs text-gray-600">{job.badge}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
