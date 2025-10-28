"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroBase from "./HeroBase";
import StudioScene from "./StudioScene";

export default function LandingHero() {
  const [open, setOpen] = useState(false);

  // close dengan ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <HeroBase
        align="left"
        bgUrl="/hero.jpg"
        title={<>Jika karier adalah musik, <span style={{ color: "var(--primary)" }}>apa playlist-mu?</span></>}
        subtitle="Temukan peran yang paling cocok denganmu. Arunika menganalisis keterampilan, kekuatan, dan kelemahanmu untuk menyusun jalur karier yang relevan. Lengkap dengan rekomendasi lowongan kerja yang sesuai."
        rightSlot={null} 
        ctas={[
          { label: "Mulai Gratis", href: "/register", variant: "primary" },
          { label: "Lihat Dashboard", variant: "ghost", onClick: () => setOpen(true) }, // buka popup
        ]}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />

            {/* dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-full max-w-4xl rounded-2xl border bg-[var(--background)] shadow-2xl overflow-hidden"
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              {/* header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-lg font-semibold text-[var(--text)]">Cara Kerja Arunika</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm border hover:bg-black/5"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  aria-label="Tutup"
                >
                  Tutup
                </button>
              </div>

              {/* content: pakai scene/dashboard */}
              <div className="p-5 md:p-6">
                <StudioScene />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
