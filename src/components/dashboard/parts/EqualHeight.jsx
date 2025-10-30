"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function EqualHeight({ className = "", style, activeKey, panes, measurers }) {
  const hostRef = useRef(null);
  const ghostRef = useRef(null);
  const [h, setH] = useState(null);

  const active = panes[activeKey];

  const ghost = useMemo(() => {
    return (
      <div style={{ width: hostRef.current?.clientWidth ?? 640 }}>
        {Object.keys(measurers).map((k) => (
          <div key={k} className="mb-6 last:mb-0">
            {measurers[k]}
          </div>
        ))}
      </div>
    );
  }, [measurers]);

  useEffect(() => {
    const measure = () => {
      if (!ghostRef.current) return;
      const kids = Array.from(ghostRef.current.children);
      const max = kids.reduce((m, el) => Math.max(m, el.scrollHeight), 0);
      const minClamp = Math.max(480, Math.round(window.innerHeight * 0.5));
      setH(Math.max(max, minClamp));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div
        ref={hostRef}
        className={className}
        style={{ ...style, height: h ? `${h}px` : undefined, transition: "height .24s ease" }}
      >
        <div style={{ animation: "fadeIn .18s ease" }}>{active}</div>
      </div>

      <div
        aria-hidden
        ref={ghostRef}
        style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none", visibility: "hidden" }}
      >
        {ghost}
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}
