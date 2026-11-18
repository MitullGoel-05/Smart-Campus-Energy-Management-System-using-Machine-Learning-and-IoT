import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchCSVData, transformCSVDataForCharts, calculateSummaryStats } from '../services/csvService';

const EnergyContext = createContext(null);

export const EnergyProvider = ({ children }) => {
  // Calculate default date range (last 30 days)
  const getDefaultDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return {
      from: thirtyDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };

  const [state, setState] = useState({
    alertPanelOpen: false,
    dismissedAlerts: [],
    filters: {
      dateRange: getDefaultDateRange(),
      departments: [],
      systems: []
    },
    csvData: null,
    chartData: null,
    summaryStats: null,
    lastUpdate: null,
    isLoading: false,
    error: null
  });

  // Live polling removed; manual refresh only.

  // Function to load CSV data
  const loadCSVData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const csvData = await fetchCSVData();
      const chartData = transformCSVDataForCharts(csvData);
      const summaryStats = calculateSummaryStats(chartData);
      
      setState(prev => ({
        ...prev,
        csvData,
        chartData,
        summaryStats,
        lastUpdate: new Date().toISOString(),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading CSV data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load CSV data'
      }));
    }
  }, []);

  // Initial one-time load (no polling)
  useEffect(() => {
    loadCSVData();
  }, [loadCSVData]);

  const toggleAlertPanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      alertPanelOpen: !prev.alertPanelOpen
    }));
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setState(prev => ({
      ...prev,
      dismissedAlerts: [...prev.dismissedAlerts, alertId]
    }));
  }, []);

  const setFilters = useCallback((newFilters) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...newFilters
      }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        dateRange: getDefaultDateRange(),
        departments: [],
        systems: []
      }
    }));
  }, []);

  const refreshData = useCallback(() => {
    loadCSVData();
  }, [loadCSVData]);

  const actions = {
    toggleAlertPanel,
    dismissAlert,
    setFilters,
    resetFilters,
    refreshData
  };

  return (
    <EnergyContext.Provider value={{ state, actions }}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};

