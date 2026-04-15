import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Shield, Bell, Plus } from 'lucide-react';
import './GuardMobileNav.css';

const MOBILE_NAV = [
  { path: '/guard/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/guard/approval', label: 'Approvals', icon: Shield },
  { path: '/guard/visitors', label: '', icon: Plus, isFab: true },
  { path: '/guard/alerts', label: 'Alerts', icon: Bell },
  { path: '/guard/logs', label: 'Logs', icon: Camera },
];

export default function GuardMobileNav() {
  return (
    <nav className="guard-mobile-nav">
      {MOBILE_NAV.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''} ${item.isFab ? 'fab-item' : ''}`
          }
        >
          {item.isFab ? (
            <div className="mobile-fab">
              <item.icon size={24} />
            </div>
          ) : (
            <>
              <item.icon size={20} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
