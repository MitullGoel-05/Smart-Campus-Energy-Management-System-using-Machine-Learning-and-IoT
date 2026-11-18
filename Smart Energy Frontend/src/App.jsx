import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EnergyProvider } from './context/EnergyContext';
import Layout from './components/layout/Layout';
import AlertPanel from './components/alerts/AlertPanel';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

function App() {
  return (
    <EnergyProvider>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
          <AlertPanel />
        </div>
      </Router>
    </EnergyProvider>
  );
}

export default App;


