import axios from 'axios';

// Gunakan proxy Next.js (/api) agar semua request lewat localhost:3000
const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updatePassword: (password) => api.put('/auth/update-password', { password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (password) => api.post('/auth/reset-password', { password }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
};

// ============ USERS ENDPOINTS ============

export const usersAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============ SKILL QUESTIONS ENDPOINTS ============
export const skillQuestionsAPI = {
  getAll: (page = 1, limit = 12, roleCategory = null) => {
    let url = `/skill-questions?page=${page}&limit=${limit}`;
    if (roleCategory) url += `&role_category=${encodeURIComponent(roleCategory)}`;
    return api.get(url);
  },
  getByRole: (roleCategory) =>
    api.get(`/assessment/generate-questions?role_category=${encodeURIComponent(roleCategory)}`),
  getCategories: () => api.get('/skill-questions/categories'),
  getById: (id) => api.get(`/skill-questions/${id}`),
  create: (data) => api.post('/skill-questions', data),
  update: (id, data) => api.put(`/skill-questions/${id}`, data),
  delete: (id) => api.delete(`/skill-questions/${id}`),
};

// ============ ASSESSMENT ENDPOINTS ============
export const assessmentAPI = {
  generateQuestions: () => api.get('/assessment/generate-questions'),
  submitAssessment: (data) => api.post('/assessment/submit', data),
  // Legacy aliases for backward compatibility
  submitAnswers: (data) => api.post('/assessment/submit', data),
  getResults: () => api.get('/assessment/results'),
  checkStatus: () => api.get('/assessment/status'),
  refreshAIAnalysis: () => api.post('/assessment/refresh-ai'),
};

// ============ PEKERJAAN ENDPOINTS ============
export const pekerjaanAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/jobs?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ============ JOB SKILLS ENDPOINTS ============
export const jobSkillsAPI = {
  getByRoleAndLevel: (role, level) =>
    api.get(`/jobs/${encodeURIComponent(role)}/${encodeURIComponent(level)}`),
  getByRole: (role) =>
    api.get(`/jobs/${encodeURIComponent(role)}/all-skills`),
  getAll: () => api.get('/jobs/skills/all'),
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
};

// ============ REC PEKERJAAN ENDPOINTS ============
export const recPekerjaanAPI = {
  getByRecId: (recId, page = 1, limit = 10) =>
    api.get(`/recommendations/jobs/${recId}?page=${page}&limit=${limit}`),
  add: (data) => api.post('/recommendations/jobs', data),
  remove: (id) => api.delete(`/recommendations/jobs/${id}`),
};

export const recSkillupAPI = {
  getByRecId: (recId, page = 1, limit = 10) =>
    api.get(`/recommendations/skills/${recId}?page=${page}&limit=${limit}`),
  add: (data) => api.post('/recommendations/skills', data),
  remove: (id) => api.delete(`/recommendations/skills/${id}`),
};

// ============ PROFILE ENDPOINTS ============
export const profileAPI = {
  getComplete: (userId) => api.get(`/users/${userId}/profile`),
};

export default api;