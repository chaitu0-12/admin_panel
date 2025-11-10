import {
  mockStudents,
  mockSeniors,
  mockDonators,
  mockRequests,
  mockDashboardStats,
  mockAnalytics,
} from './mockData';

// Helper function to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create mock response
const mockResponse = (data) => ({ data });

// ==================== AUTH APIs ====================
export const authAPI = {
  login: async (credentials) => {
    await delay();
    // Accept any credentials for static demo
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: credentials.email,
      role: 'admin',
    };
    return mockResponse({
      token: 'mock-token-' + Date.now(),
      user: mockUser,
    });
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  verifyToken: async () => {
    await delay();
    return mockResponse({ valid: true });
  },
};

// ==================== USERS APIs ====================
export const usersAPI = {
  // Students
  getStudents: async (params) => {
    await delay();
    return mockResponse({
      data: mockStudents,
      total: mockStudents.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    });
  },
  getStudentById: async (id) => {
    await delay();
    const student = mockStudents.find(s => s.id === parseInt(id));
    return mockResponse(student);
  },
  updateStudent: async (id, data) => {
    await delay();
    const student = mockStudents.find(s => s.id === parseInt(id));
    return mockResponse({ ...student, ...data });
  },
  deleteStudent: async (id) => {
    await delay();
    return mockResponse({ success: true, id });
  },
  
  // Seniors
  getSeniors: async (params) => {
    await delay();
    return mockResponse({
      data: mockSeniors,
      total: mockSeniors.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    });
  },
  getSeniorById: async (id) => {
    await delay();
    const senior = mockSeniors.find(s => s.id === parseInt(id));
    return mockResponse(senior);
  },
  updateSenior: async (id, data) => {
    await delay();
    const senior = mockSeniors.find(s => s.id === parseInt(id));
    return mockResponse({ ...senior, ...data });
  },
  deleteSenior: async (id) => {
    await delay();
    return mockResponse({ success: true, id });
  },
  
  // Donators
  getDonators: async (params) => {
    await delay();
    return mockResponse({
      data: mockDonators,
      total: mockDonators.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    });
  },
};

// ==================== ANALYTICS APIs ====================
export const analyticsAPI = {
  getDashboardStats: async () => {
    await delay();
    return mockResponse(mockDashboardStats);
  },
  getUserActivity: async (params) => {
    await delay();
    return mockResponse(mockAnalytics.userActivity);
  },
  getDailyVisits: async (params) => {
    await delay();
    return mockResponse(mockAnalytics.dailyVisits);
  },
  getEngagementMetrics: async () => {
    await delay();
    return mockResponse(mockAnalytics.engagementMetrics);
  },
  getDonationStats: async () => {
    await delay();
    return mockResponse(mockAnalytics.donationStats);
  },
};

// ==================== DONATIONS APIs ====================
export const donationsAPI = {
  getAllDonations: async (params) => {
    await delay();
    return mockResponse({
      data: mockDonators,
      total: mockDonators.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    });
  },
  getDonationById: async (id) => {
    await delay();
    const donation = mockDonators.find(d => d.id === parseInt(id));
    return mockResponse(donation);
  },
  updateDonationStatus: async (id, status) => {
    await delay();
    const donation = mockDonators.find(d => d.id === parseInt(id));
    return mockResponse({ ...donation, status });
  },
};

// ==================== REQUESTS APIs ====================
export const requestsAPI = {
  getAllRequests: async (params) => {
    await delay();
    return mockResponse({
      data: mockRequests,
      total: mockRequests.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    });
  },
  getRequestById: async (id) => {
    await delay();
    const request = mockRequests.find(r => r.id === parseInt(id));
    return mockResponse(request);
  },
  updateRequestStatus: async (id, status) => {
    await delay();
    const request = mockRequests.find(r => r.id === parseInt(id));
    return mockResponse({ ...request, status });
  },
};
