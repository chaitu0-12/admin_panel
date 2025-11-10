import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import { Search, Visibility, VolunteerActivism, Phone, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import StatsCard from '../components/common/StatsCard';
import { usersAPI } from '../services/api';

export default function DonatorsPage() {
  const [loading, setLoading] = useState(true);
  const [donators, setDonators] = useState([]);
  const [filteredDonators, setFilteredDonators] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalAmount: 0,
    avgDonation: 0,
    completedDonations: 0,
  });

  useEffect(() => {
    fetchDonators();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDonators(donators);
    } else {
      const filtered = donators.filter((donation) =>
        donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.phone.includes(searchQuery)
      );
      setFilteredDonators(filtered);
    }
    setPage(0);
  }, [searchQuery, donators]);

  const fetchDonators = async () => {
    try {
      const response = await usersAPI.getDonators();
      const donationData = response.data.data || response.data;
      setDonators(donationData);
      setFilteredDonators(donationData);
      
      // Calculate stats
      const totalDonors = donationData.length;
      const totalAmount = donationData.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const avgDonation = totalAmount / totalDonors || 0;
      const completedDonations = donationData.filter(d => d.status === 'completed').length;
      
      setStats({
        totalDonors,
        totalAmount: totalAmount.toFixed(2),
        avgDonation: avgDonation.toFixed(2),
        completedDonations,
      });
    } catch (error) {
      toast.error('Failed to load donations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDonation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading donations..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Donator Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Donors"
            value={stats.totalDonors}
            icon={<VolunteerActivism sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Amount"
            value={`₹${stats.totalAmount}`}
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Average Donation"
            value={`₹${stats.avgDonation}`}
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats.completedDonations}
            icon={<VolunteerActivism sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Main Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {filteredDonators.length === 0 ? (
              <EmptyState
                icon={<VolunteerActivism sx={{ fontSize: 80 }} />}
                title="No donations found"
                description={searchQuery ? 'Try adjusting your search criteria' : 'No donations have been made yet'}
              />
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Donor</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDonators
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((donation) => (
                          <TableRow key={donation.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                  }}
                                >
                                  {donation.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {donation.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {donation.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption">{donation.phone}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={donation.gender} 
                                size="small" 
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                ₹{parseFloat(donation.amount).toLocaleString('en-IN')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={donation.paymentMethod.toUpperCase()} 
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={donation.status}
                                size="small"
                                color={getStatusColor(donation.status)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(donation)}
                                sx={{ color: 'warning.main' }}
                              >
                                <Visibility />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredDonators.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Donation Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDonation && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    fontSize: '2rem',
                  }}
                >
                  {selectedDonation.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {selectedDonation.name}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedDonation.phone}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Gender</Typography>
                <Typography variant="body1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {selectedDonation.gender}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Amount</Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                  ₹{parseFloat(selectedDonation.amount).toLocaleString('en-IN')}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                  {selectedDonation.paymentMethod}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedDonation.status}
                    size="small"
                    color={getStatusColor(selectedDonation.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedDonation.upiTransactionId || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Donation Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {format(new Date(selectedDonation.created_at), 'MMMM dd, yyyy HH:mm')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
