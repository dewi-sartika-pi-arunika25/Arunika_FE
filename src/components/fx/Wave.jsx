"use client";
import { useEffect, useRef } from "react";

export default function Wave() {
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const svg = ref.current;
    const layers = Array.from(svg.querySelectorAll("[data-depth]"));

    const onMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const mx = (e.clientX - w / 2) / w;
      const my = (e.clientY - h / 2) / h;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        layers.forEach((el) => {
          const d = Number(el.getAttribute("data-depth") || 0);
          el.style.transform = `translate(${mx * d}px, ${my * d}px)`;
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={ref} className="absolute inset-x-0 -bottom-24 w-[140%] left-1/2 -translate-x-1/2" viewBox="0 0 1440 320" aria-hidden>
      <g data-depth="6" style={{ transition: "transform 120ms ease-out" }}>
        <path fill="url(#g1)" d="M0,288L60,272C120,256,240,224,360,181.3C480,139,600,85,720,80C840,75,960,117,1080,154.7C1200,192,1320,224,1380,240L1440,256L1440,320H0Z"/>
      </g>
      <g data-depth="3" style={{ transition: "transform 120ms ease-out" }}>
        <path fill="url(#g2)" d="M0,256L80,245.3C160,235,320,213,480,192C640,171,800,149,960,165.3C1120,181,1280,235,1360,261.3L1440,288V320H0Z"/>
      </g>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsla(260,100%,70%,.55)" />
          <stop offset="100%" stopColor="hsla(24,100%,60%,.45)" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsla(200,100%,70%,.35)" />
          <stop offset="100%" stopColor="hsla(310,100%,70%,.25)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
