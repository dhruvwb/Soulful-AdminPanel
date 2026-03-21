import { Card, CardContent, Typography } from '@mui/material';

export default function StatCard({ label, value, color }) {
  return (
    <Card sx={{ backgroundColor: color, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
