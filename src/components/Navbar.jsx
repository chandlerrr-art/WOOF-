import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenLoginPass,
  currentPass,
  openIncidentsCount,
  demoMode,
}) {
  const [open, setOpen] = useState(false);

  const go = (tab) => {
    setActiveTab(tab);
    setOpen(false);
  };

  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => go('map')}>
        <span className="brand-mark">W</span>
        <span>
          <strong>WOOF</strong>
          <em>Animal rescue help</em>
        </span>
      </button>

      <nav className="top-nav" aria-label="Main">
        <button type="button" className={activeTab === 'map' ? 'nav-link active' : 'nav-link'} onClick={() => go('map')}>
          Map
        </button>
        <button type="button" className={activeTab === 'reports' ? 'nav-link active' : 'nav-link'} onClick={() => go('reports')}>
          Reports{openIncidentsCount ? ` (${openIncidentsCount})` : ''}
        </button>
        <button type="button" className="nav-link" onClick={onOpenLoginPass}>
          {currentPass ? currentPass.name : 'Sign in'}
        </button>
      </nav>

      <div className="top-actions">
        {demoMode && <span className="demo-pill">Local demo</span>}
        <button type="button" className="btn-primary compact" onClick={onOpenReport}>Report an animal</button>
        <button type="button" className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="mobile-drawer">
          <button type="button" onClick={() => go('map')}>Map</button>
          <button type="button" onClick={() => go('reports')}>Reports</button>
          <button type="button" onClick={() => { onOpenLoginPass(); setOpen(false); }}>
            {currentPass ? 'Account' : 'Sign in'}
          </button>
        </div>
      )}
    </header>
  );
}
