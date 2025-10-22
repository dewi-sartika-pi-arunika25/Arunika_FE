"use client";
import { useEffect, useRef } from "react";


export default function Hero() {
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let rafId;

    const onScroll = () => {
      const y = window.scrollY || 0;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${-y * 0.06}px, 0)`;
      }
    };

    const onMouseMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const mx = (e.clientX - w / 2) / w; // -0.5..0.5
      const my = (e.clientY - h / 2) / h;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform += ` translate(${mx * 8}px, ${my * 6}px)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border shadow-sm">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage: `url('/hero.jpg')`,
          backgroundColor: "var(--bg)",
        }}
      />

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(255,253,244,0.95), rgba(255,253,244,0.80) 40%, rgba(255,253,244,0.55))",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(40rem 20rem at 15% 20%, rgba(250,225,60,.25), transparent 70%), radial-gradient(32rem 18rem at 85% 30%, rgba(247,230,164,.3), transparent 70%), radial-gradient(36rem 16rem at 50% 80%, rgba(255,131,0,.18), transparent 70%)",
        }}
      />

      <div
        ref={contentRef}
        className="px-6 sm:px-10 md:px-14 lg:px-20 py-16 sm:py-20 lg:py-24 text-center"
      >
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--accent-2)]">
          Perempuan di Tech
        </p>

        <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mx-auto max-w-4xl">
          Jika karier adalah musik, <br className="hidden sm:block" />
          apa <span style={{ color: "var(--primary)" }}>playlist-mu?</span>
        </h1>

        <p className="mt-5 text-lg text-[color:var(--text)]/80 max-w-2xl mx-auto">
          Arunika memadukan AI dan komunitas untuk memetakan jalur karier,
          membangun portofolio, dan menghubungkanmu dengan mentor relevan.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--primary)" }}
          >
            Mulai Gratis
          </a>
          <a
            href="#cara-kerja"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border"
            style={{ borderColor: "var(--accent-2)" }}
          >
            Lihat Cara Kerja
          </a>
        </div>
      </div>
    </section>
  );
}
