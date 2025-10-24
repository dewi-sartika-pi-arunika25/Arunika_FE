"use client";

import { useEffect } from "react";
import { BookOpen, Map, Users, Menu, Sparkles } from "lucide-react";
import { useUI } from "@/lib/store/ui";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const items = [
  { key: "keunggulan", label: "Keunggulan", icon: BookOpen },
  { key: "unik", label: "Unik", icon: Sparkles },
  { key: "keanggotaan", label: "Anggota", icon: Map },
  { key: "tentang-kami", label: "Tentang Kami", icon: Users },
];

export default function Navbar() {
  const { mobileOpen, setMobileOpen, smoothScrollTo } = useUI();
  const active = useUI((s) => s.activeSection);

  useScrollSpy(["hero", "keunggulan", "unik", "keanggotaan", "tentang-kami"], 140);

  // optional: jaga-jaga
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <header className="sticky top-2 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto flex items-center justify-between gap-4 rounded-full border px-4 sm:px-6 py-2 shadow-sm backdrop-blur-xl"
          style={{
            background: "color-mix(in oklab, var(--background) 70%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <button
            onClick={() => smoothScrollTo("hero")}
            className="flex items-center text-xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            <span className="mr-1 text-2xl leading-none">👑</span> Arunika
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {items.map((n) => {
              const Icon = n.icon;
              const isActive = active === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => smoothScrollTo(n.key)}
                  className={`rounded-full px-4 py-2 inline-flex items-center gap-2 text-sm font-medium transition
                    ${isActive ? "bg-[var(--primary)] text-white" : "hover:bg-white/60"}`}
                  style={!isActive ? { color: "var(--text)" } : {}}
                >
                  <Icon className="h-5 w-5" />
                  {n.label}
                </button>
              );
            })}
          </div>

          {/* AUTH (opsional) */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/60"
              style={{ color: "var(--text)" }}
            >
              Masuk
            </a>
            <a
              href="/register"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              Daftar
            </a>
          </div>

          {/* MOBILE MENU (fallback tanpa shadcn/ui) */}
          <button
            className="lg:hidden rounded-full p-2"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            onClick={() => useUI.getState().setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-6 w-6" style={{ color: "var(--text)" }} />
          </button>
        </div>

        {mobileOpen && (
          <div
            className="lg:hidden mt-2 rounded-2xl border p-3"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex flex-col gap-2">
              {items.map((n) => (
                <button
                  key={n.key}
                  onClick={() => useUI.getState().smoothScrollTo(n.key)}
                  className="rounded-lg px-3 py-2 text-left transition hover:bg-[var(--accent-3)]/60"
                  style={{
                    color: "color-mix(in oklab, var(--text) 85%, transparent)",
                  }}
                >
                  {n.label}
                </button>
              ))}

              <div className="mt-1 flex items-center gap-2">
                <a
                  href="/login"
                  className="rounded-md px-3 py-2 transition hover:bg-[var(--accent-3)]/60"
                  style={{ color: "var(--text)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="rounded-md px-3 py-2 text-white transition hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Daftar
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}