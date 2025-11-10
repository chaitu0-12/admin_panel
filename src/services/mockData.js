// Mock data for static admin panel

// Mock students data
export const mockStudents = [
  {
    id: 1,
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+91 9876543210',
    college: 'IIT Delhi',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    status: 'active',
    registeredAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 9876543211',
    college: 'Delhi University',
    course: 'B.A. Economics',
    year: '2nd Year',
    status: 'active',
    registeredAt: '2024-01-20T14:20:00Z',
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 9876543212',
    college: 'BITS Pilani',
    course: 'B.E. Mechanical',
    year: '4th Year',
    status: 'inactive',
    registeredAt: '2024-02-10T09:15:00Z',
  },
];

// Mock seniors data
export const mockSeniors = [
  {
    id: 1,
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    phone: '+91 9876543220',
    age: 68,
    address: 'Sector 15, Noida',
    status: 'active',
    registeredAt: '2024-01-10T11:00:00Z',
  },
  {
    id: 2,
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    phone: '+91 9876543221',
    age: 72,
    address: 'Connaught Place, Delhi',
    status: 'active',
    registeredAt: '2024-01-25T16:45:00Z',
  },
  {
    id: 3,
    name: 'Mohan Lal',
    email: 'mohan.lal@example.com',
    phone: '+91 9876543222',
    age: 65,
    address: 'Dwarka, Delhi',
    status: 'active',
    registeredAt: '2024-02-05T10:30:00Z',
  },
];

// Mock donators data
export const mockDonators = [
  {
    id: 1,
    name: 'Tech Corp India',
    email: 'contact@techcorp.com',
    phone: '+91 9876543230',
    amount: 50000,
    date: '2024-03-01T10:00:00Z',
    status: 'completed',
  },
  {
    id: 2,
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    phone: '+91 9876543231',
    amount: 10000,
    date: '2024-03-05T14:30:00Z',
    status: 'completed',
  },
  {
    id: 3,
    name: 'Global Foundation',
    email: 'info@globalfoundation.org',
    phone: '+91 9876543232',
    amount: 100000,
    date: '2024-03-10T09:00:00Z',
    status: 'pending',
  },
];

// Mock requests data
export const mockRequests = [
  {
    id: 1,
    studentName: 'Rahul Kumar',
    seniorName: 'Rajesh Verma',
    type: 'Assistance Request',
    description: 'Need help with grocery shopping',
    status: 'pending',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 2,
    studentName: 'Priya Sharma',
    seniorName: 'Sunita Devi',
    type: 'Medical Support',
    description: 'Accompany to hospital appointment',
    status: 'approved',
    createdAt: '2024-03-14T11:30:00Z',
  },
  {
    id: 3,
    studentName: 'Amit Patel',
    seniorName: 'Mohan Lal',
    type: 'Tech Help',
    description: 'Setup smartphone and apps',
    status: 'completed',
    createdAt: '2024-03-10T15:00:00Z',
  },
];

// Mock dashboard stats
export const mockDashboardStats = {
  totalStudents: 156,
  totalSeniors: 89,
  totalDonators: 45,
  totalRequests: 432,
  activeRequests: 23,
  completedRequests: 387,
  totalDonations: 450000,
  trends: {
    students: { direction: 'up', value: '+12%' },
    seniors: { direction: 'up', value: '+8%' },
    donators: { direction: 'up', value: '+15%' },
    requests: { direction: 'down', value: '-5%' },
  },
  activityData: [
    { name: 'Mon', students: 45, seniors: 28, requests: 12 },
    { name: 'Tue', students: 52, seniors: 32, requests: 15 },
    { name: 'Wed', students: 48, seniors: 35, requests: 18 },
    { name: 'Thu', students: 61, seniors: 38, requests: 22 },
    { name: 'Fri', students: 55, seniors: 42, requests: 19 },
    { name: 'Sat', students: 38, seniors: 25, requests: 8 },
    { name: 'Sun', students: 32, seniors: 20, requests: 6 },
  ],
  userDistribution: [
    { name: 'Students', value: 156 },
    { name: 'Seniors', value: 89 },
    { name: 'Donators', value: 45 },
  ],
  requestsByStatus: [
    { status: 'Pending', count: 23 },
    { status: 'In Progress', count: 78 },
    { status: 'Completed', count: 387 },
    { status: 'Cancelled', count: 22 },
  ],
};

// Mock analytics data
export const mockAnalytics = {
  dailyVisits: [
    { date: '2024-03-01', visits: 120 },
    { date: '2024-03-02', visits: 145 },
    { date: '2024-03-03', visits: 132 },
    { date: '2024-03-04', visits: 168 },
    { date: '2024-03-05', visits: 155 },
    { date: '2024-03-06', visits: 178 },
    { date: '2024-03-07', visits: 190 },
  ],
  userActivity: [
    { name: 'Students', value: 156 },
    { name: 'Seniors', value: 89 },
    { name: 'Donators', value: 45 },
  ],
  donationStats: [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 180000 },
    { month: 'Mar', amount: 150000 },
  ],
  engagementMetrics: {
    totalInteractions: 1234,
    averageSessionTime: '12m 34s',
    returnRate: '68%',
  },
};
