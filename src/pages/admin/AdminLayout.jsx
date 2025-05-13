import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

const AdminLayout = () => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    // Navigate to login or public page. For simplicity, navigate to login.
    // A proper app might navigate to the main site's homepage.
    window.location.href = '/admin/login'; // Force reload to clear state if any
  };

  if (!isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the admin dashboard.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If the stray characters {/* */} were due to a rendering issue at the top level,
  // this clean AdminLayout should help. If they persist, the issue is within
  // the specific child page components (AdminDashboard, etc.).

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#333' }}> {/* Simple dark AppBar for admin */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8' }}>
        <Outlet /> {/* This is where the nested admin route components will render */}
      </Box>
    </Box>
  );
};

export default AdminLayout; 