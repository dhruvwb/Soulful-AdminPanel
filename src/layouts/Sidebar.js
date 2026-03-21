import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExploreIcon from '@mui/icons-material/Explore';
import PlaceIcon from '@mui/icons-material/Place';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BuildIcon from '@mui/icons-material/Build';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'India Tours', icon: <ExploreIcon />, path: '/india-tours' },
  { label: 'Destinations', icon: <PlaceIcon />, path: '/destinations' },
  { label: 'Packages', icon: <Inventory2Icon />, path: '/packages' },
  { label: 'Customized Tour Package', icon: <BuildIcon />, path: '/customized-tour-package' },
  { label: 'News', icon: <CampaignIcon />, path: '/news' },
  { label: 'Blogs', icon: <ArticleIcon />, path: '/blogs' },
  { label: 'Our Gallery', icon: <PhotoLibraryIcon />, path: '/gallery' },
  { label: 'About Us', icon: <InfoOutlinedIcon />, path: '/about-us' }
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: 'white',
          paddingTop: 2
        }
      }}
    >
      <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
          Soulful India Tours
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              to={item.path}
              key={item.label}
              style={{ textDecoration: 'none' }}
            >
              <ListItemButton
                sx={{
                  backgroundColor: isActive ? '#f1f3f5' : 'transparent',
                  color: isActive ? '#1f2937' : '#374151',
                  borderRadius: 1,
                  marginX: 1,
                  marginY: 0.5,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#1f2937' : '#6b7280' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </NavLink>
          );
        })}
        <Divider sx={{ marginY: 2 }} />
        <ListItemButton
          sx={{
            color: 'red',
            marginX: 1,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'white'
            }
          }}
          onClick={logout}
        >
          <ListItemIcon sx={{ color: 'red' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
