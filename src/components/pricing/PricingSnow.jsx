"use client";
import { useEffect, useRef, useState } from "react";

export default function PricingSnow({
  density = 0.35,   // partikel / 100k px
  maxCount = 80,
  speed = [0.15, 0.45], // min..max px/frame
}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const flakes = useRef([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!prefersReduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(2, devicePixelRatio || 1);

    const fit = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const area = (width * height) / 100000;
      const n = Math.min(maxCount, Math.round(area * density));
      flakes.current = Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.4,
        vy: speed[0] + Math.random() * (speed[1] - speed[0]),
        drift: (Math.random() - 0.5) * 0.25,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-3")
      .trim() || "#F7E6A4";

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      flakes.current.forEach((p) => {
        p.t += 0.02;
        p.y += p.vy;
        p.x += Math.cos(p.t) * p.drift;

        if (p.y > height + 6) {
          p.y = -6;
          p.x = Math.random() * width;
        }
        if (p.x < -6) p.x = width + 6;
        if (p.x > width + 6) p.x = -6;

        ctx.beginPath();
        ctx.globalAlpha = 0.18;              // halus
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    fit();
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [enabled, density, maxCount, speed]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={{ mixBlendMode: "normal" }}
      aria-hidden
    />
  );
}
