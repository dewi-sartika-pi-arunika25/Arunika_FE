"use client";

import { motion } from "framer-motion";
import { Target, BookOpenCheck, Brain, Briefcase, Sparkles } from "lucide-react";
import FeatureCard from "./FeatureCard";

// Map tag ke ikon default biar otomatis ada ikon di chip
const TAG_ICON = {
  Onboarding:   <Sparkles className="h-3.5 w-3.5" />,
  Assessment:   <BookOpenCheck className="h-3.5 w-3.5" />,
  "AI Insights": <Brain className="h-3.5 w-3.5" />,
  Opportunities:<Briefcase className="h-3.5 w-3.5" />,
  "Skill Development": <Target className="h-3.5 w-3.5" />,
};

const featureRows = [
  {
    title: "Profil Awal yang Bermakna",
    tag: "Onboarding",
    icon: TAG_ICON["Onboarding"],
    imageSrc: "/feature-profile.png",
    alt: "Tampilan pengisian profil awal pengguna",
    description:
      "Isi pekerjaan, pendidikan, tujuan karier, dan minatmu. Data ini jadi fondasi strategi yang personal, bukan template umum.",
  },
  {
    title: "Skill Match yang Terarah",
    tag: "Assessment",
    icon: TAG_ICON["Assessment"],
    imageSrc: "/feature-assessment.png",
    alt: "Ilustrasi asesmen skill dan hasil evaluasi",
    description:
      "Asesmen mengenali kekuatan dan area pengembangan. Hasilnya bukan sekadar skor, tapi gambaran jelas agar kamu tahu arah langkah.",
  },
  {
    title: "Personalisasi Mendalam dengan AI",
    tag: "AI Insights",
    icon: TAG_ICON["AI Insights"],
    imageSrc: "/feature-ai.png",
    alt: "Grafik analitik AI dengan role fit dan skill gaps",
    description:
      "Analisis unik seperti Role Fit, Skill Gaps, dan Kekuatan Utama yang siap ditindaklanjuti.",
  },
  {
    title: "Rekomendasi Karier yang Relevan",
    tag: "Opportunities",
    icon: TAG_ICON["Opportunities"],
    imageSrc: "/feature-jobs.png",
    alt: "Daftar lowongan",
    description:
      "Lowongan selaras profil plus saran skill-up yang fokus pada dampak nyata.",
  },
  {
    title: "Rekomendasi SkillUp yang Relevan",
    tag: "Skill Development",
    icon: TAG_ICON["Skill Development"],
    imageSrc: "/feature-skillup.png",
    alt: "Ilustrasi pengembangan keterampilan",
    description:
      "Bantu menutup celah keterampilan dengan rekomendasi materi yang langsung bisa dipraktikkan.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function FeatureGrid() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      className="
        mt-10 sm:mt-12
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-5 lg:gap-6
      "
    >
      {featureRows.map((feature, idx) => (
        <FeatureCard key={idx} feature={feature} />
      ))}
    </motion.div>
  );
}
