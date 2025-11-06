"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Preset animasi Framer Motion untuk dipakai lintas-komponen.
 */
export default function useMotionPresets({
  duration = 0.38,
  ease = "easeOut",
  amount = 0.45,
  once = false,
  stagger = 0.12,
} = {}) {
  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
      show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration, ease } },
    }),
    [duration, ease]
  );

  const fadeDown = useMemo(
    () => ({
      hidden: { opacity: 0, y: -14, filter: "blur(2px)" },
      show:   { opacity: 1, y: 0,   filter: "blur(0px)", transition: { duration, ease } },
    }),
    [duration, ease]
  );

  const fadeIn = useMemo(
    () => ({
      hidden: { opacity: 0, filter: "blur(2px)" },
      show:   { opacity: 1, filter: "blur(0px)", transition: { duration, ease } },
    }),
    [duration, ease]
  );

  const scaleIn = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.96 },
      show:   { opacity: 1, scale: 1, transition: { duration, ease } },
    }),
    [duration, ease]
  );

  const staggerWrap = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show:   { opacity: 1, transition: { staggerChildren: stagger } },
    }),
    [stagger]
  );

  const base = useMemo(
    () => ({ initial: "hidden", whileInView: "show", viewport: { once, amount } }),
    [once, amount]
  );

  return { base, fadeUp, fadeDown, fadeIn, scaleIn, stagger: staggerWrap };
}

/**
 * useApproachReveal
 * Muncul saat elemen masuk area pantau (atas/bawah), hilang saat keluar lagi.
 * Cocok buat efek “muncul perlahan saat mendekat, lenyap saat berlalu”.
 *
 * @param amount     - fraksi elemen yang harus terlihat (0..1)
 * @param rootMargin - margin viewport CSS-like, contoh: "-12% 0px -12% 0px"
 * @param initialVisible - state awal (default false)
 *
 * return: { ref, visible }
 */
export function useApproachReveal({
  amount = 0.35,
  rootMargin = "-12% 0px -12% 0px",
  initialVisible = false,
} = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount, margin: rootMargin });
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    setVisible(inView);
  }, [inView]);

  return { ref, visible };
}
