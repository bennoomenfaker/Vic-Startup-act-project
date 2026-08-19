import React from 'react';
import { 
  LayoutDashboard, 
  Table2, 
  Building2, 
  Users2, 
  FileSearch, 
  CheckCircle2, 
  TrendingUp,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { ActiveTab } from '../types';
import { META_DATA } from '../data/dataset';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenGlobalSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'sessions_table', label: '85 Sessions', icon: Table2, badge: '85', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'startups_table', label: 'Startups & Candidats', icon: Building2, badge: '2 630', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'founders_table', label: 'Fondateurs', icon: Users2, badge: '4 764', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'session_explorer', label: 'Explorateur PDF & Tables', icon: FileSearch },
    { id: 'audit_verification', label: 'Vérification & Audit', icon: CheckCircle2, badge: 'Vérifié', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'export_center', label: 'Export (Excel / SQL / JSON)', icon: Download, badge: 'Nouveau', badgeColor: 'bg-cyan-100 text-cyan-800' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-700/20 ring-1 ring-white/20">
              <span className="text-lg tracking-tight">TN</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">Startup Act Tunisie</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  85 Sessions (2019-2026)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Dashboard Analytique & Données Officielles Auditées</p>
            </div>
          </div>

          {/* Quick Metrics Pill */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-medium text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-900 font-semibold">{META_DATA.totalLabels}</span>
              <span>Labels accordés</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-900 font-semibold">{META_DATA.totalPreLabels}</span>
              <span>Pré-Labels</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-900 font-semibold">{META_DATA.totalCandidatures}</span>
              <span>Candidatures</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{META_DATA.tauxMoyenPct}% Taux moyen</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 -mx-4 px-4 sm:mx-0 sm:px-0" id="main-navigation-tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
