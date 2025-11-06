"use client";
import { User, Bot } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      <div
        className={`p-2 rounded-full ${
          isUser ? "bg-[var(--primary)] text-white" : "bg-[#EFE9DC] text-[#4b3b2a]"
        }`}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div
        className={`p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm border ${
          isUser
            ? "bg-[var(--primary)] text-white border-transparent"
            : "bg-white text-[var(--text)]"
        }`}
        style={
          isUser
            ? undefined
            : { borderColor: "color-mix(in oklab, var(--accent-3) 55%, var(--border))" }
        }
      >
        {message.content}
      </div>
    </div>
  );
}
