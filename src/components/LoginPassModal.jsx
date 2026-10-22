import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, User, LogIn, CheckCircle2, Sparkles, QrCode, Award, ArrowRight, KeyRound } from 'lucide-react';

const PRESET_PASSES = {
  'Field Unit': {
    name: 'Rajesh Kumar',
    role: 'Field Rescue Operative',
    badgeId: 'FIELD-BLR-104',
    sector: 'East Bengaluru Grid',
    vehicle: 'Two-Wheeler First Response Kit',
    status: 'Verified Level 2 Medic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    color: '#1b5e3a'
  },
  'Dispatcher': {
    name: 'Priya Sundaram',
    role: 'Emergency Dispatch Coordinator',
    badgeId: 'DISPATCH-HQ-09',
    sector: 'Central Metro Operations',
    vehicle: 'Command Desk Telemetry',
    status: 'Lead Operations Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    color: '#e65100'
  },
  'Vet Clinic': {
    name: 'Dr. Sameer Patil, MVSc',
    role: 'Emergency Veterinary Surgeon',
    badgeId: 'VET-CUPA-042',
    sector: 'Trauma & Casualty Bay',
    vehicle: 'Surgical ICU Ambulance',
    status: 'Accredited Veterinary Surgeon',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    color: '#00838f'
  }
};

export default function LoginPassModal({ isOpen, onClose, currentPass, onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('Field Unit');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('fastpass'); // 'fastpass' | 'custom'

  if (!isOpen) return null;

  const handleFastPassSelect = (roleKey) => {
    const passData = PRESET_PASSES[roleKey];
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    onLoginSuccess(passData);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const passData = {
      name: email.split('@')[0] || 'Authorized Responder',
      role: selectedRole,
      badgeId: `WOOF-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      sector: 'Active Municipal Grid',
      vehicle: 'Verified Unit',
      status: 'Active Pass Authenticated',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      color: '#1b5e3a'
    };

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    onLoginSuccess(passData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '24px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--color-primary-fixed)', 
              color: 'var(--color-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="status-pill in-progress" style={{ fontSize: '10px', marginBottom: '2px' }}>
                Secure Access Pass
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                Responder Portal Login
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: 'var(--radius-full)', 
              background: 'var(--color-surface-dim)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--color-text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Pass View if Logged In */}
        {currentPass ? (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '20px', 
              color: 'white',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
              border: '1.5px solid rgba(255, 219, 207, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="brand-badge" style={{ width: '28px', height: '28px' }}>
                    <span className="material-symbols-outlined fill-1" style={{ fontSize: '16px' }}>pets</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>
                    HAVENPULSE RESCUE PASS
                  </span>
                </div>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.25)', 
                  border: '1px solid #10b981', 
                  color: '#6ee7b7', 
                  fontSize: '10px', 
                  fontWeight: 800, 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-full)' 
                }}>
                  ACTIVE PASS
                </span>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img 
                  src={currentPass.avatar} 
                  alt={currentPass.name} 
                  style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', border: '2px solid white', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.2 }}>{currentPass.name}</h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{currentPass.role}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Badge ID: <strong>{currentPass.badgeId}</strong></p>
                </div>
              </div>

              <div style={{ 
                marginTop: '14px', 
                paddingTop: '10px', 
                borderTop: '1px solid rgba(255, 255, 255, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                fontSize: '11px', 
                color: '#94a3b8' 
              }}>
                <span>Sector: {currentPass.sector}</span>
                <span>{currentPass.status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, minHeight: '42px' }}
                onClick={onClose}
              >
                Continue to Mission Center
              </button>
              <button 
                className="btn-secondary" 
                style={{ minHeight: '42px' }}
                onClick={() => onLoginSuccess(null)}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Login Mode Toggle Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--color-surface-container)', padding: '4px', borderRadius: 'var(--radius-full)', marginBottom: '16px' }}>
              <button 
                style={{ 
                  padding: '8px', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '12.5px', 
                  fontWeight: 700, 
                  background: activeTab === 'fastpass' ? '#ffffff' : 'transparent',
                  color: activeTab === 'fastpass' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === 'fastpass' ? 'var(--shadow-sm)' : 'none'
                }}
                onClick={() => setActiveTab('fastpass')}
              >
                ⚡ 1-Click Fast-Pass (Demo)
              </button>
              <button 
                style={{ 
                  padding: '8px', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '12.5px', 
                  fontWeight: 700, 
                  background: activeTab === 'custom' ? '#ffffff' : 'transparent',
                  color: activeTab === 'custom' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === 'custom' ? 'var(--shadow-sm)' : 'none'
                }}
                onClick={() => setActiveTab('custom')}
              >
                🔑 Official Credentials
              </button>
            </div>

            {/* Fast-Pass Instant Demo Presets */}
            {activeTab === 'fastpass' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Select an authenticated responder profile to immediately explore live operational features:
                </p>

                {Object.entries(PRESET_PASSES).map(([roleKey, pass]) => (
                  <div 
                    key={roleKey}
                    onClick={() => handleFastPassSelect(roleKey)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '14px 16px', 
                      borderRadius: 'var(--radius-lg)', 
                      border: '1.5px solid var(--color-border)', 
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 160ms ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={pass.avatar} 
                        alt={pass.name}
                        style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                            {pass.name}
                          </span>
                          <span className="status-pill severe" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                            {roleKey}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {pass.role} • Badge: <strong>{pass.badgeId}</strong>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="btn-primary" 
                      style={{ minHeight: '34px', padding: '0 12px', fontSize: '12px' }}
                    >
                      Login Pass
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Custom Credentials Form */
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    <span>Authorized Role</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {['Field Unit', 'Dispatcher', 'Vet Clinic'].map(role => (
                      <button
                        type="button"
                        key={role}
                        className={`role-pill-btn ${selectedRole === role ? 'active' : ''}`}
                        onClick={() => setSelectedRole(role)}
                        style={{ padding: '8px' }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    <span>Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="responder@havenpulse.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    <span>Security Passcode / Token</span>
                  </label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-emergency-trigger" 
                  style={{ height: '48px', marginTop: '6px' }}
                >
                  <KeyRound size={16} />
                  Authenticate & Issue Access Pass
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
