// hooks/usePersonalizedProfile.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { personalizedAPI, recommendationsAPI, skillupAPI, usersAPI, assessmentAPI } from '@/lib/api';
import { logWarning, logError } from '@/lib/utils/logger';
import { COLORS } from '@/lib/config/constants';
import { getWithExpiry } from '@/lib/utils/storage';

/**
 * Main hook untuk personalized dashboard
 * Pulls data dari API (rec_pekerjaan, rec_skillup, personalized)
 * Ready untuk AI integration nanti
 */
export function usePersonalizedProfile() {
  const searchParams = useSearchParams();
  
  // Ambil recId dari berbagai sumber (rec_id, id, sessionStorage, atau profile data)
  const [profile, setProfile] = useState(null);
  
  // recId sebagai computed value dengan useMemo - update ketika searchParams atau profile berubah
  // PRIORITAS: rec_id param > id param (jika UUID) > profile data > sessionStorage (fallback terakhir)
  const recId = useMemo(() => {
    // 1. Cek query parameter rec_id (prioritas tertinggi)
    const fromQueryRecId = searchParams.get('rec_id');
    if (fromQueryRecId) return fromQueryRecId;
    
    // 2. Cek query parameter id - bisa jadi rec_id atau user_id
    const fromQueryId = searchParams.get('id');
    if (fromQueryId) {
      // Jika id adalah UUID (format personalized rec_id), gunakan langsung
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars dengan dashes)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(fromQueryId)) {
        return fromQueryId; // Kemungkinan rec_id
      }
      // Jika bukan UUID, mungkin user_id - akan di-resolve via API nanti
    }
    
    // 3. Cek dari profile data yang sudah di-fetch (jika ada)
    // Cek berbagai kemungkinan field: rec_id, id (jika UUID), atau field lain
    if (profile?.rec_id) return profile.rec_id;
    // Cek apakah profile.id adalah UUID (format personalized rec_id)
    if (profile?.id) {
      const idStr = String(profile.id);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(idStr) || idStr.length > 20) {
        // Jika UUID atau panjang, kemungkinan rec_id
        return idStr;
      }
    }
    
      // 4. Fallback: Cek sessionStorage (HANYA untuk local/offline mode)
      // NOTE: Data utama seharusnya dari assessment_cache via API, bukan sessionStorage
      // sessionStorage hanya untuk backward compatibility dan offline mode
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}');
          if (saved?.recId && String(saved.recId).startsWith('local-')) {
            // Hanya gunakan jika local (temporary/offline mode)
            return saved.recId;
          }
        } catch (e) {
          // Ignore
        }
      }
    
    return null;
  }, [searchParams, profile]);
  
  const isLocalRec = recId && String(recId).startsWith('local-');
  const [user, setUser] = useState(null); // ✅ diperbaiki: hapus const userId yang salah
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiStatus, setAiStatus] = useState('');
  const [refreshingAI, setRefreshingAI] = useState(false);

  // Fetch profile + recommendations
  useEffect(() => {
    // Check for DISC+RIASEC results first (dari localStorage dengan expiry 24h)
    if (typeof window !== 'undefined') {
      const discRiasecResults = getWithExpiry('disc_riasec_results');
      const assessmentType = getWithExpiry('assessment_type');
      
      if (discRiasecResults && assessmentType === 'DISC_RIASEC') {
        try {
          const results = discRiasecResults; // Sudah di-parse oleh getWithExpiry
          // Create profile from DISC+RIASEC results
          const discProfile = results.discProfile || {};
          const riasecProfile = results.riasecProfile || {};
          const recommendations = results.recommendations || [];
          
          // Format profile for personalized page
          const formattedProfile = {
            role_fit: `DISC: ${discProfile.primary || 'N/A'}/${discProfile.secondary || 'N/A'} | RIASEC: ${riasecProfile.primary || 'N/A'}/${riasecProfile.secondary || 'N/A'}`,
            level: 'Menengah',
            gap: `${recommendations.length} rekomendasi pekerjaan`,
            strength: JSON.stringify({
              archetype: `DISC ${discProfile.primary || ''}-${discProfile.secondary || ''}`,
              topThree: [
                discProfile.primary || 'D',
                discProfile.secondary || 'I',
                riasecProfile.primary || 'A'
              ],
              traits: {
                ...discProfile.scores,
                ...riasecProfile.scores
              },
              discProfile,
              riasecProfile
            }),
            skill_gap: JSON.stringify([]),
            disc_profile: discProfile,
            riasec_profile: riasecProfile,
            job_recommendations: recommendations
          };
          
          setProfile(formattedProfile);
          setUser({ name: 'User' });
          // Store recommendations in the format expected by formatJobRecommendations
          setJobRecommendations(recommendations);
          setError('');
          setLoading(false);
          return;
        } catch (e) {
          logError('Error parsing DISC+RIASEC results:', e);
        }
      }
    }
    
    if (!recId) {
      // Jika recId masih null, coba resolve dari user_id via API
      const userIdFromQuery = searchParams.get('id');
      
      if (userIdFromQuery && !userIdFromQuery.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // id adalah user_id (bukan UUID), fetch personalized profile dari API
        const fetchByUserId = async () => {
          try {
            setLoading(true);
            const userPersonalizationsRes = await personalizedAPI.getByUserId(userIdFromQuery, 1, 1);
            
            if (userPersonalizationsRes?.data?.success && userPersonalizationsRes.data.data?.personalizations?.length > 0) {
              // Ambil personalized profile terbaru
              const latestPersonalized = userPersonalizationsRes.data.data.personalizations[0];
              const resolvedRecId = latestPersonalized.rec_id || latestPersonalized.id;
              
              if (resolvedRecId) {
                // Fetch full profile dengan rec_id yang ditemukan
                const fullProfileRes = await personalizedAPI.getWithRecs(resolvedRecId);
                if (fullProfileRes?.data?.success) {
                  const profileData = fullProfileRes.data.data.personalized;
                  const jobRecs = fullProfileRes.data.data.job_recommendations || [];
                  const skillRecs = fullProfileRes.data.data.skill_recommendations || [];
                  
                  setProfile(profileData);
                  setJobRecommendations(jobRecs);
                  setSkillRecommendations(skillRecs);
                  
                  // Resolve user name
                  const userId = profileData?.user_id;
                  if (userId) {
                    try {
                      const userRes = await usersAPI.getById(userId);
                      if (userRes.data?.success && userRes.data.data?.user) {
                        const userObj = userRes.data.data.user;
                        setUser({ ...userObj, name: userObj.name || userObj.email || 'User' });
                      } else {
                        setUser({ name: typeof userId === 'string' ? userId : 'User' });
                      }
                    } catch (userErr) {
                      setUser({ name: typeof userId === 'string' ? userId : 'User' });
                    }
                  }
                  
                  setError('');
                  setLoading(false);
                  return;
                }
              }
            }
            
            // Jika tidak ada personalized profile, cek assessment_cache
            setError('Profil personalized tidak ditemukan. Silakan selesaikan assessment terlebih dahulu.');
          } catch (apiErr) {
            console.error('Error fetching personalized by user_id:', apiErr);
            // Fallback ke sessionStorage HANYA jika API gagal total
            try {
              const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
              if (saved?.personalizedRecord) {
                setProfile(saved.personalizedRecord);
                setUser({ name: saved.personalizedRecord.user_id || 'User' });
                setJobRecommendations([]);
                setSkillRecommendations([]);
                setError('');
              } else {
                setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
              }
            } catch (e) {
              setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
            }
          } finally {
            setLoading(false);
          }
        };
        
        fetchByUserId();
        return;
      }
      
      // Fallback terakhir: sessionStorage (HANYA untuk local mode)
      try {
        const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
        if (saved?.personalizedRecord && saved?.recId?.startsWith('local-')) {
          // Hanya gunakan jika local mode (offline/temporary)
          setProfile(saved.personalizedRecord);
          setUser({ name: saved.personalizedRecord.user_id || 'User' });
          setJobRecommendations([]);
          setSkillRecommendations([]);
          setError('');
        } else {
          setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
        }
      } catch (e) {
        setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
      }
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        
        // Jika menggunakan rec_id lokal, gunakan data dari sessionStorage tanpa call API
        if (isLocalRec) {
          const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
          if (saved?.personalizedRecord) {
            setProfile(saved.personalizedRecord);
            setUser({ name: saved.personalizedRecord.user_id || 'User' });
            setJobRecommendations([]);
            setSkillRecommendations([]);
            setError('');
            return; // selesai local mode
          }
        }

        // 1. Fetch personalized profile + recommendations dari API (prefer bundled endpoint)
        let profileData = null;
        let jobRecs = [];
        let skillRecs = [];
        try {
          const bundleRes = await personalizedAPI.getWithRecs(recId);
          if (bundleRes.data?.success) {
            profileData = bundleRes.data.data.personalized;
            jobRecs = bundleRes.data.data.job_recommendations || [];
            skillRecs = bundleRes.data.data.skill_recommendations || [];
          }
        } catch (bundleErr) {
          // Silently ignore 404s for bundled endpoint - it's optional
          if (bundleErr.response?.status !== 404) {
            logWarning('Bundled recommendations endpoint failed:', bundleErr);
          }
          // fallback to separate calls below
        }

        if (!profileData) {
          const profileRes = await personalizedAPI.getById(recId);
          if (!profileRes.data.success) {
            throw new Error('Gagal fetch profile');
          }
          profileData = profileRes.data.data.personalized;
        }
        setProfile(profileData);

        // 2. Resolve nama pengguna secara robust
        const userId = profileData?.user_id;
        if (userId) {
          // Jika user_id adalah objek yang sudah berisi nama/id
          if (typeof userId === 'object') {
            const name = resolveUserName(userId);
            setUser({ name, id: userId.id || userId.user_id || null });
          } else {
            try {
              const userRes = await usersAPI.getById(userId);
              if (userRes.data?.success && userRes.data.data?.user) {
                const userObj = userRes.data.data.user;
                const name = resolveUserName(userObj, userId);
                setUser({ ...userObj, name });
              } else {
                // fallback kalau user_id sudah berupa nama string
                const name = typeof userId === 'string' ? userId : 'Pengguna';
                setUser({ name });
              }
            } catch (userErr) {
              logWarning('Gagal fetch user detail, fallback ke user_id:', userErr);
              const name = typeof userId === 'string' ? userId : 'Pengguna';
              setUser({ name });
            }
          }
        } else {
          setUser({ name: 'Pengguna' });
        }

        // 3. Fetch job recommendations if not provided by bundle
        if (jobRecs.length > 0) {
          setJobRecommendations(jobRecs);
        } else {
          try {
            const jobsRes = await recommendationsAPI.getJobRecommendations(recId);
            // Handle various response structures
            if (jobsRes.data?.success) {
              const jobs = jobsRes.data.data?.recommendations || jobsRes.data.data?.data || jobsRes.data.recommendations || [];
              setJobRecommendations(Array.isArray(jobs) ? jobs : []);
            } else {
              setJobRecommendations([]);
            }
          } catch (jobErr) {
            // Silently handle 404s - recommendations might not exist yet
            if (jobErr.response?.status !== 404) {
              logWarning('Error fetching jobs:', jobErr);
            }
            setJobRecommendations([]);
          }
        }

        // 4. Fetch skill recommendations if not provided by bundle
        if (skillRecs.length > 0) {
          setSkillRecommendations(skillRecs);
        } else {
          try {
            const skillsRes = await recommendationsAPI.getSkillRecommendations(recId);
            // Handle various response structures
            if (skillsRes.data?.success) {
              const skills = skillsRes.data.data?.recommendations || skillsRes.data.data?.data || skillsRes.data.recommendations || [];
              setSkillRecommendations(Array.isArray(skills) ? skills : []);
            } else {
              setSkillRecommendations([]);
            }
          } catch (skillErr) {
            // Silently handle 404s - recommendations might not exist yet
            if (skillErr.response?.status !== 404) {
              logWarning('Error fetching skills:', skillErr);
            }
            setSkillRecommendations([]);
          }
        }

        setError('');

        // 5. Try fetch AI analysis (only when user just submitted assessment)
        try {
          const fromRecentAssessment = typeof window !== 'undefined' && sessionStorage.getItem('assessment_submitted') === 'true';
          if (fromRecentAssessment) {
            // Poll for AI completion (every 5s, max 24 attempts = 2 minutes)
            let attempts = 0;
            const maxAttempts = 24;
            const pollInterval = setInterval(async () => {
              attempts += 1;
              try {
                const statusRes = await assessmentAPI.checkStatus();
                const completed = statusRes?.data?.data?.is_completed;
                const failed = statusRes?.data?.data?.is_failed;
                const status = statusRes?.data?.data?.ai_status;
                if (status) setAiStatus(status);
                if (completed) {
                  try {
                    const res = await assessmentAPI.getResults();
                    if (res.data?.success && res.data.data?.ai_analysis) {
                      setProfile(prev => ({ ...(prev || {}), ai_insight: res.data.data.ai_analysis }));
                    }
                    sessionStorage.removeItem('assessment_submitted');
                    clearInterval(pollInterval);
                  } catch (resErr) {
                    logWarning('Failed to fetch AI results:', resErr);
                  }
                } else if (failed || status === 'failed') {
                  setAiStatus('failed');
                  clearInterval(pollInterval);
                } else if (attempts >= maxAttempts) {
                  clearInterval(pollInterval);
                  setAiStatus('timeout');
                }
              } catch (pollErr) {
                logWarning('Poll error:', pollErr);
                if (attempts >= maxAttempts) {
                  clearInterval(pollInterval);
                  setAiStatus('error');
                }
              }
            }, 5000); // Poll every 5 seconds
          }
        } catch (_) {
          // ignore status errors
        }
      } catch (err) {
        logError('Error in fetchAll:', err);
        // Fallback ke data lokal jika 401/403 atau network error
        const status = err?.response?.status;
        if (status === 401 || status === 403 || isLocalRec) {
          try {
            const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
            if (saved?.personalizedRecord) {
              setProfile(saved.personalizedRecord);
              const fallbackName = resolveUserName(saved.personalizedRecord?.user || saved.personalizedRecord?.user_id, saved.personalizedRecord?.user_id);
              setUser({ name: fallbackName || 'Pengguna' });
              setJobRecommendations([]);
              setSkillRecommendations([]);
              setError('');
            } else {
              setError(err.message || 'Gagal load profile');
            }
          } catch (e) {
            setError(err.message || 'Gagal load profile');
          }
        } else {
          setError(err.message || 'Gagal load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [recId, isLocalRec]);

  // ============================================
  // COMPUTED VALUES - Phase 1 (Logic-based)
  // ============================================

  const computed = {
    // Extract role fit percentage
    roleFit: profile ? extractRoleFit(profile.role_fit) : 0,

    // Summary metrics untuk dashboard card
    summaryMetrics: profile ? buildMetrics(profile) : [],

    // Top strengths
    strengths: profile ? parseStrengths(profile.strength) : [],

    // Skill gaps dengan priority (fallback synth jika kosong)
    skillGaps: (() => {
      if (!profile) return [];
      const parsed = parseSkillGaps(profile.skill_gap);
      if (parsed && parsed.length > 0) return parsed;
      const strengthParsed = parseStrengths(profile.strength);
      return synthesizeSkillGaps(strengthParsed);
    })(),

    // Formatted job recommendations
    formattedJobs: formatJobRecommendations(jobRecommendations),

    // Formatted skill recommendations
    formattedSkills: formatSkillRecommendations(skillRecommendations),

    // AI analysis (filled from backend if available)
    aiInsight: (() => {
      if (!profile) return null;
      return (
        profile.ai_insight ||
        profile.ai_summary ||
        profile.ai_analysis ||
        null
      );
    })(),

    // Next steps recommendation
    nextSteps: profile ? generateNextSteps(profile) : []
  };

  // Function untuk refresh AI analysis (dipisah dari langchain logic, langsung call endpoint)
  const refreshAIAnalysis = async (analysisType = 'detailed') => {
    // Validasi recId - coba resolve lagi jika null
    let currentRecId = recId;
    
    // Jika recId masih null, coba resolve dari profile atau query params
    if (!currentRecId) {
      // Cek dari profile yang sudah di-fetch - cek semua kemungkinan field
      if (profile?.rec_id) {
        currentRecId = profile.rec_id;
      } else if (profile?.id) {
        const idStr = String(profile.id);
        // Jika profile.id adalah UUID atau panjang, gunakan sebagai rec_id
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(idStr) || idStr.length > 20) {
          currentRecId = idStr;
        }
      }
      // Cek dari query params
      else if (searchParams.get('rec_id')) currentRecId = searchParams.get('rec_id');
      else if (searchParams.get('id')) currentRecId = searchParams.get('id');
      // Cek sessionStorage (HANYA untuk local mode - data utama dari assessment_cache via API)
      else if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}');
          // Hanya gunakan jika local mode (offline/temporary)
          if (saved?.recId?.startsWith('local-')) {
            currentRecId = saved.recId;
          } else if (saved?.personalizedRecord?.rec_id) {
            currentRecId = saved.personalizedRecord.rec_id;
          } else if (saved?.personalizedRecord?.id) {
            currentRecId = saved.personalizedRecord.id;
          }
        } catch (e) {
          // Ignore
        }
      }
    }
    
    if (!currentRecId) {
      // Debug: log semua kemungkinan field dari profile
      console.error('❌ refreshAIAnalysis: recId tidak ada setelah semua resolusi', { 
        recId, 
        profile: profile ? {
          id: profile.id,
          rec_id: profile.rec_id,
          user_id: profile.user_id,
          allKeys: Object.keys(profile || {}),
          sample: JSON.stringify(profile).substring(0, 200)
        } : null,
        queryParams: { rec_id: searchParams.get('rec_id'), id: searchParams.get('id') }
      });
      
      // Coba ambil dari URL jika ada (terakhir)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlRecId = urlParams.get('rec_id') || urlParams.get('id');
        if (urlRecId) {
          console.log('✅ Found recId from URL:', urlRecId);
          currentRecId = urlRecId;
        }
      }
      
      if (!currentRecId) {
        logError('recId tidak ditemukan. Pastikan Anda sudah menyelesaikan assessment dan memiliki personalized profile.');
        alert('Tidak dapat menemukan ID profil. Pastikan Anda sudah menyelesaikan assessment.');
        return;
      }
    }
    
    if (refreshingAI) {
      console.warn('refreshAIAnalysis: Already refreshing, skipping...');
      return;
    }
    
    try {
      console.log('🔄 Starting AI analysis refresh...', { recId: currentRecId, analysisType });
      setRefreshingAI(true);
      setAiStatus('pending');
      
      // Call endpoint langsung (tidak perlu polling assessmentAPI, langsung dari personalized)
      const response = await personalizedAPI.refreshAIAnalysis(currentRecId, analysisType);
      
      if (!response?.data?.success) {
        throw new Error(response?.data?.error || 'Failed to trigger AI analysis');
      }
      
      console.log('✅ AI analysis triggered:', response.data);
      
      // Poll untuk hasil - langsung fetch dari personalized endpoint
      let attempts = 0;
      const maxAttempts = 24; // 2 menit polling (24 x 5s)
      const pollInterval = setInterval(async () => {
        attempts += 1;
        try {
          // Fetch personalized profile langsung untuk dapat AI analysis
          const profileRes = await personalizedAPI.getById(currentRecId);
          
          if (profileRes?.data?.success) {
            const personalizedData = profileRes.data.data?.personalized || profileRes.data.data;
            const aiAnalysis = personalizedData?.ai_analysis || personalizedData?.ai_insight;
            
            if (aiAnalysis && Object.keys(aiAnalysis).length > 0) {
              console.log('✅ AI analysis completed, updating profile');
              setProfile(prev => ({ ...(prev || {}), ai_insight: aiAnalysis }));
              setAiStatus('completed');
              clearInterval(pollInterval);
              setRefreshingAI(false);
              return;
            }
          }
          
          // Fallback: check status via assessment API juga
          try {
            const statusRes = await assessmentAPI.checkStatus();
            const completed = statusRes?.data?.data?.is_completed;
            const failed = statusRes?.data?.data?.is_failed;
            const status = statusRes?.data?.data?.ai_status;
            
            if (status) setAiStatus(status);
            
            if (completed) {
              const res = await assessmentAPI.getResults();
              if (res.data?.success && res.data.data?.ai_analysis) {
                setProfile(prev => ({ ...(prev || {}), ai_insight: res.data.data.ai_analysis }));
                setAiStatus('completed');
                clearInterval(pollInterval);
                setRefreshingAI(false);
                return;
              }
            } else if (failed || status === 'failed') {
              setAiStatus('failed');
              clearInterval(pollInterval);
              setRefreshingAI(false);
              return;
            }
          } catch (statusErr) {
            // Ignore status check errors, continue polling
            console.warn('Status check error (continuing):', statusErr);
          }
          
          // Timeout handling
          if (attempts >= maxAttempts) {
            console.warn('⏱️ AI analysis polling timeout');
            clearInterval(pollInterval);
            setAiStatus('timeout');
            setRefreshingAI(false);
          }
        } catch (pollErr) {
          console.warn('Poll error (continuing):', pollErr);
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setAiStatus('error');
            setRefreshingAI(false);
          }
        }
      }, 5000);
      
    } catch (err) {
      console.error('❌ Error refreshing AI analysis:', err);
      logError('Error refreshing AI analysis:', err);
      setAiStatus('error');
      setRefreshingAI(false);
    }
  };

  return {
    profile,
    user, // ✅ ditambahkan agar bisa digunakan di komponen (misal DashboardContent)
    recId,
    loading,
    error,
    aiStatus,
    refreshingAI,
    refreshAIAnalysis, // ✅ fungsi untuk refresh AI analysis
    // Raw data
    jobRecommendations,
    skillRecommendations,
    // Computed
    ...computed
  };
}

// ============================================
// PHASE 1: LOGIC-BASED HELPERS
// ============================================

// Mengambil nama pengguna dari berbagai kemungkinan field
function resolveUserName(userObjOrString, fallback) {
  if (typeof userObjOrString === 'string') return userObjOrString;
  if (!userObjOrString || typeof userObjOrString !== 'object') {
    return typeof fallback === 'string' ? fallback : 'Pengguna';
  }
  const candidates = [
    userObjOrString.name,
    userObjOrString.full_name,
    userObjOrString.nama,
    userObjOrString.username,
    typeof fallback === 'string' ? fallback : null
  ].filter(Boolean);
  return candidates[0] || 'Pengguna';
}

function extractRoleFit(roleFitStr) {
  if (!roleFitStr) return 0;
  const match = roleFitStr.match(/\((\d+)%\)/);
  return match ? parseInt(match[1]) : 0;
}

function buildMetrics(profile) {
  const roleFit = extractRoleFit(profile.role_fit);
  
  return [
    {
      title: "Role Fit",
      value: `${roleFit}%`,
      icon: "Target",
      color: `text-[${COLORS.PRIMARY}]`,
      benchmark: roleFit >= 75 ? "Excellent" : roleFit >= 55 ? "Good" : "Building"
    },
    {
      title: "Level",
      value: profile.level || "Menengah",
      icon: "TrendingUp",
      color: `text-[${COLORS.ACCENT}]`
    },
    {
      title: "Skill Gaps",
      value: profile.gap ? extractGapCount(profile.gap) : "3",
      icon: "BookOpen",
      color: "text-gray-600"
    }
  ];
}

function extractGapCount(gapStr) {
  const match = gapStr.match(/(\d+)\s/);
  return match ? match[1] : "3";
}

function parseSkillGaps(skillGapStr) {
  if (!skillGapStr) return [];
  try {
    const gaps = JSON.parse(skillGapStr);
    return gaps
      .map(g => ({
        name: g.name,
        trait: g.trait,
        priority: g.priority,
        priorityLabel: getPriorityLabel(g.priority)
      }))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  } catch (e) {
    logError('Error parsing skill gaps:', e);
    return [];
  }
}

function parseStrengths(strengthStr) {
  if (!strengthStr) return [];
  try {
    const strength = JSON.parse(strengthStr);
    return {
      archetype: strength.archetype || "The Explorer",
      topThree: strength.topThree || [],
      traits: strength.traits || {}
    };
  } catch (e) {
    logError('Error parsing strengths:', e);
    return {
      archetype: "The Explorer",
      topThree: [],
      traits: {}
    };
  }
}

function getPriorityLabel(priority) {
  const priorityMap = {
    5: "Urgent",
    4: "High",
    3: "Medium",
    2: "Low",
    1: "Learning"
  };
  return priorityMap[priority] || "Medium";
}

function formatJobRecommendations(jobs) {
  // Handle DISC+RIASEC format
  if (jobs.length > 0 && jobs[0].job && typeof jobs[0].job === 'string') {
    return jobs.map(job => ({
      id: job.job || `job-${Math.random()}`,
      role: job.job,
      bidang: 'IT',
      description: job.desc || '',
      requirements: '',
      link: null,
      match: job.score || 0,
      badge: job.label || getBadgeFromMatch(job.score || 0)
    }));
  }
  
  // Handle legacy format
  return jobs.map(job => ({
    id: job.pekerjaan?.pekerjaan_id,
    role: job.pekerjaan?.nama_pekerjaan,
    bidang: job.pekerjaan?.bidang,
    description: job.pekerjaan?.deskripsi,
    requirements: job.pekerjaan?.requirements,
    link: job.pekerjaan?.link_pekerjaan,
    // Mock match score for now (will be calculated or from AI later)
    match: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
    badge: getBadgeFromMatch(Math.floor(Math.random() * (95 - 70 + 1)) + 70)
  }));
}

function formatSkillRecommendations(skills) {
  return skills.map(skill => ({
    id: skill.skill_id || skill.skillup?.skill_id,
    name: skill.skillup?.nama_skillup,
    description: skill.skillup?.deskripsi,
    link: skill.skillup?.link_skillup,
    level: skill.skillup?.level,
    addedAt: skill.created_at
  }));
}

function getBadgeFromMatch(score) {
  if (score >= 85) return "Exact Match";
  if (score >= 75) return "Strong Match";
  if (score >= 65) return "Good Fit";
  return "Growing Path";
}

function generateNextSteps(profile) {
  const roleFit = extractRoleFit(profile.role_fit);
  const level = profile.level || "Menengah";
  const steps = [];

  // Analyze dan generate steps berdasarkan data
  if (roleFit < 60) {
    steps.push({
      id: 1,
      priority: "URGENT",
      title: "Tingkatkan Skill Gap",
      description: "Fokus pada 3 skill prioritas untuk mencapai Role Fit 75%",
      timeline: "2 minggu",
      actionUrl: "/personalized?page=skills",
      icon: "BookOpen"
    });
  }

  if (roleFit >= 75 && roleFit < 90) {
    steps.push({
      id: 2,
      priority: "HIGH",
      title: "Apply ke Posisi yang Sesuai",
      description: "Sudah waktunya untuk mulai apply ke lowongan yang match",
      timeline: "Minggu ini",
      actionUrl: "/personalized?page=jobs",
      icon: "Briefcase"
    });
  }

  if (roleFit >= 75) {
    steps.push({
      id: 3,
      priority: "RECOMMENDED",
      title: "Build Portfolio Project",
      description: "Showcase skill terbaik Anda dengan membuat mini project",
      timeline: "1 bulan",
      actionUrl: "/resources/projects",
      icon: "Code"
    });
  }

  if (level === "Pemula") {
    steps.push({
      id: 4,
      priority: "RECOMMENDED",
      title: "Cari Mentor",
      description: "Mulai network dan cari mentor di bidang Anda",
      timeline: "Ongoing",
      actionUrl: "/community",
      icon: "Users"
    });
  }

  return steps;
}

// Generate synthetic skill gaps when backend has no data
function synthesizeSkillGaps(strengthsObj) {
  const top = strengthsObj?.topThree || [];
  const traits = strengthsObj?.traits || {};
  const candidates = [
    { name: 'Leadership Communication', trait: top[0] || 'Communication', priority: 4 },
    { name: 'Problem Solving', trait: top[1] || 'Analysis', priority: 3 },
    { name: 'Stakeholder Management', trait: top[2] || 'Collaboration', priority: 3 },
  ];
  return candidates.map(c => ({
    ...c,
    priorityLabel: getPriorityLabel(c.priority)
  }));
}

/**
 * AI Analysis Hook dengan RAG + Gemini + LangChain
 * 
 * Backend menggunakan:
 * - LangChain untuk orchestration AI calls
 * - Google Gemini API untuk LLM generation
 * - RAG (Retrieval Augmented Generation) dengan vector embeddings:
 *   1. Query di-embed menggunakan Gemini embeddings
 *   2. Vector similarity search untuk retrieve relevant documents
 *   3. Top 5 documents digunakan sebagai context untuk prompt
 *   4. Gemini generate analysis dengan RAG context
 * 
 * Caching:
 * - Smart caching dengan 85% similarity threshold
 * - Similar profiles akan reuse cached analysis
 * 
 * @param {string} personalizedId - ID dari personalized profile (rec_id)
 * @param {boolean} autoFetch - Auto fetch saat mount (default: false)
 * @param {string} analysisType - 'summary' untuk dashboard (ringkas) atau 'detailed' untuk AnalisisAI (mendalam, default: 'summary')
 * @returns {Object} { aiInsight, aiLoading, aiError, generateInsight, refreshAnalysis }
 */
export function useAIAnalysis(personalizedId, autoFetch = false, analysisType = 'summary') {
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const generateInsight = useCallback(async (forceRefresh = false) => {
    if (!personalizedId) {
      setAiError('Personalized ID is required');
      return null;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const response = await personalizedAPI.refreshAIAnalysis(personalizedId, analysisType);
      
      if (response?.data?.success) {
        const analysis = response.data.data?.ai_analysis || 
                        response.data.data?.analysis ||
                        response.data.data;
        setAiInsight(analysis);
        return analysis;
      } else {
        throw new Error(response?.data?.error || 'Failed to generate AI analysis');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message ||
                          error?.message || 
                          'Gagal generate AI analysis. Silakan coba lagi.';
      setAiError(errorMessage);
      console.error('AI Analysis error:', error);
      throw error;
    } finally {
      setAiLoading(false);
    }
  }, [personalizedId, analysisType]);

  useEffect(() => {
    if (autoFetch && personalizedId && !aiInsight && !aiLoading) {
      generateInsight();
    }
  }, [autoFetch, personalizedId, aiInsight, aiLoading, generateInsight]);

  return {
    aiInsight,
    aiLoading,
    aiError,
    generateInsight,
    refreshAnalysis: () => generateInsight(true),
  };
}