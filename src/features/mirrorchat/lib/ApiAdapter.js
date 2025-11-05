export const MirrorChatAPI = {
  // Gunakan proxy Next.js (/api) agar semua request lewat localhost:3000
  // Ini konsisten dengan pattern di api.js dan menghindari CORS issue
  async askBot({ userId, profile, message, roleFitContext, personalizedContext, isFirstMessage }) {
    const url = "/api/gemini";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          userId, 
          profile, 
          message, 
          roleFitContext, 
          personalizedContext,
          isFirstMessage 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || "Bad response");
      }
      
      const data = await res.json();
      
      // Response format dari backend: { success: true, data: { reply: "..." }, message: "..." }
      if (data.success && data.data?.reply) {
        return data.data.reply;
      }
      
      // Fallback untuk format lama atau error
      return data?.reply || data?.message || "Bot belum ada jawaban.";
    } catch (error) {
      console.error("[MirrorChatAPI] Error:", error);
      console.error("[MirrorChatAPI] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Handle network errors (Failed to fetch, CORS, etc.)
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        return "⚠️ Error koneksi ke server. Pastikan backend sedang berjalan di http://localhost:5000";
      }
      
      return error.message || "⚠️ Error koneksi ke server.";
    }
  },
};
