const cache = new Map();

export function trackConfusion(userId, text) {
  const key = userId || "anon";
  const prev = cache.get(key) || 0;
  const inc = /bingung|gimana|ga paham|tidak paham/i.test(text) ? 1 : 0;
  const next = prev + inc;
  cache.set(key, next);
  return next;
}

export async function mentorRecommendation(userId) {
  return "🤝 Rekomendasi: Jadwalkan sesi singkat dengan mentor Arunika untuk bahas rencana langkah berikutnya.";
}

export function resetConfusion(userId) {
  cache.set(userId || "anon", 0);
}
