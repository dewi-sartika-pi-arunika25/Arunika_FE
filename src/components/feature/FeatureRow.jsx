"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const featureRows = [
  {
    title: "Profil Awal yang Bermakna",
    tag: "Onboarding",
    imageSrc: "/feature-profile.png",
    alt: "Tampilan pengisian profil awal pengguna",
    description:
      "Isi pekerjaan, pendidikan, tujuan karier, dan minatmu. Data ini menjadi fondasi strategi yang benar-benar personal bukan sekedar template umum.",
  },
  {
    title: "Skill Match yang Terarah",
    tag: "Assessment",
    imageSrc: "/feature-assessment.png",
    alt: "Ilustrasi asesmen skill dan hasil evaluasi",
    description:
      "Jawab asesmen yang kami rancang untuk mengenali kekuatan dan area pengembanganmu. Hasilnya bukan sekadar skor, melainkan gambaran potensi yang jelas agar kamu tahu harus melangkah ke mana.",
  },
  {
    title: "Personalisasi Mendalam dengan AI",
    tag: "AI Insights",
    imageSrc: "/feature-ai.png",
    alt: "Grafik analitik AI dengan role fit dan skill gaps",
    description:
      "Dapatkan analisis unik: Role Fit (peran yang paling cocok), Skill Gaps (keterampilan yang perlu ditingkatkan), dan Kekuatan Utama. Semua dirangkum menjadi wawasan yang bisa ditindaklanjuti.",
  },
  {
    title: "Rekomendasi Karier yang Relevan",
    tag: "Opportunities",
    imageSrc: "/feature-jobs.png",
    alt: "Daftar lowongan kerja dan saran skill-up",
    description:
      "Kami bantu kamu melangkah lebih tepat dengan lowongan yang selaras dengan profil serta saran skill-up yang bisa langsung dipelajari dan fokus pada dampak nyata, bukan sekadar checklist.",
  },
  {
    title: "Rekomendasi SkillUp yang Relevan",
    tag: "Skill Development",
    imageSrc: "/feature-skillup.png",
    alt: "Ilustrasi pengembangan keterampilan berbasis rekomendasi AI",
    description:
      "Arunika tidak hanya menunjukkan celah keterampilanmu, kami bantu kamu menutupnya. Dengan rekomendasi skill yang relevan dan langsung bisa dipelajari, kamu tahu persis langkah apa yang perlu diambil untuk berkembang dan tetap kompetitif.",
  },
];

const fly = (dir) => ({
  hidden: { opacity: 0, x: dir === "left" ? -40 : 40, filter: "blur(2px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
});

function Visual({ imageSrc, alt = "", objectPosition = "center" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative w-full will-change-transform"
    >
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[5/3] rounded-2xl overflow-hidden border shadow-sm transition-shadow duration-300"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in oklab, var(--background) 88%, transparent)",
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          sizes="(min-width: 1024px) 48vw, (min-width: 768px) 50vw, 100vw"
          priority={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition-[box-shadow,ring] duration-300"
          style={{ ringColor: "color-mix(in oklab, var(--accent-2) 28%, transparent)" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full blur-2xl"
        style={{ background: "color-mix(in oklab, var(--primary) 26%, transparent)" }}
      />
    </motion.div>
  );
}

export default function FeatureRows() {
  return (
    <div
      className="
        mt-12
        space-y-12 sm:space-y-14 lg:space-y-20
      "
    >
      {featureRows.map((f, i) => {
        const reverse = i % 2 === 1 ? "md:flex-row-reverse" : "";
        return (
          <motion.div
            key={f.title}
            className={`
              reveal flex flex-col items-center md:items-center
              gap-8 sm:gap-10 md:gap-12 lg:gap-16
              md:flex-row ${reverse}
            `}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
          >
            <motion.div className="md:w-1/2" variants={fly(i % 2 === 1 ? "right" : "left")}>
              <Visual imageSrc={f.imageSrc} alt={f.alt} />
            </motion.div>

            <motion.div className="md:w-1/2" variants={fly(i % 2 === 1 ? "left" : "right")}>
              <div
                className="
                  max-w-xl
                  pt-1 sm:pt-2 md:pt-3
                "
              >
                <span
                  className="
                    mb-4
                    inline-flex items-center rounded-full border
                    px-3.5 py-1.5
                    text-xs sm:text-[13px]
                    font-semibold
                  "
                  style={{
                    color: "color-mix(in oklab, var(--text) 86%, transparent)",
                    borderColor: "color-mix(in oklab, var(--accent-2) 50%, transparent)",
                    background: "color-mix(in oklab, var(--accent-3) 18%, transparent)",
                  }}
                >
                  {f.tag}
                </span>

                <h3
                  className="
                    text-[22px] sm:text-[26px] md:text-[28px]
                    font-bold tracking-tight
                    leading-[1.15]
                    mb-2.5 sm:mb-3
                  "
                  style={{ color: "var(--text)" }}
                >
                  {f.title}
                </h3>

                <p
                  className="
                    text-[15px] sm:text-[16px] md:text-[17px]
                    leading-relaxed
                    text-[color:var(--text)]/82
                  "
                >
                  {f.description}
                </p>

                <div className="mt-5 sm:mt-6" />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
