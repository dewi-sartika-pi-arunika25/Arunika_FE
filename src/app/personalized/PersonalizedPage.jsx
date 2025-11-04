"use client";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnalisisAI from "./components/AnalisisAI";
import ArunaQuest from "./components/ArunaQuest";
import MirrorChatPage from "./mirror-chat/page";
import RekomendasiPekerjaan from "./components/RekomendasiPekerjaan";
import RekomendasiSkillUp from "./components/RekomendasiSkillUp";
import DashboardContent from "./components/DashboardContent";
import ProfileModal from "./components/ProfileModal";
import Header from "./components/Header";
import { useSearchParams } from "next/navigation";
import { usePersonalizedStore } from "@/lib/store/personalized";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { useAuthStore } from "@/lib/store/auth";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PersonalizedPage() {
  // Filter state
  const filters = useDashboardFilters();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  
  const activeMenu = usePersonalizedStore((state) => state.activeMenu);
  const setActiveMenu = usePersonalizedStore((state) => state.setActiveMenu);
  const isProfileModalOpen = usePersonalizedStore((state) => state.isProfileModalOpen);
  const setProfileModalOpen = usePersonalizedStore((state) => state.setProfileModalOpen);
  const userProfile = usePersonalizedStore((state) => state.userProfile);
  const setUserProfile = usePersonalizedStore((state) => state.setUserProfile);
  
  // Check assessment status
  const hasAssessment = useAuthStore((state) => state.hasAssessment());
  const { profile, loading } = usePersonalizedProfile();
  
  // Check if user has assessment data
  const hasAssessmentData = hasAssessment || 
                           !!(profile?.disc_profile && profile?.riasec_profile) ||
                           !!(profile?.rec_id);

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
      case "aruna-quest":
        return <ArunaQuest />;
      case "mirror-chat":
        return <MirrorChatPage />;
      default:
        return <DashboardContent />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E4B200] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Show message if no assessment data (only show if not loading and no data)
  if (!loading && !hasAssessmentData) {
    return (
      <div className="flex h-screen">
        {/* Sidebar tetap tampil */}
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          userProfile={userProfile}
          onEditProfile={() => setProfileModalOpen(true)}
        />

        {/* Main Area dengan pesan */}
        <main className="flex-1 flex flex-col overflow-y-auto">
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
            showFilter={false}
          />

          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md bg-[#FFFDF5] border border-[#E4B200]/40 shadow-lg">
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 mx-auto mb-4" style={{ color: '#E4B200' }} />
                <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">
                  Belum Melakukan Skill Match
                </h3>
                <p className="text-gray-600 mb-6">
                  Untuk melihat dashboard yang lengkap, silakan selesaikan skill match terlebih dahulu.
                </p>
                <Button
                  onClick={() => window.location.href = '/skill-match'}
                  className="px-6 py-3 rounded-xl text-white font-semibold shadow-sm hover:shadow-md transition-shadow w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#E4B200' }}
                >
                  Mulai Skill Match
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

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
      <main className="flex-1 flex flex-col overflow-y-auto pb-16 lg:pb-0">
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
