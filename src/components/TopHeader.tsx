import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  HelpCircle, 
  Calendar, 
  ChevronDown, 
  Globe, 
  Menu,
  Check,
  Award,
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { YEARLY_STATS, META_DATA } from '../data/dataset';
import { ActiveTab } from '../types';

interface TopHeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  selectedYear,
  setSelectedYear,
  onOpenSearch,
  onOpenMobileMenu,
  activeTab,
  setActiveTab,
}) => {
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('FR');

  const notifications = [
    {
      id: 1,
      title: 'Session 03/2026 auditée',
      desc: '38 candidatures traitées, 17 labels accordés.',
      time: 'Il y a 2h',
      unread: true,
    },
    {
      id: 2,
      title: 'Données certifiées 2019-2026',
      desc: 'Total vérifié à 1 311 labels et 623 pré-labels.',
      time: 'Aujourd\'hui',
      unread: true,
    },
    {
      id: 3,
      title: 'Export SQL & Excel disponible',
      desc: 'Schéma relationnel et feuilles multi-onglets.',
      time: 'Hier',
      unread: false,
    },
  ];

  const yearOptions = [
    { value: 'all', label: 'Toutes les années (2019 — 2026)', count: '85 sessions' },
    { value: '2026', label: 'Année 2026 (T1)', count: '3 sessions' },
    { value: '2025', label: 'Année 2025', count: '12 sessions' },
    { value: '2024', label: 'Année 2024', count: '12 sessions' },
    { value: '2023', label: 'Année 2023', count: '12 sessions' },
    { value: '2022', label: 'Année 2022', count: '12 sessions' },
    { value: '2021', label: 'Année 2021', count: '12 sessions' },
    { value: '2020', label: 'Année 2020', count: '12 sessions' },
    { value: '2019', label: 'Année 2019 (Lancement)', count: '10 sessions' },
  ];

  const currentYearLabel = yearOptions.find(y => y.value === selectedYear)?.label || '2019 — 2026';

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" id="neostate-top-header">
      {/* Left: Mobile Menu Toggle & Global Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input (Exact match to Neostate/Orbitus search bar) */}
        <div 
          onClick={onOpenSearch}
          className="flex-1 flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-2xl px-3.5 py-2 cursor-pointer transition-all duration-200 shadow-2xs group max-w-md"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors mr-2.5 shrink-0" />
          <span className="text-xs text-slate-400 font-medium truncate flex-1 select-none">
            Rechercher une startup, fondateur, session...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white rounded-md border border-slate-200/80 shadow-2xs">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* Right Controls: Theme / Lang / Notifications / Date Filter / Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Sun / Theme icon */}
        <button 
          title="Mode clair actif"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>

        {/* Language dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-1.5 z-50">
              {['FR', 'EN', 'AR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    setShowLangMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                >
                  <span>{lang === 'FR' ? 'Français' : lang === 'EN' ? 'English' : 'العربية'}</span>
                  {currentLang === lang && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white"></span>
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications PVs</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  3 nouvelles
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-1">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotifMenu(false);
                  setActiveTab('audit_verification');
                }}
                className="w-full text-center mt-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 block"
              >
                Voir le journal d'audit complet →
              </button>
            </div>
          )}
        </div>

        {/* Global Year Filter Dropdown (Exact Match to Neostate/Orbitus Date Range Picker) */}
        <div className="relative">
          <button
            id="global-year-filter-btn"
            onClick={() => setShowYearMenu(!showYearMenu)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-soft text-xs font-semibold text-slate-800 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[140px] sm:max-w-none truncate">{currentYearLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showYearMenu ? 'rotate-180' : ''}`} />
          </button>

          {showYearMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Filtrer les données par Année
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {yearOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedYear(opt.value);
                      setShowYearMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedYear === opt.value
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div>{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.count}</div>
                    </div>
                    {selectedYear === opt.value && (
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill (Neostate / Orbitus Style) */}
        <div className="hidden sm:flex items-center space-x-2.5 pl-2 border-l border-slate-200/80">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-indigo-50">
            <span>FB</span>
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Faker Ben Noomen</span>
            <span className="text-[10px] font-medium text-slate-400">Admin Écosystème</span>
          </div>
        </div>
      </div>
    </header>
  );
};
