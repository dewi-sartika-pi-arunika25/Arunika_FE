/**
 * Mapping role fit dan gaya kerja berdasarkan DISC + RIASEC
 * Memberikan penjelasan yang lebih detail tentang karir yang cocok dan gaya kerjanya
 */

export const ROLE_FIT_MAPPING = {
  "Frontend Developer": {
    disc_ideal: ["C", "S"],
    riasec_ideal: ["A", "I", "C"],
    description: "Frontend Developer",
    workStyle: {
      "C": "Anda sangat detail-oriented dan terorganisir - cocok untuk membuat UI yang konsisten dan bug-free",
      "S": "Anda stabil dan dapat diandalkan - ideal untuk mengembangkan fitur yang membutuhkan ketelitian dan kesabaran",
      "A": "Anda kreatif dan memiliki sense estetika yang baik - perfect untuk design implementation",
      "I": "Anda analitis dan suka problem-solving - cocok untuk optimasi performance dan debugging",
      "C (RIASEC)": "Anda methodical dan suka struktur - ideal untuk maintain code quality"
    },
    personality: "Sebagai Frontend Developer, Anda akan bekerja dengan detail design dan user experience. Gaya kerja Anda yang sistematis dan terorganisir membuat Anda cocok untuk mengembangkan fitur yang membutuhkan ketelitian, sedangkan sisi kreatif dan estetika membantu dalam implementasi visual yang menarik.",
    strengths: ["Detail-oriented", "Kreatif", "Analitis", "Methodical"],
    workEnvironment: "Bekerja di lingkungan yang terstruktur namun fleksibel, dengan fokus pada user experience dan visual quality."
  },
  "Backend Developer": {
    disc_ideal: ["C", "D"],
    riasec_ideal: ["I", "R", "C"],
    description: "Backend Developer",
    workStyle: {
      "C": "Anda sangat analitis dan teliti - cocok untuk system design dan database optimization",
      "D": "Anda decisive dan goal-oriented - ideal untuk membuat keputusan teknis yang cepat dan tepat",
      "I": "Anda investigatif dan suka problem-solving kompleks - perfect untuk architecture design",
      "R": "Anda practical dan hands-on - cocok untuk implementasi dan debugging sistem",
      "C (RIASEC)": "Anda structured dan organized - ideal untuk maintain code quality dan documentation"
    },
    personality: "Sebagai Backend Developer, Anda akan bekerja dengan sistem dan infrastruktur. Gaya kerja Anda yang analitis dan terstruktur membuat Anda cocok untuk membuat keputusan teknis yang kompleks, sedangkan kemampuan investigasi dan problem-solving membantu dalam menyelesaikan masalah yang mendalam.",
    strengths: ["Analitis", "Decisive", "Problem-solver", "Structured"],
    workEnvironment: "Bekerja di lingkungan yang fokus pada technical excellence, scalability, dan system reliability."
  },
  "Project Manager": {
    disc_ideal: ["D", "I"],
    riasec_ideal: ["E", "S", "C"],
    description: "Project Manager",
    workStyle: {
      "D": "Anda decisive dan leadership-oriented - cocok untuk mengambil keputusan strategis dan memimpin tim",
      "I": "Anda influential dan komunikatif - ideal untuk stakeholder management dan team motivation",
      "E": "Anda enterprising dan ambisius - perfect untuk driving project success dan business goals",
      "S": "Anda supportive dan empathetic - cocok untuk team management dan conflict resolution",
      "C (RIASEC)": "Anda organized dan planned - ideal untuk project planning dan risk management"
    },
    personality: "Sebagai Project Manager, Anda akan memimpin tim dan mengkoordinasikan proyek. Gaya kerja Anda yang tegas dan berorientasi hasil membuat Anda cocok untuk mengambil keputusan cepat, sementara kemampuan komunikasi dan kolaborasi membantu dalam memotivasi tim menuju pencapaian tujuan bisnis.",
    strengths: ["Leadership", "Communication", "Strategic thinking", "Team management"],
    workEnvironment: "Bekerja di lingkungan yang dinamis, membutuhkan koordinasi dengan berbagai stakeholder dan fokus pada delivery."
  },
  "UI/UX Designer": {
    disc_ideal: ["I", "S"],
    riasec_ideal: ["A", "S", "I"],
    description: "UI/UX Designer",
    workStyle: {
      "I": "Anda influential dan komunikatif - cocok untuk user research dan stakeholder collaboration",
      "S": "Anda supportive dan user-focused - ideal untuk memahami kebutuhan user dan empathy",
      "A": "Anda artistic dan kreatif - perfect untuk visual design dan creative problem-solving",
      "S (RIASEC)": "Anda social dan collaborative - cocok untuk working dengan tim dan users",
      "I (RIASEC)": "Anda investigatif dan curious - ideal untuk user research dan data analysis"
    },
    personality: "Sebagai UI/UX Designer, Anda akan merancang pengalaman pengguna yang menarik. Gaya kerja Anda yang komunikatif dan berorientasi pada kebutuhan pengguna membuat Anda cocok untuk memahami user needs, sedangkan sisi kreatif dan sense estetika membantu dalam menciptakan desain yang visually appealing dan user-friendly.",
    strengths: ["User empathy", "Kreatif", "Komunikatif", "Research-oriented"],
    workEnvironment: "Bekerja di lingkungan yang kolaboratif, fokus pada user experience dan design thinking."
  }
};

/**
 * Get role fit dengan penjelasan gaya kerja berdasarkan DISC + RIASEC
 * SEKARANG MENGGUNAKAN SCORE AKTUAL, bukan hanya type!
 */
export function getRoleFitWithWorkStyle(discProfile, riasecProfile) {
  if (!discProfile || !riasecProfile) {
    return {
      role: "Belum Tersedia",
      fit: 0,
      workStyle: null,
      personality: "Selesaikan assessment terlebih dahulu untuk mendapatkan rekomendasi.",
      strengths: [],
      workEnvironment: ""
    };
  }

  // Get scores aktual dari profile
  const discScores = discProfile.scores || discProfile.scores_detail || {};
  const riasecScores = riasecProfile.scores || riasecProfile.scores_detail || {};
  
  // Get primary/secondary untuk reference
  const discPrimary = discProfile.primary || discProfile.dominant_type || '';
  const discSecondary = discProfile.secondary || discProfile.secondary_type || '';
  const riasecPrimary = riasecProfile.primary || riasecProfile.primary_code || '';
  const riasecSecondary = riasecProfile.secondary || riasecProfile.secondary_code || '';

  // Calculate scores untuk semua roles berdasarkan SCORE AKTUAL
  const roleScores = {};
  Object.keys(ROLE_FIT_MAPPING).forEach(role => {
    const mapping = ROLE_FIT_MAPPING[role];
    
    // Kumpulkan semua score dari dimensi ideal
    const idealScores = [];
    
    // DISC ideal dimensions - ambil score aktual
    mapping.disc_ideal.forEach(dim => {
      const score = discScores[dim];
      if (score !== undefined && score !== null) {
        idealScores.push(score);
      }
    });

    // RIASEC ideal dimensions - ambil score aktual
    mapping.riasec_ideal.forEach(dim => {
      const score = riasecScores[dim];
      if (score !== undefined && score !== null) {
        idealScores.push(score);
      }
    });

    // Hitung rata-rata score dari dimensi ideal
    // Jika semua score rendah (misalnya 20%), rata-rata juga rendah (20%)
    if (idealScores.length > 0) {
      const avgScore = idealScores.reduce((sum, s) => sum + s, 0) / idealScores.length;
      roleScores[role] = Math.round(avgScore);
    } else {
      // Fallback jika tidak ada score
      roleScores[role] = 50;
    }
  });

  // Get role dengan score tertinggi
  const sortedRoles = Object.entries(roleScores).sort((a, b) => b[1] - a[1]);
  const bestRole = sortedRoles[0][0];
  const bestFit = sortedRoles[0][1];

  if (bestFit < 40) {
    return {
      role: "Belum Tersedia",
      fit: bestFit,
      workStyle: null,
      personality: "Profil Anda membutuhkan pengembangan lebih lanjut untuk menentukan role yang cocok.",
      strengths: [],
      workEnvironment: ""
    };
  }

  const roleMapping = ROLE_FIT_MAPPING[bestRole];
  
  // Build work style explanation
  const workStyleParts = [];
  if (discPrimary && roleMapping.workStyle[discPrimary]) {
    workStyleParts.push(roleMapping.workStyle[discPrimary]);
  }
  if (discSecondary && roleMapping.workStyle[discSecondary] && discSecondary !== discPrimary) {
    workStyleParts.push(roleMapping.workStyle[discSecondary]);
  }
  if (riasecPrimary && roleMapping.workStyle[riasecPrimary]) {
    workStyleParts.push(roleMapping.workStyle[riasecPrimary]);
  }
  if (riasecSecondary && roleMapping.workStyle[riasecSecondary] && riasecSecondary !== riasecPrimary) {
    workStyleParts.push(roleMapping.workStyle[riasecSecondary]);
  }

  return {
    role: bestRole,
    fit: bestFit,
    workStyle: workStyleParts.join(" "),
    personality: roleMapping.personality,
    strengths: roleMapping.strengths,
    workEnvironment: roleMapping.workEnvironment
  };
}

