import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import UploadScreen from './screens/UploadScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import DashboardScreen from './screens/DashboardScreen';
import ReportScreen from './screens/ReportScreen';
import ComplianceScreen from './screens/ComplianceScreen';
import LayoffAuditScreen from './screens/LayoffAuditScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/upload" element={<UploadScreen />} />
        <Route path="/analysis" element={<AnalysisScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/layoff-audit" element={<LayoffAuditScreen />} />
        <Route path="/report" element={<ReportScreen />} />
        <Route path="/compliance" element={<ComplianceScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
