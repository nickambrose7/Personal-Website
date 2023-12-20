import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
          sx={{ height: 300 }}
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
          {/* Add more actions or buttons if needed */}
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}
