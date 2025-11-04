"use client";
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-9xl font-bold text-[#E4B200] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#E4B200' }}
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-[#E4B200] text-[#2C2C2C] hover:bg-[#FFF6DC] transition-all"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E4B200]/20">
          <p className="text-sm text-gray-500 mb-4">Atau coba halaman populer:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/skill-match"
              className="px-4 py-2 text-sm rounded-lg bg-white border border-[#E4B200]/30 text-[#2C2C2C] hover:bg-[#FFF6DC] transition-colors"
            >
              Skill Match
            </Link>
            <Link
              href="/personalized"
              className="px-4 py-2 text-sm rounded-lg bg-white border border-[#E4B200]/30 text-[#2C2C2C] hover:bg-[#FFF6DC] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-lg bg-white border border-[#E4B200]/30 text-[#2C2C2C] hover:bg-[#FFF6DC] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

