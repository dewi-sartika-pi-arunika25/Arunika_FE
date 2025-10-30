"use client";
import { motion } from "framer-motion";

export default function AnimatedBadge({
  label = "Gratis",
  tone = "free", // "free" | "pro"
  className = "",
}) {
  const isPro = tone === "pro";

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotate: isPro ? 1.5 : -1.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        "absolute -top-4 left-5 z-10 rounded-full px-3.5 py-1 text-xs font-semibold",
        "backdrop-blur-md shadow-sm border",
        className,
      ].join(" ")}
      style={{
        color: isPro ? "#fff" : "var(--text)",
        background: isPro
          ? "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))"
          : "color-mix(in oklab, var(--accent-3) 60%, transparent)",
        borderColor: isPro
          ? "color-mix(in oklab, var(--primary) 50%, transparent)"
          : "color-mix(in oklab, var(--accent-2) 45%, transparent)",
      }}
    >
      {label}
    </motion.div>
  );
}
