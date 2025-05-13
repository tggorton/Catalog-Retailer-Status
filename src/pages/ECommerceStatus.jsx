import React from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/DataTable';
import { useData } from '../context/DataContext';

const ECommerceStatus = () => {
  const { eCommerceData } = useData();

  return (
    <Box>
      <DataTable data={eCommerceData} type="ecommerce" />
    </Box>
  );
};

export default ECommerceStatus; 