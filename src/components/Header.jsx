import React from 'react';
import { CITIES } from '../data/mockData';
import { Smartphone, Monitor, ShieldCheck, HeartHandshake, Users } from 'lucide-react';

export default function Header({
  activeCity,
  setActiveCity,
  isMobileView,
  setIsMobileView,
  onOpenReport
}) {
  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-badge">
            <span className="material-symbols-outlined fill-1" style={{ fontSize: '24px' }}>pets</span>
          </div>
          <div className="brand-title-group">
            <h1>
              WOOF <span className="india-badge">Connect</span>
            </h1>
            <span className="brand-subtitle">Emergency Stray Animal Connection Portal</span>
          </div>
        </div>

        <div className="header-actions">
          <select 
            className="city-select"
            value={activeCity}
            onChange={(e) => setActiveCity(e.target.value)}
            aria-label="Select City"
          >
            {CITIES.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <button
            className="view-mode-toggle"
            onClick={() => setIsMobileView(!isMobileView)}
            title={isMobileView ? "Switch to Wide Desktop View" : "Switch to Mobile Field View"}
            aria-label="Toggle View Mode"
          >
            {isMobileView ? <Monitor size={18} /> : <Smartphone size={18} />}
          </button>
        </div>
      </header>

      {/* Modern Connecting Portal Mission Subheader */}
      <div className="portal-tagline-bar">
        <span>
          <span className="live-pulse-dot" style={{ width: '7px', height: '7px' }}></span>
          <span>Direct Connection Grid: <strong>{currentCityObj.sector}</strong></span>
        </span>
        <span className="pill-tag">
          Connecting Portal
        </span>
      </div>
    </>
  );
}
