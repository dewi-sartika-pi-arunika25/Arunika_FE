"use client";
import { Suspense } from "react";
import ThemeAdapter from "@/features/mirrorchat/adapters/ThemeAdapter";
import MirrorChatScreen from "@/features/mirrorchat/components/MirrorChatScreen";

export default function MirrorChatPage() {
  return (
    <ThemeAdapter>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E4B200] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat Mirror Chat...</p>
          </div>
        </div>
      }>
        <MirrorChatScreen />
      </Suspense>
    </ThemeAdapter>
  );
}