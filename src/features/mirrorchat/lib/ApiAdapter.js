export const MirrorChatAPI = {
  /**
   * Ask bot dengan personalized context dari personalizedAPI (assessment_cache)
   * 
   * Flow:
   * 1. Frontend mengirim personalizedContext yang sudah di-fetch dari personalizedAPI
   * 2. Backend (/api/gemini) akan menggunakan data dari personalizedContext untuk personalisasi
   * 3. Data assessment_cache (DISC, RIASEC, AI analysis) sudah termasuk dalam personalizedContext
   * 4. Backend akan menggunakan batasan response yang sudah di-set untuk menjaga konsistensi
   * 
   * @param {string} userId - User ID
   * @param {object} profile - Profile user (optional)
   * @param {string} message - User message
   * @param {object} roleFitContext - Role fit context (dari personalizedAPI)
   * @param {object} personalizedContext - Full personalized context dengan assessment_cache data
   * @param {boolean} isFirstMessage - Flag untuk first message
   * @returns {Promise<string>} - AI response
   */
  async askBot({ userId, profile, message, roleFitContext, personalizedContext, isFirstMessage }) {
    // Gunakan proxy Next.js (/api/gemini) -> backend /api/gemini
    // Backend akan menggunakan personalizedContext untuk personalisasi response
    const url = "/api/gemini";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies untuk auth
        body: JSON.stringify({ 
          userId, 
          profile, 
          message, 
          roleFitContext, // Context dari personalizedAPI (fallback)
          personalizedContext, // SELALU kirim - berisi data dari personalizedAPI termasuk assessment_cache
          isFirstMessage // Flag untuk first message
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || "Bad response");
      }
      
      const data = await res.json();
      
      // Debug logging untuk development
      if (process.env.NODE_ENV === 'development') {
        console.log('[MirrorChatAPI] Response:', {
          success: data.success,
          hasData: !!data.data,
          hasReply: !!data.data?.reply,
          message: data.message
        });
      }
      
      // Response format dari backend: { success: true, data: { reply: "..." }, message: "..." }
      if (data.success && data.data?.reply) {
        return data.data.reply;
      }
      
      // Fallback untuk format lama atau error
      if (data.reply) {
        return data.reply;
      }
      
      if (data.message && data.message !== 'Content generated successfully') {
        return data.message;
      }
      
      return "Bot belum ada jawaban.";
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
