import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Typography, Box, CircularProgress } from '@mui/material';
import DataTable from '../components/DataTable'; // Import DataTable component

const ECommerceStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming Tab2-eCommerce.csv is in the public folder
    Papa.parse('/Tab2-eCommerce.csv', {
      download: true,
      header: true, // Assumes first row is header
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            setError('Failed to parse eCommerce data correctly. Check console.');
        }
         // Filter out potential empty rows or rows with only null/empty values
        const validData = results.data.filter(row => Object.values(row).some(val => val !== null && val !== ''));
        setData(validData);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error fetching or parsing CSV: ", err);
        setError('Failed to load eCommerce data. Ensure Tab2-eCommerce.csv is in the public folder and accessible.');
        setLoading(false);
      }
    });
  }, []);

  return (
    <Box>
      {/* <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        eCommerce Status
      </Typography> */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
         <DataTable data={data} type="ecommerce" />
      )}
    </Box>
  );
};

export default ECommerceStatus; 