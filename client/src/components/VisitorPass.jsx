import { X, Printer, Download, Shield } from 'lucide-react';
import './VisitorPass.css';

// Generate a simple deterministic "QR" pattern from an ID
function QRPattern({ seed = 'PASS' }) {
  const cells = Array.from({ length: 25 }, (_, i) => {
    const c = seed.charCodeAt(i % seed.length);
    return (c + i * 7 + Math.floor(i / 5) * 3) % 3 !== 0;
  });
  // Force corners to be filled (QR finder squares)
  [0, 1, 5, 6, 4, 9, 20, 21, 24].forEach(idx => { cells[idx] = true; });
  [2, 3, 7, 8, 17, 22, 23].forEach(idx => { cells[idx] = false; });
  return (
    <div className="pass-qr-inner">
      {cells.map((filled, i) => (
        <div key={i} className={`pass-qr-cell ${filled ? '' : 'empty'}`} />
      ))}
    </div>
  );
}

export default function VisitorPass({ result, formData, onClose }) {
  if (!result) return null;

  const passId = `VIS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const now = new Date();
  const validUntil = new Date(now.getTime() + 4 * 60 * 60 * 1000); // +4 hours

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="visitor-pass-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="visitor-pass-modal">
        {/* Modal header */}
        <div className="pass-modal-header">
          <h3>Visitor Pass</h3>
          <button className="pass-close-btn" onClick={onClose} id="close-visitor-pass">
            <X size={14} />
          </button>
        </div>

        {/* The printable pass */}
        <div className="visitor-pass-card" id="printable-pass">
          {/* Pass header */}
          <div className="pass-card-header">
            <div className="pass-brand-logo">🛡️</div>
            <div className="pass-brand-text">
              <h4>SentraAI</h4>
              <span>Intelligent Visitor Security</span>
            </div>
            <div className={`pass-badge ${result.status}`}>
              {result.status === 'approved' ? 'APPROVED' : 'DENIED'}
            </div>
          </div>

          {/* Pass body */}
          <div className="pass-card-body">
            <div className="pass-photo-wrapper">
              <img
                src={result.photo}
                alt={result.visitor}
                className="pass-photo"
              />
              <div className={`pass-photo-status ${result.status}`}>
                {result.status === 'approved' ? '✓ Verified' : '✗ Denied'}
              </div>
            </div>

            <div className="pass-info-grid">
              <div className="pass-info-row">
                <span className="pass-info-label">Visitor Name</span>
                <span className="pass-info-value">{result.visitor}</span>
              </div>
              <div className="pass-info-row">
                <span className="pass-info-label">Destination Unit</span>
                <span className="pass-info-value highlight">{formData?.unit || 'N/A'}</span>
              </div>
              <div className="pass-info-row">
                <span className="pass-info-label">Purpose</span>
                <span className="pass-info-value">{formData?.purpose || 'N/A'}</span>
              </div>
              <div className="pass-info-row">
                <span className="pass-info-label">Trust Score</span>
                <span className="pass-info-value">
                  {result.trustScore}/100 · {result.trustLevel} Risk
                </span>
              </div>
              <div className="pass-info-row">
                <span className="pass-info-label">Pass ID · Issued</span>
                <span className="pass-info-value" style={{ fontSize: '0.75rem' }}>
                  {passId} · {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="pass-card-divider" />

          {/* Pass footer */}
          <div className="pass-card-footer">
            {result.status === 'approved' && result.otp ? (
              <div className="pass-otp-section">
                <span className="pass-otp-label">OTP — Share with Resident</span>
                <div className="pass-otp-digits">
                  {String(result.otp).split('').map((d, i) => (
                    <div key={i} className="pass-otp-digit">{d}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pass-validity" style={{ color: '#ef4444' }}>
                ⚠ Access Denied — Contact Security
              </div>
            )}

            <div className="pass-qr-placeholder">
              <QRPattern seed={passId} />
            </div>
          </div>

          <div style={{ padding: '0 1.5rem 0.75rem', textAlign: 'right' }}>
            <span className="pass-validity">
              Valid until {validUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pass-actions">
          <button className="pass-action-btn primary" onClick={handlePrint} id="print-pass-btn">
            <Printer size={15} />
            Print Pass
          </button>
          <button className="pass-action-btn secondary" onClick={onClose} id="close-pass-btn">
            <X size={15} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
