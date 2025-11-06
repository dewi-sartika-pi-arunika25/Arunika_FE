"use client";
import { create } from "zustand";

export const useMirrorChatStore = create((set) => ({
  messages: [],
  hasWelcomed: false, // Track apakah sudah ada welcome message
  personalizedData: null, // Store personalized data untuk sinkronisasi
  userName: null, // Store user name dari personalized data
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [], hasWelcomed: false }),
  setMessages: (arr) => set({ messages: arr || [] }),
  setHasWelcomed: (value) => set({ hasWelcomed: value }),
  setPersonalizedData: (data) => set({ personalizedData: data }),
  setUserName: (name) => set({ userName: name }),
}));
