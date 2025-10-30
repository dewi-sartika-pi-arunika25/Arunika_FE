"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Parallax from "./Parallax";
import CTAButton from "./CTAButton";

export default function HeroBase({
  eyebrow,
  title,
  subtitle,
  ctas = [],
  bgUrl,
  align = "center",
  navOffset = false,
  scrollLink, // { label, href }
}) {
  const alignText =
    align === "left" ? "text-left items-start" : "text-center items-center";

  // overlay lembut agar teks kebaca
  const wash =
    "linear-gradient(180deg, rgba(255,253,244,.92) 0%, rgba(255,253,244,.78) 36%, rgba(255,253,244,.56) 100%)";
  const centerScrim = "linear-gradient(0deg, rgba(20,22,28,.16), rgba(20,22,28,.16))";

  // show/hide konten saat scroll
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const topClamp = 24;
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const goingUp = y < lastY.current;
      const nearTop = y <= topClamp;
      setVisible(nearTop || goingUp);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // spotlight konten
  const wrapRef = useRef(null);
  const onMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  return (
    <section
      id="hero"
      aria-label="Bagian pembuka"
      className="relative w-screen mx-[calc(50%-50vw)] overflow-hidden"
      style={{
        paddingTop: navOffset ? "var(--nav-h, 72px)" : undefined,
        marginTop: navOffset ? undefined : "calc(var(--nav-h, 72px) * -1)",
      }}
    >
      {/* Background nempel ke atas + parallax */}
      {bgUrl && (
        <>
          <Parallax
            className="absolute inset-0 -z-20 will-change-transform"
            yStrength={120}
            scaleFrom={1}
            scaleTo={1.05}
            mouseTilt
            disabledBelow={768}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${bgUrl})`,
                top: "calc(var(--nav-h, 72px) * -1)",
                height: "calc(100% + var(--nav-h, 72px))",
                position: "absolute",
                insetInline: 0,
              }}
            />
          </Parallax>
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: wash }} />
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: centerScrim }} />
        </>
      )}

      {/* Content wrapper — diturunkan + spotlight halus */}
      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        className="relative z-10 flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-20"
        style={{
          minHeight: "84vh",
          maxHeight: "96vh",
          paddingTop: "clamp(12vh, 14vh, 16vh)",
          paddingBottom: "clamp(8vh, 10vh, 12vh)",
          background:
            "radial-gradient(200px 160px at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--background) 40%, transparent), transparent 70%)",
          transition: "background .15s ease",
        }}
      >
        <AnimatePresence initial mode="popLayout">
          {visible && (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, y: 18, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.995 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`mx-auto flex max-w-4xl flex-col gap-4 ${alignText}`}
            >
              {eyebrow && (
                <p
                  className="uppercase tracking-[0.18em] text-[11px] sm:text-xs"
                  style={{ color: "var(--accent-2)" }}
                >
                  {eyebrow}
                </p>
              )}

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[var(--text)]"
                style={{ transition: "transform .18s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {title}
              </h1>

              {subtitle && (
                <motion.p
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={`text-base sm:text-lg leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
                  style={{ color: "color-mix(in oklab, var(--text) 88%, transparent)" }}
                >
                  {subtitle}
                </motion.p>
              )}

              {!!ctas.length && (
                <div className={`mt-4 flex gap-3 flex-wrap ${align === "center" ? "justify-center" : ""}`}>
                  {ctas.map((c) => (
                    <CTAButton key={c.label} {...c} />
                  ))}
                </div>
              )}

              {/* (hapus microcopy gratis) */}

              {/* Link scroll: teks saja + efek hover */}
              {scrollLink?.href && (
                <div className="mt-6 flex justify-center">
                  <a
                    href={scrollLink.href}
                    className="group inline-flex items-center gap-1 text-sm font-medium tracking-wide"
                    style={{
                      color: "color-mix(in oklab, var(--text) 78%, transparent)",
                    }}
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
                      <path
                        d="M12 5v14m0 0l-6-6m6 6l6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wave bawah */}
      <svg aria-hidden className="block w-full translate-y-px" viewBox="0 0 1440 110" preserveAspectRatio="none">
        <path d="M0,70 C420,150 1020,0 1440,70 L1440,110 L0,110 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
