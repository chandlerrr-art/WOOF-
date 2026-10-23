import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Upload } from 'lucide-react';
import RescueMap from './RescueMap';
import { nearestCityId } from '../lib/geo';
import { reverseGeocode } from '../lib/geocode';
import { ANIMAL_TYPES, PROBLEMS, getProblem } from '../lib/problems';
import { validatePhotoFile } from '../lib/supabase';

export default function ReportIntake({
  userLocation,
  problemId,
  onSubmitReport,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [animalType, setAnimalType] = useState('dog');
  const [concern, setConcern] = useState(problemId || 'injured');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [point, setPoint] = useState(userLocation || null);
  const [locationLabel, setLocationLabel] = useState('');
  const [landmark, setLandmark] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    if (userLocation && !point) setPoint(userLocation);
  }, [userLocation, point]);

  const captureGps = () => {
    if (!navigator.geolocation) {
      setSubmissionError('This browser cannot provide a location.');
      return;
    }
    setGpsLoading(true);
    setSubmissionError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const next = { lat: coords.latitude, lng: coords.longitude };
        setPoint(next);
        try {
          const label = await reverseGeocode(next);
          setLocationLabel(label || `${next.lat.toFixed(5)}, ${next.lng.toFixed(5)}`);
        } catch {
          setLocationLabel(`${next.lat.toFixed(5)}, ${next.lng.toFixed(5)}`);
        }
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        setSubmissionError(error.message || 'Could not read your location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 },
    );
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validatePhotoFile(file);
    if (error) {
      setSubmissionError(error);
      setPhotoFile(null);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl('');
      event.target.value = '';
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoFile(file);
    setSubmissionError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!point) {
      setSubmissionError('Set the animal’s location with GPS or the map marker.');
      return;
    }
    if (!locationLabel.trim()) {
      setSubmissionError('Add a short location description so responders can find the animal.');
      return;
    }
    setSubmitting(true);
    setSubmissionError('');
    const problem = getProblem(concern);
    const speciesLabel = ANIMAL_TYPES.find((item) => item.id === animalType)?.label || 'Animal';
    const ticket = {
      cityId: nearestCityId(point),
      title: `${speciesLabel}: ${problem.label}`.slice(0, 160),
      species: speciesLabel,
      concern: problem.label,
      urgency: problem.urgent ? 'critical' : 'moderate',
      status: 'broadcasted',
      location: locationLabel.trim(),
      lat: point.lat,
      lng: point.lng,
      landmark: landmark.trim() || 'Not specified',
      reportedBy: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
      notes: notes.trim(),
      photo: photoUrl,
      photoFile,
      connectedResponder: null,
      nearestFacility: null,
      timeline: [{ time: new Date().toLocaleTimeString(), event: 'Report submitted', actor: 'Reporter' }],
    };
    try {
      await onSubmitReport(ticket);
    } catch (error) {
      setSubmissionError(error.message || 'Could not submit the report.');
      setSubmitting(false);
    }
  };

  return (
    <div className="intake">
      <div className="intake-head">
        <div>
          <p className="eyebrow">Report</p>
          <h2>Report an animal in need</h2>
        </div>
        <button type="button" className="linkish" onClick={onCancel}>Cancel</button>
      </div>

      <div className="wizard-progress" aria-hidden="true">
        <div className="wizard-bar"><div className="wizard-bar-fill" style={{ width: `${(step / 3) * 100}%` }} /></div>
        <span>Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div>
          <fieldset className="form-group">
            <legend className="form-label">Animal type</legend>
            <div className="choice-grid">
              {ANIMAL_TYPES.map((item) => (
                <button key={item.id} type="button" className={animalType === item.id ? 'choice active' : 'choice'} onClick={() => setAnimalType(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="form-group">
            <legend className="form-label">Reported concern</legend>
            <p className="meta">This is what you observed, not a medical diagnosis.</p>
            <div className="choice-stack">
              {PROBLEMS.map((item) => (
                <button key={item.id} type="button" className={concern === item.id ? 'choice active' : 'choice'} onClick={() => setConcern(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button type="button" className="btn-primary full" onClick={() => setStep(2)}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="form-group">
            <label className="form-label" htmlFor="report-notes">Description</label>
            <textarea
              id="report-notes"
              className="form-textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={3000}
              rows={4}
              placeholder="Visible injuries, whether the animal can walk, and whether you can stay nearby."
            />
          </div>
          <div className="form-group">
            <span className="form-label">Photograph (optional)</span>
            <div className="photo-frame">
              {photoUrl ? <img src={photoUrl} alt="Selected report photograph" /> : <span>No photo selected</span>}
            </div>
            <label className="btn-secondary full">
              <Upload size={16} />
              Upload or capture a photo
              <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handlePhoto} hidden />
            </label>
          </div>
          {submissionError && <p className="banner error" role="alert">{submissionError}</p>}
          <div className="action-row">
            <button type="button" className="btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
            <button type="button" className="btn-primary" onClick={() => setStep(3)}>Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="report-location">Location</label>
              <button type="button" className="linkish" onClick={captureGps}>
                <MapPin size={14} /> {gpsLoading ? 'Locating…' : 'Use my location'}
              </button>
            </div>
            {point && (
              <RescueMap
                className="rescue-map compact"
                reportPoint={point}
                onReportPointChange={async (next) => {
                  setPoint(next);
                  try {
                    const label = await reverseGeocode(next);
                    if (label) setLocationLabel(label);
                  } catch {
                    /* keep typed label */
                  }
                }}
              />
            )}
            <p className="meta">Drag the marker to the animal if GPS is off by a few metres.</p>
            <input
              id="report-location"
              className="form-input"
              value={locationLabel}
              onChange={(event) => setLocationLabel(event.target.value)}
              placeholder="Street, area, or landmark"
              required
              maxLength={300}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="report-landmark">Landmark (optional)</label>
            <input id="report-landmark" className="form-input" value={landmark} onChange={(event) => setLandmark(event.target.value)} maxLength={300} placeholder="Gate, shop, metro pillar" />
          </div>
          <div className="split-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="report-name">Your name (optional)</label>
              <input id="report-name" className="form-input" value={reporterName} onChange={(event) => setReporterName(event.target.value)} maxLength={120} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="report-phone">Phone (optional)</label>
              <input id="report-phone" className="form-input" type="tel" value={reporterPhone} onChange={(event) => setReporterPhone(event.target.value)} maxLength={40} />
            </div>
          </div>
          <p className="meta">Contact details are stored separately and shown only to you or a responder who claims the report.</p>
          {submissionError && <p className="banner error" role="alert">{submissionError}</p>}
          <button type="submit" className="btn-primary full" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit report'}
          </button>
          <button type="button" className="btn-secondary full" onClick={() => setStep(2)} disabled={submitting}>
            <ArrowLeft size={16} /> Back
          </button>
        </form>
      )}
    </div>
  );
}
