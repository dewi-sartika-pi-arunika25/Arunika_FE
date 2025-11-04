"use client";

import { useState, useEffect } from "react";
import { Home, Brain, Target, BarChart3, Pencil, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { useAuthStore } from "@/lib/store/auth";

export default function Sidebar({ activeMenu, setActiveMenu, userProfile = {}, onEditProfile }) {
  const { user } = usePersonalizedProfile();
  const authStore = useAuthStore();
  
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  const displayName = authUserName || user?.name || userProfile.name || "Pengguna";
  const initials = (displayName?.match(/\b\w/g) || []).slice(0,2).join('').toUpperCase() || userProfile.initials || "US";
  const photo = userProfile.photo;
  const menuItems = [
    { key: "dashboard", icon: Home, label: "Dashboard" },
    { key: "analisis", icon: Brain, label: "Analisis AI" },
    { key: "rekom-pekerjaan", icon: Target, label: "Rekomendasi Pekerjaan" },
    { key: "rekom-skill", icon: BarChart3, label: "Skill Up" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 bg-gradient-to-b from-yellow-50 to-yellow-100 flex-col justify-between shadow-sm">
      <div>
        {/* Logo */}
        <div className="p-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-yellow-600">Arunika</span> 
          </h1>

          {/* === Profile Section === */}
          <div className="mt-8 flex flex-col items-center relative">
            {/* Foto Profil */}
            <div className="relative">
              {photo ? (
                <Image
                  src={photo}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 shadow-inner"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold shadow-inner">
                  {initials}
                </div>
              )}

              {/* Tombol Edit */}
              <button
                onClick={onEditProfile}
                className="absolute -bottom-1 -right-1 bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full shadow"
              >
                <Pencil size={14} />
              </button>
            </div>

            {/* Nama */}
            <p className="mt-3 font-semibold text-gray-800 text-center">
              {displayName}
            </p>
          </div>
        </div>

        {/* === Menu Navigasi === */}
        <nav className="mt-10 px-3">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.key;
            return (
              <motion.div
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all ${
                  isActive
                    ? "bg-yellow-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400">© 2025 Arunika. All Rights Reserved</div>
      </aside>

      {/* Mobile Bottom Navigation - Icon Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.key;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all relative ${
                  isActive
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
                title={item.label}
              >
                <Icon size={22} />
                <span className={`text-[10px] font-medium ${isActive ? "text-yellow-600" : "text-gray-500"}`}>
                  {item.label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* Profile Button */}
          <motion.button
            onClick={onEditProfile}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-gray-500 transition-all"
            title="Profil"
          >
            {photo ? (
              <Image
                src={photo}
                alt="Profile"
                width={22}
                height={22}
                className="rounded-full object-cover"
              />
            ) : (
              <>
                <User size={22} />
                <span className="text-[10px] font-medium">Profil</span>
              </>
            )}
          </motion.button>
        </div>
      </nav>
    </>
  );
}
