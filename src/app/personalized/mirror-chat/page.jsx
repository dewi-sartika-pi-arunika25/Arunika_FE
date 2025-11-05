"use client";
import ThemeAdapter from "@/features/mirrorchat/adapters/ThemeAdapter";
import MirrorChatScreen from "@/features/mirrorchat/components/MirrorChatScreen";

export default function MirrorChatPage() {
  return (
    <ThemeAdapter>
      <MirrorChatScreen />
    </ThemeAdapter>
  );
}