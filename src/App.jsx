import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';
import ProductCatalogStatus from './pages/ProductCatalogStatus';
import ECommerceStatus from './pages/ECommerceStatus';

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
      <Router>
        <Layout theme={theme}> { /* Pass theme to Layout */}
          <Routes>
            <Route path="/" element={<ProductCatalogStatus />} />
            <Route path="/ecommerce" element={<ECommerceStatus />} />
            {/* Add other routes as needed */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
