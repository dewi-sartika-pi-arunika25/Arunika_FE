"use client";
import { User, Bot } from "lucide-react";

export default function MessageBubble({ message }) {
  const me = message.role === "user";
  return (
    <div className={["flex items-start gap-3 max-w-[85%]",
      me ? "ml-auto flex-row-reverse" : "mr-auto"].join(" ")}>
      <div className={["p-2 rounded-full",
        me ? "bg-[color-mix(in oklab,var(--mc-primary)30%,transparent)]"
           : "bg-gray-800"].join(" ")}>
        {me ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className={[
        "p-4 rounded-3xl text-sm whitespace-pre-wrap shadow-md",
        me ? "rounded-br-none"
           : "rounded-tl-none border"
      ].join(" ")}
        style={{
          background: me ? "color-mix(in oklab,var(--mc-primary)22%,#1a1a1a)"
                         : "rgba(22,22,26,.9)",
          borderColor: me ? "transparent" : "var(--mc-border)"
        }}>
        {message.content}
      </div>
    </div>
  );
}
