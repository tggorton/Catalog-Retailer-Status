import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Box, FormControl, InputLabel, Select, MenuItem, Chip,
  IconButton
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StatusDot = ({ status }) => {
  console.log("StatusDot received status:", status);
  let color;
  let standardizedStatus = status ? String(status).toLowerCase() : '';
  console.log("StatusDot standardized:", standardizedStatus);

  // Reordered checks: Red/Orange first, then Green
  if (standardizedStatus.includes('not approved') || standardizedStatus.includes('offline') || standardizedStatus.includes('deactivated') || standardizedStatus.includes('not active') || standardizedStatus.includes('not available')) {
    color = 'red'; // Check red first
  } else if (standardizedStatus.includes('pending')) {
    color = 'orange'; // Check pending second
  } else if (standardizedStatus.includes('approved') || standardizedStatus.includes('active')) {
    color = 'green'; // Check green last
  } else {
    color = 'grey'; // Default for unknown statuses
  }
  console.log("StatusDot determined color:", color);
  return <CircleIcon sx={{ fontSize: '12px', color: color, verticalAlign: 'middle', marginRight: '5px' }} />;
};

const DataTable = ({ data, type, isAdmin, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState('all');

  const productColumns = [
    { id: 'RETAILER', label: 'Retailer Name', minWidth: 170 },
    {
      id: 'APPROVAL STATUS',
      label: 'Approval Status',
      minWidth: 150,
      align: 'left',
      format: (value) => {
        // console.log(`DataTable (Product): Formatting value for 'APPROVAL STATUS':`, value);
        return (
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusDot status={value} />
            {value}
          </Box>
        );
      },
    },
    { id: 'APPLICABLE PRODUCTS', label: 'Applicable Product', minWidth: 200 },
  ];

  const eCommerceColumnsRaw = useMemo(() => {
    if (!data || data.length === 0) return [];
    // console.log("eCommerceColumns: Creating columns based on keys:", Object.keys(data[0]));
    return Object.keys(data[0])
      .filter(key => key !== null && key !== undefined && key !== '' && key !== '_id') // Added key !== '_id'
      .map((key) => ({
        id: key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        minWidth: 170,
        format: (value) => {
          const lowerValue = String(value).toLowerCase();
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'product catalog' || lowerKey === 'direct to cart support') {
            // ... (status dot logic for eCommerce columns)
            // console.log(`DataTable (eCommerce): Formatting value for key '${key}':`, value);
            let status = 'unknown'; 
            if (lowerValue.includes('active') || lowerValue.includes('approved')) {
              status = 'active';
            }
            if (lowerValue.includes('not active') || lowerValue.includes('not approved') || lowerValue.includes('not available')) {
              status = 'not active';
            }
            if (lowerValue.includes('pending')) {
              status = 'pending';
            }
            // console.log(`DataTable (eCommerce): Determined status '${status}' for value '${value}'`);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StatusDot status={status} />
                {value}
              </Box>
            );
          }
          return value;
        }
      }));
  }, [data]);

  // Add Actions column if isAdmin is true
  const columns = useMemo(() => {
    let baseColumns = type === 'product' ? productColumns : eCommerceColumnsRaw;
    if (isAdmin) {
      return [
        ...baseColumns,
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 100,
          align: 'center',
          format: (value, row) => (
            <Box>
              <IconButton onClick={() => onEdit && onEdit(row)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete && onDelete(row)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      ];
    }
    return baseColumns;
  }, [type, productColumns, eCommerceColumnsRaw, isAdmin, onEdit, onDelete]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredData = useMemo(() => {
    const currentData = Array.isArray(data) ? data : [];
    if (type === 'product' && statusFilter !== 'all') {
        return currentData.filter(row => {
            const status = row['APPROVAL STATUS'] ? String(row['APPROVAL STATUS']).toLowerCase() : '';
            if (statusFilter === 'approved') return status.includes('approved');
            if (statusFilter === 'deactivated') return status.includes('offline') || status.includes('deactivated') || status.includes('not approved');
            if (statusFilter === 'pending') return status.includes('pending');
            return false;
        });
    }
    return currentData;
  }, [data, statusFilter, type]);

  // Added check for columns length before rendering table body
  if ((!filteredData || filteredData.length === 0) && columns.length === 0) {
    // Display loading or no data message appropriately
    if (type ==='ecommerce' && columns.length === 0 && filteredData && filteredData.length > 0) {
        return <p>Generating table columns...</p>;
    }
    // Don't show "no data" if columns aren't ready for ecommerce
    // return <p>No data to display.</p>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.05)', borderRadius: '8px' }}>
      {type === 'product' && !isAdmin && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filter by Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">Show All</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="deactivated">Not Approved / Offline / Deactivated</MenuItem>
              <MenuItem value="pending">Pending Approval</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      <TableContainer sx={{ maxHeight: undefined }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.length > 0 && filteredData && filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => {
                // Prioritize row._id for the key, then row.id, then fallback
                const rowKey = row._id || row.id || type + rowIndex.toString() + (row.RETAILER || JSON.stringify(row).substring(0,30));
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowKey}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'actions' && isAdmin ? 
                           column.format(value, row) : // Pass the whole row to actions format function
                           (column.format ? column.format(value) : value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 50, 100]}
        component="div"
        count={filteredData ? filteredData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable; 