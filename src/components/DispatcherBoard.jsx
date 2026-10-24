import React, { useState } from 'react';
import { MapPin, CheckCircle2, UserCheck, MessageSquare, Phone, ArrowRight, HeartHandshake } from 'lucide-react';

export default function DispatcherBoard({
  tickets,
  onClaimTicket,
  onUpdateTicketStatus,
  onSelectTicketAndTrack,
  isAuthenticated,
  onRequireSignIn,
}) {
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTickets = tickets.filter(t => {
    const matchesUrgency = filterUrgency === 'all' || t.urgency === filterUrgency;
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'unconnected' 
        ? ['reported', 'broadcasted'].includes(t.status)
        : t.status === filterStatus;

    return matchesUrgency && matchesStatus;
  });

  return (
    <div className="site-container" style={{ padding: '36px 20px' }}>
      {/* Community Banner */}
      <div className="rescue-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ffffff)', border: '1.5px solid #99f6e4', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--color-primary-bg)', 
              color: 'var(--color-primary)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #ccfbf1',
              flexShrink: 0
            }}>
              <HeartHandshake size={26} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-dark)' }}>
                Community Volunteer & Rescuer Grid
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '2px' }}>
                Open Stray Animal Distress Calls
              </h1>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                Citizens who need local volunteer transport, net capture, or foster support.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="status-pill critical" style={{ fontSize: '11px', padding: '6px 12px' }}>
              {filteredTickets.length} Open Incidents
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips-row">
        <button 
          className={`filter-chip ${filterUrgency === 'all' ? 'active' : ''}`}
          onClick={() => setFilterUrgency('all')}
        >
          All Urgencies
        </button>
        <button 
          className={`filter-chip ${filterUrgency === 'critical' ? 'active' : ''}`}
          onClick={() => setFilterUrgency('critical')}
        >
          🔴 Critical Emergencies Only
        </button>
        <button 
          className={`filter-chip ${filterUrgency === 'severe' ? 'active' : ''}`}
          onClick={() => setFilterUrgency('severe')}
        >
          🟠 Severe Distress
        </button>
      </div>

      {/* Responsive Grid of Distress Tickets (2-Column on Desktop) */}
      <div className="web-grid-2">
        {filteredTickets.length === 0 ? (
          <div className="rescue-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 800, fontSize: '18px' }}>No Open Distress Calls</div>
            <div style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              All reported animals have been connected with volunteers or ambulances!
            </div>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={`rescue-card ${ticket.urgency === 'critical' ? 'urgent-critical' : 'urgent-moderate'}`}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '14px', color: 'var(--color-text-main)' }}>
                      #{ticket.id}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>
                      • {ticket.timestamp}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className={`status-pill ${ticket.urgency}`}>
                      {ticket.urgency}
                    </span>
                    <span className="status-pill in-progress">
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <img 
                    src={ticket.photo || `${import.meta.env.BASE_URL}favicon.svg`}
                    alt={ticket.title}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: 'var(--radius-md)', 
                      objectFit: 'cover',
                      flexShrink: 0 
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.25 }}>
                      {ticket.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      <MapPin size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.location}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                      <strong>Landmark:</strong> {ticket.landmark}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '12px', background: 'var(--color-surface-dim)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  "{ticket.notes}"
                </p>

                {ticket.nearestFacility && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '8px 12px', 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'var(--color-secondary-bg)', 
                    border: '1px solid #fed7aa',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: 'var(--color-secondary-dark)', fontWeight: 700 }}>
                      Nearest Hospital: {ticket.nearestFacility.name} ({ticket.nearestFacility.distance})
                    </span>
                    <a 
                      href={`tel:${ticket.nearestFacility.phone.replace(/[^0-9+]/g, '')}`}
                      style={{ color: 'var(--color-secondary-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Phone size={12} /> Call Desk
                    </a>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)' }}>
                    Finder:
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>
                    {ticket.reportedBy}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {ticket.status === 'broadcasted' || ticket.status === 'reported' ? (
                    <button 
                      className="btn-primary"
                      style={{ fontSize: '12.5px', minHeight: '38px', padding: '0 14px' }}
                      onClick={() => {
                        if (!isAuthenticated) {
                          onRequireSignIn();
                          return;
                        }
                        onClaimTicket(ticket.id);
                      }}
                    >
                      <UserCheck size={14} />
                      {isAuthenticated ? 'I Can Help / Offer Transport' : 'Sign in to help'}
                    </button>
                  ) : ticket.status !== 'resolved' ? (
                    <button 
                      className="btn-secondary"
                      style={{ fontSize: '12.5px', minHeight: '38px', padding: '0 12px' }}
                      onClick={() => {
                        if (!isAuthenticated) {
                          onRequireSignIn();
                          return;
                        }
                        const statuses = ['broadcasted', 'connected', 'help-arrived', 'at-facility', 'resolved'];
                        const nextIdx = (statuses.indexOf(ticket.status) + 1) % statuses.length;
                        onUpdateTicketStatus(ticket.id, statuses[nextIdx]);
                      }}
                    >
                      Advance Status
                    </button>
                  ) : (
                    <span className="status-pill in-progress">Resolved</span>
                  )}

                  {ticket.reporterPhone && (
                    <a
                      href={`https://wa.me/${ticket.reporterPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ticket.reportedBy}, I saw your animal distress call on WOOF Connect for Case #${ticket.id}. I am in the area and would like to assist.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      style={{ fontSize: '12.5px', minHeight: '38px', padding: '0 12px' }}
                      title="WhatsApp Citizen Finder"
                    >
                      <MessageSquare size={14} />
                      WhatsApp
                    </a>
                  )}

                  <button 
                    className="btn-secondary"
                    style={{ fontSize: '12.5px', minHeight: '38px', padding: '0 12px' }}
                    onClick={() => onSelectTicketAndTrack(ticket.id)}
                    title="Track Connection Status"
                  >
                    Track
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
