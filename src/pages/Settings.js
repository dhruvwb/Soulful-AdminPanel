import { Box, Paper, Stack, Typography } from '@mui/material';
import { ADMIN_SEED } from '../constants/adminSeed';

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Admin access details and environment notes.
      </Typography>

      <Paper sx={{ marginTop: 3, padding: 3, borderRadius: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Default Admin Email</Typography>
          <Typography>{ADMIN_SEED.email}</Typography>
          <Typography variant="subtitle2">Role</Typography>
          <Typography>{ADMIN_SEED.role}</Typography>
          <Typography variant="body2" color="text.secondary">
            Update backend APIs to enforce role-based access and JWT auth in production.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
