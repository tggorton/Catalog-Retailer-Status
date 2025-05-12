import React, { useState, useMemo } from 'react';
// import Papa from 'papaparse';
import { Typography, Box, CircularProgress } from '@mui/material';
import DataTable from '../components/DataTable';
import ecommerceData from '../data/ecommerceData.json'; // Import the JSON data

const ECommerceStatus = () => {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Filter data directly from imported JSON
  const validData = useMemo(() => {
    console.log('ECommerceStatus: Raw Imported Data:', ecommerceData);
    // Filter out potential empty rows or rows with only null/empty values
    const filtered = ecommerceData.filter(row => Object.values(row).some(val => val !== null && String(val).trim() !== ''));
    console.log('ECommerceStatus: Filtered Imported Data (validData):', filtered);
    return filtered;
  }, []); // Run memoization only once

  // Removed useEffect hook for fetching/parsing CSV
  /*
  useEffect(() => {
    Papa.parse('/Tab2-eCommerce.csv', {
      ...
    });
  }, []);
  */

  return (
    <Box>
      {/* <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        eCommerce Status
      </Typography> */}
      {/* {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>} */}
      <DataTable data={validData} type="ecommerce" />
    </Box>
  );
};

export default ECommerceStatus; 