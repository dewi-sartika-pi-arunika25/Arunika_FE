"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { Briefcase, Target, TrendingUp, Sparkles, Loader } from "lucide-react";
import { motion } from "framer-motion";

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
    formattedJobs
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
          <CardContent className="p-4 text-red-700">
            {error || "Gagal memuat profil"}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user name dari API response atau fallback
  const userName = user?.name || "Pengguna Arunika";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-24 space-y-6"
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

      {/* === PROGRESS SUMMARY === */}
      <div className="grid grid-cols-3 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
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

      {/* === TOP STRENGTHS === */}
      {strengths.topThree && strengths.topThree.length > 0 && (
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF8C00]" />
              Kekuatan Utamamu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Archetype: <span className="font-semibold text-[#A56400]">{strengths.archetype}</span>
            </p>
            <div className="space-y-2">
              {strengths.topThree.map((strength, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#FFF6DC] p-2 rounded-lg border border-[#E4B200]/30"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF8C00] text-white text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{strength}</span>
                </div>
              ))}
            </div>
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

      {/* === TOP JOB MATCHES PREVIEW === */}
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