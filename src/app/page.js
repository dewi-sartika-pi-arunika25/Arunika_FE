// app/page.jsx
import Navbar from './components/Navbar'; // Pastikan path ini benar
import React from 'react';

export default function HomePage() {
  return (
    <>
      {/* Navbar di bagian atas */}
      <Navbar />

      {/* Isi halaman utama */}
      <main className="container mx-auto px-4 py-10">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            Selamat Datang di <span className="text-orange-600">Arunika</span>
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Arunika adalah platform pembelajaran dan karier yang membantu kamu
            menemukan arah, membangun keterampilan, dan tumbuh bersama komunitas.
          </p>
        </section>
      </main>
    </>
  );
}
