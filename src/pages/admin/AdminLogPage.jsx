import React from 'react';
import { useLog } from '../../context/LogContext';
import {
  Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box, Tooltip, IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const AdminLogPage = () => {
  const { logEntries, clearLogEntries } = useLog();

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust format as needed
  };

  const handleClearLog = () => {
    if (window.confirm('Are you sure you want to clear all log entries? This action cannot be undone.')) {
      clearLogEntries();
    }
  };

  const handleDownloadLog = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(logEntries, null, 2) // Pretty print JSON
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "kerv_dashboard_audit_log.json";
    link.click();
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Admin Activity Log
      </Typography>
      <Button component={RouterLink} to="/admin" sx={{ mb: 2 }}>
        &larr; Back to Admin Dashboard
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
        {logEntries.length > 0 && (
          <>
            <Tooltip title="Download Log as JSON">
              <Button 
                variant="outlined"
                startIcon={<FileDownloadIcon />} 
                onClick={handleDownloadLog}
              >
                Download Log
              </Button>
            </Tooltip>
            <Tooltip title="Clear All Log Entries">
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteSweepIcon />} 
                onClick={handleClearLog}
              >
                Clear Log
              </Button>
            </Tooltip>
          </>
        )}
      </Box>

      {logEntries.length === 0 ? (
        <Typography>No log entries yet.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '60vh'}}>
          <Table stickyHeader aria-label="audit log table">
            <TableHead>
              <TableRow>
                <TableCell sx={{fontWeight: 'bold'}}>Timestamp</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Action Type</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                  <TableCell>{entry.actionType}</TableCell>
                  <TableCell>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, fontSize: '0.8rem' }}>
                      {typeof entry.details === 'object' ? JSON.stringify(entry.details, null, 2) : entry.details}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AdminLogPage; 