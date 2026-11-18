import React from 'react';
import FilterPanel from '../components/reports/FilterPanel';
import HistoricalChart from '../components/reports/HistoricalChart';
import CostAnalysisPie from '../components/reports/CostAnalysisPie';

const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historical Reports</h1>
        <p className="mt-2 text-gray-600">
          Analyze past energy consumption patterns and cost breakdowns
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-8">
          <HistoricalChart />
          <CostAnalysisPie />
        </div>
      </div>
    </div>
  );
};

export default Reports;






