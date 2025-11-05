"use client";
import { create } from "zustand";

export const useMirrorChatStore = create((set) => ({
  messages: [],
  hasWelcomed: false, // Track apakah sudah ada welcome message
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [], hasWelcomed: false }),
  setMessages: (arr) => set({ messages: arr || [] }),
  setHasWelcomed: (value) => set({ hasWelcomed: value }),
}));
