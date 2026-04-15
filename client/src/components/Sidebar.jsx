import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, LogOut, Zap
} from 'lucide-react';
import './Sidebar.css';

const ROLE_LABELS = {
  admin: 'Administrator',
  guard: 'Security Guard',
  resident: 'Resident',
};

const ROLE_AVATARS = {
  admin: 'https://randomuser.me/api/portraits/men/32.jpg',
  guard: 'https://randomuser.me/api/portraits/men/65.jpg',
  resident: 'https://randomuser.me/api/portraits/women/44.jpg',
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  navItems = [],
  user,
  onLogout,
  roleAccent = 'purple',
  dashboardPath = '/admin/dashboard',
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate(dashboardPath);
    setMobileOpen(false);
  };

  const userName = user?.name || 'User';
  const userRole = user?.role || 'admin';
  const roleLabel = ROLE_LABELS[userRole] || 'User';
  const avatar = ROLE_AVATARS[userRole] || ROLE_AVATARS.admin;

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar sidebar-accent-${roleAccent} ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo — clickable, navigates to dashboard */}
        <div className="sidebar-logo" onClick={handleLogoClick} role="button" tabIndex={0}>
          <div className="logo-icon">
            <Zap size={collapsed ? 20 : 24} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name">SentraAI</span>
              <span className="logo-tagline">Security System</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">{!collapsed && 'MAIN MENU'}</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={20} />
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="nav-badge-dot" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* User section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img src={avatar} alt={userName} />
            <span className="user-status-dot" />
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{roleLabel}</span>
            </div>
          )}
          {!collapsed && (
            <button className="user-logout" title="Logout" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
