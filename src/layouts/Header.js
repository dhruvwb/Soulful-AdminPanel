import { AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const titleMap = {
    '/dashboard': 'Dashboard',
    '/india-tours': 'India Tours',
    '/destinations': 'Destinations',
    '/packages': 'Packages',
    '/customized-tour-package': 'Customized Tour Package',
    '/news': 'News',
    '/blogs': 'Blogs',
    '/gallery': 'Our Gallery',
    '/about-us': 'About Us'
  };

  const pageTitle = titleMap[path] || 'Dashboard';

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#fff', color: '#1f2937', boxShadow: 'none', borderBottom: '1px solid #eee' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {pageTitle}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome back!
          </Typography>
          <Avatar sx={{ bgcolor: '#f04b00', width: 36, height: 36 }}>
            {user?.name?.slice(0, 1) || 'A'}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
