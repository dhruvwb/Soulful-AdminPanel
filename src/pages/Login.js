import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const result = await login(form.email.trim(), form.password);
    if (result.ok) {
      navigate('/dashboard', { replace: true });
      return;
    }
    setError(result.message);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fb 0%, #eef2f7 100%)',
        padding: 3
      }}
    >
      <Card sx={{ width: 420, boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 1 }}>
            Soulful India Tours
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 3, color: '#5f6b7a' }}>
            Admin panel access
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              type="email"
              required
            />
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              type="password"
              required
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" size="large">
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
