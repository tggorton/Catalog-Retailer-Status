import React from 'react';
import { Typography, Paper, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PageviewIcon from '@mui/icons-material/Pageview';
import StorageIcon from '@mui/icons-material/Storage';
import ArticleIcon from '@mui/icons-material/Article';

const AdminDashboard = () => {
  return (
    <Paper sx={{ m: 2, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome to the KERV Product Feed Status Admin Panel. Please select an option below to manage the data.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
        <Button 
          component={RouterLink} 
          to="/admin/product-catalog" 
          variant="contained" 
          size="large"
          startIcon={<StorageIcon />} 
          sx={{ flexGrow: 1, py:2 }}
        >
          Manage Product Catalog
        </Button>
        <Button 
          component={RouterLink} 
          to="/admin/ecommerce" 
          variant="contained" 
          size="large"
          startIcon={<PageviewIcon />} 
          sx={{ flexGrow: 1, py:2  }}
        >
          Manage eCommerce Status
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Button 
          component={RouterLink} 
          to="/admin/log" 
          variant="outlined"
          size="large"
          startIcon={<ArticleIcon />} 
          sx={{ flexGrow: 1, py:2 }}
        >
          View Activity Log
        </Button>
      </Box>
      {/* Further sections or information can be added here if needed */}
    </Paper>
  );
};

export default AdminDashboard; 