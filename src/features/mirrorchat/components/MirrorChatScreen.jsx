"use client";
import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMirrorChatStore } from "../store/chat.store";
import { MirrorChatAPI } from "../lib/ApiAdapter";
import { trackConfusion, mentorRecommendation, resetConfusion, aiReflectionGuard } from "../lib/guards";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

export default function MirrorChatScreen() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.user?.email || "anon";
  const displayName = session?.user?.name || session?.user?.email || "Tamu";

  const messages = useMirrorChatStore((s) => s.messages);
  const hasWelcomed = useMirrorChatStore((s) => s.hasWelcomed);
  const addMessage = useMirrorChatStore((s) => s.addMessage);
  const clearMessages = useMirrorChatStore((s) => s.clearMessages);
  const setHasWelcomed = useMirrorChatStore((s) => s.setHasWelcomed);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    addMessage({ role: "user", content: value });
    setInput("");
    setIsLoading(true);

    try {
      const count = trackConfusion(userId, value);
      
      // Cek apakah ini first message (belum ada welcome message)
      const isFirstMessage = !hasWelcomed && messages.length === 0;
      
      // Gunakan AI Reflection Guard untuk personalisasi berdasarkan role fit analysis
      const reply = await aiReflectionGuard(
        userId,
        value,
        session?.user || {},
        isFirstMessage
      );

      // Mark sebagai sudah di-welcome setelah first message
      if (isFirstMessage) {
        setHasWelcomed(true);
      }

      if (count < 5) {
        addMessage({ role: "bot", content: reply });
      } else {
        addMessage({
          role: "bot",
          content: `${reply}\n\n🤝 Sepertinya kamu butuh panduan lebih lanjut. Coba konsultasi mentor.`,
        });
        const mentorMsg = await mentorRecommendation(userId);
        addMessage({ role: "bot", content: mentorMsg });
        resetConfusion(userId);
      }
    } catch {
      addMessage({ role: "bot", content: "⚠️ Error koneksi ke server." });
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);
  const confirmClear = () => {
    clearMessages();
    setShowConfirm(false);
  };

  return (
    <div className="mc-shell">
      <div className="mc-card">
        <div className="mc-viewport">
          <div className="mc-header">
            <ChatHeader name={displayName} />
          </div>

          <div className="mc-scroll space-y-6 pr-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-16">
                <Bot size={28} className="mx-auto mb-3" style={{ color: "var(--primary)" }} />
                <p className="text-base font-semibold">Belum ada percakapan</p>
                <p className="text-sm">Mulai ngobrol dengan AI Twin kamu di bawah.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 mr-auto">
                <div className="p-2 rounded-full bg-[#EFE9DC] text-[#4b3b2a]">
                  <Bot size={18} />
                </div>
                <div className="p-4 rounded-2xl bg-white border text-sm shadow-sm"
                     style={{ borderColor: "color-mix(in oklab, var(--accent-3) 55%, var(--border))" }}>
                  <span className="animate-pulse">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mc-inputbar">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSend}
              disabled={isLoading}
              onClearClick={openConfirm}
            />
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] grid place-items-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeConfirm} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 border shadow-xl"
               style={{ borderColor: "color-mix(in oklab, var(--accent-3) 60%, var(--border))" }}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>Hapus seluruh chat?</h3>
            <p className="text-sm mb-4" style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}>
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="rounded-full px-4 py-2 text-sm border"
                style={{ borderColor: "var(--border)", color: "var(--text)", background: "#fff" }}
              >
                Batal
              </button>
              <button
                onClick={confirmClear}
                className="rounded-full px-4 py-2 text-sm text-white"
                style={{ background: "var(--primary)" }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
