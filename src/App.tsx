import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MobileSidebar } from './components/MobileSidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NeostateDashboardView } from './components/NeostateDashboardView';
import { SessionsTableView } from './components/SessionsTableView';
import { StartupsTableView } from './components/StartupsTableView';
import { FoundersTableView } from './components/FoundersTableView';
import { GenderDiversityView } from './components/GenderDiversityView';
import { SessionExplorerView } from './components/SessionExplorerView';
import { AuditVerificationView } from './components/AuditVerificationView';
import { ExportCenterView } from './components/ExportCenterView';
import { AboutProjectView } from './components/AboutProjectView';
import { KPICatalogView } from './components/KPICatalogView';
import { DocumentsPvsView } from './components/DocumentsPvsView';
import { MultiTourTemporalAnalytics } from './components/MultiTourTemporalAnalytics';
import { SessionDetailModal } from './components/SessionDetailModal';
import { ActiveTab, SessionData } from './types';
import { META_DATA } from './data/dataset';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentSessionKey, setCurrentSessionKey] = useState<string>('03/2026');
  const [modalSession, setModalSession] = useState<SessionData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const handleSelectSession = (sessionKey: string) => {
    setCurrentSessionKey(sessionKey);
    setActiveTab('session_explorer');
  };

  const handleOpenSessionModal = (session: SessionData) => {
    setModalSession(session);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800 flex flex-row font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-indigo-100 selection:text-indigo-900" id="neostate-app-root">
      {/* 1. Left Sleek Sidebar (Neostate / Orbitus Style) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* Top Header with Global Year Filter & Search */}
        <TopHeader
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dashboard Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {activeTab === 'overview' && (
            <NeostateDashboardView 
              selectedYear={selectedYear}
              setActiveTab={setActiveTab} 
              onSelectSession={handleSelectSession} 
              onOpenSessionModal={handleOpenSessionModal}
            />
          )}

          {activeTab === 'sessions_table' && (
            <SessionsTableView 
              onSelectSession={handleSelectSession} 
              onOpenSessionModal={handleOpenSessionModal} 
            />
          )}

          {activeTab === 'startups_table' && (
            <StartupsTableView 
              onSelectFounder={(fName) => {
                setActiveTab('founders_table');
              }} 
              onSelectSession={handleSelectSession} 
            />
          )}

          {activeTab === 'founders_table' && (
            <FoundersTableView 
              onSelectStartup={(stName) => {
                setActiveTab('startups_table');
              }} 
              onSelectSession={handleSelectSession} 
            />
          )}

          {activeTab === 'parite_genre' && (
            <GenderDiversityView />
          )}

          {activeTab === 'session_explorer' && (
            <SessionExplorerView 
              currentSessionKey={currentSessionKey} 
              onSelectSessionKey={setCurrentSessionKey} 
              onSelectStartup={(stName) => {
                setActiveTab('startups_table');
              }}
            />
          )}

          {activeTab === 'kpi_catalog' && (
            <KPICatalogView 
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
          )}

          {activeTab === 'multi_tour_analytics' && (
            <MultiTourTemporalAnalytics />
          )}

          {activeTab === 'documents_pvs' && (
            <DocumentsPvsView 
              onSelectSession={handleSelectSession}
              onOpenSessionModal={handleOpenSessionModal}
            />
          )}

          {activeTab === 'audit_verification' && (
            <AuditVerificationView 
              onSelectSession={handleSelectSession} 
            />
          )}

          {activeTab === 'export_center' && (
            <ExportCenterView />
          )}

          {activeTab === 'about' && (
            <AboutProjectView setActiveTab={setActiveTab} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-xs border-t border-slate-200/80 py-5 text-xs text-slate-500 mt-auto" id="neostate-footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Observatoire National Startup Act Tunisie — 85 Sessions officielles auditées ({META_DATA.firstSession} — {META_DATA.lastSession})
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-semibold text-slate-700">
                {META_DATA.totalLabels} Labels • {META_DATA.totalPreLabels} Pré-Labels • {META_DATA.totalCandidatures} Candidatures
              </span>
              <a
                href="https://startup.gov.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                <span>startup.gov.tn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStartup={(name) => {
          setActiveTab('startups_table');
        }}
        onSelectFounder={(name) => {
          setActiveTab('founders_table');
        }}
        onSelectSession={(sessionKey) => {
          handleSelectSession(sessionKey);
        }}
      />

      {/* Quick Modal Viewer */}
      {modalSession && (
        <SessionDetailModal 
          session={modalSession} 
          onClose={() => setModalSession(null)} 
          onSelectStartup={(stName) => {
            setModalSession(null);
            setActiveTab('startups_table');
          }}
        />
      )}
    </div>
  );
}

