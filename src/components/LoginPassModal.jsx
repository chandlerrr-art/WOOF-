import React, { useState } from 'react';
import { ArrowRight, KeyRound, ShieldCheck, UserRound, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPassModal({
  isOpen,
  onClose,
  currentPass,
  isBackendConfigured,
  onSignOut,
}) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);

    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name.trim() } },
        });
        if (authError) throw authError;
        if (!data.session) {
          setNotice('Check your email to confirm your account, then sign in.');
        } else {
          onClose();
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        onClose();
      }
    } catch (authError) {
      setError(authError.message || 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    setBusy(true);
    try {
      await onSignOut();
      onClose();
    } catch (signOutError) {
      setError(signOutError.message || 'Could not sign out.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="responder-login-title"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '520px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <span className="status-pill in-progress" style={{ fontSize: '10px' }}>Responder account</span>
              <h2 id="responder-login-title" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>
                {currentPass ? 'Your WOOF account' : 'Responder sign-in'}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close sign-in">
            <X size={20} />
          </button>
        </div>

        {currentPass ? (
          <div>
            <div className="rescue-card" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserRound size={28} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{currentPass.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{currentPass.role}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{currentPass.status}</div>
                </div>
              </div>
            </div>
            <button type="button" className="btn-secondary" disabled={busy} onClick={handleSignOut}>
              {busy ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : !isBackendConfigured ? (
          <div role="status" style={{ padding: '14px', background: '#fff7ed', color: '#9a3412', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
            Real sign-in is unavailable in demo mode. Connect the Supabase project to enable responder accounts.
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              Create an account or sign in to claim a rescue report. Accounts are community accounts and are not independently verified.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['signin', 'signup'].map((nextMode) => (
                <button
                  key={nextMode}
                  type="button"
                  className={mode === nextMode ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => {
                    setMode(nextMode);
                    setError('');
                    setNotice('');
                  }}
                  style={{ flex: 1, minHeight: '40px' }}
                >
                  {nextMode === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mode === 'signup' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="responder-name">Display name</label>
                  <input
                    id="responder-name"
                    className="form-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                </div>
              )}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="responder-email">Email</label>
                <input
                  id="responder-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="responder-password">Password</label>
                <input
                  id="responder-password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={8}
                  required
                />
              </div>
              {error && <div role="alert" style={{ color: '#b91c1c', fontSize: '13px' }}>{error}</div>}
              {notice && <div role="status" style={{ color: 'var(--color-primary)', fontSize: '13px' }}>{notice}</div>}
              <button type="submit" className="btn-primary" disabled={busy} style={{ minHeight: '46px', marginTop: '4px' }}>
                <KeyRound size={16} />
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create responder account' : 'Sign in'}
                {!busy && <ArrowRight size={15} />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
