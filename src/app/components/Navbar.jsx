// src/app/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Map, Users, Menu } from "lucide-react";

const nav = [
  { label: "Lab Career", href: "/lab-career", icon: BookOpen },
  { label: "Roadmap",   href: "/roadmap",     icon: Map },
  { label: "About Us",  href: "/about-us",    icon: Users },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    // transparan, TANPA background & TANPA border
    <header className="sticky top-2 z-50">
      {/* container ringan */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* pill */}
        <div
          className="mx-auto flex items-center justify-between gap-4 rounded-full border px-4 sm:px-6 py-2 shadow-sm"
          style={{
            background: "var(--accent-3)", // #F7E6A4
            borderColor: "color-mix(in oklab, #000 8%, var(--accent-3))",
          }}
        >
          {/* logo */}
          <Link
            href="/"
            className="flex items-center text-xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            <span className="mr-1 text-2xl leading-none">👑</span> Arunika
          </Link>

          {/* nav desktop */}
          <div className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex items-center gap-2 transition"
                style={{ color: "color-mix(in oklab, var(--text) 85%, transparent)" }}
              >
                <n.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{n.label}</span>
              </Link>
            ))}
          </div>

          {/* actions */}
          <div className="hidden sm:flex items-center gap-2">
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
              style={{ background: "var(--primary)" }} /* #FF8300 */
            >
              Daftar
            </Link>
          </div>

          {/* mobile menu button */}
          <button
            className="md:hidden rounded-full p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" style={{ color: "var(--text)" }} />
          </button>
        </div>

        {/* mobile drawer */}
        {open && (
          <div
            className="md:hidden mt-2 rounded-2xl border p-3"
            style={{
              background: "var(--bg)", // pakai warna halaman
              borderColor: "color-mix(in oklab, #000 10%, var(--bg))",
            }}
          >
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-2 transition hover:bg-[var(--accent-3)]/60"
                  style={{ color: "color-mix(in oklab, var(--text) 85%, transparent)" }}
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
