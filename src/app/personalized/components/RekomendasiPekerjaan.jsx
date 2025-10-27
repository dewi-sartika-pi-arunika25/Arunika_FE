"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Loader, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function RekomendasiPekerjaan() {
  const { formattedJobs, loading, error } = usePersonalizedProfile();

  const platforms = [
    { name: "LinkedIn", url: "https://linkedin.com/jobs", icon: "/linkedin.svg" },
    { name: "JobStreet", url: "https://www.jobstreet.co.id", icon: "/jobstreet.png" },
    { name: "Tech-in-Asia", url: "https://techinasia.com", icon: "/techinasia.png" },
    { name: "Sribulancer", url: "https://www.sribulancer.com", icon: "/sribulancer.jpeg" },
  ];

  if (loading) {
    return (
      <div className="p-8 pt-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Memuat rekomendasi lowongan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pt-24">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-red-700 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formattedJobs || formattedJobs.length === 0) {
    return (
      <div className="p-8 pt-24">
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Belum ada rekomendasi lowongan. Selesaikan skill gap Anda terlebih dahulu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topMatch = Math.max(...formattedJobs.map(j => j.match));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-24 space-y-6"
    >
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#FF8C00]" />
            Rekomendasi Pekerjaan ({formattedJobs.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {formattedJobs.map((job, i) => {
            const isTop = job.match === topMatch;

            return (
              <motion.div
                key={job.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`relative border border-[#E4B200]/30 p-4 rounded-xl transition-all duration-300 hover:bg-[#FFF6DC] ${
                  isTop ? "border-[#FF8C00]/70 shadow-lg scale-[1.02] bg-[#FFF6DC]" : ""
                }`}
              >
                {/* Top Badge */}
                {isTop && (
                  <div className="absolute -top-3 -right-3 bg-[#FF8C00] text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ Top Match
                  </div>
                )}

                {/* === Job Header === */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p
                      className={`${
                        isTop
                          ? "text-[#A56400] text-base font-bold"
                          : "text-[#2C2C2C] text-sm font-semibold"
                      }`}
                    >
                      {job.role}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{job.bidang}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`${
                        isTop
                          ? "text-[#FF8C00] text-lg font-bold"
                          : "text-[#E4B200] text-sm font-semibold"
                      }`}
                    >
                      {job.match}%
                    </p>
                    <p className="text-xs text-gray-600">{job.badge}</p>
                  </div>
                </div>

                {/* === Progress Bar === */}
                <Progress
                  value={job.match}
                  className={`h-2 bg-[#FFFDF5] [&>div]:${
                    isTop ? "bg-[#FF8C00]" : "bg-[#E4B200]"
                  }`}
                />

                {/* === Job Description === */}
                {job.description && (
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                    {job.description}
                  </p>
                )}

                {/* === Platform Links === */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-[#E4B200]/20">
                  {platforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFDF5] border border-[#E4B200]/40 hover:bg-[#E4B200]/20 transition-all hover:scale-110"
                      title={`Cari di ${p.name}`}
                    >
                      <Image
                        src={p.icon}
                        alt={p.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </a>
                  ))}
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/30 hover:bg-[#FF8C00] hover:text-white transition-all hover:scale-110"
                      title="Lihat lowongan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
