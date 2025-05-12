import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, CssBaseline, AppBar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import FeedIcon from '@mui/icons-material/Feed'; // Example Icon
import StorefrontIcon from '@mui/icons-material/Storefront'; // Example Icon
import KervLogo from '../assets/kerv-logo.png'; // Import the logo

const drawerWidth = 240;

const Layout = ({ children, theme }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Product Catalog Status', path: '/', icon: <FeedIcon /> },
    { text: 'eCommerce Status', path: '/ecommerce', icon: <StorefrontIcon /> },
  ];

  // Find the current page title based on the path
  const currentPage = menuItems.find(item => item.path === location.pathname);
  const pageTitle = currentPage ? currentPage.text : '';

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
          {/* Display the current page title */}
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            {pageTitle}
          </Typography>
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