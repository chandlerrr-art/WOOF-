import { X } from 'lucide-react';

export default function FirstAidModal({ guide, onClose }) {
  if (!guide) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="safety-title" onClick={(event) => event.stopPropagation()}>
        <div className="intake-head">
          <h2 id="safety-title">{guide.title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <ol className="steps">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <button type="button" className="btn-primary full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
