"use client";
import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMirrorChatStore } from "../store/chat.store";
import { MirrorChatAPI } from "../lib/ApiAdapter";
import { trackConfusion,  resetConfusion, aiReflectionGuard, fetchPersonalizedData } from "../lib/guards";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { useAuthStore } from "@/lib/store/auth";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

export default function MirrorChatScreen() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.user?.email || "anon";
  const sessionName = session?.user?.name || session?.user?.email || "Tamu";

  // Gunakan usePersonalizedProfile untuk mendapatkan user name (sama seperti Header)
  const authStore = useAuthStore();
  const { user } = usePersonalizedProfile();
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  
  // Prioritas: authUserName > user?.name dari usePersonalizedProfile > userName dari store > sessionName
  // Ini memastikan nama di Mirror Chat sama dengan yang di Header
  const headerDisplayName = authUserName || user?.name || 'Pengguna';

  const messages = useMirrorChatStore((s) => s.messages);
  const hasWelcomed = useMirrorChatStore((s) => s.hasWelcomed);
  const personalizedData = useMirrorChatStore((s) => s.personalizedData);
  const userName = useMirrorChatStore((s) => s.userName);
  const addMessage = useMirrorChatStore((s) => s.addMessage);
  const clearMessages = useMirrorChatStore((s) => s.clearMessages);
  const setHasWelcomed = useMirrorChatStore((s) => s.setHasWelcomed);
  const setPersonalizedData = useMirrorChatStore((s) => s.setPersonalizedData);
  const setUserName = useMirrorChatStore((s) => s.setUserName);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper function untuk resolve user name (sama seperti usePersonalizedProfile)
  const resolveUserName = (userObjOrString, fallback) => {
    if (typeof userObjOrString === 'string') return userObjOrString;
    if (!userObjOrString || typeof userObjOrString !== 'object') {
      return typeof fallback === 'string' ? fallback : sessionName;
    }
    const candidates = [
      userObjOrString.display_name,
      userObjOrString.full_name,
      userObjOrString.name,
      userObjOrString.nama,
      userObjOrString.username,
      typeof fallback === 'string' ? fallback : null
    ].filter(Boolean);
    return candidates[0] || sessionName;
  };

  // Load personalized data saat component mount atau userId berubah
  // HANYA fetch sekali saat mount, tidak perlu fetch lagi di handleSend (akan menggunakan cached data)
  useEffect(() => {
    if (userId && userId !== "anon" && !personalizedData) {
      let isMounted = true; // Flag untuk mencegah state update setelah unmount
      
      const loadPersonalizedData = async () => {
        try {
          const data = await fetchPersonalizedData(userId).catch(err => {
            // Catch error untuk mencegah unhandled rejection
            // fetchPersonalizedData sudah handle error internal, jadi return empty object
            console.warn("[MirrorChat] Error loading personalized data:", err?.message || err);
            return {
              userInfo: null,
              personalizedData: null,
              assessmentData: null,
              computedValues: null,
            };
          });
          
          // Only update state if component is still mounted
          if (!isMounted) return;
          
          // Store personalized data (bahkan jika partial)
          if (data) {
            setPersonalizedData(data);
          }
          
          // Update user name dari data jika ada (prioritas lebih rendah dari headerDisplayName)
          if (data?.userInfo && !headerDisplayName) {
            const extractedName = resolveUserName(data.userInfo, sessionName);
            if (extractedName && extractedName !== sessionName && extractedName !== 'Pengguna') {
              setUserName(extractedName);
            }
          }
        } catch (error) {
          // Error sudah di-handle di fetchPersonalizedData
          // Pastikan nama tetap ter-set dari headerDisplayName
          if (!isMounted) return;
          if (!userName && !headerDisplayName) {
            setUserName(sessionName);
          }
        }
      };
      
      loadPersonalizedData();
      
      // Cleanup function untuk mencegah state update setelah unmount
      return () => {
        isMounted = false;
      };
    }
  }, [userId, sessionName, setPersonalizedData, setUserName, userName, personalizedData, headerDisplayName]);

  // Gunakan headerDisplayName sebagai prioritas utama (sama seperti Header.jsx)
  // Ini memastikan nama di Mirror Chat sinkron dengan Header dashboard
  const displayName = headerDisplayName || userName || sessionName;
  
  // Build userProfile object untuk ChatHeader (sama seperti PersonalizedPage)
  const userProfile = {
    name: displayName,
    initials: (displayName?.match(/\b\w/g) || []).slice(0, 2).join('').toUpperCase() || "US",
    photo: null,
  };
  
  // Sync userName di store dengan headerDisplayName jika berbeda
  useEffect(() => {
    if (headerDisplayName && headerDisplayName !== userName && headerDisplayName !== 'Pengguna') {
      setUserName(headerDisplayName);
    }
  }, [headerDisplayName, userName, setUserName]);

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
      
      // Refresh personalized data HANYA jika belum ada sama sekali (untuk first message)
      // Jangan fetch lagi jika sudah ada - gunakan cached data untuk menghindari duplicate fetch
      let currentPersonalizedData = personalizedData;
      if (!currentPersonalizedData && userId && userId !== "anon") {
        try {
          currentPersonalizedData = await fetchPersonalizedData(userId);
          setPersonalizedData(currentPersonalizedData);
        } catch (error) {
          // Continue dengan null jika fetch gagal - aiReflectionGuard akan handle
          console.warn("[MirrorChat] Could not fetch personalized data:", error);
        }
      }
      
      // Gunakan AI Reflection Guard untuk personalisasi berdasarkan role fit analysis
      // Pass cached personalizedData untuk menghindari duplicate fetch di aiReflectionGuard
      const reply = await aiReflectionGuard(
        userId,
        value,
        session?.user || {},
        isFirstMessage,
        currentPersonalizedData // Pass cached data untuk menghindari duplicate fetch
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
            <ChatHeader userProfile={userProfile} />
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
