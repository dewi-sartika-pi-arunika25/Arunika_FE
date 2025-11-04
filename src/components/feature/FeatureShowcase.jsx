"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURES } from "./data";
import FeaturePills from "./FeaturePills";
import FeatureVisual from "./FeatureVisual";
import FeatureCopy from "./FeatureCopy";

const fadeSlide = {
  initial: { opacity: 0, y: 16, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)", transition: { duration: 0.42, ease: "easeOut" } },
  exit:    { opacity: 0, y: -12, filter: "blur(2px)", transition: { duration: 0.25, ease: "easeIn" } },
};

export default function FeatureShowcase() {
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((v) => (v + 1) % FEATURES.length), []);
  const prev = useCallback(() => setIdx((v) => (v - 1 + FEATURES.length) % FEATURES.length), []);

  // Keyboard ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = useMemo(() => FEATURES[idx], [idx]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
      <FeaturePills idx={idx} setIdx={setIdx} prev={prev} next={next} />

      <AnimatePresence mode="wait">
        <motion.div key={current.tag} variants={fadeSlide} initial="initial" animate="animate" exit="exit">
          <FeatureVisual current={current} />
          <FeatureCopy current={current} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
