"use client";
import HeroBase from "./HeroBase";
import { useTypewriter } from "@/hooks/useTypewriter";
import StepChip from "./StepChip";

const IconClipboard = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path d="M9 7h6M9 4h6a2 2 0 012 2v1h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h1V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChip = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M17 5l2 2M5 17l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconBriefcase = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 12h18M12 12v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function LandingHero() {
  const typed = useTypewriter("Apa Playlist-mu?", {
    typeSpeed: 60,
    deleteSpeed: 40,
    pauseMs: 1200,
    loop: true
  });

  return (
    <HeroBase
      bgUrl="/hero.jpg"
      align="center"
      navOffset={true}
      ctas={[{ label: "Mulai Gratis Sekarang", href: "/register" }]}
      scrollLink={{ label: "Lihat keunggulan kami", href: "#keunggulan" }}
      title={
        <div className="mx-auto w-full max-w-[1120px] text-balance leading-[1.06]">
          <span className="block font-extrabold tracking-tight text-[clamp(26px,4.4vw,40px)]">Jika Karir Adalah Musik,</span>
          <span
            className="block mt-1 font-extrabold tracking-tight text-[clamp(26px,4.4vw,40px)]"
            style={{ color: "#ff8300", textShadow: "0 1px 0 rgba(0,0,0,.04)" }}
            aria-label="Apa Playlist-mu?"
          >
            {typed}
            <span className="hero-caret" style={{ color: "#ff8300" }}>|</span>
          </span>
        </div>
      }
      subtitle={
        <div className="mx-auto w-full max-w-[1000px] text-balance space-y-8">
          <p className="text-[clamp(14px,2.2vw,17px)] leading-relaxed">
            <span className="font-extrabold" style={{ color: "color-mix(in oklab, var(--text) 96%, transparent)" }}>
              Berhenti menebak-nebak.
            </span>{" "}
            <span style={{ color: "color-mix(in oklab, var(--text) 88%, transparent)" }}>
              Kami bantu kamu memahami peran, kekuatan, dan gap keterampilan agar kamu bisa ambil langkah nyata dengan percaya diri.
            </span>
          </p>

          <div className="space-y-4">
            <p className="text-[clamp(13.5px,2vw,16px)] font-extrabold tracking-wide flex flex-wrap items-center justify-center gap-4">
              <StepChip icon={IconClipboard}>Isi Skill Match</StepChip>
              <span className="opacity-60">→</span>
              <StepChip icon={IconChip}>Analisis AI</StepChip>
              <span className="opacity-60">→</span>
              <StepChip icon={IconBriefcase}>Rekomendasi kerja</StepChip>
            </p>
            <p
              className="text-[clamp(13px,1.9vw,15.5px)] leading-relaxed text-center"
              style={{ color: "color-mix(in oklab, var(--text) 84%, transparent)" }}
            >
              Temukan kecocokan peran, pahami kekuatan &amp; gap keterampilan, lalu ambil langkah nyata.
            </p>
          </div>
        </div>
      }
    />
  );
}
