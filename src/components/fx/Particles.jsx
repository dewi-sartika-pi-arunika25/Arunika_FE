"use client";
import { useEffect, useRef } from "react";

export default function Particles({ density = 0.00014, zIndex = -1 }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");

    function size() {
      c.width = c.offsetWidth * devicePixelRatio;
      c.height = c.offsetHeight * devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    size();

    const count = Math.max(16, Math.floor(c.offsetWidth * c.offsetHeight * density));
    const P = Array.from({ length: count }).map(() => ({
      x: Math.random() * c.offsetWidth,
      y: Math.random() * c.offsetHeight,
      r: 1 + Math.random() * 2,
      a: Math.random() * Math.PI * 2,
      s: 0.3 + Math.random() * 0.9,
      h: Math.floor(260 + Math.random() * 70),
      l: 60 + Math.random() * 25,
    }));

    function draw() {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      for (const p of P) {
        p.a += (Math.random() - 0.5) * 0.05;
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        if (p.x < 0) p.x = c.offsetWidth; if (p.x > c.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = c.offsetHeight; if (p.y > c.offsetHeight) p.y = 0;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `hsla(${p.h}, 100%, ${p.l}%, 0.85)`);
        grd.addColorStop(1, `hsla(${p.h}, 100%, ${p.l}%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex }}
      aria-hidden
    />
  );
}
