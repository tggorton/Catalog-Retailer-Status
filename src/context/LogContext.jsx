import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const LOG_STORAGE_KEY = 'kervDashboardAuditLog';

const LogContext = createContext();

export const useLog = () => useContext(LogContext);

export const LogProvider = ({ children }) => {
  const [logEntries, setLogEntries] = useState([]);

  // Load logs from localStorage on initial mount
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(LOG_STORAGE_KEY);
      if (storedLogs) {
        setLogEntries(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load logs from localStorage", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(LOG_STORAGE_KEY); 
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logEntries));
    } catch (error) {
      console.error("Failed to save logs to localStorage", error);
    }
  }, [logEntries]);

  const addLogEntry = useCallback((actionType, itemId = null, details = {}) => {
    const timestamp = new Date().toISOString();
    const newEntry = {
      timestamp,
      actionType,
      itemId,
      details, // Can be an object with more info, or a simple string message
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9) // Unique ID for the log entry itself
    };
    setLogEntries(prevEntries => [newEntry, ...prevEntries]); // Add new entries to the top
  }, []);
  
  const clearLogEntries = useCallback(() => {
    setLogEntries([]);
    // localStorage.removeItem(LOG_STORAGE_KEY); // This is handled by the useEffect above when logEntries becomes []
  }, []);

  const value = {
    logEntries,
    addLogEntry,
    clearLogEntries
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}; 