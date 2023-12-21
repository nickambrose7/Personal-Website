import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons CSS
/*
    * This component is used to display a skill card with Bootstrap icons or devicons.
*/

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function SkillCard({ skillName, iconName, iconLibrary }) {
  const getIconClassName = () => {
    return iconLibrary === 'devicon' ? `${iconName} colored` : `bi ${iconName}`;
  };

  const cardStyle = {
    width: '130px',
    display: 'inline-block',
    textAlign: 'center',
    margin: '10px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={cardStyle}>
        <CardContent>
          <i className={getIconClassName()} style={{ fontSize: '3rem' }}></i>
          <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
            {skillName}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}



