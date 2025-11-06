"use client";

import Link from "next/link";

export default function FooterCTA() {
  return (
    <div className="wrap relative">
      <section
        aria-label="Ajakan bergabung"
        className="
          relative -mb-12 z-10 rounded-3xl shadow-xl
          px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10
        "
        style={{
          background: "color-mix(in oklab, var(--secondary) 92%, white)",
          border: "1px solid color-mix(in oklab, var(--accent-2) 40%, transparent)",
        }}
      >
        {/* dekor lembut */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
          style={{
            background:
              "radial-gradient(26rem 14rem at 75% 40%, rgba(255,255,255,.35), transparent 70%), radial-gradient(22rem 12rem at 18% 78%, rgba(255,255,255,.22), transparent 70%)",
          }}
        />

        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* LEFT – copy */}
          <div className="min-w-0">
            <span
              className="
                inline-flex h-6 items-center rounded-full px-3 text-[11px] font-bold text-white
                shadow-sm
              "
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--accent-2) 92%, black), var(--primary))",
              }}
            >
              Get Started
            </span>

            <h3
              className="mt-2 text-[28px] sm:text-[34px] font-extrabold leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              Figure out what’s next
            </h3>

            <p
              className="mt-3 max-w-xl text-sm sm:text-[15px] leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--foreground) 78%, transparent)" }}
            >
              Kami sudah menyiapkan riset dan panduan untuk menavigasi perubahan karier.
              Yuk mulai.
            </p>

            <div className="mt-6">
              <Link
                href="/daftar"
                className="
                  inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white
                  transition-transform hover:scale-[1.02]
                "
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  boxShadow:
                    "0 18px 36px -18px color-mix(in oklab, var(--primary) 75%, black)",
                }}
              >
                Mulai Gratis
              </Link>
            </div>
          </div>

          {/* RIGHT – mock kartu sederhana */}
          <div className="relative">
            <div
              className="
                ml-auto w-[320px] rounded-xl border bg-white p-3.5 shadow-lg
                max-lg:mx-auto
              "
              style={{
                border:
                  "1px solid color-mix(in oklab, var(--accent-3) 65%, transparent)",
              }}
            >
              <div className="mb-2 flex gap-1.5">
                {[0,1,2].map(i=>(
                  <span key={i} className="h-2 w-2 rounded-full"
                    style={{ background: "color-mix(in oklab, var(--primary) 80%, var(--accent-2))" }} />
                ))}
              </div>
              {["", "w-10/12", "w-9/12", "w-8/12"].map((w, i) => (
                <div
                  key={i}
                  className={`my-1.5 h-2.5 rounded-md ${w ?? ""}`}
                  style={{
                    background:
                      "color-mix(in oklab, var(--foreground) 14%, transparent)",
                  }}
                />
              ))}
            </div>

            <div
              className="
                absolute -bottom-4 -right-2 w-[210px] rounded-lg border bg-white p-2.5 shadow-md
                max-lg:right-1 max-lg:-bottom-5
              "
              style={{
                border:
                  "1px solid color-mix(in oklab, var(--accent-3) 60%, transparent)",
              }}
            >
              <div
                className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  background: "color-mix(in oklab, var(--accent-3) 55%, #fff)",
                  color:
                    "color-mix(in oklab, var(--foreground) 80%, transparent)",
                  border:
                    "1px solid color-mix(in oklab, var(--accent-3) 75%, transparent)",
                }}
              >
                Personalized Guidance
              </div>
              <ul className="mt-2 space-y-1.5 text-[12px]">
                {["Action Plan", "Interview Guide", "Energy Drivers"].map((t) => (
                  <li
                    key={t}
                    className="inline-flex rounded-md px-2 py-0.5"
                    style={{
                      background:
                        "color-mix(in oklab, var(--accent-3) 48%, #fff)",
                      color:
                        "color-mix(in oklab, var(--foreground) 82%, transparent)",
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
