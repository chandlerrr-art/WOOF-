import React, { useState } from 'react';
import { CITIES } from '../data/mockData';
import { Menu, X, KeyRound } from 'lucide-react';

export default function Navbar({
  activeCity,
  setActiveCity,
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenLoginPass,
  currentPass,
  openIncidentsCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* A concise description of the community feed */}
      <div className="stitch-ticker-bar">
        <div className="stitch-ticker-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005c65', letterSpacing: '0.05em' }}>
              Neighbourhood animal care
            </span>
            <span style={{ color: 'var(--color-border)', margin: '0 4px' }}>•</span>
            <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Reports, local services, and community support in {currentCityObj.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>favorite</span>
              Neighbours helping neighbours
            </span>
          </div>
        </div>
      </div>

      {/* Stitch Main Desktop Navbar */}
      <header className="stitch-navbar">
        <div className="site-container">
          <div className="stitch-navbar-inner">
            {/* Brand Mark & Title */}
            <div className="nav-brand" onClick={() => handleNavClick('hub')} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="brand-badge">
                <span className="material-symbols-outlined fill-1" style={{ fontSize: '24px' }}>pets</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  WOOF
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em', marginTop: '3px' }}>
                  Neighbourhood animal care
                </span>
              </div>
            </div>

            {/* Stitch Pill Navigation Dock */}
            <nav className="stitch-nav-dock" aria-label="Main navigation">
              <button 
                className={`stitch-nav-btn ${activeTab === 'hub' ? 'active' : ''}`}
                onClick={() => handleNavClick('hub')}
              >
                Home
              </button>

              <button 
                className={`stitch-nav-btn ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => handleNavClick('tracker')}
              >
                Reports & updates
              </button>

              <button 
                className={`stitch-nav-btn ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => handleNavClick('community')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Community reports
                {openIncidentsCount > 0 && (
                  <span style={{ 
                    background: 'var(--color-secondary)', 
                    color: 'white', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    padding: '1px 6px', 
                    borderRadius: 'var(--radius-full)' 
                  }}>
                    {openIncidentsCount}
                  </span>
                )}
              </button>

              <button 
                className={`stitch-nav-btn ${activeTab === 'directory' ? 'active' : ''}`}
                onClick={() => handleNavClick('directory')}
              >
                Find local care
              </button>
            </nav>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* City Selector */}
              <select 
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                aria-label="Choose city"
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--color-border)',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>
                    📍 {city.name}
                  </option>
                ))}
              </select>

              {/* Portal Login Pass Button from Stitch */}
              {currentPass ? (
                <button 
                  onClick={onOpenLoginPass}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-full)', 
                    background: 'var(--color-primary-fixed)', 
                    color: 'var(--color-on-primary-fixed)', 
                    fontSize: '12px', 
                    fontWeight: 800,
                    border: '1px solid var(--color-primary-fixed-dim)',
                    cursor: 'pointer'
                  }}
                  title="View community responder account"
                >
                  <img 
                    src={currentPass.avatar} 
                    alt={currentPass.name} 
                    style={{ width: '22px', height: '22px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }} 
                  />
                  <span>Pass: {currentPass.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button 
                  onClick={onOpenLoginPass}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '8px 14px', 
                    borderRadius: 'var(--radius-full)', 
                    background: 'var(--color-surface-container)', 
                    color: 'var(--color-primary)', 
                    fontSize: '12.5px', 
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <KeyRound size={14} />
                  <span>Portal Login</span>
                </button>
              )}

              {/* Glowing Report Emergency Button */}
              <button 
                className="btn-stitch-sos"
                onClick={onOpenReport}
                aria-label="Report an emergency"
              >
                <span className="live-pulse-dot" style={{ backgroundColor: '#ba1a1a', width: '7px', height: '7px' }}></span>
                <span>Report Emergency</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                style={{ marginLeft: '4px' }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{ 
            background: '#ffffff', 
            borderBottom: '1px solid var(--color-border)', 
            padding: '16px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
          }}>
            <button 
              className={`stitch-nav-btn ${activeTab === 'hub' ? 'active' : ''}`}
              onClick={() => handleNavClick('hub')}
              style={{ textAlign: 'left', borderRadius: 'var(--radius-md)' }}
            >
              Home
            </button>
            <button 
              className={`stitch-nav-btn ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => handleNavClick('tracker')}
              style={{ textAlign: 'left', borderRadius: 'var(--radius-md)' }}
            >
              Reports & updates
            </button>
            <button 
              className={`stitch-nav-btn ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => handleNavClick('community')}
              style={{ textAlign: 'left', borderRadius: 'var(--radius-md)' }}
            >
              Community reports ({openIncidentsCount} open)
            </button>
            <button 
              className={`stitch-nav-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => handleNavClick('directory')}
              style={{ textAlign: 'left', borderRadius: 'var(--radius-md)' }}
            >
              Find local care
            </button>
            <button 
              onClick={() => { onOpenLoginPass(); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-container)', color: 'var(--color-primary)', fontWeight: 700 }}
            >
              🔑 Responder Portal Login / Access Pass
            </button>
          </div>
        )}
      </header>
    </>
  );
}
