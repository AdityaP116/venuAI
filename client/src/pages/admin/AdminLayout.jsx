import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../Dashboard';
import Logs from '../Logs';
import Alerts from '../Alerts';
import Admin from '../Admin';
import Analytics from '../Analytics';
import Settings from '../Settings';
import About from '../About';
import ProfilePage from '../ProfilePage';
import AdminPhotos from '../AdminPhotos';
import useTheme from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ScrollText, Bell,
  Settings as SettingsIcon, Info, Wrench, BarChart2, User, Camera
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/admin/logs',        label: 'Visitor Logs',   icon: ScrollText },
  { path: '/admin/alerts',      label: 'Alerts',         icon: Bell },
  { path: '/admin/analytics',   label: 'Analytics',      icon: BarChart2 },
  { path: '/admin/admin-panel', label: 'Admin Panel',    icon: Wrench },
  { path: '/admin/photos',      label: 'Visitor Photos', icon: Camera },
  { path: '/admin/profile',     label: 'Profile',        icon: User },
  { path: '/admin/settings',    label: 'Settings',       icon: SettingsIcon },
  { path: '/admin/about',       label: 'About',          icon: Info },
];

const ADMIN_PAGE_TITLES = {
  '/admin/dashboard':   { title: 'Dashboard',        subtitle: 'Security Overview' },
  '/admin/logs':        { title: 'Visitor Logs',     subtitle: 'Entry & Exit History' },
  '/admin/alerts':      { title: 'Alerts',           subtitle: 'Security Notifications' },
  '/admin/analytics':   { title: 'Analytics',        subtitle: 'Trends & Insights' },
  '/admin/admin-panel': { title: 'Admin Panel',      subtitle: 'System Management' },
  '/admin/photos':      { title: 'Visitor Photos',   subtitle: 'Stored Gate Photos' },
  '/admin/profile':     { title: 'My Profile',       subtitle: 'Account & Settings' },
  '/admin/settings':    { title: 'Settings',         subtitle: 'Preferences & Configuration' },
  '/admin/about':       { title: 'About',            subtitle: 'Application Information' },
};

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme('admin');
  const { user, logout } = useAuth();

  const pageInfo = ADMIN_PAGE_TITLES[location.pathname] || { title: 'SentraAI', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navItems={ADMIN_NAV_ITEMS}
        user={user}
        onLogout={logout}
        roleAccent="purple"
        dashboardPath="/admin/dashboard"
      />
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          role="admin"
        />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/logs"        element={<Logs />} />
            <Route path="/alerts"      element={<Alerts />} />
            <Route path="/analytics"   element={<Analytics />} />
            <Route path="/admin-panel" element={<Admin />} />
            <Route path="/photos"      element={<AdminPhotos />} />
            <Route path="/profile"     element={<ProfilePage />} />
            <Route path="/settings"    element={<Settings theme={theme} toggleTheme={toggleTheme} user={user} />} />
            <Route path="/about"       element={<About />} />
            <Route path="*"            element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
