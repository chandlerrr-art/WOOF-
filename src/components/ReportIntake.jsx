import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Camera, MapPin, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, Upload, Check, Share2, Sparkles, Phone, Radio, Users } from 'lucide-react';
import { CITIES, VERIFIED_CENTERS } from '../data/mockData';

const SAMPLE_PHOTOS = [
  {
    title: 'Indie Dog (Road trauma)',
    url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80',
    type: 'Indie Dog (Desi)'
  },
  {
    title: 'Gully Kitten in drain',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    type: 'Stray Kitten'
  },
  {
    title: 'Puppies in waterlogging',
    url: 'https://images.unsplash.com/photo-1591160674255-ed8b9b7759a9?auto=format&fit=crop&w=600&q=80',
    type: 'Litter of Puppies'
  }
];

export default function ReportIntake({ activeCity, onSubmitReport, onCancel }) {
  const currentCityObj = CITIES.find(c => c.id === activeCity) || CITIES[0];

  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState('Indie Dog (Desi)');
  const [urgency, setUrgency] = useState('critical');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [notes, setNotes] = useState('Stray dog hit by vehicle on main road, bleeding from hind leg. Need volunteer transport or ambulance to hospital.');
  const [locationName, setLocationName] = useState(`Near Indiranagar Metro Pillar 42, ${currentCityObj.name}`);
  const [landmark, setLandmark] = useState('Beside Chai Point on pedestrian footpath');
  const [reporterName, setReporterName] = useState('Ananya Sen (Citizen)');
  const [reporterPhone, setReporterPhone] = useState('+91 98765 43210');
  const [gpsLoading, setGpsLoading] = useState(false);

  // Closest verified emergency facility in this city
  const closestCenter = VERIFIED_CENTERS.find(c => c.cityId === activeCity) || VERIFIED_CENTERS[0];

  const handleCaptureGPS = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      if (activeCity === 'bengaluru') {
        setLocationName('100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru');
        setLandmark('Opposite Metro Pillar 42, near BDA Complex');
      } else if (activeCity === 'delhi') {
        setLocationName('Flyover Market, Defence Colony, New Delhi');
        setLandmark('Near Pillar 18 underpass, Block A market gate');
      } else if (activeCity === 'mumbai') {
        setLocationName('Carter Road Promenade, Bandra West, Mumbai');
        setLandmark('Opposite Cafe Coffee Day seawall entrance');
      } else {
        setLocationName(`Central Junction, ${currentCityObj.sector}`);
        setLandmark('Near Bus Depot & Main Signal');
      }
    }, 600);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoUrl(objectUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    const randomId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket = {
      id: randomId,
      cityId: activeCity,
      title: `${urgency === 'critical' ? 'CRITICAL: ' : ''}${species} Distress Alert`,
      species,
      urgency,
      status: 'broadcasted',
      timestamp: 'Just now',
      location: locationName,
      lat: 12.9716,
      lng: 77.5946,
      landmark,
      reportedBy: reporterName,
      reporterPhone,
      notes,
      photo: photoUrl,
      connectedResponder: null, // Open for community volunteers to connect
      nearestFacility: {
        name: closestCenter.name,
        phone: closestCenter.ambulancePhone,
        distance: closestCenter.distance
      },
      timeline: [
        { time: 'Just now', event: 'SOS Broadcast logged by citizen finder', actor: reporterName },
        { time: 'Just now', event: `Shared to ${currentCityObj.name} Volunteer Rescue Grid`, actor: 'WOOF Connector' }
      ]
    };

    onSubmitReport(newTicket);
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
              <img 
                src={photoUrl} 
                alt="Selected evidence" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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

            {/* Quick Demo Sample Selector */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                Demo Quick Selector (Preset Photos):
              </span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
                {SAMPLE_PHOTOS.map((sample, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => {
                      setPhotoUrl(sample.url);
                      setSpecies(sample.type);
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: photoUrl === sample.url ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      background: photoUrl === sample.url ? 'var(--color-primary-bg)' : '#ffffff',
                      color: photoUrl === sample.url ? 'var(--color-primary-dark)' : 'var(--color-text-main)',
                      whiteSpace: 'nowrap',
                      fontWeight: 700
                    }}
                  >
                    {sample.title}
                  </button>
                ))}
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
            <button 
              type="submit"
              className="btn-emergency-trigger"
              style={{ height: '52px' }}
            >
              <Radio size={20} />
              Post Distress Call to Community Grid
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
