import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  Users, 
  Calendar, 
  Award, 
  ArrowRight, 
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import { STARTUPS_LIST, FOUNDERS_LIST, SESSIONS_LIST, getSessionLabel } from '../data/dataset';
import { StartupItem, FounderItem, SessionData } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStartup: (name: string) => void;
  onSelectFounder: (name: string) => void;
  onSelectSession: (sessionKey: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStartup,
  onSelectFounder,
  onSelectSession,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'startups' | 'founders' | 'sessions'>('all');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Results
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        startups: STARTUPS_LIST.slice(0, 4),
        founders: FOUNDERS_LIST.slice(0, 4),
        sessions: SESSIONS_LIST.slice(-4).reverse(),
      };
    }
    const q = query.toLowerCase();

    const matchedStartups = STARTUPS_LIST.filter(
      st => st.name.toLowerCase().includes(q) || (st.secteur && st.secteur.toLowerCase().includes(q))
    ).slice(0, 6);

    const matchedFounders = FOUNDERS_LIST.filter(
      f => f.name.toLowerCase().includes(q) || f.startups.some(s => s.toLowerCase().includes(q))
    ).slice(0, 6);

    const matchedSessions = SESSIONS_LIST.filter(
      s => s.session.includes(q) || (s.commentaires && s.commentaires.toLowerCase().includes(q))
    ).slice(0, 6);

    return {
      startups: matchedStartups,
      founders: matchedFounders,
      sessions: matchedSessions,
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.startups.length + results.founders.length + results.sessions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-soft-lg border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher une startup, un fondateur, une session (ex: Datavora, 03/2026, Fintech)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-200/80 rounded">
            ESC
          </span>
          <button
            onClick={onClose}
            className="ml-2 p-1 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tab */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-white border-b border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Tout ({totalResults})
          </button>
          <button
            onClick={() => setActiveCategory('startups')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeCategory === 'startups'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Startups ({results.startups.length})
          </button>
          <button
            onClick={() => setActiveCategory('founders')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeCategory === 'founders'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Fondateurs ({results.founders.length})
          </button>
          <button
            onClick={() => setActiveCategory('sessions')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeCategory === 'sessions'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Sessions ({results.sessions.length})
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* Startups section */}
          {(activeCategory === 'all' || activeCategory === 'startups') && results.startups.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Startups & Entreprises</span>
                <span>{results.startups.length}</span>
              </div>
              <div className="space-y-1">
                {results.startups.map((st) => (
                  <div
                    key={st.name}
                    onClick={() => {
                      onSelectStartup(st.name);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                          {st.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                          <span>{st.secteur || 'Secteur Général'}</span>
                          <span>•</span>
                          <span className="text-slate-400">{st.founders.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        st.status.includes('Label') ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {st.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Founders section */}
          {(activeCategory === 'all' || activeCategory === 'founders') && results.founders.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Porteurs de Projet & Fondateurs</span>
                <span>{results.founders.length}</span>
              </div>
              <div className="space-y-1">
                {results.founders.map((f) => (
                  <div
                    key={f.name}
                    onClick={() => {
                      onSelectFounder(f.name);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/70 group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {f.startups.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {f.startups.length} startup{f.startups.length > 1 ? 's' : ''}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sessions section */}
          {(activeCategory === 'all' || activeCategory === 'sessions') && results.sessions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Sessions du Collège des Startups</span>
                <span>{results.sessions.length}</span>
              </div>
              <div className="space-y-1">
                {results.sessions.map((s) => (
                  <div
                    key={s.session}
                    onClick={() => {
                      onSelectSession(s.session);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                          Session {s.session} — {getSessionLabel(s.session)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {s.candidatures} candidats • {s.labels} labels accordés • {s.tauxPct}% acceptation
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium">Aucun résultat trouvé pour "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-1">Essayez un autre mot-clé ou parcourez les sessions</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Conseil : Utilisez <strong>↑</strong> et <strong>↓</strong> pour naviguer</span>
          <span className="font-semibold text-indigo-600">Startup Act Tunisie — Base 85 PVs</span>
        </div>
      </div>
    </div>
  );
};
