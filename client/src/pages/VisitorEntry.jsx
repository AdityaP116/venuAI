import { useState, useRef, useCallback } from 'react';
import {
  Camera, User, Phone, MapPin, FileText, Shield, Zap,
  CheckCircle, XCircle, Loader, ScanLine, RefreshCw, Clock,
  Upload
} from 'lucide-react';
import { PURPOSES, getTrustColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import VisitorPass from '../components/VisitorPass';
import './VisitorEntry.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function VisitorEntry() {
  const { getIdToken, user } = useAuth();

  const [step, setStep] = useState(1); // 1=form, 2=scanning, 3=result
  const [formData, setFormData] = useState({
    name: '', phone: '', purpose: '', unit: '', residentId: '',
  });
  const [residents, setResidents] = useState([]);     // loaded from backend
  const [residentsLoaded, setResidentsLoaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);  // base64 or URL
  const [capturedAt, setCapturedAt] = useState(null);        // ISO timestamp
  const [showPass, setShowPass] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load residents for unit dropdown when component mounts
  const loadResidents = useCallback(async () => {
    if (residentsLoaded) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/residents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResidents(data.residents || []);
    } catch {
      // Ignore — units will be a free-text field if backend unavailable
    } finally {
      setResidentsLoaded(true);
    }
  }, [getIdToken, residentsLoaded]);

  // Preload residents on mount
  useState(() => { loadResidents(); });

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      // Camera denied — let user skip photo (photo is optional)
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const ts = new Date();
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUrl);
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
    setCapturedAt(ts.toISOString());
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCapturedAt(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setStep(2);
    setScanning(true);
    setScanProgress(0);

    // Display the scan animation (4 steps, 600ms each)
    const scanSteps = [20, 45, 70, 90, 100];
    for (const pct of scanSteps) {
      await new Promise(r => setTimeout(r, 600));
      setScanProgress(pct);
    }
    await new Promise(r => setTimeout(r, 300));

    // Find selected resident details
    const selectedResident = residents.find(r => r.id === formData.residentId);
    const targetFlat = selectedResident
      ? `${selectedResident.b_wing_alphabet || ''}-${selectedResident.flat_num || selectedResident.b_num || ''}`
      : formData.unit;

    // Submit to real backend
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/visitors`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:               formData.name,
          phone:              formData.phone,
          purpose:            formData.purpose,
          target_flat:        targetFlat,
          target_resident_id: formData.residentId || null,
          photo_url:          capturedPhoto || null,
          captured_at:        capturedAt || new Date().toISOString(),
          captured_by_guard_id: user?.id || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to register visitor');
        setStep(1);
        setScanning(false);
        return;
      }

      const v = data.visitor;
      const trust = getTrustColor(v.trust_level);

      setResult({
        visitor:        v.name,
        visitorId:      v.visitor_unique_id || v.id,
        photo:          capturedPhoto || null,
        capturedAt:     capturedAt,
        trustScore:     v.trust_score,
        trustLevel:     v.trust_level,
        status:         v.status,
        targetFlat:     v.target_flat,
        otpCode:        data.otp_code || null,
        message:        data.message || '',
        residentName:   selectedResident?.name || null,
      });
    } catch {
      setSubmitError('Server error. Please try again.');
      setStep(1);
      setScanning(false);
      return;
    }

    setScanning(false);
    setStep(3);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ name: '', phone: '', purpose: '', unit: '', residentId: '' });
    setCapturedPhoto(null);
    setCapturedAt(null);
    setResult(null);
    setScanProgress(0);
    setSubmitError('');
  };

  // Resident unit display label
  const residentLabel = (r) => {
    const wing = r.b_wing_alphabet || '';
    const flat = r.flat_num || r.b_num || '';
    const block = wing && flat ? `${wing}-${flat}` : flat || wing || r.flat_num || '?';
    return `${r.name} — Flat ${block}`;
  };

  return (
    <div className="visitor-entry-page">
      {/* Progress Steps */}
      <div className="entry-steps">
        <div className={`entry-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">{step > 1 ? <CheckCircle size={16} /> : '1'}</div>
          <span>Visitor Info</span>
        </div>
        <div className="step-connector" />
        <div className={`entry-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">{step > 2 ? <CheckCircle size={16} /> : '2'}</div>
          <span>Processing</span>
        </div>
        <div className="step-connector" />
        <div className={`entry-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Result</span>
        </div>
      </div>

      <div className="entry-content">
        {/* Step 1: Form */}
        {step === 1 && (
          <div className="entry-form-section animate-fade-in-up">
            <div className="entry-form-card">
              <div className="form-card-header">
                <div className="form-icon-wrapper">
                  <User size={20} />
                </div>
                <div>
                  <h2>Register Visitor</h2>
                  <p>Fill in visitor details and capture photo (optional)</p>
                </div>
              </div>

              {submitError && (
                <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1rem', color:'#f87171', display:'flex', gap:'0.5rem', alignItems:'center' }}>
                  <XCircle size={16} /> {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="visitor-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="visitor-name">Full Name *</label>
                    <div className="field-input">
                      <User size={16} />
                      <input
                        id="visitor-name"
                        type="text"
                        placeholder="Enter visitor name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="visitor-phone">Phone Number *</label>
                    <div className="field-input">
                      <Phone size={16} />
                      <input
                        id="visitor-phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="visitor-purpose">Purpose of Visit *</label>
                    <div className="field-input">
                      <FileText size={16} />
                      <select
                        id="visitor-purpose"
                        value={formData.purpose}
                        onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        required
                      >
                        <option value="">Select purpose</option>
                        {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="visitor-resident">Destination Resident *</label>
                    <div className="field-input">
                      <MapPin size={16} />
                      {residents.length > 0 ? (
                        <select
                          id="visitor-resident"
                          value={formData.residentId}
                          onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                          required
                        >
                          <option value="">Select resident</option>
                          {residents.map(r => (
                            <option key={r.id} value={r.id}>{residentLabel(r)}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="visitor-unit"
                          type="text"
                          placeholder="e.g. A-101"
                          value={formData.unit}
                          onChange={e => setFormData({ ...formData, unit: e.target.value })}
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Camera Section */}
                <div className="camera-section">
                  <label>Photo Capture <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:400, fontSize:'0.8rem' }}>(Optional)</span></label>
                  <div className="camera-container">
                    {!cameraActive && !capturedPhoto && (
                      <div className="camera-placeholder">
                        <Camera size={40} />
                        <p>Capture visitor's photo for the record</p>
                        <div className="camera-buttons">
                          <button type="button" className="camera-btn primary" onClick={startCamera} id="start-camera">
                            <Camera size={16} />
                            Open Camera
                          </button>
                          <button type="button" className="camera-btn secondary"
                            onClick={() => { setCapturedPhoto('demo'); setCapturedAt(new Date().toISOString()); }}
                            id="skip-photo"
                          >
                            <Upload size={16} />
                            Skip Photo
                          </button>
                        </div>
                      </div>
                    )}

                    {cameraActive && (
                      <div className="camera-active">
                        <video ref={videoRef} autoPlay playsInline className="camera-video" />
                        <div className="camera-overlay">
                          <div className="face-guide" />
                          <div className="scan-line-anim" />
                        </div>
                        <button type="button" className="capture-btn" onClick={capturePhoto} id="capture-btn">
                          <div className="capture-ring" />
                        </button>
                      </div>
                    )}

                    {capturedPhoto && capturedPhoto !== 'demo' && (
                      <div className="captured-preview">
                        <img src={capturedPhoto} alt="Captured" />
                        <div className="captured-overlay">
                          <CheckCircle size={24} />
                          <span>Photo Captured</span>
                        </div>
                        <button type="button" className="retake-btn" onClick={retakePhoto} id="retake-btn">
                          <RefreshCw size={14} />
                          Retake
                        </button>
                      </div>
                    )}

                    {capturedPhoto === 'demo' && (
                      <div className="captured-preview" style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1.5rem' }}>
                          <Clock size={28} style={{ color:'#a78bfa' }} />
                          <div>
                            <p style={{ color:'#a78bfa', fontWeight:600, margin:0 }}>No photo — proceeding without</p>
                            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', margin:0 }}>
                              {capturedAt ? new Date(capturedAt).toLocaleString() : ''}
                            </p>
                          </div>
                        </div>
                        <button type="button" className="retake-btn"
                          onClick={() => { setCapturedPhoto(null); setCapturedAt(null); startCamera(); }}
                          id="retake-btn-skip">
                          <Camera size={14} />
                          Use Camera
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <button type="submit" className="submit-entry-btn" id="submit-visitor">
                  <Shield size={18} />
                  Register Visitor
                  <Zap size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="scanning-section animate-fade-in-up">
            <div className="scan-card">
              <div className="scan-visual">
                <div className="scan-photo-wrapper">
                  {capturedPhoto && capturedPhoto !== 'demo' ? (
                    <img src={capturedPhoto} alt="Scanning" className="scan-photo" />
                  ) : (
                    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(139,92,246,0.08)' }}>
                      <User size={64} style={{ color:'rgba(139,92,246,0.4)' }} />
                    </div>
                  )}
                  <div className="scan-overlay-anim">
                    <div className="scan-line" />
                  </div>
                  <div className="scan-corners">
                    <span /><span /><span /><span />
                  </div>
                </div>
              </div>

              <div className="scan-progress-section">
                <div className="scan-progress-bar">
                  <div className="scan-progress-fill" style={{ width: `${scanProgress}%` }} />
                </div>
                <p className="scan-status-text">
                  {scanProgress < 25 ? 'Registering visitor details…' :
                   scanProgress < 50 ? 'Checking trust history…' :
                   scanProgress < 75 ? 'Generating OTP for resident…' :
                   scanProgress < 100 ? 'Saving to Supabase…' :
                   'Registration complete!'}
                </p>
                <span className="scan-percent">{scanProgress}%</span>
              </div>

              <div className="scan-indicators">
                <div className={`scan-indicator ${scanProgress >= 20 ? 'active' : ''}`}>
                  <User size={14} />
                  <span>Visitor Logged</span>
                </div>
                <div className={`scan-indicator ${scanProgress >= 45 ? 'active' : ''}`}>
                  <ScanLine size={14} />
                  <span>Trust Computed</span>
                </div>
                <div className={`scan-indicator ${scanProgress >= 70 ? 'active' : ''}`}>
                  <Shield size={14} />
                  <span>OTP Issued</span>
                </div>
                <div className={`scan-indicator ${scanProgress >= 90 ? 'active' : ''}`}>
                  <Zap size={14} />
                  <span>Resident Notified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className="result-section animate-fade-in-up">
            <div className={`result-card ${result.status}`}>
              <div className="result-status-banner">
                {result.status === 'approved' || result.status === 'pending' ? (
                  <>
                    <CheckCircle size={32} />
                    <h2>{result.status === 'approved' ? 'Access Approved' : 'Awaiting Approval'}</h2>
                    <p>{result.status === 'approved' ? 'Visitor registered successfully' : 'OTP sent to resident for approval'}</p>
                  </>
                ) : (
                  <>
                    <XCircle size={32} />
                    <h2>Access Denied</h2>
                    <p>High risk visitor — entry blocked</p>
                  </>
                )}
              </div>

              <div className="result-details">
                {result.photo && result.photo !== 'demo' && (
                  <div className="result-photo">
                    <img src={result.photo} alt={result.visitor} />
                  </div>
                )}

                <div className="result-info-grid">
                  <div className="result-field">
                    <span className="field-label">Visitor</span>
                    <span className="field-value">{result.visitor}</span>
                  </div>
                  <div className="result-field">
                    <span className="field-label">Visitor ID</span>
                    <span className="field-value" style={{ fontFamily:'monospace', fontSize:'0.85em', color:'#a78bfa' }}>
                      {result.visitorId}
                    </span>
                  </div>
                  <div className="result-field">
                    <span className="field-label">Destination</span>
                    <span className="field-value">{result.targetFlat || '—'}</span>
                  </div>
                  {result.residentName && (
                    <div className="result-field">
                      <span className="field-label">Resident</span>
                      <span className="field-value">{result.residentName}</span>
                    </div>
                  )}
                  <div className="result-field">
                    <span className="field-label">Trust Score</span>
                    <span className="field-value" style={{ color: getTrustColor(result.trustLevel).color }}>
                      {result.trustScore}/100 ({result.trustLevel} Risk)
                    </span>
                  </div>
                  {result.capturedAt ? (
                    <div className="result-field">
                      <span className="field-label">Photo Captured</span>
                      <span className="field-value" style={{ fontSize:'0.85em', color:'rgba(255,255,255,0.6)' }}>
                        {new Date(result.capturedAt).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="result-field">
                      <span className="field-label">Face Scan</span>
                      <span className="field-value" style={{ color:'rgba(255,255,255,0.5)' }}>
                        No photo captured
                      </span>
                    </div>
                  )}
                  {result.otpCode && (
                    <div className="result-field otp-field">
                      <span className="field-label">OTP Code (sent to resident)</span>
                      <div className="otp-display">
                        {String(result.otpCode).split('').map((d, i) => (
                          <span key={i} className="otp-digit">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="result-actions">
                <button className="result-btn primary" onClick={resetForm} id="new-entry">
                  <Camera size={16} />
                  New Entry
                </button>
                <button className="result-btn secondary" id="print-pass" onClick={() => setShowPass(true)}>
                  <FileText size={16} />
                  Print Visitor Pass
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visitor Pass Modal */}
      {showPass && result && (
        <VisitorPass
          result={result}
          formData={formData}
          onClose={() => setShowPass(false)}
        />
      )}
    </div>
  );
}
