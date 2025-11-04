"use client";

import Link from "next/link";

export default function FooterMain() {
  const year = new Date().getFullYear();

  return (
    <div
      className="
        relative rounded-t-2xl
        pt-16  /* ruang overlap CTA (-mb-12) */
      "
      style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}
    >
      <div className="wrap py-12">
        <div className="grid items-start gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <img src="/logo-arunika.svg" alt="Arunika" className="h-11 w-auto" />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed">
              Playlist karier personal untuk masa depan yang lebih cerah.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-3 [&>li>a]:transition-colors [&>li>a:hover]:text-[var(--footer-hover)]">
                <li><Link href="/">Beranda</Link></li>
                <li><Link href="/pricing">Harga</Link></li>
                <li><Link href="/privacy">Kebijakan Privasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-lg font-semibold">Company</h4>
              <ul className="space-y-3 [&>li>a]:transition-colors [&>li>a:hover]:text-[var(--footer-hover)]">
                <li><Link href="/about">Tentang Kami</Link></li>
                <li><Link href="/partner">Partner</Link></li>
                <li><Link href="/press-kit">Press Kit</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-2 text-lg font-semibold">Stay up to date</h4>
            <p className="text-sm">Dapatkan insight karier terbaru.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email kamu"
                aria-label="Email"
                className="
                  h-11 w-full flex-1 rounded-full border px-4 text-sm
                  bg-white text-[var(--footer-text)]
                "
                style={{ borderColor: "var(--footer-divider)" }}
              />
              <button
                type="submit"
                className="
                  h-11 rounded-full px-4 text-sm font-semibold text-white
                  transition-transform hover:scale-[1.03]
                "
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  boxShadow:
                    "0 14px 28px -16px color-mix(in oklab, var(--primary) 70%, black)",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 text-center text-sm"
          style={{ borderColor: "var(--footer-divider)" }}
        >
          © {year} Arunika. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
