"use client";
import Parallax from "@/components/Parallax";


export default function HeroBase({
  eyebrow,
  title,
  subtitle,
  ctas = [],
  bgUrl,
  align = "center",
}) {
  const alignCls =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center";

  return (
    <div className="relative isolate overflow-hidden">
      {bgUrl && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-center bg-cover"
            style={{ backgroundImage: `url(${bgUrl})` }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(255,253,244,0.92)] via-[rgba(255,253,244,0.86)] to-[rgba(255,253,244,0.6)]"
          />
        </>
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(40rem 20rem at 15% 20%, rgba(250,225,60,.25), transparent 70%), radial-gradient(32rem 18rem at 85% 30%, rgba(247,230,164,.3), transparent 70%), radial-gradient(36rem 16rem at 50% 80%, rgba(255,131,0,.18), transparent 70%)",
        }}
      />

      <Parallax speed={0.35} className={`section flex flex-col ${alignCls} gap-4`}>
        {eyebrow && (
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--accent-2)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-[color:var(--text)]/80 max-w-2xl">
            {subtitle}
          </p>
        )}

        {!!ctas.length && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {ctas.map((c) =>
              c.variant === "ghost" ? (
                <a
                  key={c.label}
                  href={c.href || "#"}
                  className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-white/70"
                >
                  {c.label}
                </a>
              ) : (
                <a
                  key={c.label}
                  href={c.href || "#"}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-[var(--primary)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {c.label}
                </a>
              )
            )}
          </div>
        )}
      </Parallax>
    </div>
  );
}
