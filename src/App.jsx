import React, { useCallback, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Navbar from './components/Navbar';
import EmergencyHub from './components/EmergencyHub';
import ReportIntake from './components/ReportIntake';
import LiveTracker from './components/LiveTracker';
import DispatcherBoard from './components/DispatcherBoard';
import FirstAidModal from './components/FirstAidModal';
import LoginPassModal from './components/LoginPassModal';
import Footer from './components/Footer';
import { INITIAL_TICKETS } from './data/mockData';
import {
  advanceRescueReport,
  claimRescueReport,
  createRescueReport,
  fetchRescueReports,
  supabase,
  supabaseConfigurationError,
} from './lib/supabase';

export default function App() {
  const [activeCity, setActiveCity] = useState('bengaluru');
  const [activeTab, setActiveTab] = useState('hub');
  const [firstAidGuide, setFirstAidGuide] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [loginPassModalOpen, setLoginPassModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState(() => {
    if (supabase) return [];
    try {
      const saved = localStorage.getItem('woof_rescue_tickets');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Could not load demo tickets from localStorage', error);
    }
    return INITIAL_TICKETS;
  });
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [backendError, setBackendError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (supabase) return;
    try {
      localStorage.setItem('woof_rescue_tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error('Could not save demo tickets to localStorage', error);
    }
  }, [tickets]);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setBackendError(`Could not restore your sign-in: ${error.message}`);
        return;
      }
      setUser(data.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadTickets = useCallback(async () => {
    if (!supabase) return;
    try {
      const nextTickets = await fetchRescueReports(user?.id);
      setTickets(nextTickets);
      setBackendError('');
      setSelectedTicketId((currentId) => (
        nextTickets.some((ticket) => ticket.id === currentId)
          ? currentId
          : nextTickets[0]?.id || ''
      ));
    } catch (error) {
      console.error('Could not load rescue reports', error);
      setBackendError(`Could not load rescue reports: ${error.message}`);
    }
  }, [user]);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    queueMicrotask(() => {
      if (active) loadTickets();
    });
    const channel = supabase
      .channel('rescue-reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rescue_reports' }, loadTickets)
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setBackendError(`Live updates are unavailable (${status}).`);
        }
      });
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [loadTickets]);

  const currentPass = user ? {
    name: user.user_metadata?.display_name || user.email,
    role: 'Community responder',
    badgeId: `WOOF-${user.id.slice(0, 8).toUpperCase()}`,
    sector: 'Community rescue network',
    status: 'Account active · not independently verified',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    color: '#1b5e3a',
  } : null;

  const handleNewReport = async (newTicket) => {
    let savedTicket;
    if (supabase) {
      savedTicket = await createRescueReport(newTicket);
      await loadTickets();
    } else {
      savedTicket = { ...newTicket, photoFile: undefined };
      setTickets((currentTickets) => [savedTicket, ...currentTickets]);
    }
    setSelectedTicketId(savedTicket.id);
    setReportModalOpen(false);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimTicket = async (ticketId) => {
    if (!supabase) {
      setTickets((currentTickets) => currentTickets.map((ticket) => (
        ticket.id === ticketId
          ? { ...ticket, status: 'connected', connectedResponder: { name: 'Demo volunteer', role: 'Demo mode', phone: '', eta: 'Contact the reporter for an ETA' } }
          : ticket
      )));
      return;
    }
    if (!user) {
      setLoginPassModalOpen(true);
      return;
    }
    try {
      setActionError('');
      await claimRescueReport(ticketId);
      await loadTickets();
    } catch (error) {
      console.error('Could not claim rescue report', error);
      setActionError(error.message);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, nextStatus) => {
    if (!supabase) {
      setTickets((currentTickets) => currentTickets.map((ticket) => (
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket
      )));
      return;
    }
    if (!user) {
      setLoginPassModalOpen(true);
      return;
    }
    try {
      setActionError('');
      await advanceRescueReport(ticketId, nextStatus);
      await loadTickets();
    } catch (error) {
      console.error('Could not update rescue report status', error);
      setActionError(error.message);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset WOOF demo tickets on this browser?')) {
      setTickets(INITIAL_TICKETS);
      setSelectedTicketId(INITIAL_TICKETS[0]?.id || '');
      localStorage.removeItem('woof_rescue_tickets');
    }
  };

  const openCount = tickets.filter((ticket) => ['reported', 'broadcasted'].includes(ticket.status)).length;
  const openLogin = () => setLoginPassModalOpen(true);

  return (
    <div className="site-wrapper">
      <Navbar
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenLoginPass={openLogin}
        currentPass={currentPass}
        openIncidentsCount={openCount}
      />

      <main style={{ flex: 1 }}>
        {!supabase && (
          <div role="status" style={{ padding: '10px 20px', textAlign: 'center', background: '#fff7ed', color: '#9a3412', fontSize: '13px' }}>
            {supabaseConfigurationError || 'Demo mode: configure Supabase to share reports between visitors.'}
          </div>
        )}
        {(backendError || actionError) && (
          <div role="alert" style={{ padding: '10px 20px', textAlign: 'center', background: '#fef2f2', color: '#991b1b', fontSize: '13px' }}>
            {actionError || backendError}
            <button type="button" onClick={() => { setActionError(''); setBackendError(''); }} style={{ marginLeft: '10px', textDecoration: 'underline' }}>
              Dismiss
            </button>
          </div>
        )}
        {(activeTab === 'hub' || activeTab === 'directory') && (
          <EmergencyHub
            activeCity={activeCity}
            onOpenReport={() => setReportModalOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFirstAid={setFirstAidGuide}
            onOpenLoginPass={openLogin}
          />
        )}

        {activeTab === 'community' && (
          <DispatcherBoard
            tickets={tickets}
            activeCity={activeCity}
            onClaimTicket={handleClaimTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            isAuthenticated={!supabase || Boolean(user)}
            onRequireSignIn={openLogin}
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
            onClaimTicket={handleClaimTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            isAuthenticated={!supabase || Boolean(user)}
            onRequireSignIn={openLogin}
          />
        )}

        {!supabase && (
          <div style={{ padding: '24px 0', textAlign: 'center', opacity: 0.75 }}>
            <button onClick={handleResetData} style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <RotateCcw size={12} />
              Reset Demo Incidents
            </button>
          </div>
        )}
      </main>

      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {reportModalOpen && (
        <div className="modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
            <ReportIntake
              activeCity={activeCity}
              onSubmitReport={handleNewReport}
              onCancel={() => setReportModalOpen(false)}
            />
          </div>
        </div>
      )}

      <LoginPassModal
        isOpen={loginPassModalOpen}
        onClose={() => setLoginPassModalOpen(false)}
        currentPass={currentPass}
        isBackendConfigured={Boolean(supabase)}
        onSignOut={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        }}
      />

      <FirstAidModal guide={firstAidGuide} onClose={() => setFirstAidGuide(null)} />
    </div>
  );
}
