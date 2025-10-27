// pages/personalized/page.jsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardContent from "./components/DashboardContent";
import AnalisisAI from "./components/AnalisisAI";
import RekomendasiPekerjaan from "./components/RekomendasiPekerjaan";
import RekomendasiSkillUp from "./components/RekomendasiSkillUp";
import HistoryPage from "./components/HistoryPage";
import { useSearchParams } from 'next/navigation';

export default function PersonalizedDashboard() {
  const searchParams = useSearchParams();
  const recId = searchParams.get('rec_id');

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Pengguna Arunika",
    location: "Jakarta, Indonesia",
    job: "Frontend Developer",
    birth: "–",
    education: "–",
    phone: "–",
    initials: "AU",
    photo: "",
  });

  // Log rec_id untuk debugging
  useEffect(() => {
    if (recId) {
      console.log('✅ Personalized page loaded with rec_id:', recId);
    } else {
      console.warn('⚠️ No rec_id found in URL');
    }
  }, [recId]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        profile={profile} 
        setProfile={setProfile} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen} 
      />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="relative ml-72 mt-16 min-h-screen">
        {currentPage === "dashboard" && <DashboardContent />}
        {currentPage === "ai" && <AnalisisAI />}
        {currentPage === "jobs" && <RekomendasiPekerjaan />}
        {currentPage === "skills" && <RekomendasiSkillUp />}
        {currentPage === "history" && <HistoryPage />}
      </main>
    </div>
  );
}