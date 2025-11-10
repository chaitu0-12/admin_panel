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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  Box as MuiBox,
} from '@mui/material';
import { Search, Visibility, Assignment, Person, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import StatsCard from '../components/common/StatsCard';
import { requestsAPI } from '../services/api';

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter((request) =>
        request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
    setPage(0);
  }, [searchQuery, requests]);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAllRequests();
      const requestData = response.data;
      setRequests(requestData);
      setFilteredRequests(requestData);
      
      // Calculate stats
      const total = requestData.length;
      const pending = requestData.filter(r => r.status === 'pending').length;
      const inProgress = requestData.filter(r => r.status === 'in_progress').length;
      const completed = requestData.filter(r => r.status === 'completed').length;
      
      setStats({ total, pending, inProgress, completed });
    } catch (error) {
      toast.error('Failed to load requests');
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

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedRequest(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'in_progress':
      case 'assigned':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading requests..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Request Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Requests"
            value={stats.total}
            icon={<Assignment sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={<Assignment sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Assignment sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<Assignment sx={{ fontSize: 32 }} />}
            color="success"
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
                placeholder="Search requests..."
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

            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={<Assignment sx={{ fontSize: 80 }} />}
                title="No requests found"
                description={searchQuery ? 'Try adjusting your search criteria' : 'No requests have been submitted yet'}
              />
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Request ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Requested By</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((request) => (
                          <TableRow key={request.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                #{request.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {request.title || request.requestType || 'Untitled Request'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                  {request.requesterName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="body2">
                                  {request.requesterName || 'Unknown'}
                                </Typography>
                              </MuiBox>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={request.status || 'pending'}
                                size="small"
                                color={getStatusColor(request.status)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={request.priority || 'medium'}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {format(new Date(request.createdAt || new Date()), 'MMM dd, yyyy')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(request)}
                                sx={{ color: 'primary.main' }}
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
                  count={filteredRequests.length}
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
            Request Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {selectedRequest.title || selectedRequest.requestType || 'Untitled Request'}
                </Typography>
                <Chip
                  label={selectedRequest.status || 'pending'}
                  color={getStatusColor(selectedRequest.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Request ID</Typography>
                <Typography variant="body1" gutterBottom>#{selectedRequest.id}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Priority</Typography>
                <Typography variant="body1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {selectedRequest.priority || 'Medium'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Requested By</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.requesterName || 'Unknown'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Created Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {format(new Date(selectedRequest.createdAt || new Date()), 'MMMM dd, yyyy HH:mm')}
                </Typography>
              </Grid>
              
              {selectedRequest.description && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedRequest.description}
                  </Typography>
                </Grid>
              )}
              
              {selectedRequest.assignedTo && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.assignedTo}
                  </Typography>
                </Grid>
              )}
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
