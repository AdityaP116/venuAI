import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGateway from './pages/RoleGateway';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import GuardLogin from './pages/guard/GuardLogin';
import GuardLayout from './pages/guard/GuardLayout';
import ResidentLogin from './pages/resident/ResidentLogin';
import ResidentLayout from './pages/resident/ResidentLayout';
import './App.css';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Gateway — role selector */}
          <Route path="/" element={<RoleGateway />} />
          <Route path="/gateway" element={<Navigate to="/" replace />} />

          {/* ===== Admin Domain ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin" loginPath="/admin/login">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* ===== Guard Domain ===== */}
          <Route path="/guard/login" element={<GuardLogin />} />
          <Route
            path="/guard/*"
            element={
              <ProtectedRoute allowedRole="guard" loginPath="/guard/login">
                <GuardLayout />
              </ProtectedRoute>
            }
          />

          {/* ===== Resident Domain ===== */}
          <Route path="/resident/login" element={<ResidentLogin />} />
          <Route
            path="/resident/*"
            element={
              <ProtectedRoute allowedRole="resident" loginPath="/resident/login">
                <ResidentLayout />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
