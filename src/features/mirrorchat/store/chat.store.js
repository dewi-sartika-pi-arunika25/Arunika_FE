"use client";
import { create } from "zustand";

export const useMirrorChatStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  setMessages: (arr) => set({ messages: arr || [] }),
}));
