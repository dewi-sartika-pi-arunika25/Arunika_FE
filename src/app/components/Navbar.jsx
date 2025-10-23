// src/app/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Map, Users, Menu } from "lucide-react";

const nav = [
  { label: "Lab Career", href: "/lab-career", icon: BookOpen },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "About Us", href: "/about-us", icon: Users },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-2 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto flex items-center justify-between gap-4 rounded-full border px-4 sm:px-6 py-2 shadow-sm"
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          <Link
            href="/"
            className="flex items-center text-xl font-semibold"
            style={{ color: "var(--text)" }}
            onClick={() => setOpen(false)}
          >
            <span className="mr-1 text-2xl leading-none">👑</span> Arunika
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex items-center gap-2"
                style={{
                  color: "color-mix(in oklab, var(--text) 85%, transparent)",
                }}
                onClick={() => setOpen(false)}
              >
                <n.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{n.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/60"
              style={{ color: "var(--text)" }}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              Daftar
            </Link>
          </div>

          <button
            className="lg:hidden rounded-full p-2"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" style={{ color: "var(--text)" }} />
          </button>
        </div>

        {open && (
          <div
            className="lg:hidden mt-2 rounded-2xl border p-3"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-2 transition hover:bg-[var(--accent-3)]/60"
                  style={{
                    color:
                      "color-mix(in oklab, var(--text) 85%, transparent)",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}

              <div className="mt-1 flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 transition hover:bg-[var(--accent-3)]/60"
                  style={{ color: "var(--text)" }}
                  onClick={() => setOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-md px-3 py-2 text-white transition hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                  onClick={() => setOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
