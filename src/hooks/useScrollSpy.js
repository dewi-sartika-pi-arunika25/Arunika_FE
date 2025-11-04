// /src/hooks/useScrollSpy.js
import { useEffect, useRef } from "react";
import { useUI } from "@/lib/store/ui";

/**
 * Scroll spy + reveal (stabil, tanpa loop update).
 * - Throttle via rAF
 * - Set state HANYA jika berubah
 * - Dep yang stabil (idsJoin)
 */
export function useScrollSpy(ids, offset = 120) {
  const rafRef = useRef(null);
  const idsJoin = Array.isArray(ids) ? ids.join("|") : String(ids || "");

  useEffect(() => {
    const computeActive = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) current = id;
      }
      return current;
    };

    const onScroll = () => {
      if (rafRef.current) return; // throttle by rAF
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const current = computeActive();
        const st = useUI.getState();
        if (st.activeSection !== current) {
          // hanya update jika BERUBAH
          st.setActiveSection(current);
        }
      });
    };

    // IntersectionObserver untuk .reveal (sekali setup)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            e.target.classList.remove("reveal-hide");
          }
        }
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.1 }
    );

    const revealNodes = document.querySelectorAll(".reveal");
    revealNodes.forEach((el) => {
      // Delay is now set via CSS nth-child selector to avoid hydration mismatch
      // No need to set inline style anymore
      el.classList.add("reveal-hide");
      io.observe(el);
    });

    // inisiasi pertama
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  // gunakan idsJoin agar deps stabil; offset angka stabil
  }, [idsJoin, offset]);
}
