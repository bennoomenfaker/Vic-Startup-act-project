import React from 'react';
import { 
  LayoutDashboard, 
  Table2, 
  Building2, 
  Users2, 
  FileSearch, 
  CheckCircle2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  Database, 
  HelpCircle, 
  Award,
  Calculator,
  FileText,
  RotateCw,
  HeartHandshake
} from 'lucide-react';
import { ActiveTab } from '../types';
import { META_DATA } from '../data/dataset';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenExportModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenExportModal,
}) => {
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
      badgeColor: 'bg-purple-500/10 text-purple-700 font-bold'
    },
    {
      id: 'multi_tour_analytics' as ActiveTab,
      label: 'Tours & Temporalité',
      icon: RotateCw,
      badge: '1er-3e Tour',
      badgeColor: 'bg-amber-500/10 text-amber-700 font-bold'
    },
    {
      id: 'documents_pvs' as ActiveTab,
      label: 'Documents & PVs (85)',
      icon: FileText,
      badge: '85 Docs',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 font-bold'
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
      icon: HelpCircle,
      badge: 'VIC 2026',
      badgeColor: 'bg-purple-500/10 text-purple-600'
    },
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30 ${
        isCollapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
      id="neostate-sidebar"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4.5 border-b border-slate-100 justify-between">
        <div 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
        >
          {/* Logo Mark matching Neostate / Orbitus styling */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 shrink-0">
            <span className="tracking-tighter">N</span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-200">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Neostate <span className="text-xs font-bold text-indigo-600 ml-1">Act</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                Collège des Startups
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer group ${
                isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
              } ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/25' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon 
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                }`} 
              />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="text-xs tracking-tight truncate">{item.label}</span>
                  {item.badge && (
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo & Help Card (Matching Neostate "Upgrade to Pro" Card) */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50/40 border border-indigo-100 text-slate-800 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-2.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Données Certifiées</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              85 PVs vérifiés : 1 311 labels, 623 pré-labels et 3 015 dossiers.
            </p>
            <button
              onClick={() => setActiveTab('export_center')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Pack Pro</span>
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Réduire le menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
