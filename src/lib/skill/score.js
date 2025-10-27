export const TRAIT_TO_ROLE_CATEGORY = {
  analysis: "Backend Developer",
  innovation: "Product Manager",
  collab: "Frontend Developer",
  creative: "UI/UX Designer"
};

/**
 * Map trait codes to archetype display names
 */
export const TRAIT_ARCHETYPES = {
  analysis: "The Analyst",
  innovation: "The Innovator",
  collab: "The Collaborator",
  creative: "The Designer"
};

/**
 * Map trait codes to strength display names
 */
export const TRAIT_DISPLAY_NAMES = {
  analysis: "Analitis",
  innovation: "Problem Solving",
  collab: "Kolaboratif",
  creative: "Kreatif/Visual"
};

/**
 * Compute trait averages and best trait from quiz answers
 * Converts 1-5 scale to 0-100 scale
 * @param {Array} questions - Quiz questions with trait info
 * @param {Object} answers - User answers { questionId: score (1-5) }
 * @returns {Object} { traitAvg, bestTrait, role, bestScore }
 */
export function computeScore(questions, answers) {
  const sum = {};
  const cnt = {};
  
  questions.forEach((q) => {
    const v = Number(answers[q.id] || 0);
    if (!sum[q.trait]) { 
      sum[q.trait] = 0; 
      cnt[q.trait] = 0; 
    }
    if (v) { 
      sum[q.trait] += v; 
      cnt[q.trait] += 1; 
    }
  });

  // Convert 1-5 scale to 0-100 scale
  const traitAvg = Object.fromEntries(
    Object.entries(sum).map(([k, v]) => [
      k, 
      Math.round((v / (cnt[k] || 1) / 5) * 100)
    ])
  );

  // Find best trait
  let bestTrait = null;
  let bestScore = -1;
  for (const [t, v] of Object.entries(traitAvg)) {
    if (v > bestScore) { 
      bestScore = v; 
      bestTrait = t; 
    }
  }

  // Get archetype and role category
  const archetype = TRAIT_ARCHETYPES[bestTrait] || "The Explorer";
  const roleCategory = TRAIT_TO_ROLE_CATEGORY[bestTrait] || "Backend Developer";

  return { 
    traitAvg, 
    bestTrait,
    archetype,
    roleCategory,
    bestScore
  };
}

/**
 * Compute role fit percentage (40-100)
 * @param {number} bestScore - Best trait score (0-100)
 * @param {number} answered - Number of questions answered
 * @param {number} total - Total number of questions
 * @returns {number} Role fit percentage
 */
export function computeFit(bestScore, answered, total) {
  const completionBonus = (answered / total) * 40;
  return Math.min(100, Math.max(40, Math.round(bestScore + completionBonus)));
}

/**
 * Get top 3 strengths from trait scores
 * @param {Object} traitAvg - Trait averages { trait: score }
 * @returns {Array} Top 3 strength display names
 */
export function topStrengths(traitAvg) {
  return Object.entries(traitAvg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => TRAIT_DISPLAY_NAMES[t] || t);
}

/**
 * Map skill gaps based on role and trait weaknesses
 * @param {Object} traitAvg - Trait averages { trait: score (0-100) }
 * @param {string} roleCategory - Role category name
 * @returns {Array} Skill gaps with priority [{ name, priority, trait }]
 */
export function mapSkillGaps(traitAvg, roleCategory) {
  const roleGapMap = {
    "Frontend Developer": {
      analysis: ["Performance Optimization", "Bug Debugging"],
      innovation: ["Algorithm Design", "Architecture Patterns"],
      collab: ["Code Review Skills", "Team Communication"],
      creative: ["UI Implementation", "Animation Skills"]
    },
    "Backend Developer": {
      analysis: ["Database Optimization", "System Design"],
      innovation: ["Scalability Planning", "API Design"],
      collab: ["API Documentation", "Cross-team Sync"],
      creative: ["Code Organization", "Error Handling"]
    },
    "UI/UX Designer": {
      analysis: ["User Research", "Data Analysis"],
      innovation: ["Design Thinking", "Creative Ideation"],
      collab: ["Stakeholder Management", "Design Communication"],
      creative: ["Visual Design", "Interaction Design"]
    },
    "Product Manager": {
      analysis: ["Market Analysis", "Data-driven Decisions"],
      innovation: ["Strategic Thinking", "Problem Solving"],
      collab: ["Cross-functional Leadership", "Negotiation"],
      creative: ["Product Vision", "User Storytelling"]
    }
  };

  const gaps = roleGapMap[roleCategory] || roleGapMap["Frontend Developer"];
  const result = [];

  // Sort traits by score (ascending - weakest first)
  const sorted = Object.entries(traitAvg)
    .sort((a, b) => a[1] - b[1]);

  sorted.forEach(([trait, score]) => {
    const skillsForTrait = gaps[trait] || [];
    // Priority: higher for weaker traits (score < 50 = priority 5, score 50-70 = priority 4, etc)
    const priority = Math.ceil((100 - score) / 20);

    skillsForTrait.forEach((skill) => {
      result.push({
        name: skill,
        trait,
        priority: Math.min(5, priority)
      });
    });
  });

  return result.slice(0, 5);
}

/**
 * Map fit score to level text
 * @param {number} fitScore - Fit percentage (40-100)
 * @returns {string} Level: 'Pemula', 'Menengah', 'Lanjutan'
 */
export function mapFitToLevel(fitScore) {
  if (fitScore >= 75) return "Lanjutan";
  if (fitScore >= 55) return "Menengah";
  return "Pemula";
}

/**
 * Build personalized record for API
 * @param {Object} scoreData - Result from computeScore()
 * @param {number} fitScore - Fit percentage from computeFit()
 * @param {Array} topThree - Top 3 strengths from topStrengths()
 * @returns {Object} Data ready for personalizedAPI.create()
 */
export function buildPersonalizedRecord(scoreData, fitScore, topThree) {
  const skillGaps = mapSkillGaps(scoreData.traitAvg, scoreData.roleCategory);
  const level = mapFitToLevel(fitScore);

  return {
    role_fit: `${scoreData.roleCategory} (${fitScore}%)`,
    strength: JSON.stringify({
      archetype: scoreData.archetype,
      topThree,
      traits: scoreData.traitAvg
    }),
    skill_gap: JSON.stringify(
      skillGaps.map(g => ({
        name: g.name,
        priority: g.priority,
        trait: g.trait
      }))
    ),
    level,
    gap: `${skillGaps.length} skill prioritas untuk 90 hari ke depan`
  };
}

/**
 * Get role code for API job skills endpoint
 * @param {string} roleCategory - Full role category name
 * @returns {string} Short code (PM, UI/UX, BE, FE)
 */
export function getRoleCode(roleCategory) {
  const codeMap = {
    "Product Manager": "PM",
    "UI/UX Designer": "UI/UX",
    "Backend Developer": "BE",
    "Frontend Developer": "FE"
  };
  return codeMap[roleCategory] || "PM";
}