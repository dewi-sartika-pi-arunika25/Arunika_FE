"use client";
import ThemeAdapter from "@/features/mirrorchat/adapters/ThemeAdapter";
import MirrorChatScreen from "@/features/mirrorchat/components/MirrorChatScreen";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MirrorChatPage() {
  return (
    <ThemeAdapter>
      <ProtectedRoute>
        <div className="wrap section">
          <MirrorChatScreen />
        </div>
      </ProtectedRoute>
    </ThemeAdapter>
  );
}
