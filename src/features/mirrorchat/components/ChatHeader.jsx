"use client";

export default function ChatHeader({ userId, onLogout, onClear }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b mb-6"
         style={{ borderColor: "var(--mc-border)" }}>
      <a href="/" className="cursor-pointer">
        <h1 className="text-2xl sm:text-3xl font-bold"
            style={{
              color: "transparent",
              backgroundImage: "linear-gradient(90deg,#60a5fa,#a78bfa)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text"
            }}>
          Arunika MC (User ID: {userId || "-"})
        </h1>
      </a>
      <div className="flex gap-3 flex-wrap text-sm">
        <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition">Logout</button>
        <button onClick={onClear} className="text-gray-400 hover:text-red-500 transition">Hapus Chat</button>
      </div>
    </div>
  );
}
