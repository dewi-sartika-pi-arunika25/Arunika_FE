// src/app/components/FeatureSection.jsx
import { Brain, Map, Briefcase } from "lucide-react";

const iconsMap = {
  "Personalized AI": Brain,
  "Career Readiness": Map,
  "Career Connector": Briefcase,
};

function Card({ title, description, tag, iconName }) {
  const Icon = iconsMap[iconName];

  return (
    <div
      className="
        relative rounded-3xl border shadow-sm backdrop-blur-xl
        transition-transform duration-300 will-change-transform
        hover:-translate-y-0.5 hover:scale-[1.01]
      "
      style={{
        background: "color-mix(in oklab, var(--background) 86%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      {/* header ikon + tag */}
      <div className="flex items-start justify-between p-6">
        <div
          className="inline-flex items-center justify-center rounded-xl p-3 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 85%, white) 0%, color-mix(in oklab, var(--primary) 60%, transparent) 100%)",
          }}
        >
          {Icon && <Icon className="h-7 w-7" style={{ color: "white" }} />}
        </div>

        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border"
          style={{
            color: "color-mix(in oklab, var(--text) 86%, transparent)",
            borderColor: "color-mix(in oklab, var(--accent-2) 50%, transparent)",
            background: "color-mix(in oklab, var(--accent-3) 22%, transparent)",
          }}
        >
          {tag}
        </span>
      </div>

      {/* konten */}
      <div className="px-6 pb-6">
        <h3
          className="text-xl sm:text-2xl font-bold mb-2"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}
        >
          {description}
        </p>
      </div>

      {/* aksen glow halus */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full blur-2xl"
        style={{ background: "color-mix(in oklab, var(--primary) 30%, transparent)" }}
      />
    </div>
  );
}

export default function FeatureSection() {
  const featureCards = [
    {
      title: "Personalized AI",
      description:
        "Dapatkan analisis mendalam yang unik untukmu, bukan hasil generik. Lakukan asesmen dan temukan jalur karier yang selaras denganmu.",
      tag: "AI Powered",
      iconName: "Personalized AI",
    },
    {
      title: "Career Readiness",
      description:
        "Ketahui kekuatan, area pengembangan, hingga jalur karier yang sesuai untukmu. Dapatkan rekomendasi pengembangan diri yang praktis.",
      tag: "Roadmap",
      iconName: "Career Readiness",
    },
    {
      title: "Career Connector",
      description:
        "Hubungkan dirimu dengan mentor dan industri impianmu. Dapatkan wawasan langsung dari para profesional berpengalaman.",
      tag: "Networking",
      iconName: "Career Connector",
    },
  ];

  return (
    // PENTING: id harus sama dengan target di navbar
    <section id="keunggulan" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* header */}
        <div className="reveal text-center mx-auto max-w-3xl">
          <p
            className="text-xs uppercase tracking-[0.18em] mb-2"
            style={{ color: "var(--accent-2)" }}
          >
            Keunggulan
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ color: "var(--text)" }}
          >
            Bukan Sekadar Tes — Ini Strategi Karier Personalmu
          </h2>
          <p
            className="mt-3 text-base"
            style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}
          >
            Arunika dirancang untuk memberi kejelasan. Lihat bagaimana kami
            membantumu melangkah lebih tepat.
          </p>
        </div>

        {/* grid cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featureCards.map((card, i) => (
            <div key={i} className="reveal">
              <Card {...card} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <div
            className="reveal rounded-xl border px-4 py-3 text-xs"
            style={{
              color: "color-mix(in oklab, var(--text) 70%, transparent)",
              borderColor: "var(--border)",
              background: "color-mix(in oklab, var(--background) 90%, transparent)",
            }}
          >
          </div>
        </div>
      </div>
    </section>
  );
}
