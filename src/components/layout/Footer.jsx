import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="Arunika" className="h-12 w-auto" />
            <p className="mt-4 text-base leading-relaxed max-w-xs footer-text">
              Playlist karir personalmu untuk masa depan yang lebih cerah.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Perusahaan</h4>
            <ul className="footer-links space-y-3 text-base">
              <li><Link href="/about">Tentang Kami</Link></li>
              <li><Link href="/partner">Partner</Link></li>
              <li><Link href="/press-kit">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Sosial Media</h4>
            <ul className="footer-links space-y-3 text-base">
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4l16 16M20 4L4 20"
                          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4"
                          stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="3.8"
                            stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/" target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3c5 0 9 4 9 9s-4 9-9 9S3 17 3 12 7 3 12 3Zm0 0c3 0 5 2 5 5 0 2-1 3-3 3h-2"
                          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20c-3 0-5-2-5-5 0-2 1-3 3-3h2"
                          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Threads
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {year} Arunika. All Rights Reserved.
        </div>
      </div>

      <div aria-hidden="true" className="footer-overlay" />
    </footer>
  );
}
