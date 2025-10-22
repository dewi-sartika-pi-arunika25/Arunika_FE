// components/FeatureCard.jsx
import { Brain, Map, Briefcase } from 'lucide-react';

const iconsMap = {
  "Personalized AI": Brain,
  "Career Readiness": Map,
  "Career Connector": Briefcase,
};

// Komponen Kartu Tunggal
const Card = ({ title, description, tag, iconName }) => {
  const IconComponent = iconsMap[iconName];

  // Menentukan warna gradien untuk border, tag, dan ikon
  let borderGradientClass = "";
  let tagClass = "";
  let iconBgClass = "";

  switch (iconName) {
    case "Personalized AI":
      borderGradientClass = "border-indigo-500/50 hover:border-indigo-400";
      tagClass = "bg-[#291845] text-[#8e45ff] border-[#4c1e9e]"; // Ungu
      iconBgClass = "bg-gradient-to-br from-indigo-500 to-fuchsia-500";
      break;
    case "Career Readiness":
      borderGradientClass = "border-cyan-500/50 hover:border-cyan-400";
      tagClass = "bg-[#183a45] text-[#45ffbe] border-[#1e7c9e]"; // Teal/Cyan
      iconBgClass = "bg-gradient-to-br from-blue-500 to-cyan-500";
      break;
    case "Career Connector":
      borderGradientClass = "border-green-500/50 hover:border-green-400";
      tagClass = "bg-[#184529] text-[#45ff8e] border-[#1e9e4c]"; // Hijau
      iconBgClass = "bg-gradient-to-br from-emerald-500 to-green-500";
      break;
    default:
      borderGradientClass = "border-gray-500/50 hover:border-gray-400";
      tagClass = "bg-gray-800 text-gray-300 border-gray-700";
      iconBgClass = "bg-gray-700";
      break;
  }

  return (
    <div
      className={`
        relative p-8 rounded-[30px] shadow-2xl 
        bg-[#180a37] 
        border-2 ${borderGradientClass} 
        transition-all duration-300 ease-in-out
        transform hover:scale-[1.03] 
      `}
      style={{
        // Bayangan untuk kesan 'floating' dan deep-purple
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(70, 0, 100, 0.4)",
      }}
    >
      {/* Container Ikon dan Tag */}
      <div className="mb-6 flex justify-between items-start">
        {/* Ikon */}
        <div className={`p-3 rounded-xl ${iconBgClass} shadow-xl`}>
          {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
        </div>
        
        {/* Tag (Roadmap, AI Powered, Networking) */}
        <div className={`px-4 py-1 text-sm font-semibold rounded-full border ${tagClass}`}>
          {tag}
        </div>
      </div>

      {/* Konten Teks */}
      <h3 className="text-2xl font-bold text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-400 text-base leading-relaxed">
        {description}
      </p>
      
      {/* Shape/Circle Ungu Gelap di Bawah (Efek visual) */}
      <div 
        className="absolute w-20 h-20 rounded-full bg-[#3f005c] opacity-50 -bottom-4 -right-4 blur-xl"
      ></div>
      <div 
        className="absolute w-12 h-12 rounded-full bg-[#3f005c] opacity-50 -top-4 -left-4 blur-lg"
      ></div>
    </div>
  );
};


// Komponen Utama Section
const FeatureSection = () => {
  const featureCards = [
    {
      title: "Personalized AI",
      description: "Dapatkan analisis mendalam yang unik untukmu, bukan hasil generik. Lakukan asesmen dan temukan jalur karir yang selaras denganmu.",
      tag: "AI Powered",
      iconName: "Personalized AI", 
    },
    {
      title: "Career Readiness",
      description: "Ketahui kekuatan, area pengembangan, hingga jalur karir yang sesuai untukmu. Dapatkan rekomendasi pengembangan diri yang praktis.",
      tag: "Roadmap",
      iconName: "Career Readiness",
    },
    {
      title: "Career Connector",
      description: "Hubungkan dirimu dengan mentor dan industri impianmu. Dapatkan wawasan langsung dari para profesional berpengalaman.",
      tag: "Networking",
      iconName: "Career Connector",
    },
  ];

  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Bukan Sekadar Tes, Tapi Strategi Karir Personalmu
          </h2>
          <p className="text-lg text-gray-400">
            Arunika dirancang untuk memberikan kejelasan, bukan keraguan. Inilah cara kami membantumu mencapai tujuan.
          </p>
        </div>

        {/* Grid Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              tag={card.tag}
              iconName={card.iconName}
            />
          ))}
        </div>
        
        {/* Placeholder untuk gambar kecil di pojok kanan bawah (opsional) */}
        <div className="mt-12 flex justify-end">
             {/* Ganti dengan komponen Image dari Next.js */}
             <div className="w-40 h-20 bg-gray-900 rounded-lg border border-gray-700 p-2 text-xs text-gray-500 flex items-center justify-center">
                Gambar App Demo
             </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;