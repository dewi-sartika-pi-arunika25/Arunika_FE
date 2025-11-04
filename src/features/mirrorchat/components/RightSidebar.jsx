"use client";
import { useState } from "react";
import { User, Search, BookOpen, Clock } from "lucide-react";

function SidebarButton({ title, icon, isActive, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        "flex flex-col items-center justify-center p-2 rounded-xl transition",
        isActive ? "text-[var(--mc-primary)] bg-[color-mix(in oklab,var(--mc-primary)20%,transparent)] hover:bg-[color-mix(in oklab,var(--mc-primary)32%,transparent)]"
                 : "text-gray-400 hover:bg-gray-800/60"
      ].join(" ")}
    >
      {icon}
      <span className="text-xs mt-1 hidden sm:block">{title}</span>
    </button>
  );
}

export default function RightSidebar({ activeMenu, setActiveMenu, user, messages, logout, onOpenSearch }) {
  const [panel, setPanel] = useState(null);

  const handle = (name) => {
    if (activeMenu === name) {
      setActiveMenu(null);
      setPanel(null);
      return;
    }
    setActiveMenu(name);
    if (name === "account") {
      setPanel(
        <div className="flex flex-col gap-3 text-sm">
          <p>User ID: {user?.userId || "-"}</p>
          <button onClick={logout} className="text-red-500 hover:text-red-400 inline-flex items-center gap-2">
            Keluar
          </button>
        </div>
      );
    } else if (name === "search") {
      setPanel(
        <div className="flex flex-col gap-2">
          <button onClick={onOpenSearch} className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-800"
                  style={{ borderColor: "var(--mc-border)", color: "var(--mc-text)" }}>
            Buka Pencarian Lanjutan
          </button>
        </div>
      );
    } else if (name === "library") {
      setPanel(<div className="text-gray-400 text-sm">Library kosong</div>);
    } else if (name === "history") {
      setPanel(
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada riwayat</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={["text-sm p-1 rounded",
                m.role === "user" ? "bg-[color-mix(in oklab,var(--mc-primary)20%,transparent)] ml-auto text-right"
                                  : "bg-gray-800/60 mr-auto text-left"
              ].join(" ")}>{m.content}</div>
            ))
          )}
        </div>
      );
    } else setPanel(null);
  };

  const items = [
    { name: "account", title: "Account", icon: <User size={22} /> },
    { name: "search",  title: "Search",  icon: <Search size={22} /> },
    { name: "library", title: "Library", icon: <BookOpen size={22} /> },
    { name: "history", title: "History", icon: <Clock size={22} /> },
  ];

  return (
    <>
      <div className="hidden lg:flex flex-col w-20 h-screen p-4 border-l bg-[#0B0B0F] space-y-8 items-center pt-10 flex-shrink-0 sticky top-0"
           style={{ borderColor: "var(--mc-border)" }}>
        {items.map((it) => (
          <SidebarButton key={it.name} title={it.title} icon={it.icon}
            isActive={activeMenu === it.name} onClick={() => handle(it.name)} />
        ))}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0B0B0F]/90 border-t flex justify-around items-center p-2 z-50"
           style={{ borderColor: "var(--mc-border)" }}>
        {items.map((it) => (
          <SidebarButton key={it.name} title={it.title} icon={it.icon}
            isActive={activeMenu === it.name} onClick={() => handle(it.name)} />
        ))}
      </div>

      {activeMenu && (
        <div className="lg:hidden fixed bottom-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl w-[90%] max-w-md z-50 border"
             style={{ borderColor: "var(--mc-border)" }}>
          {panel}
        </div>
      )}
    </>
  );
}
