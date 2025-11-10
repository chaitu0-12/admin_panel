import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  verifyToken: () => api.get('/admin/verify'),
};

// ==================== USERS APIs ====================
export const usersAPI = {
  // Students
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  updateStudent: (id, data) => api.patch(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Seniors
  getSeniors: (params) => api.get('/admin/seniors', { params }),
  getSeniorById: (id) => api.get(`/admin/seniors/${id}`),
  updateSenior: (id, data) => api.patch(`/admin/seniors/${id}`, data),
  deleteSenior: (id) => api.delete(`/admin/seniors/${id}`),
  
  // Donators
  getDonators: (params) => api.get('/admin/donations', { params }),
};

// ==================== ANALYTICS APIs ====================
export const analyticsAPI = {
  getDashboardStats: () => api.get('/admin/analytics/dashboard'),
  getUserActivity: (params) => api.get('/admin/analytics/activity', { params }),
  getDailyVisits: (params) => api.get('/admin/analytics/visits', { params }),
  getEngagementMetrics: () => api.get('/admin/analytics/engagement'),
  getDonationStats: () => api.get('/admin/analytics/donations'),
};

// ==================== DONATIONS APIs ====================
export const donationsAPI = {
  getAllDonations: (params) => api.get('/admin/donations', { params }),
  getDonationById: (id) => api.get(`/admin/donations/${id}`),
  updateDonationStatus: (id, status) => api.patch(`/admin/donations/${id}`, { status }),
};

// ==================== REQUESTS APIs ====================
export const requestsAPI = {
  getAllRequests: (params) => api.get('/admin/requests', { params }),
  getRequestById: (id) => api.get(`/admin/requests/${id}`),
  updateRequestStatus: (id, status) => api.patch(`/admin/requests/${id}`, { status }),
};

export default api;
