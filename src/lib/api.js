import axios from 'axios';
import { useAuthStore } from './store/auth';
import { useToastStore } from './store/toast';

// Gunakan proxy Next.js (/api) agar semua request lewat localhost:3000
const API_BASE_URL = '/api';

// Helper to get toast store (avoiding React hook rules)
const getToast = () => useToastStore.getState();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies automatically (for httpOnly cookie support)
});

// ✅ Add token to requests (NextAuth cookies automatically sent via withCredentials)
api.interceptors.request.use((config) => {
  // NOTE: NextAuth session token sudah otomatis dikirim via httpOnly cookie
  // Backend akan verify NextAuth JWT dari cookie
  // Tidak perlu set Authorization header karena backend pakai cookie
  return config;
});

// ✅ Handle token refresh on 401 using Zustand store + Error notifications
api.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Safety: Ensure originalRequest exists and is an object
    const originalRequest = error?.config || error?.request?.config || {};

    // Handle 401 - Token expired
    if (error?.response?.status === 401 && originalRequest && typeof originalRequest === 'object' && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get toast instance outside try-catch for error handling
      const toast = getToast();
      let loadingId = null;
      
      try {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        
        // NOTE: Refresh token bisa dari state (temporary) atau httpOnly cookie
        // Backend akan handle refresh via cookie jika tersedia
        
        // Show loading toast while refreshing
        loadingId = toast.loading('Memperbarui sesi...', { duration: 0 });

        // Try refresh with cookie first (backend will use cookie if available)
        // If cookie not available, use refreshToken from state
        // If no refresh token at all, reject immediately
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, 
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = response.data.data;
        
        // ✅ Update tokens in Zustand store (temporary, backend sets httpOnly cookies)
        setTokens(access_token, refresh_token);

        // Dismiss loading toast
        if (loadingId) {
          toast.dismiss(loadingId);
        }

        if (originalRequest && typeof originalRequest === 'object') {
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Dismiss loading toast first
        if (loadingId) {
          try {
            toast.dismiss(loadingId);
          } catch (e) {
            // Ignore if toast dismiss fails
          }
        }
        
        // Handle different refresh error scenarios
        const refreshStatus = refreshError?.response?.status;
        
        // If 400 Bad Request, don't redirect - just reject (token might be invalid format)
        if (refreshStatus === 400) {
          console.warn('⚠️ Refresh token invalid (400). Original request will fail.');
          return Promise.reject(refreshError);
        }
        
        // For 401/403, redirect to login
        if (refreshStatus === 401 || refreshStatus === 403) {
          const errorToast = getToast();
          errorToast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          
          useAuthStore.getState().logout();
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors with toast notifications
    const toast = getToast();
    
    // Don't show toast for cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle different error status codes
    switch (error.response?.status) {
      case 400:
        // Bad Request - usually validation errors
        // Don't log here - let the component handle the error message
        // Only log in development if it's not a validation error (to avoid spam)
        if (process.env.NODE_ENV === 'development' && !error.response?.data?.error?.message) {
          // Only log if there's no meaningful error message (unexpected error)
          console.warn('⚠️ 400 Bad Request (no error message):', error.response?.data);
        }
        break;
      
      case 403:
        // Forbidden
        toast.error('Anda tidak memiliki izin untuk mengakses resource ini.');
        break;
      
      case 404:
        // Not Found
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ 404 Not Found:', originalRequest.url);
        }
        break;
      
      case 500:
        // Server Error
        toast.error('Terjadi kesalahan pada server. Tim kami sedang memperbaikinya.');
        break;
      
      case 503:
        // Service Unavailable
        toast.error('Layanan sedang dalam pemeliharaan. Mohon coba lagi nanti.');
        break;
      
      default:
        // Network error or other errors
        if (!error.response) {
          toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        }
    }

    // Log all errors in development (with safety checks)
    // Skip logging for 404 errors (expected for missing resources)
    // Skip logging for 400 errors if they have error message (component will handle it)
    const statusCode = error?.response?.status || error?.status;
    const hasErrorMessage = error?.response?.data?.error?.message || error?.response?.data?.message;
    const shouldLog = process.env.NODE_ENV === 'development' && 
                      statusCode !== 404 && 
                      !(statusCode === 400 && hasErrorMessage); // Skip 400 if has error message
    
    if (shouldLog) {
      try {
        const errorInfo = {
          url: originalRequest?.url || error?.config?.url || 'Unknown',
          method: originalRequest?.method || error?.config?.method || 'Unknown',
          status: statusCode || null,
          message: error?.message || 'Unknown error',
          data: error?.response?.data || error?.data || null,
          code: error?.code || null,
        };
        
        // Only log if errorInfo has meaningful data (not empty object)
        const hasUrl = errorInfo.url && errorInfo.url !== 'Unknown' && typeof errorInfo.url === 'string';
        const hasStatus = errorInfo.status !== null && errorInfo.status !== undefined && typeof errorInfo.status === 'number';
        const hasMessage = errorInfo.message && errorInfo.message !== 'Unknown error' && typeof errorInfo.message === 'string';
        const hasData = errorInfo.data !== null && errorInfo.data !== undefined && 
                       (typeof errorInfo.data === 'object' ? Object.keys(errorInfo.data).length > 0 : true);
        const hasCode = errorInfo.code && typeof errorInfo.code === 'string';
        
        // Build meaningful error object only with actual values
        const meaningfulError = {};
        if (hasUrl) meaningfulError.url = errorInfo.url;
        if (hasStatus) meaningfulError.status = errorInfo.status;
        if (hasMessage) meaningfulError.message = errorInfo.message;
        if (hasData) {
          // Only include data if it's not empty object
          if (typeof errorInfo.data === 'object' && !Array.isArray(errorInfo.data)) {
            const dataKeys = Object.keys(errorInfo.data).filter(key => {
              const value = errorInfo.data[key];
              return value !== null && value !== undefined && value !== '';
            });
            if (dataKeys.length > 0) {
              meaningfulError.data = errorInfo.data;
            }
          } else {
            meaningfulError.data = errorInfo.data;
          }
        }
        if (hasCode) meaningfulError.code = errorInfo.code;
        
        // Only log if meaningfulError has at least one meaningful field
        const meaningfulKeys = Object.keys(meaningfulError).filter(key => {
          const value = meaningfulError[key];
          if (value === null || value === undefined || value === '') return false;
          if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
          return true;
        });
        
        if (meaningfulKeys.length > 0) {
          // Build final error object with only meaningful keys
          const finalError = {};
          meaningfulKeys.forEach(key => {
            finalError[key] = meaningfulError[key];
          });
          console.error('❌ API Error:', finalError);
        }
      } catch (logError) {
        // Silently fail - don't log if logging itself fails
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============

/**
 * Authentication API endpoints
 * @namespace authAPI
 */
export const authAPI = {
  /** Register new user account */
  register: (data) => api.post('/auth/register', data),
  /** Login with email and password */
  login: (email, password) => api.post('/auth/login', { email, password }),
  /** Logout current user */
  logout: () => api.post('/auth/logout'),
  /** Get current user profile */
  me: () => api.get('/auth/me'),
  /** Update user password */
  updatePassword: (password) => api.put('/auth/update-password', { password }),
  /** Request password reset email */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  /** Reset password with token */
  resetPassword: (password) => api.post('/auth/reset-password', { password }),
  /** Refresh access token */
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
};

// ============ USERS ENDPOINTS ============

export const usersAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  getProfile: (id) => api.get(`/users/${id}/profile`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};


// ============ ASSESSMENT ENDPOINTS ============

/**
 * Assessment API endpoints for DISC + RIASEC personality tests
 * @namespace assessmentAPI
 */
export const assessmentAPI = {
  /** Get 24 questions (12 DISC + 12 RIASEC) */
  startAssessment: () => api.get('/assessment/start'),
  /** Submit assessment responses. Supports simplified and complex formats */
  submitAssessment: (data) => api.post('/assessment/submit', data),
  /** Get assessment results (requires auth) */
  getResults: () => api.get('/assessment/results'),
  /** Check AI analysis status (requires auth) */
  checkStatus: () => api.get('/assessment/status'),
  /** Get detailed job fit analysis (requires auth) */
  getJobFitDetails: (jobId) => api.get(`/assessment/job-fit/${jobId}`),
  /** Trigger AI analysis refresh (requires auth) */
  refreshAIAnalysis: () => api.post('/assessment/refresh-ai'),
  /** Submit hard skill assessment results (requires auth) */
  submitHardSkillAssessment: (data) => api.post('/assessment/hard-skill', data),
};

// ============ JOBS ENDPOINTS ============
export const jobsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/jobs?page=${page}&limit=${limit}`),
  getAllWithSkills: () => api.get('/jobs/skills/all'),
  getByRoleAndLevel: (roleCategory, level) => 
    api.get(`/jobs/${encodeURIComponent(roleCategory)}/${encodeURIComponent(level)}`),
  getAllSkillsByRole: (roleCategory) => 
    api.get(`/jobs/${encodeURIComponent(roleCategory)}/all-skills`),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ============ SKILLUP (SKILLS) ENDPOINTS ============
export const skillupAPI = {
  getAll: (page = 1, limit = 10, level = null) => {
    let url = `/skills?page=${page}&limit=${limit}`;
    if (level) url += `&level=${level}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// ============ PERSONALIZED ENDPOINTS ============
export const personalizedAPI = {
  getByUserId: (userId, page = 1, limit = 10) =>
    api.get(`/personalized/user/${userId}?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/personalized/${id}`),
  getWithRecs: (id) => api.get(`/personalized/${id}/recommendations`),
  create: (data) => api.post('/personalized', data),
  update: (id, data) => api.put(`/personalized/${id}`, data),
  refreshAIAnalysis: (id, analysisType = 'summary') => 
    api.post(`/personalized/${id}/refresh-ai?analysis_type=${analysisType}`),
};

// ============ RECOMMENDATIONS ENDPOINTS ============

/**
 * Recommendations API for jobs and skills
 * @namespace recommendationsAPI
 */
export const recommendationsAPI = {
  /** Get job recommendations for a personalization record */
  getJobRecommendations: (recId, page = 1, limit = 10) =>
    api.get(`/recommendations/jobs/${recId}?page=${page}&limit=${limit}`),
  /** Add job recommendation */
  addJobRecommendation: (data) => api.post('/recommendations/jobs', data),
  /** Remove job recommendation */
  removeJobRecommendation: (repId) => api.delete(`/recommendations/jobs/${repId}`),
  
  /** Get skill recommendations for a personalization record */
  getSkillRecommendations: (recId, page = 1, limit = 10) =>
    api.get(`/recommendations/skills/${recId}?page=${page}&limit=${limit}`),
  /** Add skill recommendation */
  addSkillRecommendation: (data) => api.post('/recommendations/skills', data),
  /** Remove skill recommendation */
  removeSkillRecommendation: (reskillId) => api.delete(`/recommendations/skills/${reskillId}`),
};

export default api;