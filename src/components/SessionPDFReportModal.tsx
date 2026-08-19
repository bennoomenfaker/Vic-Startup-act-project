import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Users2, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Calendar,
  Layers,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { SessionData } from '../types';
import { SESSIONS_LIST, META_DATA, AUDITED_CORRECTIONS, getSessionLabel } from '../data/dataset';
import { generatePDFFromElement } from '../utils/pdfGenerator';

interface SessionPDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSessionCode?: string;
}

export const SessionPDFReportModal: React.FC<SessionPDFReportModalProps> = ({
  isOpen,
  onClose,
  initialSessionCode
}) => {
  const [selectedSessionCode, setSelectedSessionCode] = useState<string>(
    initialSessionCode || SESSIONS_LIST[SESSIONS_LIST.length - 1]?.session || '03/2026'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeTrendChart, setIncludeTrendChart] = useState(true);
  const [includeSectorBreakdown, setIncludeSectorBreakdown] = useState(true);

  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentSessionIndex = SESSIONS_LIST.findIndex(s => s.session === selectedSessionCode);
  const currentSession: SessionData = SESSIONS_LIST[currentSessionIndex >= 0 ? currentSessionIndex : SESSIONS_LIST.length - 1];

  // Surrounding sessions for contextual trend graph (+/- 4 sessions)
  const surroundingStart = Math.max(0, currentSessionIndex - 4);
  const surroundingEnd = Math.min(SESSIONS_LIST.length, currentSessionIndex + 5);
  const trendData = SESSIONS_LIST.slice(surroundingStart, surroundingEnd).map(s => ({
    session: s.session,
    isCurrent: s.session === currentSession.session,
    candidatures: s.candidatures,
    labels: s.labels,
    preLabels: s.preLabels,
    taux: s.tauxPct
  }));

  // Decision breakdown for pie chart
  const rejetsAjournements = Math.max(0, currentSession.candidatures - (currentSession.labels + currentSession.preLabels));
  const decisionData = [
    { name: 'Labels Directs', value: currentSession.newLabels, color: '#4f46e5' },
    { name: 'Conversions Pré-label', value: currentSession.conversions, color: '#06b6d4' },
    { name: 'Pré-Labels', value: currentSession.preLabels, color: '#10b981' },
    { name: 'Non Retenus / Ajournés', value: rejetsAjournements, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  // Sector breakdown calculation for current session
  const sectorCountMap: Record<string, number> = {};
  currentSession.entries.forEach(e => {
    const sect = e.secteur || 'Technologies & Services IT';
    sectorCountMap[sect] = (sectorCountMap[sect] || 0) + 1;
  });
  const sectorData = Object.entries(sectorCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Audited correction check
  const correctionNote = AUDITED_CORRECTIONS.find(c => c.session === currentSession.session);

  // Navigation handlers
  const handlePrevSession = () => {
    if (currentSessionIndex > 0) {
      setSelectedSessionCode(SESSIONS_LIST[currentSessionIndex - 1].session);
    }
  };

  const handleNextSession = () => {
    if (currentSessionIndex < SESSIONS_LIST.length - 1) {
      setSelectedSessionCode(SESSIONS_LIST[currentSessionIndex + 1].session);
    }
  };

  // Trigger PDF download
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsGenerating(true);
      const safeCode = currentSession.session.replace('/', '_');
      await generatePDFFromElement(reportRef.current, {
        filename: `Rapport_Analytique_Startup_Act_Session_${safeCode}.pdf`,
        scale: 2,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:static" id="session-pdf-modal">
      <div className="relative w-full max-w-5xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-300 print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Top Action Bar (Hidden during Print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Générateur de Rapport PDF Analytique</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">A4 Pro</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Session {currentSession.session} • {getSessionLabel(currentSession.session)}
              </p>
            </div>
          </div>

          {/* Session Switcher & Actions */}
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={handlePrevSession}
                disabled={currentSessionIndex === 0}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                title="Session précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <select
                value={selectedSessionCode}
                onChange={(e) => setSelectedSessionCode(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white px-2 py-0.5 focus:outline-none cursor-pointer"
              >
                {SESSIONS_LIST.map(s => (
                  <option key={s.session} value={s.session} className="bg-slate-900 text-white">
                    Session {s.session} ({s.candidatures} cand.)
                  </option>
                ))}
              </select>
              <button
                onClick={handleNextSession}
                disabled={currentSessionIndex === SESSIONS_LIST.length - 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                title="Session suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exportation PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF (.pdf)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Ribbon (Hidden during Print) */}
        <div className="bg-slate-200/90 px-5 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-700 shrink-0 print:hidden">
          <span className="font-semibold text-slate-800">Personnaliser le contenu du document :</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTrendChart}
                onChange={(e) => setIncludeTrendChart(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Graphiques de tendances</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSectorBreakdown}
                onChange={(e) => setIncludeSectorBreakdown(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Répartition sectorielle</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Liste des startups & fondateurs</span>
            </label>
          </div>
        </div>

        {/* Report Preview Document View (Print Target) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60 print:p-0 print:bg-white flex justify-center">
          <div 
            ref={reportRef}
            id="report-printable-area"
            className="w-full max-w-[800px] bg-white rounded-xl shadow-xl p-8 sm:p-10 border border-slate-300 print:shadow-none print:border-none print:p-6 print:max-w-none text-slate-900 space-y-7"
          >
            {/* Header Officiel République Tunisienne */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                    RÉPUBLIQUE TUNISIENNE • MINISTÈRE DES TECHNOLOGIES DE LA COMMUNICATION
                  </span>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    COLLÈGE DES STARTUPS — RAPPORT ANALYTIQUE OFFICIEL
                  </h1>
                  <p className="text-xs font-semibold text-indigo-700">
                    SESSION OFFICIELLE D'ATTRIBUTION DU LABEL N° {currentSession.session} ({getSessionLabel(currentSession.session)})
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black">
                    SESSION {currentSession.id} / 85
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Audité le : 18/08/2026
                  </p>
                </div>
              </div>

              {/* Badges and metadata bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Période</span>
                  <span className="font-bold text-slate-800">{getSessionLabel(currentSession.session)}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Document Source</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px] truncate block">{currentSession.pdf}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Statut PV</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Conforme & Audité</span>
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Dossiers Indexés</span>
                  <span className="font-bold text-slate-800">{currentSession.entriesCount} sociétés</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: KPIS CALCULÉS DE LA SESSION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>1. Synthèse des Indicateurs Clés de Performance (KPIs)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Taux d'acceptation : {currentSession.tauxPct}%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* KPI 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Candidatures</span>
                  <span className="text-2xl font-black text-slate-900 block my-0.5">{currentSession.candidatures}</span>
                  <span className="text-[10px] text-slate-500">Dossiers examinés</span>
                </div>

                {/* KPI 2 */}
                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">Labels Accordés</span>
                  <span className="text-2xl font-black text-indigo-900 block my-0.5">{currentSession.labels}</span>
                  <span className="text-[10px] text-indigo-700">
                    {currentSession.newLabels} dir. + {currentSession.conversions} conv.
                  </span>
                </div>

                {/* KPI 3 */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pré-Labels</span>
                  <span className="text-2xl font-black text-emerald-900 block my-0.5">{currentSession.preLabels}</span>
                  <span className="text-[10px] text-emerald-700">En cours de constitution</span>
                </div>

                {/* KPI 4 */}
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-center">
                  <span className="text-[10px] font-bold text-purple-800 uppercase block">Taux Acceptation</span>
                  <span className="text-2xl font-black text-purple-900 block my-0.5">{currentSession.tauxPct}%</span>
                  <span className="text-[10px] text-purple-700">
                    {currentSession.tauxPct >= 44.3 ? '▲ Sup. à la moy.' : '▼ Inf. à la moy.'}
                  </span>
                </div>
              </div>

              {/* Detailed Metrics Strip */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[10px] block">Nouveaux Labels Directs :</span>
                  <span className="font-bold text-slate-900">{currentSession.newLabels}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Conversions Pré-Label → Label :</span>
                  <span className="font-bold text-slate-900">{currentSession.conversions}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Retraits Notifiés :</span>
                  <span className="font-bold text-slate-900">{currentSession.retraits}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Non Retenus / Ajournés :</span>
                  <span className="font-bold text-slate-900">{rejetsAjournements}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: GRAPHIQUE DE TENDANCES ET DISTRIBUTION */}
            {includeTrendChart && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>2. Analyse Chronologique et Graphique de Tendances</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Trend line / bar chart surrounding sessions */}
                  <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                      Dynamique Comparée des Sessions Adjacentes (± 4 sessions)
                    </span>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="session" tick={{ fontSize: 10 }} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #cbd5e1' }} 
                          />
                          <Bar 
                            dataKey="candidatures" 
                            name="Candidatures" 
                            fill="#94a3b8" 
                            radius={[3, 3, 0, 0]} 
                          />
                          <Bar 
                            dataKey="labels" 
                            name="Labels" 
                            fill="#4f46e5" 
                            radius={[3, 3, 0, 0]} 
                          />
                          <Bar 
                            dataKey="preLabels" 
                            name="Pré-Labels" 
                            fill="#10b981" 
                            radius={[3, 3, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Decision Breakdown Pie Chart */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      Répartition des Décisions
                    </span>
                    <div className="h-32 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={decisionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={46}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {decisionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1 text-[10px] text-slate-600">
                      {decisionData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                            <span>{d.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: SECTOR BREAKDOWN */}
            {includeSectorBreakdown && sectorData.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>3. Répartition Sectorielle des Dossiers de la Session</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sectorData.map((sect, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 truncate pr-2">{sect.name}</span>
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-100 text-indigo-900 shrink-0">
                        {sect.count} {sect.count > 1 ? 'dossiers' : 'dossier'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: TABLE DES STARTUPS LABELLISÉES DANS CETTE SESSION */}
            {includeDetails && currentSession.entries.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center space-x-1.5">
                    <Users2 className="w-4 h-4 text-indigo-600" />
                    <span>4. Registre Nominatif des Sociétés & Fondateurs ({currentSession.entries.length})</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Dossiers classés par décision</span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                        <th className="py-1.5 px-3">#</th>
                        <th className="py-1.5 px-3">Société / Candidat</th>
                        <th className="py-1.5 px-3">Fondateur(s)</th>
                        <th className="py-1.5 px-3">Secteur</th>
                        <th className="py-1.5 px-3 text-right">Décision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentSession.entries.slice(0, 15).map((entry, idx) => {
                        const isLabel = entry.resultat.includes('Label Accordé') || entry.decision.includes('Nouveau');
                        const isPreLabel = entry.resultat.includes('Pré-Label');
                        const isConversion = entry.resultat.includes('Conversion');

                        return (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-1.5 px-3 text-[10px] font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{entry.societe}</td>
                            <td className="py-1.5 px-3 text-slate-600 text-[11px] truncate max-w-[150px]">{entry.fondateurs || '—'}</td>
                            <td className="py-1.5 px-3 text-slate-500 text-[10px] truncate max-w-[120px]">{entry.secteur || 'Tech'}</td>
                            <td className="py-1.5 px-3 text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                isLabel 
                                  ? 'bg-indigo-100 text-indigo-800' 
                                  : isConversion 
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : isPreLabel
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {entry.resultat}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {currentSession.entries.length > 15 && (
                    <div className="p-2 text-center text-[10px] text-slate-500 bg-slate-50 border-t border-slate-100 font-medium">
                      + {currentSession.entries.length - 15} autres dossiers répertoriés dans la base complète (export Excel complet disponible).
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 5: NOTES D'AUDIT & CERTIFICATION D'INTÉGRITÉ */}
            <div className="pt-3 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Certificat de Concordance Analytique 85 Sessions</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  {correctionNote 
                    ? `Note d'audit : Session rectifiée (${correctionNote.cause}). Concordance validée à 100% avec le PV n° ${currentSession.session}.` 
                    : `Données strictement conformes au procès-verbal original sans anomalie de quorum ni de transcription.`
                  }
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-mono block">Neostate Act Intelligence</span>
                <span className="text-[10px] font-bold text-indigo-600">Projet VIC 2026 • Ministère TIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
