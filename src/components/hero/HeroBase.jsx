"use client";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useThrottle } from "@/hooks/useThrottle";
import CTAButton from "./CTAButton";

export default function HeroBase({
  eyebrow,
  title,
  subtitle,
  ctas = [],
  bgUrl,
  align = "center",
  navOffset = true,
  scrollLink,
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const alignText = align === "left" ? "text-left items-start" : "text-center items-center";
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // Throttle scroll handler to improve performance
  const handleScroll = useCallback(() => {
    const y = window.scrollY || 0;
    const up = y < lastY.current;
    const nearTop = y <= 24;
    setVisible(nearTop || up);
    lastY.current = y;
  }, []);

  const throttledScroll = useThrottle(handleScroll, 100);

  useEffect(() => {
    // Initial check
    handleScroll();
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [throttledScroll, handleScroll]);

  // Optimize scroll transforms with reduced motion support
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  // Create transforms only once (useTransform hooks must be called at top level)
  const bgScale = shouldReduceMotion ? 1 : useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = shouldReduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [0, 48]);
  const titleY = shouldReduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [0, -14]);
  const subtitleOpacity = shouldReduceMotion ? 1 : useTransform(scrollYProgress, [0, 0.25, 1], [1, 1, 0.85]);
  
  const transforms = useMemo(() => ({
    bgScale,
    bgY,
    titleY,
    subtitleOpacity,
  }), [bgScale, bgY, titleY, subtitleOpacity]);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Bagian pembuka"
      className="relative w-screen mx-[calc(50%-50vw)] overflow-hidden"
      style={{
        position: 'relative', // Fix for scroll offset calculation
        marginTop: "calc(var(--nav-h,72px) * -1)",
        paddingTop: navOffset ? "calc(var(--nav-h,72px) + 24px)" : undefined,
      }}
    >
      {bgUrl && (
        <>
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-20 bg-center bg-cover will-change-transform"
            style={{ backgroundImage: `url(${bgUrl})`, top: 0, height: "100%", scale: transforms.bgScale, y: transforms.bgY }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ background: "linear-gradient(180deg, rgba(255,253,244,.88) 0%, rgba(255,253,244,.76) 36%, rgba(255,253,244,.56) 100%)" }}
          />
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(0deg, rgba(20,22,28,.14), rgba(20,22,28,.14))" }} />
        </>
      )}

      <div
        className="relative z-10 flex items-center justify-center px-6 sm:px-8 md:px-12"
        style={{ minHeight: "88vh", maxHeight: "96vh", paddingTop: "clamp(8vh, 11vh, 13vh)", paddingBottom: "clamp(8vh, 10vh, 12vh)" }}
      >
        <AnimatePresence initial mode="popLayout">
          {visible && (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, y: 22, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.995 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`wrap w-full mx-auto flex flex-col ${alignText} gap-7 max-w-[1120px]`}
              style={{ y: transforms.titleY }}
            >
              {eyebrow && (
                <p className="uppercase tracking-[0.18em] text-[11px] sm:text-xs" style={{ color: "var(--accent-2)" }}>
                  {eyebrow}
                </p>
              )}

              <h1 className="text-[var(--text)]">{title}</h1>

              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mx-auto w-full max-w-[1000px] space-y-5"
                  style={{ opacity: transforms.subtitleOpacity, color: "color-mix(in oklab, var(--text) 90%, transparent)" }}
                >
                  {subtitle}
                </motion.div>
              )}

              {!!ctas.length && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  className="mt-2 flex gap-3 flex-wrap justify-center"
                >
                  {ctas.map((c) => (
                    <CTAButton key={c.label} {...c} />
                  ))}
                </motion.div>
              )}

              {scrollLink?.href && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
                  className="mt-2 flex justify-center"
                >
                  <a
                    href={scrollLink.href}
                    className="group inline-flex items-center gap-1 text-sm font-medium tracking-wide"
                    style={{ color: "color-mix(in oklab, var(--text) 80%, transparent)" }}
                  >
                    <span className="relative">
                      {scrollLink.label || "Lihat keunggulan kami"}
                      <span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                    </span>
                    <svg
                      className="h-4 w-4 opacity-0 translate-y-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <svg aria-hidden className="block w-full translate-y-px" viewBox="0 0 1440 110" preserveAspectRatio="none">
        <path d="M0,70 C420,150 1020,0 1440,70 L1440,110 L0,110 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
