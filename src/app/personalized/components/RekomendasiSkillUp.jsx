"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { aiProfileData } from "../data/aiProfileData";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RekomendasiSkillUp() {
  const { skillGaps } = aiProfileData;

  // Link masing-masing academy
  const academies = [
    { src: "/skilvul.ico", link: "https://www.skillvul.com" },
    { src: "/coursera-logo.png", link: "https://www.coursera.org" },
    { src: "/growgoogle.jpg", link: "https://grow.google/certificates" },
    { src: "/ruangguru.jpg", link: "https://www.ruangguru.com/academy" },
  ];

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
            Rekomendasi Skill Up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillGaps.map((gap, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-[#E4B200]/30 pb-2 last:border-none"
            >
              <span className="text-gray-700">{gap.name}</span>
              <div className="flex items-center gap-2">
                {academies.map((academy, idx) => (
                  <a key={idx} href={academy.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={academy.src}
                      alt="academy"
                      className="h-9 w-9 object-contain rounded-full hover:scale-110 transition-transform"
                    />
                  </a>
                ))}
                <Button className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1">
                  Pelajari
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
