"use client";

import { motion } from "framer-motion";
import TeamCard from "./TeamCard";
import { useApproachReveal } from "@/hooks/useMotionPresets";

const TEAM = [
  {
    name: "Sylva",
    role: "Co-Founder",
    photo: "/about/syl.png",
    bio: "UX dan operasi produk. Fokus merapikan sistem dan belajar lewat shipping.",
    links: {
      linkedin: "https://www.linkedin.com/in/sylva-zilyasri",
      github: "https://github.com/zilyasri",
    },
  },
  {
    name: "Candra",
    role: "Co-Founder dan AI Scientist",
    photo: "/about/can.png",
    bio: "Riset model dan arsitektur AI agar jadi fitur yang berdampak.",
    links: {
      linkedin: "https://www.linkedin.com/in/candralorensia/",
      github: "https://github.com/clorensia",
    },
  },
  {
    name: "Zulfa",
    role: "Co-Founder",
    photo: "/about/zuzu.png",
    bio: "Desain dan komunitas. Membangun pengalaman brand yang hangat.",
    links: {
      linkedin: "https://www.linkedin.com/in/zulfanikmah/",
      github: "https://github.com/zulfa-nkmh",
    },
  },
];

export default function AboutUsSection() {
  const { ref, visible } = useApproachReveal({
    amount: 0.28,
    rootMargin: "-10% 0px -10% 0px",
  });

  return (
    <section id="tentang-kami" className="py-16 sm:py-20">
      <div className="wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 10,
            filter: visible ? "blur(0px)" : "blur(2px)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center"
        >
          <p
            className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.22em] border shadow-sm"
            style={{
              color: "var(--accent-2)",
              borderColor: "color-mix(in oklab, var(--accent-2) 45%, transparent)",
              background: "color-mix(in oklab, var(--accent-3) 20%, transparent)",
            }}
          >
            Tentang Kami
          </p>

          <h2
            className="mt-3 sm:mt-4 text-[28px] sm:text-[36px] md:text-[44px] font-extrabold leading-[1.15]"
            style={{ color: "var(--text)" }}
          >
            Arunika dibangun oleh tim kecil yang peduli pada kariermu
          </h2>

          <p
            className="mt-3 mx-auto max-w-2xl text-sm sm:text-[15px] leading-relaxed"
            style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}
          >
            Kami memadukan AI dan komunitas untuk memetakan jalur karier, membangun portofolio,
            dan menghubungkanmu dengan mentor relevan.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
