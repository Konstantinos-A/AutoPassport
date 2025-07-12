import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import UploadForm from "./pages/UploadForm.jsx";
import Register from "./pages/Register.jsx";
import VehicleInfo from './components/VehicleInfo.jsx';
import AccessManagement from './components/AccessManagement.jsx';
import InsuranceForm from './components/InsuranceForm.jsx';
import TransferForm from './components/TransferForm.jsx';
import AccidentForm from './components/AccidentForm.jsx';
import RetirementForm from './components/RetirementForm.jsx';
import VehicleHistory from './components/VehicleHistory.jsx';
import RoleManager from './components/RoleManager.jsx';
import Dashboard from './pages/Dashboard.jsx';
import useWallet from './hooks/useWallet.js';

function App() {
  const { account, role, isCollaborator } = useWallet();

  if (!account) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">⚠️ Δεν είστε συνδεδεμένος</h1>
        <p>Παρακαλώ συνδεθείτε με MetaMask για να συνεχίσετε.</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl">🔄 Γίνεται φόρτωση ρόλου από το Smart Contract...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar account={account} role={role} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {role === "ministry" && <Route path="/register" element={<Register />} />}
            {isCollaborator && <Route path="/access" element={<AccessManagement />} />}
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/vehicle/:vin" element={<VehicleInfo />} />
            <Route path="/insurance" element={<InsuranceForm />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/accident" element={<AccidentForm />} />
            <Route path="/retirement" element={<RetirementForm />} />
            <Route path="/history" element={<VehicleHistory />} />
            <Route path="/roles" element={<RoleManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
