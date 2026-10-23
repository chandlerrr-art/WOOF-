import { useMemo, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { statusLabel, statusTone, urgencyLabel } from '../lib/status';

function Photo({ src, alt }) {
  if (!src || src.startsWith('blob:')) {
    return <div className="photo-fallback" aria-hidden="true" />;
  }
  return <img src={src} alt={alt} />;
}

export default function ReportBoard({
  tickets,
  demoMode,
  onClaimTicket,
  onSelectTicket,
  isAuthenticated,
  onRequireSignIn,
}) {
  const [urgency, setUrgency] = useState('all');
  const [status, setStatus] = useState('all');

  const visible = useMemo(() => tickets.filter((ticket) => {
    const urgencyOk = urgency === 'all' || ticket.urgency === urgency;
    const statusOk = status === 'all'
      || (status === 'open' && ['reported', 'broadcasted'].includes(ticket.status))
      || ticket.status === status;
    return urgencyOk && statusOk;
  }), [tickets, urgency, status]);

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Reports</p>
          <h1>Rescue board</h1>
          <p className="lede">
            {demoMode
              ? 'Demo mode: reports stay in this browser and are not shared with other visitors.'
              : 'Public reports from the connected database. Contact details stay hidden unless you created or claimed a report.'}
          </p>
        </div>
      </header>

      <div className="filters">
        <button type="button" className={urgency === 'all' ? 'chip active' : 'chip'} onClick={() => setUrgency('all')}>All urgency</button>
        <button type="button" className={urgency === 'critical' ? 'chip active' : 'chip'} onClick={() => setUrgency('critical')}>Urgent</button>
        <button type="button" className={status === 'all' ? 'chip active' : 'chip'} onClick={() => setStatus('all')}>All status</button>
        <button type="button" className={status === 'open' ? 'chip active' : 'chip'} onClick={() => setStatus('open')}>Open</button>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>No reports match these filters.</p>
        </div>
      ) : (
        <ul className="report-grid">
          {visible.map((ticket) => (
            <li key={ticket.id} className={`report-card tone-${statusTone(ticket.status)}`}>
              <div className="report-card-media">
                <Photo src={ticket.photo} alt="" />
              </div>
              <div className="report-card-body">
                <div className="report-card-meta">
                  <span className={`status-pill ${ticket.urgency}`}>{urgencyLabel(ticket.urgency)}</span>
                  <span className={`status-pill ${statusTone(ticket.status)}`}>{statusLabel(ticket.status)}</span>
                  <span className="meta">{ticket.id}</span>
                </div>
                <h2>{ticket.title}</h2>
                <p className="result-address"><MapPin size={14} /> {ticket.location}</p>
                {ticket.notes && <p className="clip">{ticket.notes}</p>}
                <div className="action-row">
                  {['reported', 'broadcasted'].includes(ticket.status) && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => (isAuthenticated ? onClaimTicket(ticket.id) : onRequireSignIn())}
                    >
                      {isAuthenticated ? 'Claim report' : 'Sign in to claim'}
                    </button>
                  )}
                  <button type="button" className="btn-secondary" onClick={() => onSelectTicket(ticket.id)}>
                    View report <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
