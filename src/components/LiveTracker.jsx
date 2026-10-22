import React from 'react';
import { Phone, Navigation, Clock, CheckCircle2, AlertCircle, MessageSquare, MapPin, ShieldAlert, ArrowRight, HeartHandshake, Compass } from 'lucide-react';

const CONNECTION_STEPS = [
  { id: 'reported', label: '1. Logged', icon: 'campaign' },
  { id: 'broadcasted', label: '2. Broadcasted', icon: 'share' },
  { id: 'connected', label: '3. Connected', icon: 'handshake' },
  { id: 'help-arrived', label: '4. Help Reached', icon: 'location_on' },
  { id: 'at-facility', label: '5. At Clinic', icon: 'local_hospital' },
  { id: 'resolved', label: '6. Resolved', icon: 'task_alt' }
];

export default function LiveTracker({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onUpdateTicketStatus,
  onClaimTicket,
  isAuthenticated,
  onRequireSignIn,
}) {
  const currentTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  if (!currentTicket) {
    return (
      <div className="site-container" style={{ padding: '60px 20px' }}>
        <div className="rescue-card" style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={44} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>No Active Rescue Connections Found</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Broadcast an emergency distress call to track nearest volunteers and ambulance connections.
          </p>
        </div>
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'reported': return 0;
      case 'broadcasted': return 1;
      case 'connected': return 2;
      case 'en-route': return 2;
      case 'help-arrived': return 3;
      case 'on-scene': return 3;
      case 'at-facility': return 4;
      case 'in-clinic': return 4;
      case 'resolved': return 5;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(currentTicket.status);

  const handleAdvanceStatus = () => {
    if (!currentTicket.connectedResponder) {
      onClaimTicket(currentTicket.id);
      return;
    }
    const statuses = ['reported', 'broadcasted', 'connected', 'help-arrived', 'at-facility', 'resolved'];
    const nextIdx = (statuses.indexOf(currentTicket.status) + 1) % statuses.length;
    onUpdateTicketStatus(currentTicket.id, statuses[nextIdx]);
  };

  return (
    <div className="site-container" style={{ padding: '36px 20px' }}>
      {/* Top Header & Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="live-pulse-dot"></span>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
              Live Coordination Telemetry
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>
            Case Connection Status: #{currentTicket.id}
          </h1>
        </div>

        {/* Case Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            Select Active Case:
          </span>
          <select
            value={currentTicket.id}
            onChange={(e) => onSelectTicket(e.target.value)}
            className="city-dropdown"
            style={{ border: 'none', boxShadow: 'none', padding: '4px 8px', fontWeight: 700 }}
          >
            {tickets.map(t => (
              <option key={t.id} value={t.id}>
                #{t.id} - {t.species} ({t.urgency.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modern 2-Column Split Layout on Desktop */}
      <div className="web-grid-2">
        {/* Left Column: Incident Details & Live Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className={`rescue-card ${currentTicket.urgency === 'critical' ? 'urgent-critical' : 'urgent-moderate'}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Distress Ticket
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  #{currentTicket.id}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`status-pill ${currentTicket.urgency}`}>
                  {currentTicket.urgency}
                </span>
                <span className="status-pill in-progress">
                  {currentTicket.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <img 
                src={currentTicket.photo || `${import.meta.env.BASE_URL}favicon.svg`}
                alt={currentTicket.title}
                style={{ 
                  width: '84px', 
                  height: '84px', 
                  borderRadius: 'var(--radius-md)', 
                  objectFit: 'cover', 
                  flexShrink: 0 
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.25 }}>
                  {currentTicket.title}
                </h3>
                
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                  <span>{currentTicket.location}</span>
                </p>

                <p style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
                  <strong>Landmark:</strong> {currentTicket.landmark}
                </p>
              </div>
            </div>

            <div style={{ 
              marginTop: '14px', 
              padding: '10px 14px', 
              background: 'var(--color-surface-dim)', 
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              borderLeft: '3px solid var(--color-primary)'
            }}>
              "{currentTicket.notes}"
            </div>
          </div>

          {/* Simulated Route Map */}
          <div className="simulated-map" style={{ height: '280px' }}>
            <div className="map-grid-overlay"></div>
            <div className="map-route-line"></div>

            <div className="map-marker" style={{ top: '50%', left: '20%' }}>
              <div className="map-marker-pin" style={{ background: 'var(--color-secondary)' }}>
                <span className="material-symbols-outlined fill-1" style={{ fontSize: '18px' }}>pets</span>
              </div>
              <span className="map-marker-label">Animal Location</span>
            </div>

            <div className="map-marker" style={{ top: '50%', left: '55%' }}>
              <div className="map-marker-pin" style={{ background: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>handshake</span>
              </div>
              <span className="map-marker-label">
                {currentTicket.connectedResponder?.name ? 'Connected Helper' : 'Volunteers Alerted'}
              </span>
            </div>

            <div className="map-marker" style={{ top: '50%', left: '85%' }}>
              <div className="map-marker-pin" style={{ background: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_hospital</span>
              </div>
              <span className="map-marker-label">Nearest Vet Bay</span>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Milestones, Helper Profile & Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Milestones Stepper */}
          <div className="rescue-card" style={{ padding: '20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Connection Milestones
              </span>
              <button 
                onClick={() => {
                  if (currentTicket.status === 'resolved') return;
                  if (!isAuthenticated) {
                    onRequireSignIn();
                    return;
                  }
                  handleAdvanceStatus();
                }}
                disabled={currentTicket.status === 'resolved'}
                style={{ 
                  fontSize: '11.5px', 
                  fontWeight: 800, 
                  color: 'var(--color-primary)', 
                  background: 'var(--color-primary-bg)', 
                  border: '1px solid #ccfbf1',
                  padding: '4px 10px', 
                  borderRadius: 'var(--radius-full)' 
                }}
                title={isAuthenticated ? 'Advance the assigned rescue report' : 'Sign in to update a rescue report'}
              >
                {currentTicket.status === 'resolved'
                  ? 'Case resolved'
                  : !isAuthenticated
                  ? 'Sign in to update'
                  : currentTicket.connectedResponder
                    ? 'Advance Status'
                    : 'Claim this case'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {['Logged', 'Shared', 'Connected', 'On Scene', 'At Clinic', 'Safe'].map((stepName, i) => {
                const isCompleted = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;

                return (
                  <div 
                    key={stepName}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      flex: 1, 
                      textAlign: 'center',
                      zIndex: 2
                    }}
                  >
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: 'var(--radius-full)', 
                      background: isCompleted ? 'var(--color-primary)' : 'var(--color-surface-dim)', 
                      color: isCompleted ? 'white' : 'var(--color-text-subtle)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      boxShadow: isCurrent ? '0 0 0 3px var(--color-primary-glow)' : 'none',
                      transition: 'all 200ms ease'
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: isCurrent ? 800 : 600, 
                      color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)', 
                      marginTop: '6px',
                      lineHeight: '1.2'
                    }}>
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Responder Card */}
          {currentTicket.connectedResponder ? (
            <div className="rescue-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ffffff)', border: '1.5px solid #99f6e4' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '10px' }}>
                Connected Community Responder
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: 'var(--radius-full)', 
                    background: 'var(--color-primary-bg)', 
                    color: 'var(--color-primary-dark)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '18px',
                    border: '1px solid #ccfbf1'
                  }}>
                    {currentTicket.connectedResponder.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15.5px', color: 'var(--color-text-main)' }}>
                      {currentTicket.connectedResponder.name}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                      {currentTicket.connectedResponder.role}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700, marginTop: '2px' }}>
                      {currentTicket.connectedResponder.action}
                    </div>
                  </div>
                </div>

                {currentTicket.connectedResponder.phone && (
                  <a
                    href={`tel:${currentTicket.connectedResponder.phone.replace(/[^0-9+]/g, '')}`}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <Phone size={14} />
                    Call Helper
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="rescue-card" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#ea580c' }}>
                    Awaiting Community Volunteer Connection
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#9a3412', marginTop: '2px' }}>
                    Distress call is live on the city volunteer grid & WhatsApp network
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ fontSize: '12.5px', padding: '8px 14px' }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      onRequireSignIn();
                      return;
                    }
                    onClaimTicket(currentTicket.id);
                  }}
                >
                  {isAuthenticated ? 'I Can Help / Claim Case' : 'Sign in to claim case'}
                </button>
              </div>
            </div>
          )}

          {/* Hospital Referral */}
          {currentTicket.nearestFacility && (
            <div className="rescue-card">
              <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Closest Emergency Hospital & Ambulance Desk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-main)' }}>
                    {currentTicket.nearestFacility.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                    Approx {currentTicket.nearestFacility.distance} from incident location
                  </div>
                </div>
                <a 
                  href={`tel:${currentTicket.nearestFacility.phone.replace(/[^0-9+]/g, '')}`}
                  className="btn-emergency-trigger"
                  style={{ width: 'auto', minHeight: '40px', padding: '0 16px', fontSize: '13px' }}
                >
                  <Phone size={14} />
                  Call Hospital Desk
                </a>
              </div>
            </div>
          )}

          {/* Incident Timeline Log */}
          <div className="rescue-card">
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              Connection Activity Log
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentTicket.timeline?.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-secondary-dark)', flexShrink: 0 }}>
                    {entry.time}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>
                      {entry.event}
                    </span>
                    <span style={{ color: 'var(--color-text-subtle)', marginLeft: '6px', fontSize: '11.5px' }}>
                      — {entry.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
