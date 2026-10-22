import React, { useState } from 'react';
import { VERIFIED_CENTERS, FIRST_AID_GUIDES, CITIES } from '../data/mockData';
import { Phone, Navigation, AlertCircle, ArrowRight, CheckCircle2, HeartPulse, Radio, Search, ShieldCheck, Timer, Star, LogIn, BadgeAlert, Sparkles, KeyRound } from 'lucide-react';

export default function EmergencyHub({
  activeCity,
  onOpenReport,
  onNavigateTab,
  onOpenFirstAid,
  onOpenLoginPass,
  onFastLoginRole
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Dispatcher');
  const [demoLoginStatus, setDemoLoginStatus] = useState(false);

  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  const filteredCenters = VERIFIED_CENTERS.filter(center => {
    const matchesCity = center.cityId === activeCity;
    const matchesType = filterType === 'all' || center.type === filterType;
    const matchesSearch = searchQuery === '' || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesType && matchesSearch;
  });

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setDemoLoginStatus(true);
    setTimeout(() => {
      onFastLoginRole(selectedRole);
      onNavigateTab('community');
    }, 600);
  };

  return (
    <div>
      {/* ==========================================================================
          STITCH HERO SECTION
          ========================================================================== */}
      <section className="stitch-hero">
        <div className="stitch-hero-glow-1"></div>
        <div className="stitch-hero-glow-2"></div>

        <div className="site-container">
          <div className="stitch-hero-grid">
            {/* Left Hero Column */}
            <div>
              {/* Status Indicator Pill from Stitch */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: 'var(--color-surface-container)', 
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span className="live-pulse-dot" style={{ backgroundColor: '#10b981', width: '8px', height: '8px' }}></span>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                  Unified Emergency Network Active
                </span>
                <span style={{ 
                  background: 'var(--color-secondary-fixed)', 
                  color: 'var(--color-on-secondary-fixed)', 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-full)' 
                }}>
                  {currentCityObj.name} Sector
                </span>
              </div>

              {/* Stitch Hero Headline with Highlighter Effect */}
              <h1 className="stitch-hero-title">
                Every Life Deserves a <span className="highlight-underline">Swift Rescue.</span>
              </h1>

              <p style={{ fontSize: '16.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '600px' }}>
                Immediate compassionate care, 24/7 autonomous volunteer dispatch, and state-certified clinic triage for companion animals and distressed street animals in <strong>{currentCityObj.name}</strong>.
              </p>

              {/* Stitch Primary Dual Action Dock */}
              <div className="stitch-action-dock">
                <button 
                  className="btn-hero-emergency"
                  onClick={onOpenReport}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>emergency</span>
                  <span>Report Animal in Need</span>
                </button>

                <button 
                  className="btn-hero-shelter"
                  onClick={() => onNavigateTab('directory')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary-fixed)' }}>near_me</span>
                  <span>Find Open Shelter</span>
                </button>
              </div>

              {/* Stitch Proof Banner & Face Cluster */}
              <div className="proof-cluster">
                <div className="avatar-stack">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" 
                    alt="Responder Field Operative" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                    alt="Veterinary Medic" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                    alt="Volunteer Rescuer" 
                  />
                  <div className="avatar-more">+8k</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-secondary)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    8,940+ Animals Saved & Reunited
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>
                    Validated rescue logs across 14 municipal zones in India
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Showcase Card Stack from Stitch */}
            <div className="showcase-card">
              <div className="showcase-photo-container">
                <img 
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" 
                  alt="Rescued companion dog and cat resting peacefully" 
                />
                
                {/* Floating Triage Tag Top-Left */}
                <div className="floating-tag-top-left">
                  <span className="live-pulse-dot" style={{ backgroundColor: '#10b981', width: '7px', height: '7px' }}></span>
                  <span>Status: Safe • In Clinical Triage</span>
                </div>

                {/* Floating Response Speed Tag Top-Right */}
                <div className="floating-tag-top-right">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>timer</span>
                  <span>11m avg speed</span>
                </div>

                {/* Bottom Floating Profile Card */}
                <div className="floating-profile-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '34px', 
                      height: '34px', 
                      borderRadius: 'var(--radius-full)', 
                      background: 'var(--color-primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pets</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                        Milo & Buttercup
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {currentCityObj.sector} (Intake #2891)
                      </div>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    background: 'var(--color-surface-container)', 
                    color: 'var(--color-primary)', 
                    padding: '3px 8px', 
                    borderRadius: 'var(--radius-full)' 
                  }}>
                    Cleared
                  </span>
                </div>
              </div>

              {/* Fast-Pass Responder Portal Login Mini-Card from Stitch */}
              <div className="responder-login-widget">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>badge</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-primary)' }}>
                      Responder Portal Sign-In
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={onOpenLoginPass} 
                    style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    View All Passes →
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 10px 0' }}>
                  Access live telemetry dispatch, claim cases, or update clinic occupancy.
                </p>

                <form onSubmit={handleDemoLogin}>
                  <div className="role-selector-row">
                    {['Field Unit', 'Dispatcher', 'Vet Clinic'].map(role => (
                      <button
                        type="button"
                        key={role}
                        className={`role-pill-btn ${selectedRole === role ? 'active' : ''}`}
                        onClick={() => setSelectedRole(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      style={{ flex: 1, minHeight: '38px', fontSize: '12.5px', padding: '0 14px' }}
                    >
                      <LogIn size={14} />
                      Enter Mission Center
                    </button>
                    <button 
                      type="button"
                      className="btn-secondary"
                      style={{ minHeight: '38px', fontSize: '12px', padding: '0 12px' }}
                      onClick={handleDemoLogin}
                      title="Instant Fast-Pass Access"
                    >
                      ⚡ Fast-Pass
                    </button>
                  </div>
                </form>

                {demoLoginStatus && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-full)', 
                    background: '#dcfce7', 
                    color: '#15803d', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    textAlign: 'center' 
                  }}>
                    Authenticated as {selectedRole} • Opening Mission Center...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          STITCH 4-CARD REAL-TIME TELEMETRY STRIP
          ========================================================================== */}
      <section className="stitch-metrics-section">
        <div className="site-container">
          <div className="stitch-metrics-grid">
            {/* Metric 1 */}
            <div className="stitch-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
                  Field Units En-Route
                </span>
                <span className="live-pulse-dot" style={{ backgroundColor: '#ba1a1a', width: '7px', height: '7px' }}></span>
              </div>
              <div className="stitch-metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                18 <span style={{ fontSize: '14px', color: 'var(--color-secondary)', fontWeight: 700 }}>Active</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                4 critical triage calls underway
              </p>
            </div>

            {/* Metric 2 */}
            <div className="stitch-metric-card" style={{ background: 'rgba(255, 219, 207, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
                  Avg Arrival Window
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>bolt</span>
              </div>
              <div className="stitch-metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                14 <span style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700 }}>minutes</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                From first alert to on-site arrival
              </p>
            </div>

            {/* Metric 3 */}
            <div className="stitch-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
                  Partner Clinics
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>local_hospital</span>
              </div>
              <div className="stitch-metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                142 <span style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700 }}>Hubs</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Live telemetry surge-beds ready
              </p>
            </div>

            {/* Metric 4 */}
            <div className="stitch-metric-card" style={{ background: 'rgba(174, 242, 194, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Certified Volunteers
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>group</span>
              </div>
              <div className="stitch-metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                3,420 <span style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700 }}>Vetted</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Transporters, fosters, & leads
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          DIRECTORY & FIRST AID PROTOCOLS
          ========================================================================== */}
      <section style={{ padding: '30px 0 60px 0' }}>
        <div className="site-container">
          {/* Verified Closest Hospitals & Ambulances Directory */}
          <div style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  Verified Emergency Facilities & Ambulances
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                  Direct ambulance hotlines and trauma bays in <strong>{currentCityObj.name}</strong>
                </p>
              </div>

              {/* Search bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '6px 14px', width: '280px', boxShadow: 'var(--shadow-sm)' }}>
                <Search size={16} style={{ color: 'var(--color-text-subtle)', marginRight: '8px' }} />
                <input 
                  type="text" 
                  placeholder="Search hospital or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips-row">
              <button 
                className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All Facilities in {currentCityObj.name}
              </button>
              <button 
                className={`filter-chip ${filterType === 'vet' ? 'active' : ''}`}
                onClick={() => setFilterType('vet')}
              >
                🚑 24/7 Trauma Bays & Ambulances
              </button>
              <button 
                className={`filter-chip ${filterType === 'shelter' ? 'active' : ''}`}
                onClick={() => setFilterType('shelter')}
              >
                🏡 Animal Shelters & Sanctuaries
              </button>
            </div>

            {/* Directory Grid */}
            <div className="web-grid-2">
              {filteredCenters.length === 0 ? (
                <div className="rescue-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                  <AlertCircle size={36} style={{ color: 'var(--color-text-muted)', margin: '0 auto 10px' }} />
                  <div style={{ fontWeight: 800, fontSize: '16px' }}>No facilities matched your search in {currentCityObj.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                    Try clearing your search query or switch city using the header selector.
                  </div>
                </div>
              ) : (
                filteredCenters.map(center => (
                  <div key={center.id} className="rescue-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <img 
                          src={center.image} 
                          alt={center.name}
                          style={{ 
                            width: '84px', 
                            height: '84px', 
                            borderRadius: 'var(--radius-md)', 
                            objectFit: 'cover',
                            flexShrink: 0 
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.25 }}>
                              {center.name}
                            </h3>
                            {center.verified && (
                              <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span className="status-pill severe" style={{ fontSize: '11px' }}>
                              {center.openStatus}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                              • Approx {center.distance} away
                            </span>
                          </div>

                          <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)', marginTop: '6px' }}>
                            {center.address}
                          </p>
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {center.capabilities.map((cap, i) => (
                          <span 
                            key={i}
                            style={{ 
                              fontSize: '11px', 
                              fontWeight: 700, 
                              background: 'var(--color-surface-container)', 
                              color: 'var(--color-text-muted)', 
                              padding: '3px 8px', 
                              borderRadius: '4px' 
                            }}
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
                      <a 
                        href={`tel:${center.ambulancePhone.replace(/[^0-9+]/g, '')}`}
                        className="btn-primary"
                        style={{ fontSize: '13px', minHeight: '42px' }}
                      >
                        <Phone size={14} />
                        Call Ambulance Desk
                      </a>
                      <a 
                        href={center.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '13px', minHeight: '42px' }}
                      >
                        <Navigation size={14} />
                        Directions in Maps
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* First Aid Guidelines Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  While Help Is On The Way: Emergency First Aid
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                  Immediate triage protocols for citizen finders while waiting for ambulances or volunteers
                </p>
              </div>
              <HeartPulse size={24} style={{ color: 'var(--color-secondary)' }} />
            </div>

            <div className="web-grid-2">
              {Object.entries(FIRST_AID_GUIDES).map(([key, guide]) => (
                <div 
                  key={key}
                  className="rescue-card"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    padding: '20px',
                    cursor: 'pointer'
                  }}
                  onClick={() => onOpenFirstAid(guide)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--color-secondary-fixed)', 
                        color: 'var(--color-on-secondary-fixed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                          {guide.icon}
                        </span>
                      </div>
                      <span className="status-pill severe" style={{ fontSize: '10.5px' }}>
                        {guide.badge}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>
                      {guide.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                      {guide.steps[0]}
                    </p>
                  </div>

                  <button 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '12.5px', 
                      fontWeight: 800, 
                      color: 'var(--color-primary)', 
                      marginTop: '16px' 
                    }}
                  >
                    Read Full Step-by-Step Protocol
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
