import React from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/DataTable';
import { useData } from '../context/DataContext';

const ProductCatalogStatus = () => {
  const { productData } = useData();

  return (
    <Box>
      <DataTable data={productData} type="product" />
    </Box>
  );
};

export default ProductCatalogStatus; 