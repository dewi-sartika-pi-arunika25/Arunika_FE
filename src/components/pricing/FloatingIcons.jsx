"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Floating icons yang:
 * - HANYA dirender setelah mount (hindari hydration mismatch)
 * - Ikut arah kursor (parallax halus)
 * - Posisi & ukuran stabil selama sesi (di-random sekali saat mount)
 */
export default function FloatingIcons({
  className = "",
  icon = "/icon.svg",
  count = 18,
  size = [14, 22],          // [min, max] px
  drift = [6, 14],          // [min, max] px amplitudo sway
  speed = [8, 16],          // [min, max] s durasi
  areaPadding = 24,         // margin dari tepi container
}) {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);

  // render client-only (mencegah SSR vs CSR beda angka -> hydration error)
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / rect.width;   // -0.5 .. 0.5
      const y = (e.clientY - cy) / rect.height;  // -0.5 .. 0.5
      setMouse({ x, y });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // generate titik stabil (sekali saat mount)
  const items = useMemo(() => {
    if (!mounted) return [];
    const rand = (min, max) => min + Math.random() * (max - min);
    return Array.from({ length: count }).map(() => ({
      top:    `${rand(8, 92)}%`,
      left:   `${rand(8, 92)}%`,
      size:   Math.round(rand(size[0], size[1])),
      drift:  rand(drift[0], drift[1]),
      dur:    rand(speed[0], speed[1]),
      delay:  -rand(0, 8),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={boxRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ zIndex: 0, padding: areaPadding }}
      aria-hidden
    >
      <style jsx>{`
        @keyframes floatY { 
          0%,100% { transform: translateY(calc(var(--drift) * -1)); } 
          50%     { transform: translateY(var(--drift)); } 
        }
        @keyframes swayX { 
          0%,100% { transform: translateX(calc(var(--drift) * -1)); } 
          50%     { transform: translateX(var(--drift)); } 
        }
      `}</style>

      {items.map((it, i) => {
        // parallax ringan mengikuti mouse
        const parallaxX = mouse.x * 8; // px +/- 
        const parallaxY = mouse.y * 8;

        return (
          <img
            key={i}
            src={icon}
            alt=""
            className="absolute opacity-60"
            style={{
              top: it.top,
              left: it.left,
              width: it.size,
              height: it.size,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,.10))",
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
              animation: `floatY ${it.dur}s ease-in-out ${it.delay}s infinite`,
              // tambahin swayX tipis via CSS variable + composite di parent:
              // di sini cukup floatY agar hemat repaint
              // kalau mau double anim, bisa kombinasikan matrix/translate lain
              ["--drift"]: `${it.drift}px`,
            }}
          />
        );
      })}
    </div>
  );
}
