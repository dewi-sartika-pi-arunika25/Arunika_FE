/**
 * Mapping score ke level kompetensi (Junior, Menengah, Pro)
 */

/**
 * Map role fit score ke level kompetensi
 */
export function getCompetenceLevel(fitScore) {
  if (fitScore >= 85) return "Pro";
  if (fitScore >= 65) return "Menengah";
  return "Junior";
}

/**
 * Map berdasarkan rata-rata DISC/RIASEC scores
 */
export function getCompetenceLevelFromScores(discScores = {}, riasecScores = {}) {
  const allScores = [
    ...Object.values(discScores),
    ...Object.values(riasecScores)
  ].filter(s => typeof s === 'number' && s > 0);

  if (allScores.length === 0) return "Junior";

  const avgScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
  
  if (avgScore >= 75) return "Pro";
  if (avgScore >= 55) return "Menengah";
  return "Junior";
}

/**
 * Get description untuk level
 */
export function getLevelDescription(level) {
  const descriptions = {
    "Pro": "Anda sudah memiliki kompetensi yang sangat baik dan siap untuk posisi senior atau lead",
    "Menengah": "Anda memiliki kompetensi yang solid dengan potensi untuk berkembang ke level lebih tinggi",
    "Junior": "Anda berada di tahap awal pengembangan dengan potensi besar untuk tumbuh"
  };
  return descriptions[level] || descriptions["Junior"];
}

