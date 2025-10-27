"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Brain,
  LogOut,
  Settings,
  BookOpen,
  Briefcase,
  History,
} from "lucide-react";

/* === PETA IKON UNTUK RENDERING === */
const iconMap = { User, Brain, LogOut, Settings, BookOpen, Briefcase, History };

/* === DATA DEFAULT HISTORI === */
const initialHistory = [
  {
    date: "Hari ini",
    items: [
      { icon: "User", text: "Mengubah profil pengguna", time: "21:10" },
      { icon: "Brain", text: "Membuka Analisis AI", time: "20:48" },
    ],
  },
  {
    date: "Kemarin",
    items: [
      { icon: "BookOpen", text: "Melihat rekomendasi SkillUp", time: "18:22" },
      { icon: "Briefcase", text: "Meninjau lowongan terpersonalisasi", time: "17:45" },
      { icon: "Settings", text: "Membuka pengaturan akun", time: "17:00" },
    ],
  },
  {
    date: "2 Hari Lalu",
    items: [
      { icon: "Brain", text: "Melihat hasil analisis karier AI", time: "14:30" },
      { icon: "LogOut", text: "Logout dari Arunika", time: "14:10" },
    ],
  },
];

/* === 🧩 FUNGSI TAMBAH HISTORI (untuk diimport di page.jsx) === */
export function addHistory(newItem) {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem("user_history") || "[]");
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });
  const existing = stored.find((h) => h.date === today);

  if (existing) {
    existing.items.unshift(newItem);
  } else {
    stored.unshift({
      date: today,
      items: [newItem],
    });
  }

  localStorage.setItem("user_history", JSON.stringify(stored));
}

/* === 🧠 KOMPONEN HALAMAN HISTORI === */
export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = JSON.parse(localStorage.getItem("user_history") || "[]");
    if (stored.length === 0) {
      localStorage.setItem("user_history", JSON.stringify(initialHistory));
      setHistory(initialHistory);
    } else {
      setHistory(stored);
    }
  }, []);

  return (
    <div className="p-8 pt-24 space-y-6 bg-[#FFFDF5] min-h-screen">
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#A56400]">
            🕒 Riwayat Aktivitas Pengguna
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {history.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-semibold text-[#2C2C2C] text-sm border-b border-[#E4B200]/30 pb-1">
                {section.date}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => {
                  const Icon = iconMap[item.icon] || User;
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-3 bg-[#FFFDF5] p-3 rounded-lg border border-[#E4B200]/20 hover:bg-[#FFF6DC] transition-all"
                    >
                      <Icon className="h-5 w-5 text-[#FF8C00]" />
                      <div className="flex-1">
                        <p className="text-sm text-[#2C2C2C] font-medium">{item.text}</p>
                        <p className="text-xs text-gray-600">{item.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
