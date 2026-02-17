/**
 * IAS API Service Layer
 * ─────────────────────────────────────────────────────────────────
 * All backend communication is centralised here.
 * Components never make direct fetch/axios calls — they use these
 * service functions. This means swapping your backend URL or auth
 * strategy only requires changes in this file.
 *
 * Base URL is read from VITE_API_URL in your .env.local file.
 * In development, Vite proxies /api/* to that URL (see vite.config.js).
 */

import axios from 'axios'

// In production, use full backend URL so /api requests hit your server (not the frontend host).
// In dev, use /api and Vite proxy forwards to VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ─── Request interceptor — attach auth token ───────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ias_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response interceptor — handle 401 globally ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / not authenticated → go to landing so user can sign in
      localStorage.removeItem('ias_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// ══════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════
export const authService = {
  register:   (data)        => api.post('/auth/register', data),
  login:      (credentials) => api.post('/auth/login', credentials),
  loginGoogle: (idToken)    => api.post('/auth/google', { idToken }),
  logout:     ()            => api.post('/auth/logout'),
  me:         ()            => api.get('/auth/me'),
  refresh:    ()            => api.post('/auth/refresh'),
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
export const dashboardService = {
  getStats:    ()       => api.get('/dashboard/stats'),
  getActivity: (limit) => api.get('/dashboard/activity', { params: { limit } }),
}

// ══════════════════════════════════════════════════════════════
// OPPORTUNITIES
// ══════════════════════════════════════════════════════════════
export const opportunityService = {
  getAll:       (params) => api.get('/opportunities', { params }),
  getById:      (id)     => api.get(`/opportunities/${id}`),
  getRecommended: ()    => api.get('/opportunities/recommended'),
  save:         (id)     => api.post(`/opportunities/${id}/save`),
  unsave:       (id)     => api.delete(`/opportunities/${id}/save`),
  getSaved:     ()       => api.get('/opportunities/saved'),
  getAdminAll:  (params) => api.get('/opportunities/admin/all', { params }),
  create:       (data)   => api.post('/opportunities', data),
  update:       (id, d)  => api.patch(`/opportunities/${id}`, d),
}

// ══════════════════════════════════════════════════════════════
// APPLICATIONS
// ══════════════════════════════════════════════════════════════
export const applicationService = {
  getAll:       (params) => api.get('/applications', { params }),
  getById:     (id)     => api.get(`/applications/${id}`),
  create:      (payload) => {
    if (payload instanceof FormData) {
      return api.post('/applications', payload);
    }
    const form = new FormData();
    if (payload.opportunityId != null) form.append('opportunityId', payload.opportunityId);
    if (payload.coverLetter != null) form.append('coverLetter', payload.coverLetter);
    if (payload.phoneNumber != null) form.append('phoneNumber', payload.phoneNumber);
    if (payload.resume instanceof File) form.append('resume', payload.resume);
    if (payload.recommendationLetter instanceof File) form.append('recommendationLetter', payload.recommendationLetter);
    return api.post('/applications', form);
  },
  pay:         (id, data) => api.post(`/applications/${id}/pay`, data),
  update:      (id, d)  => api.patch(`/applications/${id}`, d),
  withdraw:    (id)     => api.delete(`/applications/${id}`),
  getAllAdmin: (params) => api.get('/applications/admin/all', { params }),
}

// ══════════════════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════════════════
export const profileService = {
  get:    ()       => api.get('/profile'),
  update: (data)   => api.patch('/profile', data),
  uploadCV: (file) => {
    const form = new FormData()
    form.append('cv', file)
    return api.post('/profile/cv', form)
  },
}

// ══════════════════════════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════════════════════════
export const messageService = {
  getAll:  ()          => api.get('/messages'),
  getById: (id)        => api.get(`/messages/${id}`),
  send:    (data)      => api.post('/messages', data),
  markRead:(id)        => api.patch(`/messages/${id}/read`),
}

export default api
