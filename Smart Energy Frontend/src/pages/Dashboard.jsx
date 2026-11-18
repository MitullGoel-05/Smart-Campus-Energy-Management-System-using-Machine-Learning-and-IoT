import React from 'react';
import { FiZap, FiFeather, FiDollarSign, FiTrendingUp, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import SummaryCard from '../components/dashboard/SummaryCard';
import EnergyUsageChart from '../components/dashboard/EnergyUsageChart';
import PeakDemandChart from '../components/dashboard/PeakDemandChart';
import { useEnergy } from '../context/EnergyContext';


const Dashboard = () => {
  const { state, actions } = useEnergy();
  const { chartData, summaryStats, lastUpdate, isLoading, error } = state;


  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const date = new Date(lastUpdate);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


  // Compute quick stats from chartData
  const computeQuickStats = (data = []) => {
    if (!data || data.length === 0) {
      return {
        peakTime: '—',
        peakValue: '—',
        lowTime: '—',
        lowValue: '—',
        avgEfficiency: '—'
      };
    }


    // Choose the most-variable numeric field to represent usage (so peak/low are meaningful)
    const candidateKeys = ['current', 'energy', 'predicted_energy'];
    const statsByKey = {};
    candidateKeys.forEach(k => { statsByKey[k] = { min: Infinity, max: -Infinity, sum: 0, count: 0 }; });


    data.forEach(d => {
      candidateKeys.forEach(k => {
        const val = Number(d[k] ?? (k === 'energy' ? (d.energy ?? d.predicted_energy) : undefined));
        if (Number.isFinite(val)) {
          statsByKey[k].min = Math.min(statsByKey[k].min, val);
          statsByKey[k].max = Math.max(statsByKey[k].max, val);
          statsByKey[k].sum += val;
          statsByKey[k].count += 1;
        }
      });
    });


    // Select key with largest range (max-min) that has at least 1 data point
    let chosenKey = null;
    let bestRange = -1;
    candidateKeys.forEach(k => {
      const s = statsByKey[k];
      const range = (s.count > 0 && isFinite(s.max) && isFinite(s.min)) ? (s.max - s.min) : -1;
      if (s.count >= 1 && range > bestRange) {
        bestRange = range;
        chosenKey = k;
      }
    });


    if (!chosenKey) chosenKey = 'predicted_energy';


    let maxVal = -Infinity;
    let minVal = Infinity;
    let maxItem = null;
    let minItem = null;
    let sum = 0;
    let count = 0;


    data.forEach(d => {
      const val = Number(d[chosenKey] ?? d.energy ?? d.predicted_energy ?? d.current ?? 0);
      if (Number.isFinite(val)) {
        if (val > maxVal) { maxVal = val; maxItem = d; }
        if (val < minVal) { minVal = val; minItem = d; }
        sum += val;
        count += 1;
      }
    });


    const avg = count ? (sum / count) : 0;


    // Derive a simple "efficiency" metric if summaryStats doesn't provide one:
    // efficiency = 100 * (1 - avg/max) clipped to [0,100]. If max==0, use 100.
    let avgEfficiency = '—';
    const effSource = summaryStats && typeof summaryStats.efficiency !== 'undefined' ? summaryStats.efficiency : null;
    if (effSource !== null) {
      avgEfficiency = `${Number(effSource).toFixed(1)}%`;
    } else if (Number.isFinite(maxVal) && maxVal > 0) {
      const eff = Math.max(0, Math.min(100, 100 * (1 - (avg / maxVal))));
      avgEfficiency = `${eff.toFixed(1)}%`;
    }


    const fmtTime = (ts) => {
      try {
        const d = new Date(ts);
        return isNaN(d) ? '—' : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '—';
      }
    };


    return {
      peakTime: maxItem ? fmtTime(maxItem.time || maxItem.timestamp) : '—',
      peakValue: Number.isFinite(maxVal) ? `${maxVal.toFixed(2)} kWh` : '—',
      lowTime: minItem ? fmtTime(minItem.time || minItem.timestamp) : '—',
      lowValue: Number.isFinite(minVal) ? `${minVal.toFixed(2)} kWh` : '—',
      avgEfficiency
    };
  };


  const quick = computeQuickStats(chartData);


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Energy Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor real-time energy usage and optimize consumption across your facility
            </p>
          </div>
          <button
            onClick={actions.refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500 animate-pulse-slow'}`}></div>
            <span>
              {isLoading ? 'Loading...' : error ? 'Error loading data' : 'Live data'} •
              Last updated: {formatLastUpdate()}
            </span>
          </div>
          {chartData && (
            <span className="text-gray-500">
              {chartData.length} data points
            </span>
          )}
        </div>
        {error && (
          <div className="mt-4 flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error Loading CSV Data</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <p className="text-xs text-red-500 mt-2">
                Make sure the CSV file exists at <code className="bg-red-100 px-1 rounded">csv data/live_data (1).csv</code> in the project root
              </p>
            </div>
          </div>
        )}
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Energy Used"
          value={summaryStats ? summaryStats.totalEnergy.toFixed(2) : '—'}
          unit="kWh"
          change={summaryStats ? `Avg ${summaryStats.avgEnergy.toFixed(2)} kWh` : ''}
          trend=""
          icon={FiZap}
          color="primary"
        />
        <SummaryCard
          title="Avg Temperature"
          value={summaryStats ? summaryStats.avgTemperature.toFixed(2) : '—'}
          unit="°C"
          change={''}
          trend={''}
          icon={FiFeather}
          color="success"
        />
        <SummaryCard
          title="Avg Current"
          value={summaryStats ? summaryStats.avgCurrent.toFixed(2) : '—'}
          unit="A"
          change={''}
          trend={''}
          icon={FiDollarSign}
          color="warning"
        />
        <SummaryCard
          title="Avg Humidity"
          value={summaryStats ? summaryStats.avgHumidity.toFixed(2) : '—'}
          unit="%"
          change={''}
          trend={''}
          icon={FiTrendingUp}
          color="secondary"
        />
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <EnergyUsageChart />
        </div>
        <div className="lg:col-span-2">
          <PeakDemandChart />
        </div>
      </div>


      {/* Quick Stats (dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Hours Today</p>
              <p className="text-2xl font-bold text-gray-900">{quick.peakTime}</p>
              <p className="text-sm text-gray-500">{quick.peakValue}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiZap className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lowest Usage</p>
              <p className="text-2xl font-bold text-gray-900">{quick.lowTime}</p>
              <p className="text-sm text-gray-500">{quick.lowValue}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiFeather className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{quick.avgEfficiency}</p>
              <p className="text-sm text-green-600">{summaryStats && summaryStats.change ? summaryStats.change : ''}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;







