"use client";

import { useEffect, useRef, useState } from "react";

export default function Collapse({ open, children, duration = 220 }) {
  const wrapRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const h = el.scrollHeight;
    if (open) setMaxH(h);
    else setMaxH(0);
  }, [open, children]);

  return (
    <div
      style={{
        maxHeight: maxH,
        overflow: "hidden",
        transition: `max-height ${duration}ms ease, opacity ${duration}ms ease`,
        opacity: open ? 1 : 0,
      }}
    >
      <div ref={wrapRef}>{children}</div>
    </div>
  );
}
