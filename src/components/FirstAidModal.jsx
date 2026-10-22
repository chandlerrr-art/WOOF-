import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function FirstAidModal({ guide, onClose }) {
  if (!guide) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              className="material-symbols-outlined" 
              style={{ fontSize: '28px', color: 'var(--color-primary)' }}
            >
              {guide.icon || 'health_and_safety'}
            </span>
            <div>
              <span className="status-pill critical" style={{ fontSize: '10px', marginBottom: '2px' }}>
                {guide.badge}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {guide.title}
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
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
          {guide.steps.map((step, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'var(--color-surface-container-low)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)', 
                padding: '12px 14px',
                fontSize: '13px',
                lineHeight: '1.5',
                color: 'var(--color-text-main)'
              }}
            >
              {step}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', height: '48px', fontSize: '14px' }}
            onClick={onClose}
          >
            <ShieldCheck size={18} />
            Understood, Return to Rescue Hub
          </button>
        </div>
      </div>
    </div>
  );
}
