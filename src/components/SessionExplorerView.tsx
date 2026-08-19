import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  Ban, 
  Calendar, 
  Building2, 
  Users2, 
  Copy, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { SESSIONS_LIST, getSessionLabel, formatNumber } from '../data/dataset';
import { SessionData, SessionEntry } from '../types';

interface SessionExplorerViewProps {
  currentSessionKey: string;
  onSelectSessionKey: (sessionKey: string) => void;
  onSelectFounder?: (founderName: string) => void;
  onSelectStartup?: (startupName: string) => void;
}

export const SessionExplorerView: React.FC<SessionExplorerViewProps> = ({
  currentSessionKey,
  onSelectSessionKey,
  onSelectFounder,
  onSelectStartup
}) => {
  const [searchInSession, setSearchInSession] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Find active session object
  const activeSessionIndex = useMemo(() => {
    const idx = SESSIONS_LIST.findIndex(s => s.session === currentSessionKey);
    return idx >= 0 ? idx : SESSIONS_LIST.length - 1; // default to latest
  }, [currentSessionKey]);

  const activeSession: SessionData = SESSIONS_LIST[activeSessionIndex] || SESSIONS_LIST[SESSIONS_LIST.length - 1];

  // Navigate prev/next
  const handlePrev = () => {
    if (activeSessionIndex > 0) {
      onSelectSessionKey(SESSIONS_LIST[activeSessionIndex - 1].session);
    }
  };

  const handleNext = () => {
    if (activeSessionIndex < SESSIONS_LIST.length - 1) {
      onSelectSessionKey(SESSIONS_LIST[activeSessionIndex + 1].session);
    }
  };

  // Filter entries in this session
  const filteredEntries = useMemo(() => {
    if (!activeSession || !activeSession.entries) return [];

    return activeSession.entries.filter((e) => {
      // Filter by decision
      if (filterDecision !== 'all') {
        if (filterDecision === 'label' && e.decision !== 'label') return false;
        if (filterDecision === 'prelabel' && e.decision !== 'prelabel') return false;
        if (filterDecision === 'retrait' && e.decision !== 'retrait') return false;
        if (filterDecision === 'refused' && e.decision !== 'refused') return false;
      }

      // Search in session
      if (searchInSession.trim()) {
        const q = searchInSession.toLowerCase();
        const matchSoc = e.societe.toLowerCase().includes(q);
        const matchFond = e.fondateurs.toLowerCase().includes(q);
        const matchSec = e.secteur.toLowerCase().includes(q);
        const matchRes = e.resultat.toLowerCase().includes(q);
        if (!matchSoc && !matchFond && !matchSec && !matchRes) return false;
      }

      return true;
    });
  }, [activeSession, searchInSession, filterDecision]);

  // Export current session table to CSV
  const exportSessionCSV = () => {
    const headers = ['N°', 'Societe', 'Fondateurs', 'Secteur', 'Decision', 'Resultat_Brut'];
    const rows = filteredEntries.map((e, idx) => [
      idx + 1,
      `"${e.societe.replace(/"/g, '""')}"`,
      `"${e.fondateurs.replace(/"/g, '""')}"`,
      `"${e.secteur.replace(/"/g, '""')}"`,
      e.decision,
      `"${e.resultat.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `session_${activeSession.session.replace('/', '_')}_table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy table as TSV
  const handleCopyTSV = () => {
    const lines = [
      ['N°', 'Société', 'Fondateurs', 'Secteur', 'Résultat'].join('\t'),
      ...filteredEntries.map((e, i) => [i + 1, e.societe, e.fondateurs, e.secteur, e.resultat || e.decision].join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDecisionBadge = (decision: string, resultat: string) => {
    if (decision === 'retrait' || resultat.toLowerCase().includes('retrait')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
          Retrait de label
        </span>
      );
    }
    if (decision === 'prelabel' || resultat.toLowerCase().includes('prelabel') || resultat.toLowerCase().includes('prélabel')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          Pré-Label accordé
        </span>
      );
    }
    if (decision === 'label' || resultat.toLowerCase().includes('label accorde') || resultat.toLowerCase().includes('accordé')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Label accordé
        </span>
      );
    }
    if (decision === 'refused' || resultat.toLowerCase().includes('non accorde')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Non accordé
        </span>
      );
    }
    if (decision === 'ajourne' || resultat.toLowerCase().includes('ajourn')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Ajourné
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
        {decision}
      </span>
    );
  };

  return (
    <div className="space-y-5 pb-12" id="session-explorer-container">
      {/* Session Selector & Navigator Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title & Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">Explorateur de Session PDF</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {activeSession.id} sur 85
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Session {activeSession.session} — {getSessionLabel(activeSession.session)}
              </h2>
            </div>
          </div>

          {/* Quick Select Dropdown & Prev/Next */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-prev-session"
              onClick={handlePrev}
              disabled={activeSessionIndex === 0}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700"
              title="Session précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              id="select-session-picker"
              value={activeSession.session}
              onChange={(e) => onSelectSessionKey(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {SESSIONS_LIST.map((s) => (
                <option key={s.session} value={s.session}>
                  Session {s.session} ({getSessionLabel(s.session)}) — {s.labels} Labels, {s.candidatures} Candidats
                </option>
              ))}
            </select>

            <button
              id="btn-next-session"
              onClick={handleNext}
              disabled={activeSessionIndex === SESSIONS_LIST.length - 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700"
              title="Session suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Metrics of this specific session */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-medium block">Candidatures</span>
            <span className="text-base font-bold text-blue-700">{activeSession.candidatures}</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-medium block">Total Labels</span>
            <span className="text-base font-bold text-emerald-800">{activeSession.labels}</span>
            <span className="text-[9px] text-emerald-600 block">({activeSession.newLabels} dir. + {activeSession.conversions} conv.)</span>
          </div>

          <div className="p-3 bg-indigo-50 rounded-lg text-center border border-indigo-100">
            <span className="text-[10px] text-indigo-700 font-medium block">Pré-Labels</span>
            <span className="text-base font-bold text-indigo-800">{activeSession.preLabels}</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
            <span className="text-[10px] text-purple-700 font-medium block">Conversions</span>
            <span className="text-base font-bold text-purple-800">{activeSession.conversions}</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-lg text-center border border-rose-100">
            <span className="text-[10px] text-rose-700 font-medium block">Retraits</span>
            <span className="text-base font-bold text-rose-800">{activeSession.retraits}</span>
          </div>

          <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
            <span className="text-[10px] text-teal-700 font-medium block">Taux Acceptation</span>
            <span className="text-base font-bold text-teal-800">{activeSession.tauxPct}%</span>
          </div>
        </div>

        {/* Comments & PDF Reference */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Procès-Verbal :</span>
            <span className="text-slate-600">{activeSession.commentaires || `${activeSession.labels} labels accordés pour cette session.`}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={activeSession.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-white text-slate-700 hover:text-emerald-700 border border-slate-300 font-medium hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir PDF Source ({activeSession.pdf})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Structured Table Section for this Session */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tableau des Entreprises Évaluées ({filteredEntries.length} dossiers listés)
            </h3>
            <p className="text-xs text-slate-500">
              Extraction structurée des sociétés, fondateurs, secteurs et décisions du Collège
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search inside session */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filtrer dans la session..."
                value={searchInSession}
                onChange={(e) => setSearchInSession(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Decision filter */}
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">Toutes décisions</option>
              <option value="label">Labels accordés</option>
              <option value="prelabel">Pré-labels</option>
              <option value="retrait">Retraits</option>
              <option value="refused">Non accordés</option>
            </select>

            {/* Copy Table */}
            <button
              onClick={handleCopyTSV}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
              title="Copier le tableau pour Excel/Sheets"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportSessionCSV}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" id="session-structured-table">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Société / Projet</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Fondateurs</th>
                  <th className="py-2.5 px-3 min-w-[150px]">Secteur d'Activité</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Résultat / Décision Collège</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Aucune entreprise trouvée pour cette session avec les filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((e, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center font-medium text-slate-400">
                          {idx + 1}
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            onClick={() => onSelectStartup?.(e.societe)}
                            className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer text-sm"
                          >
                            {e.societe}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          {e.fondateurs ? (
                            <span className="text-slate-700 font-medium">{e.fondateurs}</span>
                          ) : (
                            <span className="text-slate-400 italic">Non mentionné</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          {e.secteur ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                              {e.secteur}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex flex-col space-y-1">
                            <div>{getDecisionBadge(e.decision, e.resultat)}</div>
                            {e.resultat && e.resultat.toLowerCase() !== e.decision && (
                              <span className="text-[10px] text-slate-500 max-w-[280px] leading-tight">
                                {e.resultat}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
