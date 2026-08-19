import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Award, 
  Briefcase, 
  ChevronRight, 
  Eye,
  FileSpreadsheet,
  Building2,
  Users2,
  FileSearch,
  Filter,
  FileDown
} from 'lucide-react';
import { SESSIONS_LIST, getSessionLabel, formatNumber, META_DATA } from '../data/dataset';
import { SessionData } from '../types';
import { SessionDetailModal } from './SessionDetailModal';
import { ComprehensivePDFReportsModal, ReportType } from './ComprehensivePDFReportsModal';

interface DocumentsPvsViewProps {
  onSelectSession: (sessionKey: string) => void;
  onOpenSessionModal: (session: SessionData) => void;
}

export const DocumentsPvsView: React.FC<DocumentsPvsViewProps> = ({
  onSelectSession,
  onOpenSessionModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [activeModalSession, setActiveModalSession] = useState<SessionData | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);
  const [pdfReportType, setPdfReportType] = useState<ReportType>('single_session');
  const [pdfTargetSession, setPdfTargetSession] = useState<string>('03/2026');

  const handleOpenPDF = (type: ReportType, sessionCode?: string) => {
    setPdfReportType(type);
    if (sessionCode) setPdfTargetSession(sessionCode);
    setIsPDFModalOpen(true);
  };

  const filteredSessions = useMemo(() => {
    return SESSIONS_LIST.filter((s) => {
      const matchYear = selectedYear === 'all' || s.annee === Number(selectedYear);
      const matchSearch = searchQuery === '' ||
        s.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSessionLabel(s.session).toLowerCase().includes(searchQuery.toLowerCase());
      return matchYear && matchSearch;
    });
  }, [selectedYear, searchQuery]);

  return (
    <div className="space-y-7 pb-16" id="documents-pvs-view">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-indigo-900/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Registre Documentaire Officiel</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                85 Procès-Verbaux Ministériels
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Documents, PVs & Délibérations des 85 Sessions
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Accédez aux procès-verbaux intégraux du Collège des Startups (Mars 2019 — Mars 2026), avec la liste nominative des décisions, les déclarations de conflits d'intérêts et les arrêtés d'octroi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => handleOpenPDF('national_executive')}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <FileDown className="w-4 h-4 text-amber-300" />
              <span>Générer Bilan PDF (85 Sessions)</span>
            </button>

            <a
              href="https://startup.gov.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Portail Ministériel</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">PVs Numérisés</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">85 / 85</span>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Couverture</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Dossiers Nominatifs</span>
          <span className="text-2xl font-extrabold text-purple-700 mt-1 block">3 015</span>
          <span className="text-[11px] text-purple-600 font-semibold">Candidatures examinées</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Conflits d'Intérêts</span>
          <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">100%</span>
          <span className="text-[11px] text-indigo-600 font-semibold">Clauses de déport</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Audit de Conformité</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">21</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Sessions réconciliées</span>
        </div>
      </div>

      {/* 3. Official Master PDF Documents Hub (2019, 2020, 2021 & 85 Sessions) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileDown className="w-5 h-5 text-indigo-600" />
              <span>Rapports Annuels & Archives Officielles Consultables et Téléchargeables</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Consultez et téléchargez les 3 rapports consolidés annuels (2019, 2020, 2021) ainsi que le registre intégral des 85 sessions scellées.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shrink-0">
            PDFs Format A4 Certifiés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card 2019 */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  Exercice 2019
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">10 Sessions</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-2">
                Rapport Annuel 2019
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                410 candidatures, 240 labels accordés, 131 pré-labels (taux d'acceptation 58.5%).
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2">
              <button
                onClick={() => handleOpenPDF('report_2019')}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Consulter & PDF</span>
              </button>
            </div>
          </div>

          {/* Card 2020 */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase">
                  Exercice 2020
                </span>
                <span className="text-xs font-bold text-blue-700 font-mono">12 Sessions</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-2">
                Rapport Annuel 2020
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                520 candidatures, 258 labels, 126 pré-labels et 55 conversions (taux 49.6%).
              </p>
            </div>
            <div className="pt-2 border-t border-blue-200/60 flex items-center gap-2">
              <button
                onClick={() => handleOpenPDF('report_2020')}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Consulter & PDF</span>
              </button>
            </div>
          </div>

          {/* Card 2021 */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                  Exercice 2021
                </span>
                <span className="text-xs font-bold text-purple-700 font-mono">Record S25</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-2">
                Rapport Annuel 2021
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                475 candidatures, 248 labels, dont session record 25 (80 dossiers) et 78 conversions.
              </p>
            </div>
            <div className="pt-2 border-t border-purple-200/60 flex items-center gap-2">
              <button
                onClick={() => handleOpenPDF('report_2021')}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Consulter & PDF</span>
              </button>
            </div>
          </div>

          {/* Card 85 Sessions Archive */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-3 shadow-md hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase">
                  Archive 2019-2026
                </span>
                <span className="text-xs font-bold text-amber-300 font-mono">85 PVs</span>
              </div>
              <h3 className="text-sm font-black text-white mt-2">
                Registre des 85 Sessions
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                3 015 candidatures, 1 311 labels, 95 conversions, 20 retraits et 21 PVs rectifiés après audit.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleOpenPDF('all_85_sessions_archive')}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Consulter & Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Year Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {['all', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedYear === yr
                  ? 'bg-slate-900 text-white shadow-soft'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {yr === 'all' ? 'Toutes les 85 sessions' : `Année ${yr}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher session (ex: 04/2021)..."
            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-2xl bg-white border border-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* 4. Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((session) => {
          const monthLabel = getSessionLabel(session.session);

          return (
            <div
              key={session.session}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        Session {session.session}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {monthLabel}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>PV Signé</span>
                  </span>
                </div>

                {/* Session Key Stats */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Candidats</span>
                    <span className="text-sm font-extrabold text-slate-900">{session.candidatures}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[9px] text-purple-700 block font-bold uppercase">Labels</span>
                    <span className="text-sm font-extrabold text-purple-700">{session.labels}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[9px] text-amber-700 block font-bold uppercase">Pré-Labels</span>
                    <span className="text-sm font-extrabold text-amber-700">{session.preLabels}</span>
                  </div>
                </div>

                {/* Conversions or Notes */}
                <div className="space-y-1 text-xs text-slate-500 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Taux d'acceptation :</span>
                    <span className="font-bold text-slate-800">{session.tauxPct}%</span>
                  </div>
                  {session.conversions > 0 && (
                    <div className="flex items-center justify-between text-indigo-600 font-semibold">
                      <span>Conversions actées :</span>
                      <span>{session.conversions}</span>
                    </div>
                  )}
                  {session.retraits > 0 && (
                    <div className="flex items-center justify-between text-rose-600 font-semibold">
                      <span>Retraits prononcés :</span>
                      <span>{session.retraits}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenSessionModal(session)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Détail & PV</span>
                </button>

                <button
                  onClick={() => handleOpenPDF('single_session', session.session)}
                  className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  title="Générer Rapport PDF Officiel de cette Session"
                >
                  <FileDown className="w-3.5 h-3.5 text-purple-600" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => onSelectSession(session.session)}
                  className="py-2 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="Ouvrir dans l'Explorateur"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive PDF Report Modal */}
      {isPDFModalOpen && (
        <ComprehensivePDFReportsModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          initialReportType={pdfReportType}
          initialSessionCode={pdfTargetSession}
        />
      )}
    </div>
  );
};
