"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Target, DollarSign, Sparkles } from "lucide-react";

export default function DashboardContent() {
  return (
    <div className="p-8 pt-24 space-y-6">
        
      {/* === WELCOME CARD === */}
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-md text-[#2C2C2C]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Selamat Datang, Zulfa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 italic">
            “Hari ini adalah waktu terbaik untuk tumbuh dan melangkah dengan tenang.”
          </p>
        </CardContent>
      </Card>

      {/* === PROGRESS SUMMARY === */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 p-4 flex flex-col items-center text-center shadow-sm">
          <Briefcase className="h-5 w-5 text-[#FF8C00]" />
          <p className="text-lg font-bold text-[#2C2C2C]">12</p>
          <p className="text-sm text-gray-600">Lowongan</p>
        </Card>
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 p-4 flex flex-col items-center text-center shadow-sm">
          <Target className="h-5 w-5 text-[#E4B200]" />
          <p className="text-lg font-bold text-[#2C2C2C]">3</p>
          <p className="text-sm text-gray-600">Skill Gap</p>
        </Card>
        <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 p-4 flex flex-col items-center text-center shadow-sm">
          <DollarSign className="h-5 w-5 text-gray-700" />
          <p className="text-lg font-bold text-[#2C2C2C]">Rp 13 Juta</p>
          <p className="text-sm text-gray-600">Gaji Proyeksi</p>
        </Card>
      </div>

      {/* === AI RECOMMENDATION === */}
      <Card className="bg-[#FFFDF5] border border-[#E4B200]/30 shadow-sm">
        <CardHeader className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#FF8C00]" />
          <CardTitle className="text-lg font-bold text-[#2C2C2C]">
            Rekomendasi Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            “Pelajari <b>Delivery Cadence</b> minggu ini untuk meningkatkan efisiensi proyekmu.”
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
