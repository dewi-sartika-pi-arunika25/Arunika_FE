import { create } from "zustand";

export const useUI = create((set) => ({
  mobileOpen: false,
  activeSection: "hero", // "hero" | "keunggulan" | "unik" | "keanggotaan" | "tentang-kami"
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  setActiveSection: (activeSection) => set({ activeSection }),
  smoothScrollTo: (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    set({ mobileOpen: false });
  },
}));