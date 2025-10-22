"use client";

export default function PlanCard({
  name,
  price,
  cadence,
  features,
  cta,
  highlighted = false,
  tag,
}) {
  const primary = "var(--primary)";    // #FF8300
  const accent2 = "var(--accent-2)";   // #E4B200
  const text    = "var(--foreground)"; // #2B2B2B (light) / #FFFDF4 (dark)

  const Wrapper = ({ children }) =>
    highlighted ? (
      <div
        className="rounded-2xl"
        style={{ border: `2px solid ${accent2}`, background: "var(--pricing-surface)" }}
      >
        {children}
      </div>
    ) : (
      <div
        className="rounded-2xl"
        style={{ border: "1px solid var(--pricing-border)", background: "var(--pricing-surface)" }}
      >
        {children}
      </div>
    );

  return (
    <Wrapper>
      <div className="relative p-6 sm:p-7 flex flex-col h-full">
        {highlighted && (
          <span
            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: primary }}
          >
            {tag || "Paling Populer"}
          </span>
        )}

        <h3
          className="text-lg font-semibold"
          style={{ color: highlighted ? primary : text }}
        >
          {name}
        </h3>

        <div className="mt-2">
          <div className="text-4xl font-bold" style={{ color: text }}>{price}</div>
          <div className="text-sm" style={{ color: "color-mix(in oklab, var(--foreground) 65%, #0000)" }}>
            {cadence}
          </div>
        </div>

        <ul className="mt-5 space-y-3 flex-1 text-sm" style={{ color: text }}>
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <svg
                aria-hidden
                className="mt-[2px] h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{ color: accent2 }}
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {highlighted ? (
          <button
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: primary }}
          >
            {cta}
          </button>
        ) : (
          <button
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition hover:bg-white"
            style={{ border: `1px solid ${primary}`, color: primary, background: "transparent" }}
          >
            {cta}
          </button>
        )}
      </div>
    </Wrapper>
  );
}
