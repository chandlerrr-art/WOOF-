import React, { useState } from 'react';
import { VERIFIED_CENTERS, FIRST_AID_GUIDES, CITIES } from '../data/mockData';
import { Phone, Navigation, AlertCircle, ArrowRight, CheckCircle2, HeartPulse, MapPin, Search } from 'lucide-react';

export default function EmergencyHub({
  activeCity,
  onOpenReport,
  onNavigateTab,
  onOpenFirstAid,
  onOpenLoginPass
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  const filteredCenters = VERIFIED_CENTERS.filter(center => {
    const matchesCity = center.cityId === activeCity;
    const matchesType = filterType === 'all' || center.type === filterType;
    const matchesSearch = searchQuery === '' || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesType && matchesSearch;
  });

  return (
    <div>
      {/* Main introduction */}
      <section className="stitch-hero">
        <div className="stitch-hero-glow-1"></div>
        <div className="stitch-hero-glow-2"></div>

        <div className="site-container">
          <div className="stitch-hero-grid">
            {/* Left Hero Column */}
            <div>
              {/* Location context */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: 'var(--color-surface-container)', 
                boxShadow: 'var(--shadow-sm)'
              }}>
                <MapPin size={15} style={{ color: 'var(--color-secondary)' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                  Local help for animals in need
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
                A little help can <span className="highlight-underline">change everything.</span>
              </h1>

              <p style={{ fontSize: '16.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '600px' }}>
                Found an animal who needs care? Share what you see, find nearby animal-care services, or browse reports from your community in <strong>{currentCityObj.name}</strong>.
              </p>

              {/* Stitch Primary Dual Action Dock */}
              <div className="stitch-action-dock">
                <button 
                  className="btn-hero-emergency"
                  onClick={onOpenReport}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>emergency</span>
                  <span>Tell us what happened</span>
                </button>

                <button 
                  className="btn-hero-shelter"
                  onClick={() => onNavigateTab('directory')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary-fixed)' }}>near_me</span>
                  <span>Find local care</span>
                </button>
              </div>

              <div className="hero-note">
                <span className="hero-note-mark"><HeartPulse size={17} /></span>
                <span>Start with the details you have. You can add a photo and location when you report.</span>
              </div>
            </div>

            {/* Right Hero Column: Showcase Card Stack from Stitch */}
            <div className="showcase-card">
              <div className="showcase-photo-container">
                <img 
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" 
                  alt="Rescued companion dog and cat resting peacefully" 
                />
                
                {/* Photo-led introduction */}
                <div className="floating-tag-top-left">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>favorite</span>
                    <span>Care begins with noticing</span>
                </div>

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
                        Every animal deserves a hand
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        A community starts with one person
                      </div>
                    </div>
                  </div>
                  <span className="photo-credit">WOOF community</span>
                </div>
              </div>

              {/* Responder account entry */}
              <div className="responder-login-widget">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>badge</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-primary)' }}>
                      For community responders
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={onOpenLoginPass} 
                    style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    Sign in / create account →
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 10px 0' }}>
                  Sign in to volunteer for a report and share case updates. Accounts are community sign-ins, not professional credentials.
                </p>

                <button type="button" className="btn-primary" onClick={onOpenLoginPass} style={{ width: '100%', minHeight: '38px', fontSize: '12.5px' }}>
                  Responder sign-in
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A clear explanation of what people can do */}
      <section className="stitch-metrics-section">
        <div className="site-container">
          <div className="section-intro">
            <span className="eyebrow">A practical place to start</span>
            <h2>Small steps, shared locally.</h2>
            <p>WOOF helps people nearby find each other and the care an animal may need.</p>
          </div>
          <div className="stitch-metrics-grid how-it-works-grid">
            <div className="stitch-metric-card">
              <span className="step-number">01</span>
              <h3>Share what you see</h3>
              <p>Add a description, where the animal is, and a photo if it’s safe to take one.</p>
            </div>
            <div className="stitch-metric-card">
              <span className="step-number">02</span>
              <h3>Reach people nearby</h3>
              <p>Your report appears in the community feed so local responders can see it.</p>
            </div>
            <div className="stitch-metric-card">
              <span className="step-number">03</span>
              <h3>Find a next step</h3>
              <p>Browse local clinics and shelters, or follow updates as the community responds.</p>
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
                  Animal care near you
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                  Contact details for animal-care organizations in <strong>{currentCityObj.name}</strong>. Please call ahead to confirm availability.
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
                🚑 Veterinary care
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
