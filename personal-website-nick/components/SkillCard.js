import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Create a local theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function SkillCard({ skillName, iconName }) {
  const cardStyle = {
    width: '120px', // Fixed width for each card
    display: 'inline-block',
    textAlign: 'center',
    margin: '10px',
    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
    '&:hover': {
      transform: 'scale(1.1)', // Scales the card up slightly on hover
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={cardStyle}>
        <CardContent>
          <i className={`bi ${iconName}`} style={{ fontSize: '2rem' }}></i>
          <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
            {skillName}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

