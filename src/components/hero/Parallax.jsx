"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Parallax({
  children,
  className = "",
  yStrength = 200,
  scaleFrom = 1,
  scaleTo = 1.04,
  mouseTilt = true,
  disabledBelow = 768,
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(!prefersReduced && window.innerWidth >= disabledBelow);
    const onResize = () => setEnabled(!prefersReduced && window.innerWidth >= disabledBelow);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [prefersReduced, disabledBelow]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, enabled ? yStrength : 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, enabled ? scaleTo : 1]);

  // Mouse tilt ringan
  const [rot, setRot] = useState({ rx: 0, ry: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled || !mouseTilt) return;
    const onMove = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX - w / 2) / w;
        const ny = (e.clientY - h / 2) / h;
        setRot({ rx: ny * -3, ry: nx * 4 });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, mouseTilt]);

  const style = useMemo(
    () => (enabled ? { y, scale, rotateX: rot.rx, rotateY: rot.ry, transformStyle: "preserve-3d" } : {}),
    [enabled, y, scale, rot.rx, rot.ry]
  );

  return (
    <motion.section ref={ref} style={style} className={className}>
      {children}
    </motion.section>
  );
}
