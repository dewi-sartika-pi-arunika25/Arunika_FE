"use client";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";


export default function Header() {
    const router = useRouter();

  const handleLogout = () => {
    // 1️⃣ Hapus data login user (kalau ada)
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_history"); // optional

    // 2️⃣ Redirect ke halaman utama (misal landing page)
    router.push("/");

    // (Opsional: munculkan notifikasi kecil)
    alert("Anda telah logout. Sampai jumpa kembali!");
  };
  return (
    <header className="fixed top-0 left-72 w-[calc(100%-18rem)] h-16 bg-[#FFFDF5] border-b border-[#E4B200]/30 shadow-sm z-40 flex items-center justify-between px-8">
      {/* === LEFT SIDE === */}
      <h1 className="text-lg font-semibold text-[#A56400] tracking-wide">ARUNIKA</h1>

      {/* === RIGHT SIDE === */}
      <div className="flex items-center gap-3">
        {/* Tombol navigasi utama */}
        <Button className="bg-[#FF8C00] hover:bg-[#E67600] text-white font-medium text-sm rounded-xl">
          ARUNA QUEST
        </Button>
        <Button className="bg-[#E4B200] hover:bg-[#D19C00] text-[#2C2C2C] font-medium text-sm rounded-xl">
          MIRROR CHAT
        </Button>

        {/* === NOTIFICATION BELL === */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-[#FFF6DC] transition-all">
              <Bell className="h-5 w-5 text-[#A56400]" />
              {/* Titik notifikasi aktif */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF8C00] rounded-full border border-[#FFFDF5]"></span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 bg-[#FFFDF5] border border-[#E4B200]/30 shadow-lg rounded-xl">
            <DropdownMenuLabel className="text-sm font-semibold text-[#A56400]">
              Notifikasi
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-sm text-[#2C2C2C] hover:bg-[#FFF6DC]">
              ✨ AI menemukan 2 lowongan baru untukmu!
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-[#2C2C2C] hover:bg-[#FFF6DC]">
              💡 Rekomendasi skill baru: Leadership Communication
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-[#2C2C2C] hover:bg-[#FFF6DC]">
              🌿 Pesan harian Mirror Chat sudah siap
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-gray-500 justify-center">
              Lihat semua notifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* === LOGOUT BUTTON === */}
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-[#FF8C00] hover:bg-[#FFF6DC] flex items-center gap-2 text-sm"
           onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </header>
  );
}
