'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia, CircularProgress, Box } from '@mui/material';

export default function Home() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5094/weatherforecast')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setForecast(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <Container sx={{ padding: '2rem' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Weather Forecast
      </Typography>
      <Grid container spacing={4}>
        {forecast.map((day, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardMedia
                component="img"
                height="140"
                image={`https://via.placeholder.com/400x140.png?text=${day.summary}`}
                alt={day.summary}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {day.date}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Temperature: {day.temperatureC}°C / {day.temperatureF}°F
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Summary: {day.summary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}