export const MirrorChatAPI = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  async askBot({ userId, profile, message }) {
    const url = this.baseUrl
      ? `${this.baseUrl}/mirrorchat/ask`
      : "/api/ai/mirrorchat"; 

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, profile, message }),
      });
      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      return data?.reply || "Bot belum ada jawaban.";
    } catch {
      return "⚠️ Error koneksi ke server.";
    }
  },
};
