"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { aiProfileData } from "../data/aiProfileData";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RekomendasiPekerjaan() {
  const { jobMatches } = aiProfileData;
  const topMatch = Math.max(...jobMatches.map((j) => j.match));

  const platforms = [
    { name: "Tech-in-Asia", url: "https://techinasia.com", icon: "/techinasia.png" },
    { name: "LinkedIn", url: "https://linkedin.com/jobs", icon: "/linkedin.svg" },
    { name: "JobStreet", url: "https://www.jobstreet.co.id", icon: "/jobstreet.png" },
    { name: "Sribulancer", url: "https://www.sribulancer.com", icon: "/sribulancer.jpeg" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 pt-24 space-y-6"
    >
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#2C2C2C]">
            Rekomendasi Pekerjaan
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {jobMatches.map((job, i) => {
            const isTop = job.match === topMatch;

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className={`relative border border-[#E4B200]/30 p-4 rounded-xl transition-all duration-300 hover:bg-[#FFF6DC] ${
                  isTop ? "border-[#FF8C00]/70 shadow-lg scale-[1.02]" : ""
                }`}
              >
                {/* === Job Title & Match === */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className={`${
                        isTop
                          ? "text-[#A56400] text-base font-bold"
                          : "text-[#2C2C2C] text-sm font-semibold"
                      }`}
                    >
                      {job.role}
                    </p>
                    <p className="text-xs text-gray-600">Role Fit: {job.badge}</p>
                  </div>
                  <p
                    className={`${
                      isTop
                        ? "text-[#FF8C00] text-lg font-bold"
                        : "text-[#E4B200] text-sm font-semibold"
                    }`}
                  >
                    {job.match}%
                  </p>
                </div>

                {/* === Progress Bar === */}
                <Progress
                  value={job.match}
                  className={`h-2 bg-[#FFFDF5] [&>div]:${
                    isTop ? "bg-[#FF8C00]" : "bg-[#E4B200]"
                  }`}
                />

                {/* === Platform Links === */}
                <div className="flex gap-3 mt-3">
                  {platforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFDF5] border border-[#E4B200]/40 hover:bg-[#FFF6DC] transition-all"
                      title={`Cari di ${p.name}`}
                    >
                      <Image
                        src={p.icon}
                        alt={p.name}
                        width={26}
                        height={26}
                        className="object-contain rounded-full hover:scale-110 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
