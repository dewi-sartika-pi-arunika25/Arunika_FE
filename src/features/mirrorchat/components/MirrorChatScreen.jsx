"use client";
import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { useMirrorChatStore } from "../store/chat.store";
import { MirrorChatAPI } from "../lib/ApiAdapter";
import { trackConfusion, mentorRecommendation, resetConfusion } from "../lib/guards";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import RightSidebar from "./RightSidebar";
import SearchModal from "./SearchModal";
import { useSession } from "next-auth/react";

export default function MirrorChatScreen() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.user?.email || "anon";
  const messages = useMirrorChatStore((s) => s.messages);
  const addMessage = useMirrorChatStore((s) => s.addMessage);
  const clearMessages = useMirrorChatStore((s) => s.clearMessages);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
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
      const reply = await MirrorChatAPI.askBot({
        userId,
        profile: session?.user || {},
        message: value,
      });

      if (count < 5) {
        addMessage({ role: "bot", content: reply });
      } else {
        addMessage({ role: "bot", content: `${reply}\n\n🤝 Sepertinya kamu butuh panduan lebih lanjut. Coba konsultasi mentor.` });
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

  const onLogout = () => {
    window.location.href = "/logout";
  };

  const onClear = () => {
    if (window.confirm("Yakin hapus semua pesan?")) clearMessages();
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B0F] text-white flex-col lg:flex-row">
      <div className="flex flex-col flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-28 lg:pb-0">
        <ChatHeader userId={userId} onLogout={onLogout} onClear={onClear} />

        <div className="flex-grow overflow-y-auto space-y-6 pr-2">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <Bot size={32} className="mx-auto mb-3 text-[var(--mc-primary)]" />
              <p className="text-base sm:text-lg font-semibold">Belum ada pesan</p>
              <p className="text-xs sm:text-sm">Mulailah percakapan dengan bot di bawah.</p>
            </div>
          )}
          {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
          {isLoading && (
            <div className="flex items-start gap-3 mr-auto">
              <div className="p-2 rounded-full bg-gray-800"><Bot size={18} /></div>
              <div className="p-4 rounded-3xl bg-gray-900 border text-sm"
                   style={{ borderColor: "var(--mc-border)" }}>
                <span className="animate-pulse">Mengetik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput value={input} onChange={setInput} onSubmit={handleSend} disabled={isLoading} />
      </div>

      <RightSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        user={{ userId }}
        messages={messages}
        logout={onLogout}
        onOpenSearch={() => setShowSearch(true)}
      />

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
