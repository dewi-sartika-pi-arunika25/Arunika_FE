"use client";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnalisisAI from "./components/AnalisisAI";
import RekomendasiPekerjaan from "./components/RekomendasiPekerjaan";
import RekomendasiSkillUp from "./components/RekomendasiSkillUp";
import DashboardContent from "./components/DashboardContent";
import ProfileModal from "./components/ProfileModal";
import Header from "./components/Header";
import { useSearchParams } from "next/navigation";
import { usePersonalizedStore } from "@/lib/store/personalized";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";

export default function PersonalizedPage() {
  // Filter state
  const filters = useDashboardFilters();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  
  // ✅ Use Zustand store instead of local state
  const activeMenu = usePersonalizedStore((state) => state.activeMenu);
  const setActiveMenu = usePersonalizedStore((state) => state.setActiveMenu);
  const isProfileModalOpen = usePersonalizedStore((state) => state.isProfileModalOpen);
  const setProfileModalOpen = usePersonalizedStore((state) => state.setProfileModalOpen);
  const userProfile = usePersonalizedStore((state) => state.userProfile);
  const setUserProfile = usePersonalizedStore((state) => state.setUserProfile);

  // Initialize user profile from userId
  useEffect(() => {
    if (userId && !userProfile.name) {
      setUserProfile({
        name: userId,
        initials: "",
        photo: "",
      });
    }
  }, [userId, userProfile.name, setUserProfile]);

  // Handle menu dari URL parameter
  useEffect(() => {
    const menuParam = searchParams.get('menu');
    if (menuParam) {
      setActiveMenu(menuParam);
    }
  }, [searchParams, setActiveMenu]);

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
        userProfile={userProfile}
        onEditProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* === HEADER DI SINI === */}
        <Header 
          userProfile={userProfile}
          searchQuery={filters.searchQuery}
          onSearchChange={filters.setSearchQuery}
          roleFilter={filters.roleFilter}
          onRoleFilterChange={filters.setRoleFilter}
          priorityFilter={filters.priorityFilter}
          onPriorityFilterChange={filters.setPriorityFilter}
          matchScoreFilter={filters.matchScoreFilter}
          onMatchScoreFilterChange={filters.setMatchScoreFilter}
          onResetFilters={filters.resetFilters}
          showFilter={activeMenu === "dashboard" || activeMenu === ""}
        />

        {/* === KONTEN UTAMA === */}
        <div className="p-6 flex-1">
          {activeMenu === "dashboard" || activeMenu === "" ? (
            <DashboardContent filters={filters} />
          ) : (
            renderContent()
          )}
        </div>
      </main>

      {/* Modal Profil */}
      <ProfileModal
        profile={userProfile}
        setProfile={setUserProfile}
        open={isProfileModalOpen}
        setOpen={setProfileModalOpen}
      />
    </div>
  );
}
