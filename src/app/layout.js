// src/app/layout.js
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Arunika — AI Career Mentoring",
  description:
    "Platform mentor & peta karier berbasis AI untuk membantu perempuan di tech memetakan jalan karier, membangun portofolio, dan terhubung dengan mentor relevan.",
};

// memastikan responsive di mobile
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
