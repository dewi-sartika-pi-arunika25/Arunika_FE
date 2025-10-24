"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
// ✅ perbaiki path ini (sesuai struktur baru)
import Particles from "@/components/fx/Particles";
// (opsional) kalau belum dipakai, hapus import Wave
// import Wave from "@/components/fx/Wave";

export default function Hero() {
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  const scrollYRef = useRef(0);
  const mouseRef = useRef({ mx: 0, my: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const applyTransform = () => {
      const y = scrollYRef.current || 0;
      const { mx, my } = mouseRef.current;

      const bgY = y * 0.12;
      const contentY = -y * 0.06;

      const bgMX = mx * 8;
      const bgMY = my * 6;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${bgMX}px, ${bgY + bgMY}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${contentY}px, 0)`;
      }
    };

    const onScroll = () => {
      scrollYRef.current = window.scrollY || 0;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          applyTransform();
        });
      }
    };

    const onMouseMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      mouseRef.current.mx = (e.clientX - w / 2) / w;
      mouseRef.current.my = (e.clientY - h / 2) / h;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          applyTransform();
        });
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden rounded-2xl border shadow-sm">
      {/* Particles layer */}
      <div className="absolute inset-0 -z-10">
        <Particles />
      </div>

      {/* Background image + overlays */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-center bg-cover will-change-transform"
        style={{ backgroundImage: `url('/hero.jpg')`, backgroundColor: "var(--background)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(255,253,244,0.95), rgba(255,253,244,0.80) 40%, rgba(255,253,244,0.55))",
        }}
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(40rem 20rem at 15% 20%, rgba(250,225,60,.25), transparent 70%), radial-gradient(32rem 18rem at 85% 30%, rgba(247,230,164,.3), transparent 70%), radial-gradient(36rem 16rem at 50% 80%, rgba(255,131,0,.18), transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="px-6 sm:px-10 md:px-14 lg:px-20 py-16 sm:py-20 lg:py-24 text-center will-change-transform"
      >
        <p className="reveal text-xs sm:text-sm uppercase tracking-[0.2em]" style={{ color: "var(--accent-2)" }}>
          Perempuan di Tech
        </p>

        <h1
          className="reveal mt-3 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mx-auto max-w-4xl"
          style={{ color: "var(--text)" }}
        >
          Jika karier adalah musik, <br className="hidden sm:block" />
          apa <span style={{ color: "var(--primary)" }}>playlist-mu?</span>
        </h1>

        <p
          className="reveal mt-5 text-lg max-w-2xl mx-auto"
          style={{ color: "color-mix(in oklab, var(--text) 80%, transparent)" }}
        >
          Arunika memadukan AI dan komunitas untuk memetakan jalur karier, membangun portofolio,
          dan menghubungkanmu dengan mentor relevan.
        </p>

        <div className="reveal mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {/* ke /skill-match */}
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--primary)" }}
          >
            Mulai Gratis
          </Link>

          {/* scroll ke #keunggulan */}
          <a
            href="#keunggulan"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border"
            style={{ borderColor: "var(--accent-2)", color: "var(--text)" }}
          >
            Lihat Cara Kerja
          </a>
        </div>
      </div>

      {/* (opsional) aktifkan lagi kalau sudah siap */}
      {/* <Wave /> */}
    </section>
  );
}
