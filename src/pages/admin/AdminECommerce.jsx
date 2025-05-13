import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Input, Alert as MuiAlert, Divider, Snackbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';
import { useLog } from '../../context/LogContext';
import DataTable from '../../components/DataTable';
import ECommerceEntryFormModal from '../../components/admin/ECommerceEntryFormModal';
import { generateRowId } from '../../utils/idUtils.js';

const initialECommerceFormValues = {
  'RETAILER': '',
  'PRODUCT CATALOG': '',
  'DIRECT TO CART SUPPORT': '',
  'SUPPORTED PRODUCT OFFERING': '',
};

const AdminECommerce = () => {
  const { 
    eCommerceData, 
    setECommerceData, 
    addECommerceItem, 
    updateECommerceItem, 
    deleteECommerceItem 
  } = useData();
  const { addLogEntry } = useLog();
  
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null);
  const [eCommerceFormFieldValues, setECommerceFormFieldValues] = useState(initialECommerceFormValues);
  const [formErrors, setFormErrors] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleFileChange = (event) => {
    setUploadStatus({ message: '', type: '' });
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
    } else {
      setCsvFile(null);
    }
  };

  const handleFileUpload = () => {
    if (!csvFile) {
      setUploadStatus({ message: 'Please select a CSV file to upload.', type: 'error' });
      return;
    }
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV Parsing Errors:", results.errors);
          setUploadStatus({ message: 'Error parsing CSV. Check console for details.', type: 'error' });
          return;
        }
        let processedData = results.data.filter(row => row['RETAILER'] && String(row['RETAILER']).trim() !== '');
        
        if (processedData.length === 0 && results.data.length > 0) {
            setUploadStatus({ message: 'CSV parsed, but no valid data rows found (missing RETAILER field or empty).', type: 'error' });
            return;
        }
        processedData = processedData.map(row => ({ ...row, _id: generateRowId() }));

        setECommerceData(processedData);
        setUploadStatus({ message: `Successfully uploaded and processed ${processedData.length} rows.`, type: 'success' });
        addLogEntry('ECOMMERCE_CSV_UPLOAD', null, { message: `Uploaded ${processedData.length} eCommerce items from CSV.`, fileName: csvFile.name });
        setCsvFile(null);
        if (document.getElementById('ecommerce-csv-upload-input')) {
            document.getElementById('ecommerce-csv-upload-input').value = null;
        }
      },
      error: (error) => {
        console.error("File Upload Error:", error);
        setUploadStatus({ message: 'Failed to upload or parse file.', type: 'error' });
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItemForEdit(null);
    setECommerceFormFieldValues(initialECommerceFormValues);
    setFormErrors({});
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setECommerceFormFieldValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null,
      }));
    }
    if (name === 'PRODUCT CATALOG' || name === 'DIRECT TO CART SUPPORT') {
      if (formErrors[`${name}_custom`]) {
        setFormErrors(prevErrors => ({...prevErrors, [`${name}_custom`]: null}));
      }
    }
  };

  const validateECommerceForm = () => {
    const errors = {};
    const { 
      RETAILER,
      'PRODUCT CATALOG': productCatalogStatus,
      'DIRECT TO CART SUPPORT': directToCartStatus,
    } = eCommerceFormFieldValues;

    if (!RETAILER || !RETAILER.trim()) {
      errors.RETAILER = 'Retailer Name is required.';
    }
    if (!productCatalogStatus) {
      errors['PRODUCT CATALOG'] = 'Product Catalog Status is required.';
    }
    if (productCatalogStatus === 'Other' && eCommerceFormFieldValues['PRODUCT CATALOG'] === 'Other'){
        errors['PRODUCT CATALOG'] = 'Please specify the status if \"Other\" is selected.';
    }

    if (!directToCartStatus) {
      errors['DIRECT TO CART SUPPORT'] = 'Direct to Cart Support Status is required.';
    }
    if (directToCartStatus === 'Other' && eCommerceFormFieldValues['DIRECT TO CART SUPPORT'] === 'Other'){
        errors['DIRECT TO CART SUPPORT'] = 'Please specify the status if \"Other\" is selected.';
    }

    return errors;
  };

  const handleFormSubmit = () => {
    const errors = validateECommerceForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setUploadStatus({ message: '', type: '' });

    if (currentItemForEdit && currentItemForEdit._id) {
      updateECommerceItem(currentItemForEdit._id, eCommerceFormFieldValues);
      setSnackbarMessage('eCommerce item updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      addECommerceItem(eCommerceFormFieldValues);
      setSnackbarMessage('New eCommerce item added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    handleModalClose();
  };

  const handleAddECommerce = () => {
    setCurrentItemForEdit(null);
    setECommerceFormFieldValues(initialECommerceFormValues);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditECommerce = (item) => {
    setCurrentItemForEdit(item);
    const formValues = {
        RETAILER: item.RETAILER || '',
        'PRODUCT CATALOG': item['PRODUCT CATALOG'] || '',
        'DIRECT TO CART SUPPORT': item['DIRECT TO CART SUPPORT'] || '',
        'SUPPORTED PRODUCT OFFERING': item['SUPPORTED PRODUCT OFFERING'] || '',
    };
    setECommerceFormFieldValues(formValues);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteECommerce = (item) => {
    if (item && item._id) {
      if (window.confirm(`Are you sure you want to delete ${item.RETAILER || 'this item'} (ID: ${item._id})?`)) {
        deleteECommerceItem(item._id);
        setSnackbarMessage('eCommerce item deleted successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } else {
      console.error("Delete failed: Item or item ID is missing.", item);
      setSnackbarMessage('Could not delete item: ID is missing.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage eCommerce Feed Data
      </Typography>
      <Button component={RouterLink} to="/admin" sx={{ mb: 3 }}>
        &larr; Back to Admin Dashboard
      </Button>

      <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: '4px', mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload New eCommerce Status CSV</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This will replace all existing eCommerce status data.
        </Typography>
        <Input
          id="ecommerce-csv-upload-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          sx={{ mb: 1, display: 'block' }}
        />
        <Button 
          variant="contained" 
          onClick={handleFileUpload} 
          disabled={!csvFile}
          sx={{mt:1}}
        >
          Upload and Replace Data
        </Button>
        {uploadStatus.message && uploadStatus.message.includes('uploaded') && (
          <MuiAlert severity={uploadStatus.type} sx={{ mt: 2 }} onClose={() => setUploadStatus({ message: '', type: '' })}>
            {uploadStatus.message}
          </MuiAlert>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Current eCommerce Data</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddECommerce} 
        sx={{ mb: 2 }}
      >
        Add New eCommerce Entry
      </Button>
      <DataTable 
        data={eCommerceData}
        type="ecommerce"
        isAdmin={true}
        onEdit={handleEditECommerce}
        onDelete={handleDeleteECommerce}
      />
      
      <ECommerceEntryFormModal 
        open={isModalOpen}
        onClose={handleModalClose}
        itemData={currentItemForEdit}
        formFieldValues={eCommerceFormFieldValues}
        onFormInputChange={handleFormInputChange}
        onFormSubmit={handleFormSubmit}
        itemType="eCommerce"
        errors={formErrors}
      />

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

    </Paper>
  );
};

export default AdminECommerce; 