"use client";
import Link from "next/link";

export default function AboutUsSection() {
  return (
    <section id="tentang-kami" className="max-w-6xl mx-auto mt-16">
      <div
        className="rounded-2xl border p-6 sm:p-8 shadow-sm"
        style={{
          background: "color-mix(in oklab, var(--accent-3) 35%, var(--background))",
          borderColor: "color-mix(in oklab, var(--accent-3) 55%, transparent)",
        }}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent-2)] mb-2">
              Tentang Kami
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold leading-snug">
              Kenali Arunika: misi, tim, dan nilai yang menggerakkan kami
            </h2>
            <p className="mt-3 text-[color:var(--foreground)]/75">
              Kami memadukan AI dan komunitas untuk memetakan jalur karier, membangun
              portofolio, dan menghubungkanmu dengan mentor relevan. Lihat cerita dan
              orang-orang di balik Arunika.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                Lihat About Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border"
                style={{ borderColor: "var(--accent-2)" }}
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 reveal">
            <div className="w-14 h-14 rounded-full border bg-white/70 shadow-sm" />
            <div className="w-14 h-14 rounded-full border bg-white/70 shadow-sm -translate-y-2" />
            <div className="w-14 h-14 rounded-full border bg-white/70 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
