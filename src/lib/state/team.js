// src/lib/state/team.js
import { create } from "zustand";

export const useTeamStore = create((set) => ({
  members: [
    {
      id: "sylva",
      name: "Sylva",
      role: "Co-Founder",
      avatar: "/team/syl.png",
      quote:
        "Always think about the end goal before you start to code.",
      links: {
        linkedin: "https://www.linkedin.com/in/sylva-zilyasri",
        github: "https://github.com/zilyasri",
      },
    },
    {
      id: "candra",
      name: "Candra",
      role: "Co-Founder & Chief AI Scientist",
      avatar: "/team/can.png",
      quote: "Clarity of purpose matters more than the speed of starting.",
      links: {
        linkedin: "https://www.linkedin.com/in/candralorensia/",
        github: "https://github.com/clorensia",
      },
    },
    {
      id: "zulfa",
      name: "Zulfa",
      role: "Co-Founder",
      avatar: "/team/zuzu.png",
      quote:
        "Accept bugs you can’t reproduce, fix bugs you can debug, and know when it’s a feature.",
      links: {
        linkedin: "https://www.linkedin.com/in/zulfanikmah/",
        github: "https://github.com/zulfa-nkmh",
      },
    },
  ],
  open: false,
  active: null,
  openModal: (member) => set({ open: true, active: member }),
  closeModal: () => set({ open: false, active: null }),
}));
