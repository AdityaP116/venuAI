import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ContactGuard from '../../components/ContactGuard';
import ResidentDashboard from './ResidentDashboard';
import ResidentApproval from './ResidentApproval';
import Alerts from '../Alerts';
import Settings from '../Settings';
import About from '../About';
import ProfilePage from '../ProfilePage';
import useTheme from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Shield, Bell, Settings as SettingsIcon, Info, User
} from 'lucide-react';

const RESIDENT_NAV_ITEMS = [
  { path: '/resident/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resident/approval',  label: 'Approvals', icon: Shield },
  { path: '/resident/alerts',    label: 'Alerts',    icon: Bell },
  { path: '/resident/profile',   label: 'Profile',   icon: User },
  { path: '/resident/settings',  label: 'Settings',  icon: SettingsIcon },
  { path: '/resident/about',     label: 'About',     icon: Info },
];

const RESIDENT_PAGE_TITLES = {
  '/resident/dashboard': { title: 'Dashboard', subtitle: 'Your Overview' },
  '/resident/approval':  { title: 'Approvals', subtitle: 'Approve Visitor Entry via OTP' },
  '/resident/alerts':    { title: 'Alerts',    subtitle: 'Security Notifications' },
  '/resident/profile':   { title: 'My Profile', subtitle: 'Account & Flat Details' },
  '/resident/settings':  { title: 'Settings',  subtitle: 'Preferences & Configuration' },
  '/resident/about':     { title: 'About',     subtitle: 'Application Information' },
};

export default function ResidentLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const location                                = useLocation();
  const { theme, toggleTheme }                  = useTheme('resident');
  const { user, logout }                        = useAuth();

  const pageInfo = RESIDENT_PAGE_TITLES[location.pathname] || { title: 'SentraAI', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navItems={RESIDENT_NAV_ITEMS}
        user={user}
        onLogout={logout}
        roleAccent="green"
        dashboardPath="/resident/dashboard"
      />
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          role="resident"
        />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard" element={<ResidentDashboard user={user} />} />
            <Route path="/approval"  element={<ResidentApproval />} />
            <Route path="/alerts"    element={<Alerts userUnit={user?.flat_num} />} />
            <Route path="/profile"   element={<ProfilePage />} />
            <Route path="/settings"  element={<Settings theme={theme} toggleTheme={toggleTheme} user={user} />} />
            <Route path="/about"     element={<About />} />
            <Route path="*"          element={<Navigate to="/resident/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <ContactGuard />
    </div>
  );
}
