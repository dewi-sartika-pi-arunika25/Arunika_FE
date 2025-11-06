"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRekomendasiSkillUp, ACADEMIES } from "@/hooks/useRekomendasiSkillUp";
import { BookOpen, ExternalLink, Loader, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function RekomendasiSkillUp() {
  const {
    recommendations,
    loading,
    error,
    expandedItems,
    toggleExpand,
  } = useRekomendasiSkillUp();

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
            const resources = item.resources || [];
            const isExpanded = expandedItems.has(i);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg border-l-4 overflow-hidden ${
                  priority === 5 || priority === "5"
                    ? "border-red-500 bg-red-50"
                    : priority === 4 || priority === "4"
                    ? "border-[#FF8C00] bg-orange-50"
                    : "border-[#E4B200] bg-yellow-50"
                }`}
              >
                {/* Header - Clickable untuk expand */}
                <div 
                  onClick={() => toggleExpand(i)}
                  className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#2C2C2C]">{skillName}</p>
                        {priority && (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white">
                            {priorityLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{skillDesc}</p>
                    </div>
                    <button className="ml-3 text-gray-500 hover:text-gray-700">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Academy Links & Learn Button - Always visible */}
                  <div className="flex items-center gap-2 mt-3">
                    {ACADEMIES.map((academy, idx) => (
                      <a
                        key={idx}
                        href={academy.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:scale-110 transition-transform border border-[#E4B200]/30 hover:border-[#FF8C00]/50 bg-white"
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
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Link ke academy atau resource pertama
                        if (resources.length > 0) {
                          window.open(resources[0], '_blank');
                        }
                      }}
                      className="bg-[#FF8C00] hover:bg-[#E67600] text-white text-xs px-3 py-1 ml-auto"
                    >
                      Pelajari
                    </Button>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 bg-white/50 border-t border-gray-200">
                        {resources.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Sumber Belajar:</p>
                            <ul className="space-y-1">
                              {resources.map((resource, idx) => (
                                <li key={idx}>
                                  <a
                                    href={resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#E4B200] hover:text-[#FF8C00] flex items-center gap-1"
                                  >
                                    <ExternalLink size={12} />
                                    {resource}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {resources.length === 0 && (
                          <p className="text-xs text-gray-600 italic">
                            Gunakan platform academy di atas untuk mempelajari skill ini lebih lanjut.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}