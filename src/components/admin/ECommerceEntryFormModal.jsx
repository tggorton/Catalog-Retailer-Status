import React, { useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText
} from '@mui/material';

const commonStatusOptions = [
  'Active',
  'Not Active',
  'Pending Onboarding',
  'Not Available',
  'Deactivated',
  'Offline',
  // Add other common statuses if needed
];

const ECommerceEntryFormModal = ({
  open,
  onClose,
  itemData, // Full item if editing (includes _id), null if adding.
  formFieldValues, // Current values for the form fields.
  onFormInputChange,
  onFormSubmit,
  itemType, // Should be "eCommerce"
  errors = {} // Added errors prop
}) => {

  const dialogTitle = itemData?._id ? `Edit ${itemType} Entry` : `Add New ${itemType} Entry`;
  const submitButtonText = itemData?._id ? 'Save Changes' : 'Add Entry';

  useEffect(() => {
    // console.log("eCommerce Modal received itemData:", itemData);
    // console.log("eCommerce Modal received formFieldValues:", formFieldValues);
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
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }} error={!!errors['PRODUCT CATALOG']}>
          <InputLabel id="product-catalog-status-label">Product Catalog Status</InputLabel>
          <Select
            labelId="product-catalog-status-label"
            id="PRODUCT CATALOG"
            name="PRODUCT CATALOG"
            value={formFieldValues['PRODUCT CATALOG'] || ''}
            label="Product Catalog Status"
            onChange={onFormInputChange}
            required
          >
            <MenuItem value="" disabled><em>Select a status</em></MenuItem>
            {commonStatusOptions.map((status) => (
              <MenuItem key={`pc-${status}`} value={status}>
                {status}
              </MenuItem>
            ))}
             <MenuItem value="Other"><em>Other (type below)</em></MenuItem>
          </Select>
          {errors['PRODUCT CATALOG'] && <FormHelperText>{errors['PRODUCT CATALOG']}</FormHelperText>}
        </FormControl>
        {/* Optional: Allow free text if 'Other' is selected or if the value isn't in commonStatusOptions */}
        {(formFieldValues['PRODUCT CATALOG'] === 'Other' || (formFieldValues['PRODUCT CATALOG'] && !commonStatusOptions.includes(formFieldValues['PRODUCT CATALOG']))) && (
             <TextField
                margin="dense"
                id="PRODUCT CATALOG_custom"
                name="PRODUCT CATALOG"
                label="Custom Product Catalog Status" 
                type="text"
                fullWidth
                variant="outlined"
                value={formFieldValues['PRODUCT CATALOG'] === 'Other' ? '' : formFieldValues['PRODUCT CATALOG']}
                onChange={onFormInputChange}
                error={!!errors['PRODUCT CATALOG_custom']}
                helperText={errors['PRODUCT CATALOG_custom']}
                sx={{ mb: 2, ml:1 }}
                placeholder="Enter custom status if not listed"
            />
        )}

        <FormControl fullWidth margin="dense" sx={{ mb: 2 }} error={!!errors['DIRECT TO CART SUPPORT']}>
          <InputLabel id="dtc-support-label">Direct to Cart Support</InputLabel>
          <Select
            labelId="dtc-support-label"
            id="DIRECT TO CART SUPPORT"
            name="DIRECT TO CART SUPPORT"
            value={formFieldValues['DIRECT TO CART SUPPORT'] || ''}
            label="Direct to Cart Support"
            onChange={onFormInputChange}
            required
          >
            <MenuItem value="" disabled><em>Select a status</em></MenuItem>
            {commonStatusOptions.map((status) => (
              <MenuItem key={`dtc-${status}`} value={status}>
                {status}
              </MenuItem>
            ))}
            <MenuItem value="Other"><em>Other (type below)</em></MenuItem>
          </Select>
          {errors['DIRECT TO CART SUPPORT'] && <FormHelperText>{errors['DIRECT TO CART SUPPORT']}</FormHelperText>}
        </FormControl>
         {(formFieldValues['DIRECT TO CART SUPPORT'] === 'Other' || (formFieldValues['DIRECT TO CART SUPPORT'] && !commonStatusOptions.includes(formFieldValues['DIRECT TO CART SUPPORT']))) && (
             <TextField
                margin="dense"
                id="DIRECT TO CART SUPPORT_custom"
                name="DIRECT TO CART SUPPORT" // Ensures it updates the correct state field
                label="Custom Direct to Cart Support Status"
                type="text"
                fullWidth
                variant="outlined"
                value={formFieldValues['DIRECT TO CART SUPPORT'] === 'Other' ? '' : formFieldValues['DIRECT TO CART SUPPORT']}
                onChange={onFormInputChange}
                error={!!errors['DIRECT TO CART SUPPORT_custom']}
                helperText={errors['DIRECT TO CART SUPPORT_custom']}
                sx={{ mb: 2, ml: 1 }}
                placeholder="Enter custom status if not listed"
            />
        )}

        <TextField
          margin="dense"
          id="SUPPORTED PRODUCT OFFERING"
          name="SUPPORTED PRODUCT OFFERING"
          label="Supported Product Offering"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={formFieldValues['SUPPORTED PRODUCT OFFERING'] || ''}
          onChange={onFormInputChange}
          error={!!errors['SUPPORTED PRODUCT OFFERING']}
          helperText={errors['SUPPORTED PRODUCT OFFERING']}
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

export default ECommerceEntryFormModal; 