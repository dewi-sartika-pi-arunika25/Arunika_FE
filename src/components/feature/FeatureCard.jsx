"use client";
import Badge from "@/components/ui/Badge";

export default function FeatureCard({ icon, title, body, badge }) {
  return (
    <article
      className="
        group rounded-2xl border bg-white/85
        shadow-[0_10px_30px_rgba(0,0,0,.05)]
        transition-[transform,box-shadow] duration-300
        hover:shadow-[0_14px_40px_rgba(0,0,0,.08)] hover:-translate-y-0.5
      "
      style={{ borderColor: "var(--border)" }}
    >
      <div className="p-6">
        {/* Header kecil: icon + badge */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div
            className="
              flex h-12 w-12 items-center justify-center rounded-xl
              bg-[var(--accent-3)]/70 text-[var(--primary)] text-xl
            "
          >
            <span aria-hidden>{icon}</span>
          </div>
          {badge ? <Badge>{badge}</Badge> : null}
        </div>

        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-700">{body}</p>
      </div>
    </article>
  );
}
