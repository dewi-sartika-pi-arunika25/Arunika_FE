"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { aiProfileData } from "../data/aiProfileData";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, ArrowUpRight, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function AnalisisAI() {
  const { education, skillGaps } = aiProfileData;

  // Contoh data Strengthen (bisa kamu ganti dengan data dinamis AI nanti)
  const strengths = [
    { name: "Analytical Thinking", desc: "Mampu memecahkan masalah dengan pendekatan logis dan berbasis data" },
    { name: "Leadership", desc: "Mampu mengarahkan tim dan mengambil keputusan strategis dengan empati" },
    { name: "Creativity", desc: "Mampu menciptakan ide baru dan solusi out-of-the-box di lingkungan kerja" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-24 space-y-8"
    >
      {/* === STRENGTHEN SECTION === */}
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF8C00]" />
            Strengthen (Kekuatan Utama)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {strengths.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#FFFDF5] rounded-xl border border-[#E4B200]/20 p-3"
            >
              <CheckCircle2 className="h-5 w-5 text-[#FF8C00] mt-1" />
              <div>
                <p className="font-semibold text-[#2C2C2C]">{item.name}</p>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* === SKILL GAP SECTION === */}
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-[#E4B200]" />
            Skill Gap & Pengembangan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillGaps.map((gap, i) => (
            <div key={i} className="flex justify-between items-center border-b border-[#E4B200]/30 pb-2 last:border-none">
              <span className="text-gray-700">{gap.name}</span>
              <Button className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1">
                Pelajari
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* === ANALISIS & REKOMENDASI KARIR AI === */}
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md p-6">
        <h3 className="text-lg font-bold text-[#2C2C2C] mb-2 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#FF8C00]" />
          {education.title}
        </h3>
        <p className="text-sm text-gray-600">{education.description}</p>
        <p className="text-xs text-gray-500 mt-2">{education.year}</p>
      </Card>
    </motion.div>
  );
}
