import { MirrorChatAPI } from './ApiAdapter.js';
import { assessmentAPI, personalizedAPI, usersAPI } from '@/lib/api.js';

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

/**
 * Extract role fit percentage dari role_fit (jsonb atau string)
 * @param {any} roleFitData - Role fit data (bisa object, string, atau number)
 * @returns {number} - Role fit percentage (0-100)
 */
function extractRoleFit(roleFitData) {
  if (!roleFitData) return 0;
  
  // Jika sudah berupa number
  if (typeof roleFitData === 'number') return roleFitData;
  
  // Jika berupa object dengan fit atau score
  if (typeof roleFitData === 'object') {
    return roleFitData?.fit || roleFitData?.score || roleFitData?.roleFit || 0;
  }
  
  // Jika berupa string, coba extract angka
  if (typeof roleFitData === 'string') {
    const match = roleFitData.match(/\((\d+)%\)/);
    return match ? parseInt(match[1]) : 0;
  }
  
  return 0;
}

/**
 * Parse strengths dari berbagai format
 * @param {any} strengthsData - Strengths data (bisa array, object, atau string JSON)
 * @returns {Array} - Array of strengths
 */
function parseStrengths(strengthsData) {
  if (!strengthsData) return [];
  
  // Jika sudah array
  if (Array.isArray(strengthsData)) {
    return strengthsData.map(s => typeof s === 'string' ? s : s?.name || s?.skill || s).filter(Boolean);
  }
  
  // Jika berupa object dengan topThree
  if (typeof strengthsData === 'object' && strengthsData.topThree) {
    return strengthsData.topThree || [];
  }
  
  // Jika berupa string JSON
  if (typeof strengthsData === 'string') {
    try {
      const parsed = JSON.parse(strengthsData);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.topThree) return parsed.topThree || [];
      if (parsed.traits) return Object.keys(parsed.traits).slice(0, 5);
    } catch (e) {
      // Ignore parse error
    }
  }
  
  return [];
}

/**
 * Parse skill gaps dari berbagai format
 * @param {any} skillGapsData - Skill gaps data
 * @returns {Array} - Array of skill gaps
 */
function parseSkillGaps(skillGapsData) {
  if (!skillGapsData) return [];
  
  // Jika sudah array
  if (Array.isArray(skillGapsData)) {
    return skillGapsData.map(g => ({
      name: typeof g === 'string' ? g : g?.name || g?.skill || g,
      priority: typeof g === 'object' ? (g?.priority || 3) : 3,
      description: typeof g === 'object' ? g?.description : ''
    }));
  }
  
  // Jika berupa string JSON
  if (typeof skillGapsData === 'string') {
    try {
      const parsed = JSON.parse(skillGapsData);
      if (Array.isArray(parsed)) {
        return parsed.map(g => ({
          name: typeof g === 'string' ? g : g?.name || g?.skill || g,
          priority: typeof g === 'object' ? (g?.priority || 3) : 3,
          description: typeof g === 'object' ? g?.description : ''
        }));
      }
    } catch (e) {
      // Ignore parse error
    }
  }
  
  return [];
}

/**
 * Fetch personalized data lengkap untuk user - sama seperti usePersonalizedProfile
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Personalized data dengan user info dan computed values
 */
export async function fetchPersonalizedData(userId) {
  // Return object kosong jika userId tidak valid
  if (!userId || userId === "anon") {
    return {
      userInfo: null,
      personalizedData: null,
      assessmentData: null,
      computedValues: null,
    };
  }

  try {
    // 1. Fetch user profile
    let userInfo = null;
    try {
      const userRes = await usersAPI.getById(userId);
      if (userRes?.data?.success && userRes.data.data?.user) {
        userInfo = userRes.data.data.user;
      }
    } catch (err) {
      // Error sudah di-handle oleh axios interceptor di api.js
      // Jangan throw error lagi, continue tanpa userInfo
      // Only log meaningful errors - skip empty error objects
      const errorMsg = err?.response?.data?.error?.message || err?.message;
      if (errorMsg && errorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
        console.warn("[Personalized Data] Could not fetch user info:", errorMsg);
      }
      // Continue without userInfo - will try to get from personalized data later
    }

    // 2. Fetch personalized profile dengan recommendations
    let personalizedData = null;
    let computedValues = null;
    
    try {
      const personalizedRes = await personalizedAPI.getByUserId(userId, 1, 1);
      if (personalizedRes?.data?.success && personalizedRes.data.data?.personalizations?.length > 0) {
        const latestPersonalized = personalizedRes.data.data.personalizations[0];
        
        // Fetch full profile dengan recommendations
        if (latestPersonalized.rec_id || latestPersonalized.id) {
          const recId = latestPersonalized.rec_id || latestPersonalized.id;
          try {
            const fullProfileRes = await personalizedAPI.getWithRecs(recId);
            if (fullProfileRes?.data?.success) {
              const personalized = fullProfileRes.data.data.personalized;
              const jobRecs = fullProfileRes.data.data.job_recommendations || [];
              const skillRecs = fullProfileRes.data.data.skill_recommendations || [];
              
              personalizedData = {
                personalized,
                jobRecommendations: jobRecs,
                skillRecommendations: skillRecs,
              };
              
              // Jika userInfo belum ada, coba ambil dari personalized data
              // (beberapa API mungkin sudah include user info di response)
              if (!userInfo && personalized.user_id) {
                // Try to extract user info from personalized data if available
                // This is a fallback if userInfo API call failed
                userInfo = {
                  id: personalized.user_id,
                  email: typeof personalized.user_id === 'string' && personalized.user_id.includes('@') 
                    ? personalized.user_id 
                    : null,
                };
              }
              
              // Compute values seperti di usePersonalizedProfile
              const roleFitData = personalized.role_fit || {};
              const aiInsight = personalized.ai_insight || {};
              
              computedValues = {
                roleFit: extractRoleFit(roleFitData),
                competenceLevel: personalized.competence_level || "",
                recommendedRole: roleFitData?.role || roleFitData?.recommended_role || "",
                strengths: parseStrengths(personalized.top_strengths),
                skillGaps: parseSkillGaps(personalized.skill_gaps),
                personalitySummary: aiInsight?.personality_summary || aiInsight?.summary || "",
                detailPeran: aiInsight?.detail_peran || "",
                potensiKarir: aiInsight?.potensi_karir || "",
                developmentAreas: aiInsight?.development_areas || "",
                nextSteps: aiInsight?.next_steps || "",
                jobRecommendationsCount: jobRecs.length,
                skillRecommendationsCount: skillRecs.length,
              };
            }
          } catch (innerErr) {
            // Error sudah di-handle oleh axios interceptor di api.js
            // Jangan throw error lagi, continue tanpa full profile
            const innerErrorMsg = innerErr?.response?.data?.error?.message || innerErr?.message;
            if (innerErrorMsg && innerErrorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
              console.warn("[Personalized Data] Could not fetch full profile:", innerErrorMsg);
            }
          }
        }
      }
    } catch (err) {
      // Error sudah di-handle oleh axios interceptor di api.js
      // Jangan throw error lagi, continue tanpa personalized data
      const errorMsg = err?.response?.data?.error?.message || err?.message;
      if (errorMsg && errorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
        console.warn("[Personalized Data] Could not fetch personalized:", errorMsg);
      }
      // Continue without personalized data
    }

    // 3. Fetch assessment_cache data dari personalizedAPI (jika ada di personalized data)
    // assessment_cache biasanya sudah termasuk dalam personalized data atau bisa diambil via personalizedAPI
    // Data assessment_cache (DISC, RIASEC, AI analysis) sudah terintegrasi dengan personalized profile
    let assessmentData = null;
    
    // Jika personalized data sudah ada, coba extract assessment_cache data dari sana
    if (personalizedData?.personalized) {
      const personalized = personalizedData.personalized;
      // Assessment cache data biasanya ada di personalized profile sebagai:
      // - disc_profile, riasec_profile (dari assessment_cache)
      // - ai_insight/ai_analysis (dari assessment_cache.ai_analysis)
      assessmentData = {
        disc_profile: personalized.disc_profile || null,
        riasec_profile: personalized.riasec_profile || null,
        ai_analysis: personalized.ai_insight || personalized.ai_analysis || null,
      };
    } else {
      // Fallback: coba fetch dari assessmentAPI jika personalized data tidak ada
      // Tapi ini hanya untuk backward compatibility, karena mirror chat fokus ke personalizedAPI
      try {
        const assessmentRes = await assessmentAPI.getResults();
        if (assessmentRes?.data?.success && assessmentRes.data.data) {
          assessmentData = assessmentRes.data.data;
        }
      } catch (err) {
        // Error sudah di-handle oleh axios interceptor di api.js
        // Jangan throw error lagi, continue tanpa assessment data
        const errorMsg = err?.response?.data?.error?.message || err?.message;
        if (errorMsg && errorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
          console.warn("[Personalized Data] Could not fetch assessment_cache:", errorMsg);
        }
        // Continue without assessment data
      }
    }

    return {
      userInfo,
      personalizedData,
      assessmentData, // Assessment cache data dari personalizedAPI (prioritas utama)
      computedValues, // Computed values untuk memudahkan AI memahami data user
    };
  } catch (error) {
    // Only log meaningful errors - skip empty error objects
    const errorMsg = error?.response?.data?.error?.message || error?.message;
    if (errorMsg && errorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
      console.error("[Personalized Data] Unexpected error:", errorMsg);
    }
    return {
      userInfo: null,
      personalizedData: null,
      assessmentData: null,
      computedValues: null,
    };
  }
}

/**
 * AI Reflection Guard - Membuat chat refleksi yang dipersonalisasi berdasarkan role fit analysis user
 * @param {string} userId - User ID
 * @param {string} message - Pesan dari user
 * @param {object} profile - Profile user (optional)
 * @param {boolean} isFirstMessage - Apakah ini pesan pertama kali
 * @param {object} cachedPersonalizedData - Optional: cached personalized data dari store untuk menghindari duplicate fetch
 * @returns {Promise<string>} - Response dari AI yang dipersonalisasi
 */
export async function aiReflectionGuard(userId, message, profile = {}, isFirstMessage = false, cachedPersonalizedData = null) {
  try {
    // Gunakan cached data jika tersedia, jika tidak fetch baru
    // Karena mirror chat fokus ke perkembangan karir berdasarkan role fit dari personalized
    let personalizedContext = cachedPersonalizedData;
    
    // Jika tidak ada cached data, fetch baru
    if (!personalizedContext || !personalizedContext.personalizedData) {
      try {
        personalizedContext = await fetchPersonalizedData(userId);
        // Ensure personalizedContext is never null (always an object)
        if (!personalizedContext) {
          personalizedContext = {
            userInfo: null,
            personalizedData: null,
            assessmentData: null,
            computedValues: null,
          };
        }
      } catch (err) {
        // Fallback jika fetchPersonalizedData throw error (shouldn't happen, but just in case)
        const errorMsg = err?.message;
        if (errorMsg && errorMsg !== "Unknown error" && process.env.NODE_ENV === 'development') {
          console.warn("[AI Reflection Guard] Error fetching personalized data:", errorMsg);
        }
        personalizedContext = {
          userInfo: null,
          personalizedData: null,
          assessmentData: null,
          computedValues: null,
        };
      }
    }

    // Build role fit context HANYA dari personalizedAPI (tidak ada fallback ke assessment)
    // Data sudah di-fetch dari personalizedAPI via fetchPersonalizedData
    let roleFitContext = null;
    
    // Prioritas 1: Gunakan computedValues dari personalizedAPI (sudah di-compute di fetchPersonalizedData)
    if (personalizedContext?.computedValues) {
      const computed = personalizedContext.computedValues;
      roleFitContext = {
        roleFit: computed.roleFit || null,
        competenceLevel: computed.competenceLevel || null,
        recommendedRole: computed.recommendedRole || null,
        personalitySummary: computed.personalitySummary || null,
        detailPeran: computed.detailPeran || null,
        potensiKarir: computed.potensiKarir || null,
        topStrengths: computed.strengths || null,
        developmentAreas: computed.skillGaps || null,
        nextSteps: computed.nextSteps || null,
      };
      
      // Tambahkan discProfile dan riasecProfile dari personalized data jika ada
      if (personalizedContext?.personalizedData?.personalized) {
        const personalized = personalizedContext.personalizedData.personalized;
        roleFitContext.discProfile = personalized.disc_profile || null;
        roleFitContext.riasecProfile = personalized.riasec_profile || null;
      }
    }
    // Prioritas 2: Jika computedValues tidak ada, ambil langsung dari personalized data
    else if (personalizedContext?.personalizedData?.personalized) {
      const personalized = personalizedContext.personalizedData.personalized;
      const roleFitData = personalized.role_fit || {};
      const aiInsight = personalized.ai_insight || {};
      
      roleFitContext = {
        roleFit: extractRoleFit(roleFitData),
        competenceLevel: personalized.competence_level || null,
        discProfile: personalized.disc_profile || null,
        riasecProfile: personalized.riasec_profile || null,
        recommendedRole: roleFitData?.role || roleFitData?.recommended_role || null,
        personalitySummary: aiInsight?.personality_summary || aiInsight?.summary || null,
        detailPeran: aiInsight?.detail_peran || null,
        potensiKarir: aiInsight?.potensi_karir || null,
        topStrengths: parseStrengths(personalized.top_strengths),
        developmentAreas: parseSkillGaps(personalized.skill_gaps),
        nextSteps: aiInsight?.next_steps || null,
      };
    }
    
    // TIDAK ADA FALLBACK KE ASSESSMENT API - semua data harus dari personalizedAPI

    // Panggil MirrorChatAPI dengan role fit context dan personalized context
    // SELALU kirim personalizedContext karena mirror chat fokus ke perkembangan karir berdasarkan personalized data
    const reply = await MirrorChatAPI.askBot({
      userId,
      profile,
      message,
      roleFitContext, // Context akan digunakan untuk personalisasi prompt (fallback)
      personalizedContext, // SELALU kirim personalized data untuk setiap pesan
      isFirstMessage, // Flag untuk first message
    });

    return reply;
  } catch (error) {
    console.error("[AI Reflection Guard] Error:", error);
    return "⚠️ Maaf, terjadi kesalahan saat memproses refleksi. Silakan coba lagi.";
  }
}
