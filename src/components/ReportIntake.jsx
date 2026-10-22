import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Camera, MapPin, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, Upload, Check, Share2, Sparkles, Phone, Radio, Users } from 'lucide-react';
import { CITIES, VERIFIED_CENTERS } from '../data/mockData';

export default function ReportIntake({ activeCity, onSubmitReport, onCancel }) {
  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState('Indie Dog (Desi)');
  const [urgency, setUrgency] = useState('critical');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [locationName, setLocationName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Closest verified emergency facility in this city
  const closestCenter = VERIFIED_CENTERS.find(c => c.cityId === activeCity) || VERIFIED_CENTERS[0];

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      setSubmissionError('This browser does not support location detection.');
      return;
    }
    setGpsLoading(true);
    setSubmissionError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates = { lat: coords.latitude, lng: coords.longitude };
        setGpsCoordinates(coordinates);
        setLocationName(`GPS ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)} — ${currentCityObj.name}`);
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        setSubmissionError(`Could not get your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        setSubmissionError('Choose a JPEG, PNG, or WebP photo smaller than 5 MB.');
        setPhotoFile(null);
        setPhotoUrl('');
        e.target.value = '';
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPhotoUrl(objectUrl);
      setPhotoFile(file);
      setSubmissionError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');
    setSubmitting(true);
    const newTicket = {
      cityId: activeCity,
      title: `${urgency === 'critical' ? 'CRITICAL: ' : ''}${species} Distress Alert`,
      species,
      urgency,
      status: 'broadcasted',
      timestamp: 'Just now',
      location: locationName,
      lat: gpsCoordinates?.lat ?? null,
      lng: gpsCoordinates?.lng ?? null,
      landmark,
      reportedBy: reporterName,
      reporterPhone,
      notes,
      photo: photoUrl,
      photoFile,
      connectedResponder: null,
      nearestFacility: {
        name: closestCenter.name,
        phone: closestCenter.ambulancePhone,
        distance: closestCenter.distance
      },
      timeline: [
        { time: 'Just now', event: 'SOS broadcast logged by citizen finder', actor: 'Citizen reporter' },
        { time: 'Just now', event: `Shared to ${currentCityObj.name} volunteer rescue grid`, actor: 'WOOF Connector' }
      ]
    };

    try {
      await onSubmitReport(newTicket);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (error) {
      setSubmissionError(`Could not submit rescue report: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-formatted WhatsApp SOS card
  const getWhatsAppShareUrl = () => {
    const message = `🚨 *URGENT WOOF STRAY ANIMAL SOS* 🚨\n\n*City Sector:* ${currentCityObj.sector}\n*Species:* ${species}\n*Urgency:* ${urgency.toUpperCase()}\n*Location:* ${locationName}\n*Landmark:* ${landmark}\n*Details:* ${notes}\n*Reporter Contact:* ${reporterPhone}\n\n*Immediate Action Needed:* Seeking nearest volunteer with transport or ambulance contact!`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="rescue-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '22px' }}>
      {/* Wizard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span className="status-pill severe" style={{ fontSize: '10.5px', marginBottom: '4px' }}>
            Community Connecting SOS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>
            Broadcast Distress Call
          </h2>
        </div>
        <button 
          onClick={onCancel}
          style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-muted)' }}
        >
          Cancel
        </button>
      </div>

      {/* Info Notice about connecting portal */}
      <div style={{ 
        background: 'var(--color-primary-bg)', 
        border: '1px solid #ccfbf1', 
        borderRadius: 'var(--radius-md)', 
        padding: '10px 14px', 
        fontSize: '12px', 
        color: 'var(--color-primary-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <Radio size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
        <span>This will post your distress call on the community rescue board and prepare an instant WhatsApp broadcast for city volunteer groups.</span>
      </div>

      {/* Wizard Progress Bar */}
      <div className="wizard-progress">
        <div className="wizard-bar">
          <div 
            className="wizard-bar-fill" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>
          Step {step} of 3
        </span>
      </div>

      {/* STEP 1: Species & Urgency */}
      {step === 1 && (
        <div>
          <div className="form-group">
            <label className="form-label">
              <span>Select Animal Type</span>
              <span style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Required</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {['Indie Dog (Desi)', 'Stray Gully Cat', 'Litter of Puppies', 'Litter of Kittens', 'Community Cattle / Cow', 'Other Stray Animal'].map(item => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSpecies(item)}
                  style={{
                    padding: '11px 13px',
                    borderRadius: 'var(--radius-md)',
                    border: species === item ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                    background: species === item ? 'var(--color-primary-bg)' : '#ffffff',
                    color: species === item ? 'var(--color-primary-dark)' : 'var(--color-text-main)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              <span>Urgency Level (Medical Triage)</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'critical', label: '🔴 Critical Emergency', desc: 'Vehicular hit & run, arterial bleeding, unconscious, severe trauma' },
                { id: 'severe', label: '🟠 Severe Distress', desc: 'Deep cavity maggot wound, bone fracture, trapped in drain, unable to stand' },
                { id: 'moderate', label: '🟡 Moderate / Stable', desc: 'Severe skin mange, abandoned unweaned litter, limping, eye infection' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setUrgency(opt.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: urgency === opt.id ? '2px solid var(--color-secondary)' : '1.5px solid var(--color-border)',
                    background: urgency === opt.id ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: urgency === opt.id ? 'var(--color-secondary-dark)' : 'var(--color-text-main)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="button"
            className="btn-primary" 
            style={{ width: '100%', marginTop: '14px', height: '48px' }}
            onClick={() => setStep(2)}
          >
            Continue to Photos & Notes
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2: Photo Evidence & Description */}
      {step === 2 && (
        <div>
          <div className="form-group">
            <label className="form-label">
              <span>Photo Evidence</span>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>Helps Rescuers Evaluate</span>
            </label>
            
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '190px', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden',
              marginBottom: '10px',
              border: '1.5px solid var(--color-border)'
            }}>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Selected evidence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  No photo selected (optional)
                </div>
              )}
              <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                left: '10px', 
                background: 'rgba(15, 23, 42, 0.85)', 
                color: 'white', 
                fontSize: '11px', 
                padding: '3px 9px', 
                borderRadius: 'var(--radius-full)',
                fontWeight: 600 
              }}>
                Evidence Photo
              </div>
            </div>

            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px dashed var(--color-border)',
                background: 'var(--color-surface-dim)',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--color-primary)'
              }}
            >
              <Upload size={16} />
              <span>Choose from Device Camera / Storage</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="form-group">
            {submissionError && <div role="alert" style={{ color: '#b91c1c', fontSize: '13px' }}>{submissionError}</div>}
            <label className="form-label">
              <span>Condition & Situation Notes</span>
            </label>
            <textarea 
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe condition, visible trauma, whether animal is aggressive or quiet, if you are able to stay with the animal..."
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button 
              type="button"
              className="btn-primary" 
              onClick={() => setStep(3)}
            >
              Next: Location & Contact
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location & Reporter Contact */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                <span>GPS Location of Animal</span>
              </label>
              <button
                type="button"
                onClick={handleCaptureGPS}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  background: 'var(--color-primary-bg)',
                  border: '1px solid #ccfbf1',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <MapPin size={12} />
                {gpsLoading ? 'Acquiring GPS...' : 'Auto-Detect Live GPS'}
              </button>
            </div>
            
            <input 
              type="text" 
              className="form-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Road, sector, or colony name..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Nearest Landmark (Crucial for Indian Rescuers)</span>
            </label>
            <input 
              type="text" 
              className="form-input"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Metro Pillar, opposite temple, beside chai stall..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Your Name</span>
              </label>
              <input 
                type="text" 
                className="form-input"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span>Phone (+91 WhatsApp)</span>
              </label>
              <input 
                type="tel" 
                className="form-input"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
          </div>

          {/* Submission Triggers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {submissionError && <div role="alert" style={{ color: '#b91c1c', fontSize: '13px' }}>{submissionError}</div>}
            <button 
              type="submit"
              className="btn-emergency-trigger"
              style={{ height: '52px' }}
              disabled={submitting}
            >
              <Radio size={20} />
              {submitting ? 'Posting rescue report…' : 'Post Distress Call to Community Grid'}
            </button>

            <a 
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Share2 size={16} />
              Also Blast Card to WhatsApp Rescue Groups
            </a>

            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => setStep(2)}
              style={{ marginTop: '2px' }}
            >
              <ArrowLeft size={16} />
              Back to Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
