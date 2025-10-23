export function computeScore(questions, answers) {
  const sum = {};
  const cnt = {};
  questions.forEach((q) => {
    const v = Number(answers[q.id] || 0);
    if (!sum[q.trait]) { sum[q.trait] = 0; cnt[q.trait] = 0; }
    if (v) { sum[q.trait] += v; cnt[q.trait] += 1; }
  });

  const traitAvg = Object.fromEntries(
    Object.entries(sum).map(([k, v]) => [k, Math.round((v / (cnt[k] || 1)) * 20)])
  );

  let bestTrait = null;
  let bestScore = -1;
  for (const [t, v] of Object.entries(traitAvg)) {
    if (v > bestScore) { bestScore = v; bestTrait = t; }
  }

  let role = "The Explorer";
  if (bestTrait === "analysis") role = "The Analyst";
  if (bestTrait === "innovation") role = "The Innovator";
  if (bestTrait === "collab") role = "The Collaborator";
  if (bestTrait === "creative") role = "The Designer";

  return { traitAvg, bestTrait, role, bestScore };
}

export function computeFit(bestScore, answered, total) {
  return Math.min(100, Math.max(40, Math.round(bestScore + (answered / total) * 40)));
}

export function topStrengths(traitAvg) {
  const map = { analysis: "Analitis", innovation: "Problem Solving", collab: "Kolaboratif", creative: "Kreatif/Visual" };
  return Object.entries(traitAvg).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>map[t]||t);
}
