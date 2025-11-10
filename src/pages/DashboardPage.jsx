import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { School, Elderly, VolunteerActivism, Assignment, TrendingUp, People } from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      // Set mock data for demonstration
      setStats({
        totalStudents: 248,
        totalSeniors: 156,
        totalDonators: 89,
        totalRequests: 432,
        activeRequests: 45,
        completedRequests: 387,
        totalDonations: 125000,
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
          { name: 'Students', value: 248 },
          { name: 'Seniors', value: 156 },
          { name: 'Donators', value: 89 },
        ],
        requestsByStatus: [
          { status: 'Pending', count: 45 },
          { status: 'In Progress', count: 78 },
          { status: 'Completed', count: 387 },
          { status: 'Cancelled', count: 22 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<School sx={{ fontSize: 32 }} />}
            trend={stats.trends.students}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Seniors"
            value={stats.totalSeniors}
            icon={<Elderly sx={{ fontSize: 32 }} />}
            trend={stats.trends.seniors}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Donators"
            value={stats.totalDonators}
            icon={<VolunteerActivism sx={{ fontSize: 32 }} />}
            trend={stats.trends.donators}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={<Assignment sx={{ fontSize: 32 }} />}
            trend={stats.trends.requests}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Activity Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Weekly Activity
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#667eea" strokeWidth={2} />
                    <Line type="monotone" dataKey="seniors" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="requests" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* User Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Request Status Chart */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Requests by Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.requestsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                        <stop offset="100%" stopColor="#764ba2" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
