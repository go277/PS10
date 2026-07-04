import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import NotFoundPage from './components/NotFoundPage';

// Secure Pages
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import InteractiveMap from './components/InteractiveMap';
import HistoryPage from './components/HistoryPage';
import UploadPage from './components/UploadPage';
import AnalyticsPage from './components/AnalyticsPage';
import DatasetsPage from './components/DatasetsPage';
import ResultsDashboard from './components/ResultsDashboard';
import AnalysisDetails from './components/AnalysisDetails';
import HelpPage from './components/HelpPage';

// Layout
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* SECURE ROUTES (Wrapped in MainLayout Sidebar) */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
        <Route path="/map" element={<MainLayout><InteractiveMap /></MainLayout>} />
        <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />
        <Route path="/upload" element={<MainLayout><UploadPage /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><AnalyticsPage /></MainLayout>} />
        <Route path="/datasets" element={<MainLayout><DatasetsPage /></MainLayout>} />
        <Route path="/results" element={<MainLayout><ResultsDashboard /></MainLayout>} />
        <Route path="/details" element={<MainLayout><AnalysisDetails /></MainLayout>} />
        <Route path="/help" element={<MainLayout><HelpPage /></MainLayout>} />
        
        {/* CATCH-ALL 404 ROUTE */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;