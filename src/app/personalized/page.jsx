"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AnalisisAI from "./components/AnalisisAI";
import RekomendasiPekerjaan from "./components/RekomendasiPekerjaan";
import RekomendasiSkillUp from "./components/RekomendasiSkillUp";
import DashboardContent from "./components/DashboardContent";
import ProfileModal from "./components/ProfileModal";
import Header from "./components/Header"; // 🔹 Tambah baris ini

export default function PersonalizedPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "Zulfatun Nikmah",
    initials: "ZN",
    photo: "",
  });

  const renderContent = () => {
    switch (activeMenu) {
      case "analisis":
        return <AnalisisAI />;
      case "rekom-pekerjaan":
        return <RekomendasiPekerjaan />;
      case "rekom-skill":
        return <RekomendasiSkillUp />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        userProfile={profile}
        onEditProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* === HEADER DI SINI === */}
        <Header userProfile={profile} />

        {/* === KONTEN UTAMA === */}
        <div className="p-6 flex-1">{renderContent()}</div>
      </main>

      {/* Modal Profil */}
      <ProfileModal
        profile={profile}
        setProfile={setProfile}
        open={isProfileModalOpen}
        setOpen={setProfileModalOpen}
      />
    </div>
  );
}
