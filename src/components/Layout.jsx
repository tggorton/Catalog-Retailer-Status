import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, CssBaseline, AppBar, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FeedIcon from '@mui/icons-material/Feed'; // Example Icon
import StorefrontIcon from '@mui/icons-material/Storefront'; // Example Icon
import KervLogo from '../assets/kerv-logo.png'; // Import the logo
import { Link as RouterLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; // Added LogoutIcon

const drawerWidth = 240;

const Layout = ({ children, theme }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const isInAdminSection = location.pathname.startsWith('/admin');

  const menuItems = [
    { text: 'Product Catalog Status', path: '/', icon: <FeedIcon /> },
    { text: 'eCommerce Status', path: '/ecommerce', icon: <StorefrontIcon /> },
  ];

  let pageTitle = '';
  if (isInAdminSection) {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
        pageTitle = 'Admin Dashboard';
    } else if (location.pathname === '/admin/product-catalog') {
        pageTitle = 'Admin - Product Catalog';
    } else if (location.pathname === '/admin/ecommerce') {
        pageTitle = 'Admin - eCommerce';
    } else {
        pageTitle = 'Admin Panel';
    }
  } else {
    const currentPage = menuItems.find(item => item.path === location.pathname);
    pageTitle = currentPage ? currentPage.text : 'KERV Dashboard';
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#fff', // White background for AppBar
          color: '#000', // Black text color
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)', // Subtle shadow
        }}
      >
        <Toolbar>
          <img src={KervLogo} alt="KERV Logo" style={{ height: '40px', marginRight: '15px' }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          {isAuthenticated && isInAdminSection ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                color: '#000',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'rgba(0, 0, 0, 0.5)',
                }
              }}
              variant="outlined"
            >
              Logout
            </Button>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/admin"
              sx={{ 
                color: '#000',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'rgba(0, 0, 0, 0.5)',
                }
              }}
              variant="outlined"
            >
              Admin
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
             width: drawerWidth,
             boxSizing: 'border-box',
             backgroundColor: '#f8f9fa', // Light grey background for Drawer
             borderRight: '1px solid #dee2e6' // Subtle border
            },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'auto', paddingTop: '10px' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(237, 0, 94, 0.1)', // Primary color tint on selection
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: 'rgba(237, 0, 94, 0.15)',
                      },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Subtle hover
                    },
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px', color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                    }}
                   />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#fff' }}>
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 