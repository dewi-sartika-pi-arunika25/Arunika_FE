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
        <Button className="bg-[#FF6A00] hover:bg-[#FFA14A] text-white font-medium text-sm rounded-xl">
          ARUNA QUEST
        </Button>
        <Button className="bg-[#FF6A00] hover:bg-[#FFA14A] text-white font-medium text-sm rounded-xl">
          MIRROR CHAT
        </Button>


        {/* === LOGOUT BUTTON === */}
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-[#FF6A00] hover:bg-[#FFF6DC] flex items-center gap-2 text-sm"
           onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </header>
  );
}
