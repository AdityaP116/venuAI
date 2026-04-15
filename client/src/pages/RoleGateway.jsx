import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, Home, Zap, ArrowRight, Lock, Eye, Activity } from 'lucide-react';
import './RoleGateway.css';

const roles = [
  {
    id: 'admin',
    title: 'Admin Portal',
    subtitle: 'Command Center',
    description: 'Full system control, analytics, and user management',
    icon: Shield,
    accentIcon: Lock,
    path: '/admin/login',
    accent: 'purple',
    features: ['System Management', 'Analytics Dashboard', 'User Administration'],
  },
  {
    id: 'guard',
    title: 'Guard Station',
    subtitle: 'Access Control',
    description: 'Verify visitors, control gates, and manage entries',
    icon: Fingerprint,
    accentIcon: Eye,
    path: '/guard/login',
    accent: 'cyan',
    features: ['Face Verification', 'Gate Control', 'Entry Management'],
  },
  {
    id: 'resident',
    title: 'Resident Portal',
    subtitle: 'Visitor Management',
    description: 'Approve visitors and manage access to your unit',
    icon: Home,
    accentIcon: Activity,
    path: '/resident/login',
    accent: 'green',
    features: ['Approve Visitors', 'View Alerts', 'Entry History'],
  },
];

export default function RoleGateway() {
  const navigate = useNavigate();

  return (
    <div className="gateway-page">
      {/* Animated background */}
      <div className="gateway-bg">
        <div className="gateway-grid" />
        <div className="gateway-orb orb-purple" />
        <div className="gateway-orb orb-cyan" />
        <div className="gateway-orb orb-green" />
        <div className="gateway-scanline" />
      </div>

      <div className="gateway-container">
        {/* Hero */}
        <div className="gateway-hero">
          <div className="hero-badge">
            <Activity size={14} />
            <span>System Online</span>
            <span className="hero-badge-pulse" />
          </div>
          <div className="hero-logo">
            <div className="hero-icon">
              <Zap size={36} />
            </div>
            <h1>SentraAI</h1>
          </div>
          <p className="hero-tagline">
            AI-Powered Visitor Security System
          </p>
          <p className="hero-description">
            Select your portal to access the security management dashboard
          </p>
        </div>

        {/* Role Cards */}
        <div className="gateway-cards">
          {roles.map((role, index) => (
            <button
              key={role.id}
              className={`gateway-card card-${role.accent}`}
              onClick={() => navigate(role.path)}
              id={`gateway-${role.id}`}
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <div className="card-glow" />
              <div className="card-header">
                <div className={`card-icon-wrap icon-${role.accent}`}>
                  <role.icon size={24} />
                </div>
                <div className="card-titles">
                  <h2>{role.title}</h2>
                  <span className="card-subtitle">{role.subtitle}</span>
                </div>
              </div>

              <p className="card-description">{role.description}</p>

              <ul className="card-features">
                {role.features.map((f, i) => (
                  <li key={i}>
                    <role.accentIcon size={12} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="card-cta">
                <span>Sign In</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="gateway-footer">
          <span>SentraAI v1.0.0</span>
          <span className="footer-dot" />
          <span>Enterprise Security Platform</span>
        </div>
      </div>
    </div>
  );
}
