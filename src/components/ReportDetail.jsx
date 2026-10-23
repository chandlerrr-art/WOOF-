import { MapPin, Navigation, Phone } from 'lucide-react';
import RescueMap from './RescueMap';
import { mapsDirectionsUrl } from '../lib/geo';
import { nextStatus, statusLabel, statusTone, urgencyLabel } from '../lib/status';

export default function ReportDetail({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onClaimTicket,
  onUpdateTicketStatus,
  isAuthenticated,
  onRequireSignIn,
  userLocation,
}) {
  const current = tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0];

  if (!current) {
    return (
      <section className="page">
        <div className="empty">
          <h1>No report selected</h1>
          <p>Submit a report or open one from the board.</p>
        </div>
      </section>
    );
  }

  const point = Number.isFinite(current.lat) && Number.isFinite(current.lng)
    ? { lat: current.lat, lng: current.lng }
    : null;
  const upcoming = nextStatus(current.status);

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Report {current.id}</p>
          <h1>{current.title}</h1>
        </div>
        {tickets.length > 1 && (
          <label className="select-label">
            Other reports
            <select value={current.id} onChange={(event) => onSelectTicket(event.target.value)}>
              {tickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>{ticket.id} · {ticket.species}</option>
              ))}
            </select>
          </label>
        )}
      </header>

      <div className="detail-layout">
        <div>
          <div className={`report-card tone-${statusTone(current.status)}`}>
            <div className="report-card-meta">
              <span className={`status-pill ${current.urgency}`}>{urgencyLabel(current.urgency)}</span>
              <span className={`status-pill ${statusTone(current.status)}`}>{statusLabel(current.status)}</span>
            </div>
            {current.photo && !current.photo.startsWith('blob:') && (
              <img className="detail-photo" src={current.photo} alt="Submitted with this report" />
            )}
            <p><MapPin size={14} /> {current.location}</p>
            <p className="meta">Landmark: {current.landmark}</p>
            {current.notes && <p>{current.notes}</p>}
            <p className="meta">Logged {current.timestamp}</p>
            {current.reporterPhone && (
              <a className="btn-secondary" href={`tel:${current.reporterPhone.replace(/[^0-9+]/g, '')}`}>
                <Phone size={14} /> Call reporter
              </a>
            )}
          </div>

          {point && (
            <div className="detail-map-wrap">
              <RescueMap className="rescue-map compact-lg" reportPoint={point} userLocation={userLocation} />
              <a className="btn-secondary" href={mapsDirectionsUrl(userLocation, point)} target="_blank" rel="noopener noreferrer">
                <Navigation size={16} /> Open report location in Google Maps
              </a>
            </div>
          )}
        </div>

        <aside className="side-stack">
          <div className="panel">
            <h2>Status</h2>
            <p>Open → Claimed → In progress → Resolved. Only the assigned responder can advance a connected report.</p>
            {['reported', 'broadcasted'].includes(current.status) ? (
              <button
                type="button"
                className="btn-primary full"
                onClick={() => (isAuthenticated ? onClaimTicket(current.id) : onRequireSignIn())}
              >
                {isAuthenticated ? 'Claim this report' : 'Sign in to claim'}
              </button>
            ) : upcoming ? (
              <button
                type="button"
                className="btn-primary full"
                onClick={() => (isAuthenticated ? onUpdateTicketStatus(current.id, upcoming) : onRequireSignIn())}
              >
                {isAuthenticated ? `Mark as ${statusLabel(upcoming)}` : 'Sign in to update'}
              </button>
            ) : (
              <p>This report is resolved.</p>
            )}
          </div>

          {current.connectedResponder && (
            <div className="panel">
              <h2>Claimed by</h2>
              <p>{current.connectedResponder.name}</p>
              <p className="meta">{current.connectedResponder.role}</p>
            </div>
          )}

          <div className="panel">
            <h2>Activity</h2>
            <ol className="timeline">
              {(current.timeline || []).map((entry, index) => (
                <li key={`${entry.time}-${index}`}>
                  <span>{entry.time}</span>
                  <span>{entry.event} — {entry.actor}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
