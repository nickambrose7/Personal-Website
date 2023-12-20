import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

// Create a local dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Project({ title, description, imageUrl, projectUrl }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ maxWidth: 1000 }}>
        <CardMedia
          sx={{
            height: 300,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)', // Scales the image up slightly on hover
            }
          }}
          image={imageUrl}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={projectUrl} target="_blank">Learn More</Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

