import React from 'react';
import { CITIES } from '../data/mockData';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigateTab, onOpenReport }) {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h2>WOOF India Connect</h2>
            <p>
              A community tool for sharing animal-in-need reports, finding local care, and keeping neighbours in the loop.
            </p>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5eead4' }}>
              <ShieldCheck size={16} />
              <span>Community-powered • Open to everyone</span>
            </div>
          </div>

          {/* Emergency Direct Links */}
          <div className="footer-col">
            <h4>Emergency Access</h4>
            <ul className="footer-links">
              <li>
                <a href="#report" onClick={(e) => { e.preventDefault(); onOpenReport(); }}>
                  Share an animal-in-need report
                </a>
              </li>
              <li>
                <a href="tel:1962" style={{ color: '#fb923c', fontWeight: 700 }}>
                  📞 Call Govt Helpline: 1962
                </a>
              </li>
              <li>
                <a href="#community" onClick={(e) => { e.preventDefault(); onNavigateTab('community'); }}>
                  👥 Community reports
                </a>
              </li>
              <li>
                <a href="#tracker" onClick={(e) => { e.preventDefault(); onNavigateTab('tracker'); }}>
                  🛰️ Report updates
                </a>
              </li>
            </ul>
          </div>

          {/* Coverage Metros */}
          <div className="footer-col">
            <h4>Coverage Metros</h4>
            <ul className="footer-links">
              {CITIES.map(city => (
                <li key={city.id}>
                  <span>📍 {city.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Disclaimer */}
          <div className="footer-col">
            <h4>Connecting Model</h4>
            <p style={{ fontSize: '12.5px', lineHeight: '1.5', color: '#64748b' }}>
              WOOF is a community coordination tool, not an ambulance or shelter service. Listings and responder accounts are not professional endorsements; contact organizations directly and confirm availability.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} WOOF India Connect • Made with <Heart size={13} style={{ color: '#ef4444', verticalAlign: 'middle' }} /> for Desi Indie Dogs & Community Street Cats.
          </div>
          <div>
            Free Public Community Platform • Emergency First Aid & Referral
          </div>
        </div>
      </div>
    </footer>
  );
}
