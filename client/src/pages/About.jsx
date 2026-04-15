import { Zap, Shield, Code2, Globe, Heart, GitBranch, ExternalLink } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-logo">
          <div className="about-logo-icon">
            <Zap size={36} />
          </div>
          <div>
            <h1>SentraAI</h1>
            <span className="about-version">v1.3.0</span>
          </div>
        </div>
        <p className="about-tagline">
          AI-Powered Visitor Security Management System
        </p>
      </div>

      <div className="about-grid">
        {/* Description */}
        <div className="about-card about-description">
          <div className="about-card-icon">
            <Shield size={20} />
          </div>
          <h3>About SentraAI</h3>
          <p>
            SentraAI is an enterprise-grade visitor management and access control system designed for
            residential complexes, corporate offices, and secure facilities. It features AI-powered
            analytics, real-time security alerts, face verification, and a role-based portal architecture
            with strict domain isolation for Admins, Guards, and Residents.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="about-card">
          <div className="about-card-icon">
            <Code2 size={20} />
          </div>
          <h3>Tech Stack</h3>
          <div className="tech-list">
            <div className="tech-item">
              <span className="tech-label">Frontend</span>
              <span className="tech-value">React 18.2 + Vite 4.3</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Routing</span>
              <span className="tech-value">React Router DOM 6</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Icons</span>
              <span className="tech-value">Lucide React</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">HTTP</span>
              <span className="tech-value">Axios 1.4</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Backend</span>
              <span className="tech-value">Node.js + Express 4.18</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Styling</span>
              <span className="tech-value">CSS3 with Design Tokens</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="about-card">
          <div className="about-card-icon">
            <Globe size={20} />
          </div>
          <h3>Key Features</h3>
          <ul className="feature-list">
            <li>Route-based isolated role portals (Admin / Guard / Resident)</li>
            <li>AI-powered face verification & trust scoring</li>
            <li>Real-time security alerts with severity levels</li>
            <li>Visitor approval workflow with OTP verification</li>
            <li>Comprehensive activity logging & audit trail</li>
            <li>Light & dark theme support</li>
            <li>Mobile-optimized guard interface</li>
            <li>Anomaly detection & blacklist management</li>
            <li>Session persistence across page reloads</li>
            <li>Real VisitorPass printing with QR & OTP</li>
            <li>Analytics dashboard with heatmaps & charts</li>
            <li>Resident visitor invite & OTP generation flow</li>
          </ul>
        </div>

        {/* Developer Info */}
        <div className="about-card about-developer">
          <div className="about-card-icon">
            <Heart size={20} />
          </div>
          <h3>Developer</h3>
          <div className="dev-info">
            <p className="dev-project">SentraAI Project</p>
            <p className="dev-period">2024 — 2026</p>
            <p className="dev-license">Licensed under MIT</p>
          </div>
          <div className="about-links">
            <a href="#" className="about-link" id="about-github">
              <GitBranch size={14} />
              <span>GitHub Repository</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
