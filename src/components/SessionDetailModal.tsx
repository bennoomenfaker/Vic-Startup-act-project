import React, { useState, useMemo } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Download, 
  Award, 
  Layers, 
  RefreshCw, 
  Ban, 
  CheckCircle2, 
  FileText,
  Calendar,
  Building2,
  Users,
  FileSpreadsheet,
  FileCode,
  Database
} from 'lucide-react';
import { SessionData, SessionEntry } from '../types';
import { getSessionLabel, formatNumber } from '../data/dataset';
import { exportToJSON, exportSingleSessionExcel, exportToSQL, generateSingleSessionSQL } from '../utils/exportUtils';

interface SessionDetailModalProps {
  session: SessionData | null;
  onClose: () => void;
  onSelectFounder?: (founderName: string) => void;
  onSelectStartup?: (startupName: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
  onSelectFounder,
  onSelectStartup
}) => {
  const [searchInModal, setSearchInModal] = useState('');
  const [filterDecision, setFilterDecision] = useState('all');

  if (!session) return null;

  const entries = session.entries || [];

  const filteredEntries = entries.filter((e) => {
    if (filterDecision !== 'all' && e.decision !== filterDecision) {
      return false;
    }
    if (searchInModal.trim()) {
      const q = searchInModal.toLowerCase();
      return (
        e.societe.toLowerCase().includes(q) ||
        e.fondateurs.toLowerCase().includes(q) ||
        e.secteur.toLowerCase().includes(q) ||
        e.resultat.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getDecisionBadge = (decision: string, resultat: string) => {
    if (decision === 'retrait' || resultat.toLowerCase().includes('retrait')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Retrait</span>;
    }
    if (decision === 'prelabel' || resultat.toLowerCase().includes('prelabel')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Pré-Label</span>;
    }
    if (decision === 'label' || resultat.toLowerCase().includes('label')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Label accordé</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{decision}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80 rounded-t-2xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Session N° {session.id} / 85
              </span>
              <span className="text-xs text-slate-500 font-medium">{getSessionLabel(session.session)}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Détail de la Session {session.session}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {session.commentaires || `${session.labels} labels accordés sur ${session.candidatures} candidatures.`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3 bg-slate-100/50 border-b border-slate-200 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Candidatures</span>
            <span className="font-bold text-blue-700 text-sm">{session.candidatures}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Total Labels</span>
            <span className="font-bold text-emerald-700 text-sm">{session.labels}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Pré-Labels</span>
            <span className="font-bold text-indigo-700 text-sm">{session.preLabels}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Conversions</span>
            <span className="font-bold text-purple-700 text-sm">{session.conversions}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Retraits</span>
            <span className="font-bold text-rose-700 text-sm">{session.retraits}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Taux Succès</span>
            <span className="font-bold text-teal-700 text-sm">{session.tauxPct}%</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Rechercher société ou fondateur..."
              value={searchInModal}
              onChange={(e) => setSearchInModal(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="text-xs font-medium px-2 py-1 rounded border border-slate-200 bg-white"
            >
              <option value="all">Toutes décisions ({entries.length})</option>
              <option value="label">Labels accordés</option>
              <option value="prelabel">Pré-labels</option>
              <option value="retrait">Retraits</option>
            </select>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => exportSingleSessionExcel(session)}
                title="Télécharger cette session en Excel (.xlsx)"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>

              <button
                onClick={() => exportToJSON(session, `startup_act_session_${session.session.replace('/', '_')}.json`)}
                title="Télécharger cette session en JSON"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => exportToSQL(generateSingleSessionSQL(session), `startup_act_session_${session.session.replace('/', '_')}.sql`)}
                title="Télécharger le script SQL (.sql) pour cette session"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL</span>
              </button>

              <a
                href={session.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Aucune entreprise répertoriée avec ces filtres pour cette session.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3">Société / Projet</th>
                    <th className="py-2 px-3">Fondateur(s)</th>
                    <th className="py-2 px-3">Secteur</th>
                    <th className="py-2 px-3">Décision Collège</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        <span
                          onClick={() => {
                            onClose();
                            onSelectStartup?.(e.societe);
                          }}
                          className="hover:text-emerald-700 cursor-pointer"
                        >
                          {e.societe}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {e.fondateurs ? (
                          <span>{e.fondateurs}</span>
                        ) : (
                          <span className="text-slate-400 italic">Non mentionné</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-600">{e.secteur || '-'}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          <div>{getDecisionBadge(e.decision, e.resultat)}</div>
                          {e.resultat && e.resultat.toLowerCase() !== e.decision && (
                            <span className="text-[10px] text-slate-500 mt-0.5">{e.resultat}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Source officielle : Collège des Startups — Ministère des Technologies de la Communication
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
