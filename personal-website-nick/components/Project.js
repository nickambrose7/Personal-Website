import * as React from 'react';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Project({ title, description, mediaUrl, projectUrl }) {
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isVideo = mediaUrl && mediaUrl.endsWith('.mp4');
  const shouldAutoplay = windowWidth > 768; // Autoplay only on larger screens

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ maxWidth: 1200 }}>
        {isVideo ? (
          <video
            style={{ width: '100%', height: windowWidth < 768 ? 200 : 400, objectFit: 'cover', marginTop: '0px' }}
            src={mediaUrl}
            title={title}
            loop
            muted
            autoPlay={shouldAutoplay}
          />
        ) : (
          <CardMedia
            sx={{
              height: windowWidth < 768 ? 200 : 450, // Adjust height based on screen width
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.05)' },
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            image={mediaUrl}
            title={title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ fontSize: '1rem' }}>
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


