export default function Footer({ onNavigateTab, onOpenReport }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <strong>WOOF</strong>
          <p>Find nearby veterinary and rescue listings, get a route, and report an animal in need. WOOF is a coordination tool, not a clinic or ambulance service.</p>
        </div>
        <div>
          <h2>Actions</h2>
          <button type="button" className="linkish" onClick={onOpenReport}>Report an injured animal</button>
          <button type="button" className="linkish" onClick={() => onNavigateTab('reports')}>View reports</button>
          <a href="tel:1962">Government animal helpline 1962 (where available)</a>
        </div>
        <div>
          <h2>Data</h2>
          <p>Map tiles and facility listings come from OpenStreetMap contributors. Routing uses the public OSRM demo and may be rate-limited or unavailable.</p>
        </div>
      </div>
    </footer>
  );
}
