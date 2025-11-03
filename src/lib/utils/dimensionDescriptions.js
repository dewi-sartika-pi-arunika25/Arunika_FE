/**
 * Deskripsi general untuk dimensi DISC dan RIASEC tanpa menyebutkan kode langsung
 * Untuk penjelasan yang lebih natural dan tidak terlihat seperti psikometri resmi
 */

export const DIMENSION_DESCRIPTIONS = {
  // DISC dimensions - general descriptions
  D: {
    general: "Kepribadian yang tegas dan berorientasi pada hasil. Anda cenderung mengambil keputusan dengan cepat, fokus pada efisiensi, dan memiliki semangat kepemimpinan yang kuat. Gaya kerja Anda langsung dan tidak bertele-tele, cocok untuk situasi yang membutuhkan aksi cepat.",
    strengths: ["Kemampuan kepemimpinan yang kuat", "Pengambilan keputusan yang cepat", "Berorientasi pada hasil", "Tidak takut mengambil risiko"],
    workStyle: "Anda bekerja dengan cara yang tegas dan fokus pada tujuan. Senang memimpin dan mengambil inisiatif."
  },
  I: {
    general: "Kepribadian yang komunikatif dan mudah bersosialisasi. Anda senang berkolaborasi dengan tim, memotivasi orang lain, dan menciptakan lingkungan kerja yang positif. Gaya kerja Anda interaktif dan energik, ideal untuk proyek yang membutuhkan kerja tim.",
    strengths: ["Komunikasi yang efektif", "Kemampuan memotivasi tim", "Kolaborasi yang baik", "Energi positif"],
    workStyle: "Anda bekerja dengan cara yang interaktif dan senang berkolaborasi dengan berbagai pihak."
  },
  S: {
    general: "Kepribadian yang stabil dan dapat diandalkan. Anda menyukai lingkungan kerja yang konsisten, bekerja dengan teliti, dan menjadi support system yang kuat untuk tim. Gaya kerja Anda sabar dan methodical, cocok untuk tugas yang membutuhkan ketelitian.",
    strengths: ["Stabilitas dan keandalan", "Ketelitian yang tinggi", "Support yang kuat untuk tim", "Kesabaran dalam bekerja"],
    workStyle: "Anda bekerja dengan cara yang stabil dan terorganisir, fokus pada kualitas dan detail."
  },
  C: {
    general: "Kepribadian yang analitis dan terorganisir. Anda sangat detail-oriented, menyukai struktur, dan menekankan pada kualitas. Gaya kerja Anda sistematis dan hati-hati, ideal untuk pekerjaan yang membutuhkan presisi dan akurasi.",
    strengths: ["Analitis yang kuat", "Detail-oriented", "Terorganisir dan terstruktur", "Fokus pada kualitas"],
    workStyle: "Anda bekerja dengan cara yang sistematis dan terencana, sangat memperhatikan detail dan kualitas."
  },
  // RIASEC dimensions
  R: {
    general: "Tertarik pada pekerjaan yang praktis dan hands-on. Anda senang bekerja dengan tools dan teknologi secara langsung.",
    strengths: ["Praktis dan hands-on", "Problem solving praktis"],
    workStyle: "Anda bekerja dengan cara yang praktis dan langsung pada implementasi."
  },
  I_RIASEC: {
    general: "Tertarik pada investigasi dan analisis mendalam. Anda senang mengeksplorasi ide-ide baru dan mencari solusi yang inovatif.",
    strengths: ["Analitis dan investigatif", "Berpikir kritis", "Inovatif"],
    workStyle: "Anda bekerja dengan cara yang investigatif dan suka mengeksplorasi solusi baru."
  },
  A: {
    general: "Tertarik pada aspek kreatif dan estetika. Anda memiliki sense yang baik untuk desain dan inovasi visual.",
    strengths: ["Kreatif dan inovatif", "Sense estetika yang baik", "Berpikir out-of-the-box"],
    workStyle: "Anda bekerja dengan cara yang kreatif dan fokus pada aspek visual serta estetika."
  },
  S_RIASEC: {
    general: "Tertarik pada interaksi sosial dan membantu orang lain. Anda senang bekerja dengan orang dan memahami kebutuhan mereka.",
    strengths: ["Empati yang tinggi", "Komunikasi interpersonal", "Kemampuan membantu orang lain"],
    workStyle: "Anda bekerja dengan cara yang sosial dan fokus pada kebutuhan pengguna atau klien."
  },
  E: {
    general: "Tertarik pada kepemimpinan dan bisnis. Anda senang memimpin proyek dan mencapai tujuan bisnis.",
    strengths: ["Kepemimpinan", "Berorientasi pada bisnis", "Ambisi dan drive"],
    workStyle: "Anda bekerja dengan cara yang enterprising dan fokus pada pencapaian tujuan."
  },
  C_RIASEC: {
    general: "Tertarik pada pekerjaan yang terstruktur dan terorganisir. Anda menyukai rutinitas dan proses yang jelas.",
    strengths: ["Terorganisir", "Methodical", "Fokus pada proses"],
    workStyle: "Anda bekerja dengan cara yang terstruktur dan mengikuti proses yang sudah ditetapkan."
  }
};

/**
 * Build general description dari kombinasi dimensi tanpa mention kode
 */
export function buildGeneralPersonalityDescription(discPrimary, discSecondary, riasecPrimary, riasecSecondary) {
  const parts = [];
  
  // DISC primary
  if (discPrimary && DIMENSION_DESCRIPTIONS[discPrimary]) {
    parts.push(DIMENSION_DESCRIPTIONS[discPrimary].general);
  }
  
  // RIASEC primary (handle naming conflict)
  const riasecKey = riasecPrimary === 'I' ? 'I_RIASEC' : riasecPrimary === 'S' ? 'S_RIASEC' : riasecPrimary;
  if (riasecPrimary && DIMENSION_DESCRIPTIONS[riasecKey]) {
    parts.push(DIMENSION_DESCRIPTIONS[riasecKey].general);
  }
  
  return parts.join(" ") || "Kombinasi kepribadian Anda menunjukkan potensi yang kuat di bidang IT.";
}

/**
 * Get full name dari kode dimensi
 */
export function getDimensionFullName(code) {
  const nameMap = {
    // DISC
    'D': 'Dominance',
    'I': 'Influence',
    'S': 'Steadiness',
    'C': 'Conscientiousness',
    // RIASEC
    'R': 'Realistic',
    'A': 'Artistic',
    'E': 'Enterprising',
    // Handle conflict: RIASEC I dan S perlu context, tapi untuk radar chart bisa langsung
    // Karena sudah dihandle di radarData dengan fullName
  };
  return nameMap[code] || code;
}

/**
 * Get penjelasan singkat dari kode dimensi
 */
export function getDimensionExplanation(code) {
  // Handle DISC dimensions
  if (['D', 'I', 'S', 'C'].includes(code) && DIMENSION_DESCRIPTIONS[code]) {
    return DIMENSION_DESCRIPTIONS[code].workStyle || DIMENSION_DESCRIPTIONS[code].general;
  }
  
  // Handle RIASEC dimensions dengan conflict handling
  if (code === 'I') {
    // Bisa DISC I atau RIASEC I, default ke DISC jika ada
    // Tapi untuk radar chart, kita perlu tahu dari context
    // Untuk sekarang, cek dulu DISC, kalau tidak ada baru RIASEC
    if (DIMENSION_DESCRIPTIONS['I']) {
      return DIMENSION_DESCRIPTIONS['I'].workStyle || DIMENSION_DESCRIPTIONS['I'].general;
    }
    if (DIMENSION_DESCRIPTIONS['I_RIASEC']) {
      return DIMENSION_DESCRIPTIONS['I_RIASEC'].workStyle || DIMENSION_DESCRIPTIONS['I_RIASEC'].general;
    }
  }
  
  if (code === 'S') {
    // Bisa DISC S atau RIASEC S
    if (DIMENSION_DESCRIPTIONS['S']) {
      return DIMENSION_DESCRIPTIONS['S'].workStyle || DIMENSION_DESCRIPTIONS['S'].general;
    }
    if (DIMENSION_DESCRIPTIONS['S_RIASEC']) {
      return DIMENSION_DESCRIPTIONS['S_RIASEC'].workStyle || DIMENSION_DESCRIPTIONS['S_RIASEC'].general;
    }
  }
  
  // Handle other RIASEC
  const riasecKey = code === 'I' ? 'I_RIASEC' : code === 'S' ? 'S_RIASEC' : code;
  if (DIMENSION_DESCRIPTIONS[riasecKey]) {
    return DIMENSION_DESCRIPTIONS[riasecKey].workStyle || DIMENSION_DESCRIPTIONS[riasecKey].general;
  }
  
  if (['R', 'A', 'E', 'C'].includes(code)) {
    const key = code === 'C' ? 'C_RIASEC' : code;
    if (DIMENSION_DESCRIPTIONS[key]) {
      return DIMENSION_DESCRIPTIONS[key].workStyle || DIMENSION_DESCRIPTIONS[key].general;
    }
  }
  
  return "Kekuatan utama dalam aspek ini.";
}

/**
 * Get top strengths dari radar data dengan nama lengkap dan penjelasan
 * @param {Array} radarData - Data dari radar chart (top 3-5)
 */
export function getTopStrengthsFromRadar(radarData) {
  // Mapping fullName ke kode yang benar untuk DISC/RIASEC
  const fullNameToCode = {
    // DISC
    'Dominance': 'D',
    'Influence': 'I',
    'Steadiness': 'S',
    'Conscientiousness': 'C',
    // RIASEC
    'Realistic': 'R',
    'Investigative': 'I_RIASEC',
    'Artistic': 'A',
    'Social': 'S_RIASEC',
    'Enterprising': 'E',
    'Conventional': 'C_RIASEC'
  };
  
  return radarData.slice(0, 3).map(item => {
    const code = item.subject || item.key;
    const fullName = item.fullName || getDimensionFullName(code) || code;
    
    // Gunakan fullName untuk menentukan kode yang tepat (handle conflict I dan S)
    const correctCode = fullNameToCode[fullName] || code;
    
    // Get explanation berdasarkan correctCode
    let explanation = "";
    if (correctCode && DIMENSION_DESCRIPTIONS[correctCode]) {
      explanation = DIMENSION_DESCRIPTIONS[correctCode].workStyle || DIMENSION_DESCRIPTIONS[correctCode].general;
    } else {
      // Fallback ke getDimensionExplanation dengan code asli
      explanation = getDimensionExplanation(code);
    }
    
    return {
      name: fullName,
      explanation: explanation,
      score: item.A || 0,
      code: code
    };
  });
}

/**
 * Get top strengths dengan penjelasan (legacy function, tetap dipertahankan)
 */
export function getTopStrengthsWithExplanation(discPrimary, discSecondary, riasecPrimary) {
  const strengths = [];
  
  // Helper untuk extract name dari workStyle
  const extractName = (workStyle) => {
    if (!workStyle) return "Kekuatan";
    // Ambil bagian sebelum titik pertama, atau ambil 3-4 kata pertama
    const firstSentence = workStyle.split(".")[0] || workStyle;
    const words = firstSentence.split(" ");
    return words.slice(0, 4).join(" ") || "Kekuatan";
  };
  
  if (discPrimary && DIMENSION_DESCRIPTIONS[discPrimary]) {
    const desc = DIMENSION_DESCRIPTIONS[discPrimary];
    strengths.push({
      name: extractName(desc.workStyle),
      explanation: desc.strengths.join(", "),
      dimension: discPrimary
    });
  }
  
  if (discSecondary && discSecondary !== discPrimary && DIMENSION_DESCRIPTIONS[discSecondary]) {
    const desc = DIMENSION_DESCRIPTIONS[discSecondary];
    strengths.push({
      name: extractName(desc.workStyle),
      explanation: desc.strengths.join(", "),
      dimension: discSecondary
    });
  }
  
  const riasecKey = riasecPrimary === 'I' ? 'I_RIASEC' : riasecPrimary === 'S' ? 'S_RIASEC' : riasecPrimary;
  if (riasecPrimary && DIMENSION_DESCRIPTIONS[riasecKey]) {
    const desc = DIMENSION_DESCRIPTIONS[riasecKey];
    strengths.push({
      name: extractName(desc.workStyle),
      explanation: desc.strengths.join(", "),
      dimension: riasecPrimary
    });
  }
  
  return strengths.slice(0, 3);
}

