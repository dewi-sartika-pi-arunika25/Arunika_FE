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
  // warna dari palette CSS variables
  const primary = "var(--primary)";
  const accent1 = "var(--accent-1)"; // #FAE13C
  const accent2 = "var(--accent-2)"; // #E4B200

  // Wrapper gradient border ketika highlighted
  const Wrapper = ({ children }) =>
    highlighted ? (
      <div
        className="rounded-2xl p-[2px]"
        style={{
          background:
            `linear-gradient(45deg, ${accent1}, ${accent2}, ${primary})`,
        }}
      >
        <div className="rounded-2xl bg-white/90 dark:bg-white/95">{children}</div>
      </div>
    ) : (
      <div className="rounded-2xl border bg-white/80">{children}</div>
    );

  return (
    <Wrapper>
      <div className="relative p-6 sm:p-7 flex flex-col h-full">
        {highlighted && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: "var(--destructive, #E43D3D)" }}>
            {tag || "Populer"}
          </span>
        )}

        <h3 className={`text-lg font-semibold ${highlighted ? "text-[var(--destructive,#E43D3D)]" : "text-neutral-600"}`}>
          {name}
        </h3>

        <div className="mt-2">
          <div className="text-4xl font-bold">{price}</div>
          <div className="text-sm text-neutral-500">{cadence}</div>
        </div>

        <ul className="mt-5 space-y-3 flex-1 text-sm">
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
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition"
            style={{ background: "var(--destructive, #E43D3D)" }}
          >
            {cta}
          </button>
        ) : (
          <button
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold border transition hover:bg-white"
            style={{ borderColor: primary, color: primary }}
          >
            {cta}
          </button>
        )}
      </div>
    </Wrapper>
  );
}
