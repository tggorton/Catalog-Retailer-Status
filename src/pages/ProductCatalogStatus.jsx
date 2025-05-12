import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Typography, Box, CircularProgress } from '@mui/material';
import DataTable from '../components/DataTable'; // Import DataTable component

const ProductCatalogStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ProductCatalogStatus: Fetching CSV...');
    Papa.parse('/Tab1-ProductFeed.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('ProductCatalogStatus: CSV Parse Complete. Results:', results);
        if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            setError('Failed to parse product feed data correctly. Check console.');
        }
        // Log raw parsed data
        console.log('ProductCatalogStatus: Raw Parsed Data:', results.data);
        // Filter out rows where essential data might be missing (e.g., RETAILER)
        const validData = results.data.filter(row => row['RETAILER'] && String(row['RETAILER']).trim() !== '');
        console.log('ProductCatalogStatus: Filtered Data (validData):', validData);
        setData(validData);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error fetching or parsing CSV: ", err);
        setError('Failed to load product feed data. Ensure Tab1-ProductFeed.csv is in the public folder and accessible.');
        setLoading(false);
      }
    });
  }, []);

  console.log('ProductCatalogStatus: Rendering with data state:', data);

  return (
    <Box>
      {/* <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Product Catalog Status
      </Typography> */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
          <DataTable data={data} type="product" />
      )}
    </Box>
  );
};

export default ProductCatalogStatus; 