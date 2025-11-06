// JS, bukan TS
import { Target, BookOpenCheck, Brain, Briefcase, Sparkles } from "lucide-react";

export const TAG_ICON = {
  Onboarding: <Sparkles className="h-3.5 w-3.5" />,
  Assessment: <BookOpenCheck className="h-3.5 w-3.5" />,
  "AI Insights": <Brain className="h-3.5 w-3.5" />,
  Opportunities: <Briefcase className="h-3.5 w-3.5" />,
  "Skill Development": <Target className="h-3.5 w-3.5" />,
};

export const FEATURES = [
  {
    title: "Profil Awal yang Bermakna",
    tag: "Onboarding",
    imageSrc: "/feature-profile.png",
    alt: "Tampilan pengisian profil awal pengguna",
    description:
      "Isi pekerjaan, pendidikan, tujuan, dan minat. Ini jadi fondasi strategi yang personal, bukan template umum.",
  },
  {
    title: "Skill Match yang Terarah",
    tag: "Assessment",
    imageSrc: "/feature-assessment.png",
    alt: "Ilustrasi asesmen skill dan hasil evaluasi",
    description:
      "Asesmen mengenali kekuatan dan area pengembangan. Hasilnya bukan sekadar skor, tetapi arah langkah yang jelas.",
  },
  {
    title: "Personalisasi Mendalam dengan AI",
    tag: "AI Insights",
    imageSrc: "/feature-ai.png",
    alt: "Grafik analitik AI dengan role fit dan skill gaps",
    description:
      "Role Fit, Skill Gaps, dan Kekuatan Utama dirangkum menjadi wawasan yang bisa langsung ditindaklanjuti.",
  },
  {
    title: "Rekomendasi Karier yang Relevan",
    tag: "Opportunities",
    imageSrc: "/feature-jobs.png",
    alt: "Daftar lowongan yang relevan",
    description:
      "Lowongan selaras profil plus saran skill-up yang fokus pada dampak nyata.",
  },
  {
    title: "Rekomendasi SkillUp yang Relevan",
    tag: "Skill Development",
    imageSrc: "/feature-skillup.png",
    alt: "Ilustrasi pengembangan keterampilan",
    description:
      "Menutup celah keterampilan dengan materi terkurasi yang langsung bisa dipraktikkan.",
  },
];
