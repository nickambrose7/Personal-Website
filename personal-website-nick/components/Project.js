import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

// Create a local dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Project({ title, description, mediaUrl, projectUrl}) {
  // Determine if the mediaUrl is a video or an image
  const isVideo = mediaUrl && mediaUrl.endsWith('.mp4');

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ maxWidth: 1000 }}>
        {isVideo ? (
          <video
            style={{ height: 400, width: '100%', objectFit: 'cover', objectPosition: '50% 50', marginTop: '0px' }}
            src={mediaUrl}
            title={title}
            loop
            muted
            autoPlay
          />
        ) : (
          <CardMedia
            sx={{
              height: 450,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.05)' }
            }}
            image={mediaUrl}
            title={title}
          />
        )}
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




