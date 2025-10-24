import React from 'react';
// Import Ikon dari Lucide (untuk ikon umum)
import { Briefcase, DollarSign, Target, Zap, Search, BookOpen, Bell, Brain } from 'lucide-react'; 
// Import Ikon Brand dari React-Icons (asumsi sudah diinstal)
import { FaLinkedinIn, FaRegBuilding } from 'react-icons/fa'; 
import { RiMoneyDollarBoxLine } from 'react-icons/ri';
// Import UI Components (asumsi menggunakan Shadcn/ui atau serupa)
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badgesample';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Head from 'next/head'; 

// --- Data Dummy (Konten Personalisasi Karir dari AI Gemini) ---
const aiProfileData = {
  user: {
    name: "Pengguna Arunika",
    location: "Jakarta, Indonesia",
    role: "Frontend Developer",
    // PERBAIKAN: Menggunakan Role Fit, dan ini adalah Role Fit untuk peran User saat ini
    currentRoleFit: "Teknis (95% Akurat)", 
  },
  summaryMetrics: [
    { title: "Lowongan Ditemukan", value: "12", icon: Briefcase, color: "text-orange-500" },
    { title: "Skill Gap Prioritas", value: "3", icon: Target, color: "text-red-600" },
    { title: "Gaji Proyeksi (Mid)", value: "Rp 13 Juta", icon: DollarSign, color: "text-gray-600" },
  ],
  education: {
    title: "Analisis & Rekomendasi Karir AI",
    school: "Model Gemini dari Google",
    year: "Update Terakhir: Okt 2025",
    description: "AI Gemini menganalisis profil dan tren pasar Anda untuk menghasilkan rekomendasi yang paling akurat, mempertimbangkan tren pasar dan aspirasi Anda.",
  },
  topSkills: [
    "Pemecahan Masalah Kreatif (90%)",
    "Ketelitian & Struktur (85%)",
    "Kepemimpinan (70%)",
  ],
  skillGaps: [
    { name: "Stakeholder mapping", match: 35, link: "https://academy.arunika.id/stakeholder-management" },
    { name: "Delivery cadence", match: 40, link: "https://academy.arunika.id/agile-delivery" },
    { name: "Leadership communication", match: 50, link: "https://academy.arunika.id/effective-leadership" },
  ],
  jobMatches: [
    { role: "Product Manager", match: 82, badge: "Strategi", url: "https://job.linkedin.com/product-manager-82" },
    { role: "UI/UX Researcher", match: 78, badge: "Riset", url: "https://job.jobstreet.co.id/uiux-researcher-78" },
    { role: "Frontend Engineer", match: 75, badge: "Teknis", url: "https://job.surbulance.com/frontend-engineer-75" },
  ],
};

// Ukuran Ikon untuk react-icons
const iconSize = '1.25em'; 

// --- Icon Portal Job Components ---
const JobPortalIconLink = ({ source, url }) => {
    let iconComponent;
    let iconClass;
    let name;

    switch (source) {
      case 'Skilvul':
      iconComponent = (
        <img
          src="https://skilvul.com/favicon.ico"
          alt="Skilvul"
          className="w-5 h-5 rounded object-contain hover:scale-110 transition-transform"
        />
      );
      name = 'Skilvul';
      break;
        case 'Linkedin':
            iconComponent = <FaLinkedinIn size={iconSize} />;
            iconClass = 'text-blue-700 bg-blue-100 hover:bg-blue-200';
            name = 'LinkedIn';
            break;
        case 'Jobstreet':
            iconComponent = <FaRegBuilding size={iconSize} />;
            iconClass = 'text-orange-700 bg-orange-100 hover:bg-orange-200';
            name = 'Jobstreet';
            break;
        case 'Surbulance':
            iconComponent = <RiMoneyDollarBoxLine size={iconSize} />;
            iconClass = 'text-green-700 bg-green-100 hover:bg-green-200';
            name = 'Surbulance';
            break;
        default:
            iconComponent = <Briefcase className="h-4 w-4" />;
            iconClass = 'text-gray-500 bg-gray-100 hover:bg-gray-200';
            name = 'Link';
    }

    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            title={`Lihat di ${name}`}
            className={`p-2 rounded-full transition-colors ${iconClass}`}
        >
            {iconComponent}
        </a>
    );
};


// --- Lowongan Terpersonalisasi (Job Match) ---
const JobMatchCard = ({ jobMatches }) => {
    const maxMatch = Math.max(...jobMatches.map(job => job.match));
    
    // Portal yang selalu ditampilkan
    const availablePortals = ['Linkedin', 'Jobstreet', 'Surbulance'];

    return (
        <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Lowongan Terpersonalisasi</CardTitle>
                <DollarSign className="h-6 w-6 text-yellow-500" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
            
            {jobMatches.map((job, index) => {
  const isTopMatch = job.match === maxMatch;
  
  return (
    <div
      key={index}
      className="flex flex-col border-b border-yellow-100 pb-4 last:border-b-0 last:pb-0"
    >
      <div className="flex items-start justify-between mb-2">
        {/* KIRI: Info Role */}
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p
              className={`font-semibold ${
                isTopMatch
                  ? 'text-xl text-orange-600'
                  : 'text-lg text-gray-900'
              }`}
            >
              {job.role}
            </p>
            <Badge className="bg-orange-200 text-orange-800 font-bold hover:bg-orange-300">
              Role Fit: {job.badge}
            </Badge>
          </div>
        </div>

        {/* KANAN: Portal Job */}
        <div className="flex space-x-2">
          {availablePortals.map((source) => (
            <JobPortalIconLink
              key={source}
              source={source}
              url={job.url || '#'}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar + Persentase */}
      <div className="mt-1">
        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
          <span>Analisis Kecocokan Berdasarkan AI</span>
          <span className="text-yellow-600 font-semibold">{job.match}%</span>
        </div>
        <Progress
          value={job.match}
          className="h-2 bg-yellow-400 [&>div]:bg-yellow-600"
        />
      </div>
    </div>
  );
})}

            </CardContent>
        </Card>
    );
};


// --- Analisis Karir AI (Komponen terpisah) ---
const AICareerAnalysisCard = ({ education }) => (
  <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200 h-full"> 
    <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
      <CardTitle className="text-xl">Analisis & Rekomendasi Karir AI</CardTitle>
      <Briefcase className="h-6 w-6 text-orange-500" />
    </CardHeader>
    <CardContent className="px-6 pb-6 space-y-4">
        <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-yellow-200 text-yellow-600">
                <Brain className="h-7 w-7" />
            </div>
            <div>
                <p className="text-lg font-semibold text-gray-900">{education.title}</p>
                <p className="text-sm text-gray-700">{education.school}</p>
                <p className="text-xs text-gray-600">{education.year}</p>
            </div>
        </div>
        <CardDescription className="text-gray-800">
            {education.description}
        </CardDescription>
    </CardContent>
  </Card>
);


// --- Komponen: SkillRecommendationCard (Tetap) ---
const SkillRecommendationCard = ({ skillGaps }) => (
  <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200">
    <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
      <CardTitle className="text-xl flex items-center space-x-2 text-gray-900">
        <BookOpen className="h-6 w-6 text-yellow-600" />
        <span>Rekomendasi Peningkatan Skill</span>
      </CardTitle>
      <Zap className="h-6 w-6 text-orange-500" />
    </CardHeader>
    <CardContent className="px-6 pb-6 space-y-4">
      <p className="text-sm text-gray-700">
        BerdasarkanSkill Gap Prioritas Anda, AI merekomendasikan modul belajar ini:
      </p>
      {skillGaps.map((gap, index) => (
        <div key={index} className="flex justify-between items-center border-b border-yellow-100 pb-3 last:border-b-0 last:pb-0">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-red-600">•</span>
            <span className="text-md font-medium text-gray-900">{gap.name}</span>
          </div>
          
          <a href={gap.link} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
              Mulai Belajar
            </Button>
          </a>
        </div>
      ))}
    </CardContent>
  </Card>
);

// --- Komponen Header (Gaya Krem) ---
const Header = () => (
  <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-yellow-200 shadow-md z-50">
    <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-6">
      
      {/* KIRI: Logo & Search Bar */}
      <div className="flex items-center space-x-4">
       <div className="flex items-center space-x-2">
  <img
    src="/arunikalogo.svg"
    alt="Logo Arunika"
    className="relative h-12 w-32"
  />
</div>

        
        <div className="relative hidden lg:block ml-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[300px] pl-10 pr-4 py-2 text-sm border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-100/50 text-gray-900 transition-colors"
          />
        </div>
      </div>

      {/* KANAN: Notifikasi & Profil */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 relative">
          <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></div>
          <Bell className="h-5 w-5" /> 
        </Button>
        
        <Avatar className="h-9 w-9 border-2 border-yellow-300 cursor-pointer hover:border-orange-500 transition-colors">
          <AvatarFallback className="bg-orange-100 text-orange-600">AU</AvatarFallback>
        </Avatar>
      </div>
    </div>
  </header>
);

// --- KOMPONEN UTAMA PERSONALIZED ---
const Personalized = () => {
  // Parsing data Role Fit saat ini dari peran user (sudah menggunakan 'currentRoleFit')
  const [roleFitName, roleFitMatch] = aiProfileData.user.currentRoleFit.split('(').map(s => s.trim().replace(')', ''));
  const matchPercentage = roleFitMatch.replace('% Akurat', '');
  return (
    <div className="min-h-screen bg-yellow-50 pt-20 pb-10 text-gray-900">
      <Head>
        <title>Dashboard Karir - {aiProfileData.user.name}</title>
      </Head>

      <Header />

      <div className="container mx-auto px-4 lg:px-6 space-y-6">

        {/* -------------------------------------------------- */}
        {/* BARIS 1: PROFIL, KEKUATAN UTAMA, & SKILL GAP (3 KOLOM) */}
        {/* -------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Kolom 1: Card Profil Utama (Pengguna) */}
          <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200">
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                <AvatarFallback className="text-4xl bg-yellow-500 text-white">AU</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-900">{aiProfileData.user.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{aiProfileData.user.location}</p>
              
              {/* >>> START PERUBAHAN: HAPUS TOMBOL & GANTI DENGAN LINGKARAN ROLE FIT <<< */}
              <div className="flex flex-col items-center justify-center space-y-3 mb-6 pt-3 border-t border-yellow-200">
                  
                  {/* Lingkaran Besar Role Fit */}
                  <div className="relative flex flex-col items-center justify-center h-28 w-28 rounded-full bg-orange-100 border-4 border-orange-300 shadow-inner">
                      <p className="text-xs font-semibold text-orange-700 uppercase leading-none">Role Fit</p>
                      <p className="text-4xl font-extrabold text-orange-600 leading-none mt-1">{matchPercentage}%</p>
                  </div>
                  
                  {/* Badge Peran Utama di Bawah Lingkaran */}
                  <Badge className="bg-yellow-700 text-white font-bold text-sm px-8 py-2">
                      {aiProfileData.user.role}
                  </Badge>
              </div>

              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900">Perbarui Profil</Button>
            </CardContent>
          </Card>

          {/* Kolom 2: Card Kekuatan Utama (Top Strengths) */}
          <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Kekuatan Utama (Top Strengths)</CardTitle>
              <Zap className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3 text-gray-700 h-full">
              {aiProfileData.topSkills.map((skill, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium">• {skill.split('(')[0].trim()}</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">{skill.split('(')[1].replace(')', '')}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Kolom 3: Card Skill Gap Prioritas */}
          <Card className="shadow-lg bg-yellow-100/50 border border-yellow-200">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-red-600">Skill Gap Prioritas (90 Hari)</CardTitle>
              <Target className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4 h-full">
              {aiProfileData.skillGaps.map((gap, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>{gap.name}</span>
                      <span className="font-semibold text-red-600">Match {gap.match}%</span>
                  </div>
                  <Progress value={gap.match} className="h-2 bg-red-100 [&>div]:bg-orange-500" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* -------------------------------------------------- */}
        {/* BARIS 2 & SETERUSNYA: KONTEN UTAMA & METRIK */}
        {/* -------------------------------------------------- */}
        <div className="grid grid-cols-4 gap-8">

          {/* Metrik Ringkasan (Baris Penuh) */}
          <div className="col-span-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {aiProfileData.summaryMetrics.map((metric, index) => (
                <Card key={index} className="p-4 shadow-sm text-center bg-yellow-100/50 border border-yellow-200">
                  <div className={`${metric.color} flex justify-center mb-1`}><metric.icon className="h-6 w-6" /></div>
                  <CardTitle className="text-xl font-bold text-gray-900">{metric.value}</CardTitle>
                  <CardDescription className="text-xs text-gray-600">{metric.title}</CardDescription>
                </Card>
              ))}
            </div>
          </div>


          {/* Kontainer Utama Grid 2 Kolom (Job Match + Rekomendasi vs Analisis) */}
          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Kolom Kiri KONTEN UTAMA: Job Match (DI ATAS) & Rekomendasi Skill (DI BAWAH) */}
            <div className="space-y-6">
              
              {/* 1. Lowongan Terpersonalisasi (Job Match) */}
              <JobMatchCard jobMatches={aiProfileData.jobMatches} />
              

              {/* 2. REKOMENDASI PENINGKATAN SKILL */}
              <SkillRecommendationCard skillGaps={aiProfileData.skillGaps} />
            </div>
            
            {/* Kolom Kanan KONTEN UTAMA: Analisis Karir AI (TUNGGAL) */}
            <div className="space-y-6">
              
              {/* 3. Analisis Karir AI (Mengisi Penuh Kolom Kanan) */}
              <AICareerAnalysisCard education={aiProfileData.education} />

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Personalized;