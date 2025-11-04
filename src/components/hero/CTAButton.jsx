"use client";
import { motion } from "framer-motion";
import { useRef, memo } from "react";

function CTAButton({ label, href = "#", onClick, variant }) {
  const btnRef = useRef(null);
  const isSecondary = variant === "secondary";

  const handleClick = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = "cta-ripple";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };

  return (
    <motion.a
      ref={btnRef}
      href={href}
      onClick={handleClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative overflow-hidden group inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition",
        isSecondary ? "border" : "text-white",
      ].join(" ")}
      style={
        isSecondary
          ? {
              borderColor: "color-mix(in oklab, var(--text) 30%, transparent)",
              color: "var(--text)",
              background: "color-mix(in oklab, var(--background) 86%, var(--accent-3))",
            }
          : {
              background: "#ff8300",
              boxShadow: "0 14px 30px -12px rgba(255,131,0,.55)",
            }
      }
    >
      {label}
      <svg
        className="ml-2 h-4 w-4 transition-transform duration-300 -rotate-45 group-hover:rotate-0 group-hover:translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}

export default memo(CTAButton);
