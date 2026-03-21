import { Box, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import StatCard from '../components/StatCard';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const { stats } = useData();

  const popular = stats.popularDestinations || [];
  const maxValue = Math.max(...popular.map(item => item.enquiriesCount || 0), 1);

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Total Enquiries" value={stats.totalEnquiries} color="#ffffff" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Total Users" value={stats.totalVisitors} color="#ffffff" />
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Popular Destinations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on enquiries received
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {popular.map(item => (
            <Box key={item.name}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#f04b00'
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.enquiriesCount} enquiries
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.round((item.enquiriesCount / maxValue) * 100)}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: '#eef0f2',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    backgroundColor: '#f04b00'
                  }
                }}
              />
            </Box>
          ))}
          {popular.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No destination data yet.
            </Typography>
          )}
        </Stack>
      </Paper>
    </>
  );
}
