"use client";
import { useEffect } from "react";

export default function FixedMirrorChatLayout({ children }) {
  useEffect(() => {
    document.body.classList.add("mc-lock");
    const prevent = (e) => e.preventDefault();
    // cegah scroll/drag di seluruh halaman
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("wheel", prevent, { passive: false });

    return () => {
      document.body.classList.remove("mc-lock");
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("wheel", prevent);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* OPTIONAL: overlay anim lembut (tidak pakai variabel :root, aman dengan global css) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mc-anim-radials" />
        <div className="mc-anim-conic" />
      </div>

      {/* shell */}
      <div className="relative z-10 h-full w-full grid place-items-center">
        {children}
      </div>

      {/* keyframes & style lokal */}
      <style jsx global>{`
        body.mc-lock { overflow: hidden; touch-action: none; }

        .mc-anim-radials{
          position:absolute; inset:-80px;
          background:
            radial-gradient(60% 60% at 20% 30%, rgba(250,216,168,.65) 0%, transparent 60%),
            radial-gradient(55% 55% at 80% 20%, rgba(199,210,254,.6) 0%, transparent 60%),
            radial-gradient(50% 50% at 60% 80%, rgba(185,251,192,.5) 0%, transparent 60%);
          opacity:.5; filter:saturate(1.05);
        }
        .mc-anim-conic{
          position:absolute; inset:-100px;
          background: conic-gradient(from 0deg at 50% 50%,
            rgba(255,255,255,.08), rgba(255,255,255,0), rgba(255,255,255,.08));
          animation: mcSpinSlow 80s linear infinite;
          mix-blend-mode: overlay;
        }
        @keyframes mcSpinSlow{to{transform:rotate(360deg)}}

        /* typing dots untuk loader (dipakai di MirrorChatScreen) */
        @keyframes mcTypingDots {0%{opacity:.2}33%{opacity:.6}66%{opacity:.95}100%{opacity:.2}}
        .mc-dot{animation:mcTypingDots 1.2s infinite}
        .mc-dot:nth-child(2){animation-delay:.2s}
        .mc-dot:nth-child(3){animation-delay:.4s}

        /* pop-in kecil */
        .fade-in{animation:mcFadeIn .18s ease-out}
        @keyframes mcFadeIn{from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)}}
      `}</style>
    </div>
  );
}
