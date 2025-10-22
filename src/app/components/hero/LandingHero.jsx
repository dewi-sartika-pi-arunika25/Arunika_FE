"use client";
import HeroBase from "./HeroBase";

export default function LandingHero(){
  return (
    <HeroBase
      align="center"
      bgUrl="/hero.jpg"       
      eyebrow="Perempuan di Tech"
      title="Jika karier adalah musik, apa playlist-mu?"
      subtitle="Arunika memadukan AI dan komunitas untuk memetakan jalur karier, membangun portofolio, dan menghubungkanmu dengan mentor yang relevan."
      ctas={[
        { label: "Mulai Gratis", href: "/signup", variant: "primary" },
        { label: "Lihat Cara Kerja", href: "#cara-kerja", variant: "ghost" },
      ]}
    />
  );
}
