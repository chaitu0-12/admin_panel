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
import { Search, Visibility, Elderly, Email, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import StatsCard from '../components/common/StatsCard';
import { usersAPI } from '../services/api';

export default function SeniorsPage() {
  const [loading, setLoading] = useState(true);
  const [seniors, setSeniors] = useState([]);
  const [filteredSeniors, setFilteredSeniors] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withEmergencyContact: 0,
    avgAge: 0,
  });

  useEffect(() => {
    fetchSeniors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSeniors(seniors);
    } else {
      const filtered = seniors.filter((senior) =>
        senior.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        senior.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSeniors(filtered);
    }
    setPage(0);
  }, [searchQuery, seniors]);

  const fetchSeniors = async () => {
    try {
      const response = await usersAPI.getSeniors();
      const seniorData = response.data.data || response.data;
      setSeniors(seniorData);
      setFilteredSeniors(seniorData);
      
      // Calculate stats
      const total = seniorData.length;
      const withEmergencyContact = seniorData.filter(s => 
        s.policeContact || s.ambulanceContact || s.phone1
      ).length;
      const avgAge = seniorData.reduce((sum, s) => sum + (s.age || 0), 0) / total || 0;
      
      setStats({ total, withEmergencyContact, avgAge: avgAge.toFixed(0) });
    } catch (error) {
      toast.error('Failed to load seniors');
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

  const handleViewDetails = (senior) => {
    setSelectedSenior(senior);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedSenior(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading seniors..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Senior Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Seniors"
            value={stats.total}
            icon={<Elderly sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="With Emergency Contact"
            value={stats.withEmergencyContact}
            icon={<Phone sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Average Age"
            value={`${stats.avgAge} years`}
            icon={<Elderly sx={{ fontSize: 32 }} />}
            color="warning"
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
                placeholder="Search by name or email..."
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

            {filteredSeniors.length === 0 ? (
              <EmptyState
                icon={<Elderly sx={{ fontSize: 80 }} />}
                title="No seniors found"
                description={searchQuery ? 'Try adjusting your search criteria' : 'No seniors have registered yet'}
              />
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Senior</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell align="center">Age</TableCell>
                        <TableCell>Emergency Contacts</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredSeniors
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((senior) => (
                          <TableRow key={senior.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  }}
                                >
                                  {senior.fullName.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {senior.fullName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {senior.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption">{senior.email}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${senior.age} years`} size="small" color="default" />
                            </TableCell>
                            <TableCell>
                              <Box>
                                {senior.policeContact && (
                                  <Chip label="Police" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                )}
                                {senior.ambulanceContact && (
                                  <Chip label="Ambulance" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                )}
                                {senior.phone1 && (
                                  <Chip label="Contact 1" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {senior.createdAt ? format(new Date(senior.createdAt), 'MMM dd, yyyy') : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(senior)}
                                sx={{ color: 'success.main' }}
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
                  count={filteredSeniors.length}
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
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Senior Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSenior && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    fontSize: '2.5rem',
                  }}
                >
                  {selectedSenior.fullName.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {selectedSenior.fullName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedSenior.email}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Age</Typography>
                <Typography variant="body1" gutterBottom>{selectedSenior.age} years</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                  Emergency Contacts
                </Typography>
              </Grid>
              
              {selectedSenior.policeContact && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Police Contact</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSenior.policeContact}</Typography>
                </Grid>
              )}
              
              {selectedSenior.ambulanceContact && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Ambulance Contact</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSenior.ambulanceContact}</Typography>
                </Grid>
              )}
              
              {selectedSenior.phone1 && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Contact 1</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSenior.phone1}</Typography>
                </Grid>
              )}
              
              {selectedSenior.phone2 && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Contact 2</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSenior.phone2}</Typography>
                </Grid>
              )}
              
              {selectedSenior.phone3 && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Contact 3</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSenior.phone3}</Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Joined Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSenior.createdAt ? format(new Date(selectedSenior.createdAt), 'MMMM dd, yyyy') : 'N/A'}
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
