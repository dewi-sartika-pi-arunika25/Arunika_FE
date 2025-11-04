"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TAG_ICON } from "./data";

export default function FeatureVisual({ current }) {
  const cardRef = useRef(null);
  const imgWrapRef = useRef(null);

  // Scroll parallax/zoom
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 80%", "end 20%"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const scaleZoom  = useTransform(scrollYProgress, [0, 1], [1.02, 1.06]);
  const glowAlpha  = useTransform(scrollYProgress, [0, 1], [0.10, 0.28]);

  const ySpring     = useSpring(yParallax,  { stiffness: 120, damping: 20 });
  const scaleSpring = useSpring(scaleZoom,  { stiffness: 120, damping: 20 });
  const glowSpring  = useSpring(glowAlpha,  { stiffness: 120, damping: 20 });

  // Hover tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, z: 1 });
  const onMove = (e) => {
    if (!imgWrapRef.current) return;
    const r = imgWrapRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    const max = 6;
    setTilt({ rx: dy * -max, ry: dx * max, z: 1.01 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, z: 1 });

  return (
    <div className="lg:pl-2" ref={cardRef}>
      <motion.article
        className="relative rounded-2xl border shadow-[0_14px_50px_-18px_rgba(0,0,0,.15)] bg-white/92 overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        {/* glow belakang gambar */}
        <motion.div
          aria-hidden
          className="absolute -z-0 left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            opacity: glowSpring,
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--accent-2) 68%, transparent), transparent 70%)",
          }}
        />

        <div className="relative px-4 sm:px-6 z-[1]">
          <motion.div
            ref={imgWrapRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative mx-auto w-full rounded-2xl overflow-hidden border will-change-transform mt-4"
            style={{
              borderColor: "color-mix(in oklab, var(--accent-3) 55%, var(--border))",
              background: "color-mix(in oklab, var(--background) 92%, transparent)",
              boxShadow: "0 22px 42px -18px rgba(0,0,0,.18)",
              transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.z})`,
            }}
          >
            {/* Gambar + overlay gradient */}
            <motion.div
              className="relative w-full aspect-[16/9] sm:aspect-[5/3]"
              style={{ y: ySpring, scale: scaleSpring }}
            >
              <Image
                src={current.imageSrc}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 50vw, (min-width:768px) 60vw, 100vw"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 65%, rgba(0,0,0,.08))",
                }}
              />
            </motion.div>

            {/* ⬇️ Badge dipindah ke SETELAH gambar & diberi z tinggi */}
            <div
              className="absolute inset-x-0 top-0 z-[30] flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold backdrop-blur-md shadow-sm"
                style={{
                  color: "color-mix(in oklab, var(--text) 92%, transparent)",
                  borderColor: "color-mix(in oklab, var(--accent-2) 55%, transparent)",
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--background) 70%, transparent), color-mix(in oklab, var(--background) 35%, transparent))",
                }}
              >
                <span className="text-[var(--primary)]">{TAG_ICON[current.tag]}</span>
                <span>{current.tag}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}
