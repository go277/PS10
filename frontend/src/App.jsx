import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout
import MainLayout from './components/MainLayout';

// Import Pages
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import InteractiveMap from './components/InteractiveMap';
import AnalyticsPage from './components/AnalyticsPage';
import HistoryPage from './components/HistoryPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import DatasetsPage from './components/DatasetsPage';

// Placeholder for incomplete pages so the app doesn't crash
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#5B685F' }}>
    <h1 style={{ color: '#123D30' }}>{title}</h1>
    <p>This module is currently under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Core Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/map" element={<InteractiveMap />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          {/* Our newly created Reports Page */}
          <Route path="/reports" element={<ReportsPage />} />
          
          {/* Settings Page */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Placeholder Routes for Phase 2 */}
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/profile" element={<PlaceholderPage title="User Profile" />} />
          
          {/* Catch-all for 404s */}
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;