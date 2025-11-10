import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';

export default function UsersPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    // Navigate to specific pages instead of embedding them
    switch(newValue) {
      case 0:
        navigate('/students');
        break;
      case 1:
        navigate('/seniors');
        break;
      case 2:
        navigate('/donators');
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        User Management
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select a user type to manage:
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Students" />
          <Tab label="Seniors" />
          <Tab label="Donators" />
        </Tabs>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        Click a tab above to view and manage that user type.
      </Typography>
    </Box>
  );
}
