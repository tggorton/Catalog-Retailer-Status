import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';
import AuthWrapper from './components/AuthWrapper';
import ProductCatalogStatus from './pages/ProductCatalogStatus';
import ECommerceStatus from './pages/ECommerceStatus';
import LoginPage from './pages/LoginPage';
import { DataProvider } from './context/DataContext';
import { LogProvider } from './context/LogContext';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductCatalog from './pages/admin/AdminProductCatalog';
import AdminECommerce from './pages/admin/AdminECommerce';
import AdminLogPage from './pages/admin/AdminLogPage';

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ED005E', // KERV Magenta
    },
    // Add other palette customizations if needed
  },
  // typography: {
  //   fontFamily: '"Open Sans", sans-serif',
  //   // Define other typography styles if needed
  // },
  components: {
    // Override component styles globally if needed
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            // Ensure selected styles are applied correctly even without direct theme access in Layout
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LogProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Main App Routes wrapped in Layout */}
              <Route path="/*" element={
                <Layout theme={theme}>
                  <Routes>
                    <Route path="/" element={<ProductCatalogStatus />} />
                    <Route path="/ecommerce" element={<ECommerceStatus />} />
                    {/* Admin Pages - wrapped by AuthWrapper AND Layout */}
                    <Route 
                      path="/admin"
                      element={<AuthWrapper><AdminDashboard /></AuthWrapper>} 
                    />
                    <Route 
                      path="/admin/product-catalog"
                      element={<AuthWrapper><AdminProductCatalog /></AuthWrapper>} 
                    />
                    <Route 
                      path="/admin/ecommerce"
                      element={<AuthWrapper><AdminECommerce /></AuthWrapper>} 
                    />
                    <Route 
                      path="/admin/log"
                      element={<AuthWrapper><AdminLogPage /></AuthWrapper>} 
                    />
                    <Route path="*" element={<ProductCatalogStatus />} /> {/* Default for main app */}
                  </Routes>
                </Layout>
              } />
            </Routes>
          </Router>
        </DataProvider>
      </LogProvider>
    </ThemeProvider>
  );
}

export default App;
