"use client";
import { useEffect, useState } from "react";
import HeroBase from "./HeroBase";

export default function LandingHero() {
  const words = ["bingung", "kelelahan", "tidak puas", "tak punya arah"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % words.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <HeroBase
      bgUrl="/hero.jpg"
      align="center"
      navOffset={false}
      title={
        <>
          Jika kamu merasa{" "}
          <span
            className="inline-block transition-all hover:scale-[1.01]"
            style={{
              color: "color-mix(in oklab, var(--primary) 88%, black)",
              textShadow:
                "0 1px 0 rgba(0,0,0,.05), 0 12px 28px color-mix(in oklab, var(--primary) 28%, black)",
            }}
          >
            {words[i]}
          </span>
          , Arunika bantu kamu temukan peran terbaik berbasis analisis AI.
        </>
      }
      subtitle={
        <>
          <b>Isi Skill Match → Analisis AI → Rekomendasi kerja.</b> 
          Temukan kecocokan peran, pahami kekuatan & gap keterampilan, lalu ambil langkah nyata.
        </>
      }
      ctas={[{ label: "Mulai Gratis Sekarang", href: "/register" }]}
      scrollLink={{ label: "Lihat keunggulan kami", href: "#keunggulan" }}
    />
  );
}
