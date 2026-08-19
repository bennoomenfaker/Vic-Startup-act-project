import React from 'react';
import { 
  LayoutDashboard, 
  Table2, 
  Building2, 
  Users2, 
  FileSearch, 
  CheckCircle2, 
  Download, 
  X,
  Sparkles,
  Calculator,
  FileText,
  RotateCw,
  HeartHandshake
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      id: 'sessions_table' as ActiveTab,
      label: '85 Sessions',
      icon: Table2,
      badge: '85 PVs',
      badgeColor: 'bg-indigo-500/10 text-indigo-600'
    },
    {
      id: 'startups_table' as ActiveTab,
      label: 'Startups & Candidats',
      icon: Building2,
      badge: '2 630',
      badgeColor: 'bg-blue-500/10 text-blue-600'
    },
    {
      id: 'founders_table' as ActiveTab,
      label: 'Fondateurs',
      icon: Users2,
      badge: '4 764',
      badgeColor: 'bg-purple-500/10 text-purple-600'
    },
    {
      id: 'parite_genre' as ActiveTab,
      label: 'Parité & Genre (Femmes)',
      icon: HeartHandshake,
      badge: '24.2% F',
      badgeColor: 'bg-pink-500/10 text-pink-700 font-bold'
    },
    {
      id: 'kpi_catalog' as ActiveTab,
      label: 'Catalogue des 50 KPIs',
      icon: Calculator,
      badge: '50 KPIs',
      badgeColor: 'bg-purple-500/10 text-purple-700'
    },
    {
      id: 'multi_tour_analytics' as ActiveTab,
      label: 'Tours & Temporalité',
      icon: RotateCw,
      badge: '1er-3e Tour',
      badgeColor: 'bg-amber-500/10 text-amber-700'
    },
    {
      id: 'documents_pvs' as ActiveTab,
      label: 'Documents & PVs (85)',
      icon: FileText,
      badge: '85 Docs',
      badgeColor: 'bg-emerald-500/10 text-emerald-700'
    },
    {
      id: 'session_explorer' as ActiveTab,
      label: 'Explorateur PV & Tables',
      icon: FileSearch,
    },
    {
      id: 'audit_verification' as ActiveTab,
      label: 'Audit & Vérification',
      icon: CheckCircle2,
      badge: '1 311',
      badgeColor: 'bg-amber-500/10 text-amber-600'
    },
    {
      id: 'export_center' as ActiveTab,
      label: 'Centre d\'Exportation',
      icon: Download,
      badge: 'Excel/SQL',
      badgeColor: 'bg-cyan-500/10 text-cyan-700'
    },
    {
      id: 'about' as ActiveTab,
      label: 'À Propos & Objectifs',
      icon: Sparkles,
      badge: 'VIC 2026',
      badgeColor: 'bg-purple-500/10 text-purple-600'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              <span>N</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">Neostate <span className="text-indigo-600">Act</span></div>
              <div className="text-[10px] text-slate-400">Startup Act Tunisie</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Banner */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-slate-800">
            <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Données 85 PVs</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-1">1 311 labels, 623 pré-labels et 2 958 dossiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
