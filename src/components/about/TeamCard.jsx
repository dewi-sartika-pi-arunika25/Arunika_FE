"use client";

import Link from "next/link";

function IconIn(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.1h.06c.53-1 1.83-2.1 3.78-2.1 4.06 0 4.82 2.67 4.82 6.15V24h-4v-6.8c0-1.6-.03-3.71-2.27-3.71-2.27 0-2.6 1.77-2.6 3.6V24h-4V8.5z"/>
    </svg>
  );
}

function IconGh(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden {...props}>
      <path fillRule="evenodd" d="M12 .5A11.5 11.5 0 0 0 8.37 22.9c.58.1.8-.25.8-.56v-2.1c-3.18.7-3.87-1.35-3.87-1.35-.52-1.34-1.27-1.7-1.27-1.7-1.05-.7.08-.7.08-.7 1.15.08 1.75 1.19 1.75 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.47.4-.95.74-1.25-2.54-.28-5.22-1.27-5.22-5.64 0-1.25.45-2.26 1.18-3.06-.12-.3-.52-1.5.1-3.1 0 0 .97-.3 3.16 1.18a10.9 10.9 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.6.23 2.8.1 3.1.74.8 1.19 1.8 1.19 3.06 0 4.38-2.69 5.35-5.24 5.63.42.35.78 1.03.78 2.1v3.13c0 .3.2.66.8.55A11.5 11.5 0 0 0 12 .5Z"/>
    </svg>
  );
}

export default function TeamCard({ member }) {
  const { name, role, photo, bio, links } = member;

  return (
    <article
      className={[
        "group relative rounded-2xl p-7 text-center",
        "border shadow-sm bg-white/88 dark:bg-[color:var(--pricing-surface)]/90",
        "border-[color:var(--pricing-border)]",
        "transition-[transform,box-shadow,border-color,background] duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:border-[color:var(--accent-2)]",
      ].join(" ")}
    >
      {/* Badge kecil */}
      <span
        className="absolute top-3 left-3 inline-flex h-[24px] items-center rounded-full px-2.5 text-[10px] font-bold tracking-[.06em] text-white"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--accent-2) 92%, black), var(--primary))",
          boxShadow: "0 10px 20px -12px color-mix(in oklab, var(--primary) 65%, black)",
        }}
      >
        ARUNIKA
      </span>

      <div className="grid place-items-center gap-4">
        {/* Avatar */}
        <div
          className="w-[120px] h-[120px] rounded-full p-[3px]"
          style={{
            background: "linear-gradient(120deg, var(--accent-2), var(--primary))",
            boxShadow: "0 10px 26px rgba(0,0,0,.06)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[color:var(--card)]">
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Nama dan role */}
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-extrabold" style={{ color: "var(--text)" }}>
            {name}
          </h3>
          <p
            className="text-sm"
            style={{ color: "color-mix(in oklab, var(--text) 72%, transparent)" }}
          >
            {role}
          </p>
        </div>

        {/* Bio */}
        <p
          className="mx-auto max-w-xs text-[13px] leading-relaxed"
          style={{ color: "color-mix(in oklab, var(--text) 80%, transparent)" }}
        >
          {bio}
        </p>

        {/* Tautan */}
        <div className="mt-1 flex justify-center gap-2">
          <Link
            href={links.linkedin}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.03]"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
              boxShadow: "0 12px 24px -14px color-mix(in oklab, var(--primary) 60%, black)",
            }}
          >
            <IconIn /> LinkedIn
          </Link>

          <Link
            href={links.github}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-transform hover:scale-[1.02]"
            style={{
              color: "var(--text)",
              border: "1px solid color-mix(in oklab, var(--text) 42%, transparent)",
              background: "color-mix(in oklab, var(--background) 90%, transparent)",
            }}
          >
            <IconGh /> GitHub
          </Link>
        </div>
      </div>
    </article>
  );
}
