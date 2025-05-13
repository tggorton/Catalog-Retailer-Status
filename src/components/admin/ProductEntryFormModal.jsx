import React, { useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, FormHelperText
} from '@mui/material';

const approvalStatusOptions = [
  'Approved',
  'Not Approved',
  'Pending Approval',
  'Deactivated',
  'Offline'
  // Add other relevant statuses if needed
];

const ProductEntryFormModal = ({
  open,
  onClose,
  itemData, // Contains the full item if editing, including _id. Null if adding.
  formFieldValues, // Contains the current values for RETAILER, APPROVAL STATUS, etc.
  onFormInputChange,
  onFormSubmit,
  itemType, // e.g., "Product Catalog" - used for titles
  errors = {} // Added errors prop with default value
}) => {

  const dialogTitle = itemData?._id ? `Edit ${itemType} Entry` : `Add New ${itemType} Entry`;
  const submitButtonText = itemData?._id ? 'Save Changes' : 'Add Entry';

  // Effect to potentially re-initialize form when itemData changes (e.g. opening for a new item after an edit)
  // This is largely handled by AdminProductCatalog.jsx resetting formFieldValues before opening the modal,
  // but this can be a safeguard or place for more complex initializations if needed.
  useEffect(() => {
    // console.log("Modal received itemData:", itemData);
    // console.log("Modal received formFieldValues:", formFieldValues);
  }, [itemData, formFieldValues]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>
          Please fill in the details for the {itemType.toLowerCase()} entry.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="RETAILER"
          name="RETAILER"
          label="Retailer Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formFieldValues.RETAILER || ''}
          onChange={onFormInputChange}
          error={!!errors.RETAILER}
          helperText={errors.RETAILER}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }} error={!!errors['APPROVAL STATUS']}>
          <InputLabel id="approval-status-label">Approval Status *</InputLabel>
          <Select
            required
            labelId="approval-status-label"
            id="APPROVAL STATUS"
            name="APPROVAL STATUS"
            value={formFieldValues['APPROVAL STATUS'] || ''}
            label="Approval Status *"
            onChange={onFormInputChange}
          >
            <MenuItem value="" disabled><em>Select a status</em></MenuItem>
            {approvalStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          {errors['APPROVAL STATUS'] && <FormHelperText>{errors['APPROVAL STATUS']}</FormHelperText>}
        </FormControl>
        <TextField
          required
          margin="dense"
          id="APPLICABLE PRODUCTS"
          name="APPLICABLE PRODUCTS"
          label="Applicable Products"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={formFieldValues['APPLICABLE PRODUCTS'] || ''}
          onChange={onFormInputChange}
          error={!!errors['APPLICABLE PRODUCTS']}
          helperText={errors['APPLICABLE PRODUCTS']}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{p: '16px 24px'}}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">{submitButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEntryFormModal; 