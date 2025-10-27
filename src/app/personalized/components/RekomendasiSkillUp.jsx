"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { BookOpen, ExternalLink, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RekomendasiSkillUp() {
  const { formattedSkills, skillGaps, loading, error } = usePersonalizedProfile();

  const academies = [
    { name: "Skillvul", src: "/skilvul.ico", link: "https://www.skillvul.com" },
    { name: "Coursera", src: "/coursera-logo.png", link: "https://www.coursera.org" },
    { name: "Google", src: "/growgoogle.jpg", link: "https://grow.google/certificates" },
    { name: "Ruang Guru", src: "/ruangguru.jpg", link: "https://www.ruangguru.com/academy" },
  ];

  if (loading) {
    return (
      <div className="p-8 pt-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Memuat rekomendasi SkillUp...</p>
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

  // Combine skill gaps + formatted skills untuk rekomendasi lengkap
  const recommendations = skillGaps.length > 0 ? skillGaps : formattedSkills;

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-8 pt-24">
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Belum ada skill gap yang terdeteksi. Anda sudah siap!</p>
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
      className="p-8 pt-24 space-y-6"
    >
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#E4B200]" />
            Rekomendasi Skill Up ({recommendations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((item, i) => {
            const skillName = item.name || item.skillup?.nama_skillup || "Skill";
            const skillDesc = item.description || item.skillup?.deskripsi || "Kembangkan skill ini untuk meningkatkan profil";
            const priority = item.priority;
            const priorityLabel = item.priorityLabel || "Medium";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  priority === 5 || priority === "5"
                    ? "border-red-500 bg-red-50"
                    : priority === 4 || priority === "4"
                    ? "border-[#FF8C00] bg-orange-50"
                    : "border-[#E4B200] bg-yellow-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-[#2C2C2C]">{skillName}</p>
                    <p className="text-sm text-gray-600 mt-1">{skillDesc}</p>
                  </div>
                  {priority && (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white ml-2">
                      {priorityLabel}
                    </span>
                  )}
                </div>

                {/* === Academy Links & Learn Button === */}
                <div className="flex items-center gap-2 mt-3">
                  {academies.map((academy, idx) => (
                    <a
                      key={idx}
                      href={academy.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:scale-110 transition-transform border border-[#E4B200]/30 hover:border-[#FF8C00]/50"
                      title={academy.name}
                    >
                      <Image
                        src={academy.src}
                        alt={academy.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </a>
                  ))}
                  <Button className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1 ml-auto">
                    Pelajari
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}