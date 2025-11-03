"use client";
import { useEffect, useRef, useState } from "react";

export function useTypewriter(
  text,
  { typeSpeed = 60, deleteSpeed = 40, pauseMs = 1200, loop = true } = {}
) {
  const [out, setOut] = useState("");
  const dir = useRef(1);
  const i = useRef(0);
  const pause = useRef(false);
  useEffect(() => {
    let t;
    const tick = () => {
      if (pause.current) {
        t = setTimeout(() => {
          pause.current = false;
          dir.current = -1;
          tick();
        }, pauseMs);
        return;
      }
      if (dir.current === 1) {
        const next = text.slice(0, i.current + 1);
        setOut(next);
        i.current++;
        if (next === text) {
          if (loop) pause.current = true;
          else return;
        }
        t = setTimeout(tick, typeSpeed);
      } else {
        const next = text.slice(0, i.current - 1);
        setOut(next);
        i.current--;
        if (next.length === 0) dir.current = 1;
        t = setTimeout(tick, deleteSpeed);
      }
    };
    tick();
    return () => clearTimeout(t);
  }, [text, typeSpeed, deleteSpeed, pauseMs, loop]);
  return out;
}
