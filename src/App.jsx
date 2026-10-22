import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EmergencyHub from './components/EmergencyHub';
import ReportIntake from './components/ReportIntake';
import LiveTracker from './components/LiveTracker';
import DispatcherBoard from './components/DispatcherBoard';
import FirstAidModal from './components/FirstAidModal';
import LoginPassModal from './components/LoginPassModal';
import Footer from './components/Footer';
import { INITIAL_TICKETS } from './data/mockData';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [activeCity, setActiveCity] = useState('bengaluru');
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'community' | 'tracker' | 'directory'
  const [firstAidGuide, setFirstAidGuide] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [loginPassModalOpen, setLoginPassModalOpen] = useState(false);

  // Authenticated Responder Pass stored in localStorage
  const [currentPass, setCurrentPass] = useState(() => {
    try {
      const saved = localStorage.getItem('woof_responder_pass');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Could not load pass from localStorage', e);
    }
    return null;
  });

  // Tickets stored in localStorage with INITIAL_TICKETS fallback
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('woof_rescue_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Could not load tickets from localStorage', e);
    }
    return INITIAL_TICKETS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    return tickets[0]?.id || 'RES-8492';
  });

  useEffect(() => {
    try {
      localStorage.setItem('woof_rescue_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Could not save tickets to localStorage', e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      if (currentPass) {
        localStorage.setItem('woof_responder_pass', JSON.stringify(currentPass));
      } else {
        localStorage.removeItem('woof_responder_pass');
      }
    } catch (e) {
      console.error('Could not save pass to localStorage', e);
    }
  }, [currentPass]);

  // Handle Login Pass Authenticated
  const handleLoginSuccess = (passData) => {
    setCurrentPass(passData);
  };

  const handleFastLoginRole = (role) => {
    const rolesMap = {
      'Field Unit': {
        name: 'Rajesh Kumar',
        role: 'Field Rescue Operative',
        badgeId: 'FIELD-BLR-104',
        sector: 'East Bengaluru Grid',
        vehicle: 'Two-Wheeler First Response Kit',
        status: 'Verified Level 2 Medic',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        color: '#1b5e3a'
      },
      'Dispatcher': {
        name: 'Priya Sundaram',
        role: 'Emergency Dispatch Coordinator',
        badgeId: 'DISPATCH-HQ-09',
        sector: 'Central Metro Operations',
        vehicle: 'Command Desk Telemetry',
        status: 'Lead Operations Officer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        color: '#e65100'
      },
      'Vet Clinic': {
        name: 'Dr. Sameer Patil, MVSc',
        role: 'Emergency Veterinary Surgeon',
        badgeId: 'VET-CUPA-042',
        sector: 'Trauma & Casualty Bay',
        vehicle: 'Surgical ICU Ambulance',
        status: 'Accredited Veterinary Surgeon',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
        color: '#00838f'
      }
    };
    setCurrentPass(rolesMap[role] || rolesMap['Field Unit']);
  };

  // Handle new report submission
  const handleNewReport = (newTicket) => {
    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setReportModalOpen(false);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle volunteer claiming / offering help
  const handleClaimTicket = (ticketId) => {
    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'connected',
          connectedResponder: currentPass ? {
            name: `${currentPass.name} (${currentPass.role})`,
            role: currentPass.status,
            phone: '+91 98860 99881',
            eta: '8 mins away',
            action: `Claimed by ${currentPass.badgeId} • Heading to incident`
          } : {
            name: 'Rajesh Kumar (Volunteer Rescuer)',
            role: 'Community First Responder with Bike Carrier',
            phone: '+91 98860 99881',
            eta: '8 mins away',
            action: 'Heading to site with transport crate & muzzle'
          },
          timeline: [
            { time: 'Just now', event: `Mission claimed by ${currentPass?.name || 'Volunteer Rajesh Kumar'}`, actor: currentPass?.name || 'Rajesh Kumar' },
            ...(t.timeline || [])
          ]
        };
      }
      return t;
    }));
  };

  // Handle advancing connection status
  const handleUpdateTicketStatus = (ticketId, nextStatus) => {
    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: nextStatus,
          timeline: [
            { time: 'Just now', event: `Status updated to ${nextStatus.toUpperCase()}`, actor: currentPass?.name || 'Community Rescuer' },
            ...(t.timeline || [])
          ]
        };
      }
      return t;
    }));
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (window.confirm('Reset WOOF database back to initial community distress tickets?')) {
      setTickets(INITIAL_TICKETS);
      setSelectedTicketId('RES-8492');
      setCurrentPass(null);
      localStorage.removeItem('woof_rescue_tickets');
      localStorage.removeItem('woof_responder_pass');
    }
  };

  const openCount = tickets.filter(t => ['reported', 'broadcasted'].includes(t.status)).length;

  return (
    <div className="site-wrapper">
      {/* Stitch Modern Website Header with Portal Login Pass */}
      <Navbar 
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenLoginPass={() => setLoginPassModalOpen(true)}
        currentPass={currentPass}
        openIncidentsCount={openCount}
      />

      {/* Main Website Content Views */}
      <main style={{ flex: 1 }}>
        {(activeTab === 'hub' || activeTab === 'directory') && (
          <EmergencyHub 
            activeCity={activeCity}
            onOpenReport={() => setReportModalOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFirstAid={(guide) => setFirstAidGuide(guide)}
            onOpenLoginPass={() => setLoginPassModalOpen(true)}
            onFastLoginRole={handleFastLoginRole}
          />
        )}

        {activeTab === 'community' && (
          <DispatcherBoard 
            tickets={tickets}
            activeCity={activeCity}
            onClaimTicket={handleClaimTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onSelectTicketAndTrack={(id) => {
              setSelectedTicketId(id);
              setActiveTab('tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'tracker' && (
          <LiveTracker 
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}

        {/* Demo Incidents Reset Bar */}
        <div style={{ padding: '24px 0', textAlign: 'center', opacity: 0.75 }}>
          <button 
            onClick={handleResetData}
            style={{ 
              fontSize: '11.5px', 
              fontWeight: 600,
              color: 'var(--color-text-subtle)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}
          >
            <RotateCcw size={12} />
            Reset Demo Incidents & Pass
          </button>
        </div>
      </main>

      {/* Website Footer */}
      <Footer 
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* Emergency SOS Report Modal (Overlay on Website) */}
      {reportModalOpen && (
        <div className="modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <ReportIntake 
              activeCity={activeCity}
              onSubmitReport={handleNewReport}
              onCancel={() => setReportModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Responder Portal Login Pass Modal */}
      <LoginPassModal 
        isOpen={loginPassModalOpen}
        onClose={() => setLoginPassModalOpen(false)}
        currentPass={currentPass}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Emergency First Aid Modal */}
      <FirstAidModal 
        guide={firstAidGuide}
        onClose={() => setFirstAidGuide(null)}
      />
    </div>
  );
}
