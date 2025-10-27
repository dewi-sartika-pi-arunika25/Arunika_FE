"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Map, Briefcase } from "lucide-react";

/* ====== DATA ======
   Bisa pakai imageSrc (letakkan di /public) ATAU iconName lucide.
   Kalau imageSrc ada, kita tampilkan gambar; kalau tidak, pakai ikon gradien.
*/
const iconsMap = { Brain, Map, Briefcase };

const featureRows = [
  {
    title: "Personalized AI",
    description:
      "Analisis mendalam yang unik untukmu—bukan hasil generik. Asesmen terarah yang memetakan jalur karier sesuai karakter dan potensimu.",
    tag: "AI Powered",
    // imageSrc: "/f1.png",   // ← aktifkan kalau punya gambar
    iconName: "Brain",
  },
  {
    title: "Career Readiness",
    description:
      "Kenali kekuatan & area pengembangan. Dapatkan rekomendasi kegiatan nyata untuk membangun bukti kerja (portfolio) yang relevan.",
    tag: "Roadmap",
    // imageSrc: "/f2.png",
    iconName: "Map",
  },
  {
    title: "Career Connector",
    description:
      "Terhubung dengan mentor & profesional industri. Dapatkan wawasan langsung untuk akselerasi kariermu.",
    tag: "Networking",
    // imageSrc: "/f3.png",
    iconName: "Briefcase",
  },
];

/* ====== VARIANTS (animasi) ====== */
const fly = (dir) => ({
  hidden: { opacity: 0, x: dir === "left" ? -40 : 40, filter: "blur(2px)" },
  show: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 28 }
  },
});
const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
  show: { opacity: 1, y: 0, filter: "blur(0)", transition: { duration: .35 } },
};

function Visual({ imageSrc, iconName }) {
  const Icon = iconName ? iconsMap[iconName] : null;
  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[5/3] rounded-2xl overflow-hidden border shadow-sm"
         style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--background) 88%, transparent)" }}>
      {imageSrc ? (
        <Image src={imageSrc} alt="" fill className="object-cover" />
      ) : (
        <div className="h-full w-full grid place-items-center">
          <div className="rounded-2xl p-5 shadow-sm"
               style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 85%, white), color-mix(in oklab, var(--primary) 55%, transparent))" }}>
            {Icon && <Icon className="h-14 w-14" style={{ color: "white" }} />}
          </div>
        </div>
      )}

      {/* subtle glow */}
      <div aria-hidden className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full blur-2xl"
           style={{ background: "color-mix(in oklab, var(--primary) 30%, transparent)" }} />
    </div>
  );
}

export default function FeatureSection() {
  return (
    <section id="keunggulan" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">

        {/* header */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }}
          className="text-center mx-auto max-w-3xl"
        >
          <motion.p variants={fadeUp}
            className="text-xs uppercase tracking-[0.18em] mb-2"
            style={{ color: "var(--accent-2)" }}>
            Keunggulan
          </motion.p>
          <motion.h2 variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ color: "var(--text)" }}>
            Bukan Sekadar Tes — Ini Strategi Karier Personalmu
          </motion.h2>
          <motion.p variants={fadeUp}
            className="mt-3 text-base"
            style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}>
            Arunika dirancang untuk memberi kejelasan. Scroll dan lihat bagaimana kami membantumu melangkah lebih tepat.
          </motion.p>
        </motion.div>

        {/* rows bergantian (image kiri/kanan) */}
        <div className="mt-12 space-y-12 sm:space-y-16">
          {featureRows.map((f, i) => {
            const reverse = i % 2 === 1 ? "md:flex-row-reverse" : "";
            return (
              <motion.div
                key={f.title}
                className={`reveal flex flex-col md:flex-row ${reverse} items-center gap-6 md:gap-10`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
              >
                {/* visual */}
                <motion.div className="md:w-1/2" variants={fly(i % 2 === 1 ? "right" : "left")}>
                  <Visual imageSrc={f.imageSrc} iconName={f.iconName} />
                </motion.div>

                {/* copy */}
                <motion.div className="md:w-1/2" variants={fly(i % 2 === 1 ? "left" : "right")}>
                  <div className="max-w-xl">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border mb-3"
                      style={{
                        color: "color-mix(in oklab, var(--text) 86%, transparent)",
                        borderColor: "color-mix(in oklab, var(--accent-2) 50%, transparent)",
                        background: "color-mix(in oklab, var(--accent-3) 18%, transparent)",
                      }}
                    >
                      {f.tag}
                    </span>

                    <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
                      {f.title}
                    </h3>

                    <p className="text-[color:var(--text)]/80 leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
