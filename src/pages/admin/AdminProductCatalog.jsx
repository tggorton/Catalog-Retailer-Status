import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Input, Alert as MuiAlert, Divider, Snackbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';
import { useLog } from '../../context/LogContext';
import DataTable from '../../components/DataTable';
import ProductEntryFormModal from '../../components/admin/ProductEntryFormModal';
import { generateRowId } from '../../utils/idUtils.js';

const initialFormValues = {
  'RETAILER': '',
  'APPROVAL STATUS': '', // Consider making this a specific set of allowed values, e.g., for a select dropdown
  'APPLICABLE PRODUCTS': '',
};

const AdminProductCatalog = () => {
  const { productData, setProductData, addProductItem, updateProductItem, deleteProductItem } = useData();
  const { addLogEntry } = useLog();
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' }); // 'success' or 'error'

  // State for modal and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemForEdit, setCurrentItemForEdit] = useState(null); // null for Add, object for Edit
  const [productFormFieldValues, setProductFormFieldValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({}); // Added state for form errors

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error' or 'warning' or 'info'

  const handleFileChange = (event) => {
    setUploadStatus({ message: '', type: '' }); // Clear previous status
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

        // Add _id to each row from CSV
        processedData = processedData.map(row => ({ ...row, _id: generateRowId() }));

        setProductData(processedData); // Replace existing product data with new data having _ids
        setUploadStatus({ message: `Successfully uploaded and processed ${processedData.length} rows.`, type: 'success' });
        addLogEntry('PRODUCT_CATALOG_CSV_UPLOAD', null, { message: `Uploaded ${processedData.length} product catalog items from CSV.` , fileName: csvFile.name });
        setCsvFile(null); // Clear the file input
        if (document.getElementById('csv-upload-input')) {
            document.getElementById('csv-upload-input').value = null; // Reset file input visually
        }
      },
      error: (error) => {
        console.error("File Upload Error:", error);
        setUploadStatus({ message: 'Failed to upload or parse file.', type: 'error' });
      },
    });
  };

  // Modal and Form Handlers
  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItemForEdit(null);
    setProductFormFieldValues(initialFormValues);
    setFormErrors({}); // Clear errors on modal close
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setProductFormFieldValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    // Clear the error for the field being changed
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!productFormFieldValues.RETAILER.trim()) {
      errors.RETAILER = 'Retailer Name is required.';
    }
    if (!productFormFieldValues['APPROVAL STATUS']) { // For Select, check if it's an empty string
      errors['APPROVAL STATUS'] = 'Approval Status is required.';
    }
    if (!productFormFieldValues['APPLICABLE PRODUCTS'] || !productFormFieldValues['APPLICABLE PRODUCTS'].trim()) {
      errors['APPLICABLE PRODUCTS'] = 'Applicable Products is required.';
    }
    // Add other field validations here if needed
    return errors;
  };

  const handleFormSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop submission if there are errors
    }
    setFormErrors({}); // Clear errors if validation passes
    setUploadStatus({ message: '', type: '' }); // Clear any previous upload status messages

    if (currentItemForEdit && currentItemForEdit._id) {
      // Editing existing item
      updateProductItem(currentItemForEdit._id, productFormFieldValues);
      setSnackbarMessage('Product item updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      // Adding new item
      addProductItem(productFormFieldValues);
      setSnackbarMessage('New product item added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    handleModalClose();
  };

  // CRUD action handlers (updated)
  const handleAddProduct = () => {
    setCurrentItemForEdit(null); // Signifies an "add" operation
    setProductFormFieldValues(initialFormValues); // Reset form for new entry
    setFormErrors({}); // Clear any previous errors
    setIsModalOpen(true);
    console.log("Opening modal for Add New Product");
  };

  const handleEditProduct = (product) => {
    setCurrentItemForEdit(product); // Set the item to be edited
    // Populate form with existing data, ensuring all defined keys in initialFormValues are present
    const formValues = {
        RETAILER: product.RETAILER || '',
        'APPROVAL STATUS': product['APPROVAL STATUS'] || '',
        'APPLICABLE PRODUCTS': product['APPLICABLE PRODUCTS'] || '',
    };
    setProductFormFieldValues(formValues);
    setFormErrors({}); // Clear any previous errors
    setIsModalOpen(true);
    console.log("Opening modal to Edit Product:", product);
  };

  const handleDeleteProduct = (product) => {
    console.log("Delete product:", product);
    if (product && product._id) {
      if (window.confirm(`Are you sure you want to delete ${product.RETAILER || 'this item'} (ID: ${product._id})?`)) {
        deleteProductItem(product._id);
        setSnackbarMessage('Item deleted successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } else {
      console.error("Delete failed: Product or product ID is missing.", product);
      alert("Could not delete item: ID is missing.");
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage Product Catalog Data
      </Typography>
      <Button component={RouterLink} to="/admin" sx={{ mb: 3 }}>
        &larr; Back to Admin Dashboard
      </Button>

      <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: '4px', mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload New Product Catalog CSV</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This will replace all existing Product Catalog data.
        </Typography>
        <Input
          id="csv-upload-input"
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
        {uploadStatus.message && (uploadStatus.type === 'success' || uploadStatus.type === 'error') && uploadStatus.message.includes('uploaded') && (
          <MuiAlert severity={uploadStatus.type} sx={{ mt: 2 }} onClose={() => setUploadStatus({ message: '', type: '' })}>
              {uploadStatus.message}
          </MuiAlert>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Current Product Catalog Data</Typography>
      {uploadStatus.message && (uploadStatus.type === 'success' || uploadStatus.type === 'error') && !uploadStatus.message.includes('uploaded') && (
        <MuiAlert severity={uploadStatus.type} sx={{ mb: 2 }} onClose={() => setUploadStatus({ message: '', type: '' })}>
            {uploadStatus.message}
        </MuiAlert>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddProduct} 
        sx={{ mb: 2 }}
      >
        Add New Product Entry
      </Button>
      <DataTable 
        data={productData}
        type="product"
        isAdmin={true}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      
      <ProductEntryFormModal 
        open={isModalOpen}
        onClose={handleModalClose}
        itemData={currentItemForEdit}
        formFieldValues={productFormFieldValues}
        onFormInputChange={handleFormInputChange}
        onFormSubmit={handleFormSubmit}
        itemType="Product Catalog"
        formErrors={formErrors}
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

export default AdminProductCatalog; 