import { Box, Typography, Button } from '@mui/material';
import { Inbox } from '@mui/icons-material';

export default function EmptyState({ 
  icon = <Inbox sx={{ fontSize: 80 }} />, 
  title = 'No data available',
  description = 'There is nothing to display here yet.',
  action,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }}>
        {icon}
      </Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
