// Mock data for Energy Usage and Optimization System


// Generate time series data for the last 24 hours
const generateTimeSeriesData = (hours = 24) => {
  const data = [];
  const now = new Date();
 
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
   
    // Simulate realistic energy usage patterns
    let baseUsage = 50;
   
    // Higher usage during business hours (8 AM - 6 PM)
    if (hour >= 8 && hour <= 18) {
      baseUsage = 80 + Math.random() * 40;
    }
    // Lower usage during night (10 PM - 6 AM)
    else if (hour >= 22 || hour <= 6) {
      baseUsage = 20 + Math.random() * 20;
    }
    // Medium usage during evening (7 PM - 9 PM)
    else {
      baseUsage = 40 + Math.random() * 30;
    }
   
    data.push({
      time: time.toISOString(),
      timestamp: time.getTime(),
      energy: Math.round(baseUsage * 100) / 100,
      predicted: Math.round((baseUsage + (Math.random() - 0.5) * 10) * 100) / 100
    });
  }
 
  return data;
};


// Generate historical data for the last 30 days
const generateHistoricalData = (days = 30) => {
  const data = [];
  const now = new Date();
 
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
   
    // Lower usage on weekends
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
   
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      total: Math.round((1200 + Math.random() * 400) * weekendMultiplier),
      hvac: Math.round((400 + Math.random() * 200) * weekendMultiplier),
      lighting: Math.round((200 + Math.random() * 100) * weekendMultiplier),
      machinery: Math.round((600 + Math.random() * 300) * weekendMultiplier),
      cost: Math.round(((1200 + Math.random() * 400) * weekendMultiplier * 0.12) * 100) / 100
    });
  }
 
  return data;
};


// Summary metrics
export const summaryMetrics = {
  totalEnergy: {
    value: 1847.5,
    unit: 'kWh',
    change: '+5.2%',
    trend: 'up'
  },
  carbonFootprint: {
    value: 892.3,
    unit: 'kg CO₂',
    change: '-2.1%',
    trend: 'down'
  },
  costSavings: {
    value: 1247.8,
    unit: '$',
    change: '+8.7%',
    trend: 'up'
  },
  efficiency: {
    value: 87.4,
    unit: '%',
    change: '+1.3%',
    trend: 'up'
  }
};


// Real-time energy usage data
export const realTimeData = generateTimeSeriesData(24);


// Peak demand prediction data
export const peakDemandData = generateTimeSeriesData(24).map(item => ({
  ...item,
  peakThreshold: 100,
  predicted: item.predicted
}));


// Historical data
export const historicalData = generateHistoricalData(30);


// Department data
export const departments = [
  { id: 'engineering', name: 'Engineering', color: '#3b82f6' },
  { id: 'operations', name: 'Operations', color: '#10b981' },
  { id: 'admin', name: 'Administration', color: '#8b5cf6' },
  { id: 'production', name: 'Production', color: '#f59e0b' }
];


// System types
export const systems = [
  { id: 'hvac', name: 'HVAC', icon: '🌡️', color: '#ef4444' },
  { id: 'lighting', name: 'Lighting', icon: '💡', color: '#f59e0b' },
  { id: 'machinery', name: 'Machinery', icon: '⚙️', color: '#6b7280' },
  { id: 'computing', name: 'Computing', icon: '💻', color: '#3b82f6' }
];


// Cost analysis data

export const costAnalysisData = {
  labels: ['HVAC', 'Lighting', 'Machinery', 'Computing', 'Other'],
  datasets: [{
    data: [35, 20, 30, 10, 5],
    backgroundColor: [
      '#ef4444',
      '#f59e0b',
      '#6b7280',
      '#3b82f6',
      '#10b981'
    ],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
};


// Alerts data
export const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Peak Demand Exceeded',
    message: 'Energy consumption exceeded peak threshold by 15% at 10:30 PM',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    system: 'hvac',
    dismissed: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Usage Detected',
    message: 'Lighting system showing 25% higher than normal consumption',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    system: 'lighting',
    dismissed: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Maintenance Due',
    message: 'HVAC system maintenance scheduled for next week',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    system: 'hvac',
    dismissed: false
  },
  {
    id: 4,
    type: 'warning',
    title: 'Temperature Anomaly',
    message: 'Building temperature 3°C above optimal range',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    system: 'hvac',
    dismissed: true
  }
];


// AI Recommendations
export const recommendations = [
  {
    id: 1,
    type: 'optimization',
    title: 'Optimize HVAC Schedule',
    description: 'Adjust HVAC operating hours to reduce energy consumption during off-peak hours',
    estimatedSavings: 150,
    system: 'hvac',
    priority: 'high',
    icon: '🌡️'
  },
  {
    id: 2,
    type: 'efficiency',
    title: 'LED Lighting Upgrade',
    description: 'Replace traditional lighting with LED fixtures in production area',
    estimatedSavings: 320,
    system: 'lighting',
    priority: 'medium',
    icon: '💡'
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Equipment Calibration',
    description: 'Schedule calibration for machinery to improve energy efficiency',
    estimatedSavings: 85,
    system: 'machinery',
    priority: 'low',
    icon: '⚙️'
  },
  {
    id: 4,
    type: 'automation',
    title: 'Smart Thermostat Installation',
    description: 'Install smart thermostats for better temperature control',
    estimatedSavings: 200,
    system: 'hvac',
    priority: 'medium',
    icon: '🌡️'
  },
  {
    id: 5,
    type: 'monitoring',
    title: 'Real-time Monitoring',
    description: 'Implement real-time energy monitoring for all systems',
    estimatedSavings: 100,
    system: 'computing',
    priority: 'high',
    icon: '💻'
  }
];


// User profile data
export const userProfile = {
  name: 'JIIT',
  role: 'Energy Manager',
  avatar: 'https://upload.wikimedia.org/wikipedia/en/5/56/Logo-jiit.png',
  department: 'Operations',
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
};


// Chart configuration options
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#10b981',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};













