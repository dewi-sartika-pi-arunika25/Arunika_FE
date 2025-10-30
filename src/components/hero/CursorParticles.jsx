"use client";
import { useEffect, useRef, useState } from "react";

export default function CursorParticles({
  className = "",
  mode = "snow",          // keep defaults so deps length is constant
  interactive = false,    // snow is ambient (not cursor-driven)
  density = 0.35,
  maxCount = 70,
  disabledBelow = 640,
}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const pts = useRef([]);
  const mouse = useRef({ x: 0, y: 0, has: false });
  const [enabled, setEnabled] = useState(true);

  // enable/disable once (responsive to resize)
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduce && window.innerWidth >= disabledBelow);
    const onResize = () => {
      const r = matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(!r && window.innerWidth >= disabledBelow);
    };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [disabledBelow]);

  // DRAW LOOP — dependency array has a fixed size and order
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
      pts.current = Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: 0.25 + Math.random() * 0.25, // soft fall
        s: 0.9 + Math.random() * 1.1,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of pts.current) {
        p.t += 0.015;
        p.vx += Math.cos(p.t) * 0.0015;

        if (interactive && mouse.current.has) {
          const dx = mouse.current.x - p.x, dy = mouse.current.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            const f = (1 - d / 120) * 0.015;
            p.vx += (dx / (d + 1e-3)) * f;
            p.vy += (dy / (d + 1e-3)) * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }

        ctx.beginPath();
        if (mode === "snow") {
          ctx.globalAlpha = 0.22 + Math.random() * 0.1;
          ctx.fillStyle = "rgba(255,255,255,1)";
          ctx.shadowColor = "rgba(255,255,255,.35)";
          ctx.shadowBlur = 3;
        } else {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = "rgba(250,225,60,1)";
          ctx.shadowColor = "rgba(250,225,60,.55)";
          ctx.shadowBlur = 6;
        }
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const onMove = (e) => {
      if (!interactive) return;
      const r = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.has = true;
    };
    const onLeave = () => (mouse.current.has = false);

    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    fit();
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  // 👇 ALWAYS keep this fixed-length dependency array
  }, [enabled, density, maxCount, interactive, mode]);

  if (!enabled) return null;
  return <canvas ref={ref} className={["absolute inset-0 pointer-events-none", className].join(" ")} />;
}
