import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import DoctorLogin from './pages/DoctorLogin/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister/DoctorRegister';
import ReportViewer from './pages/ReportViewer/ReportViewer';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/report/:id" element={<ReportViewer />} />
        <Route path="/patient-login" element={<LoginPage />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
