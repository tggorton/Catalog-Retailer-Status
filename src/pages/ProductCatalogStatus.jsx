import React, { useState, useMemo } from 'react';
// import Papa from 'papaparse';
import { Typography, Box, CircularProgress } from '@mui/material';
import DataTable from '../components/DataTable';
import productData from '../data/productData.json'; // Import the JSON data

const ProductCatalogStatus = () => {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Filter data directly from imported JSON
  const validData = useMemo(() => {
    console.log('ProductCatalogStatus: Raw Imported Data:', productData);
    // Filter out rows where essential data might be missing (e.g., RETAILER)
    const filtered = productData.filter(row => row['RETAILER'] && String(row['RETAILER']).trim() !== '');
    console.log('ProductCatalogStatus: Filtered Imported Data (validData):', filtered);
    return filtered;
  }, []); // Run memoization only once

  // Removed useEffect hook for fetching/parsing CSV
  /*
  useEffect(() => {
    console.log('ProductCatalogStatus: Fetching CSV...');
    Papa.parse('/Tab1-ProductFeed.csv', {
      ...
    });
  }, []);
  */

  // console.log('ProductCatalogStatus: Rendering with data state:', validData);

  return (
    <Box>
      {/* <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Product Catalog Status
      </Typography> */}
      {/* {loading && (...)} */}
      {/* {error && <Typography color="error">{error}</Typography>} */}
      {/* Render table directly with validData */}
      <DataTable data={validData} type="product" />
    </Box>
  );
};

export default ProductCatalogStatus; 