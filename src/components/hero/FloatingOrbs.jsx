"use client";

import { motion } from "framer-motion";

export default function FloatingOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute rounded-full blur-2xl opacity-40"
        style={{ width: 300, height: 300, background: "var(--accent-1)" }}
        initial={{ x: -120, y: 80 }}
        animate={{ x: 20, y: 0 }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-2xl opacity-40"
        style={{ width: 240, height: 240, background: "var(--accent-3)" }}
        initial={{ right: -80, top: 120 }}
        animate={{ right: 60, top: 40 }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-2xl opacity-30"
        style={{ width: 280, height: 280, background: "var(--primary)" }}
        initial={{ left: "45%", bottom: -60 }}
        animate={{ left: "50%", bottom: 0 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
    </div>
  );
}
