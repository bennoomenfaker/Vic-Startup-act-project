import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Database, 
  Check, 
  Copy, 
  Layers, 
  Building2, 
  Users2, 
  Table2, 
  FileText, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Info,
  FileDown,
  Printer,
  Eye,
  TrendingUp,
  HeartHandshake,
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { 
  data, 
  SESSIONS_LIST, 
  STARTUPS_LIST, 
  FOUNDERS_LIST, 
  META_DATA, 
  YEARLY_STATS, 
  AUDITED_CORRECTIONS,
  getSessionLabel 
} from '../data/dataset';
import { 
  exportToJSON, 
  exportToExcel, 
  exportToSQL, 
  exportAllDataExcel, 
  exportGenderParityExcel,
  exportKPICatalogExcel,
  exportSingleSessionExcel,
  generateCompleteSQL, 
  generateSingleSessionSQL 
} from '../utils/exportUtils';
import { 
  getAll85SessionsGenderData, 
  SECTOR_GENDER_DATA, 
  YEARLY_GENDER_DATA, 
  GENDER_MACRO_STATS 
} from '../data/genderData';
import { KPI_CATALOG } from '../data/kpiCatalog';
import { SessionData } from '../types';
import { ComprehensivePDFReportsModal, ReportType } from './ComprehensivePDFReportsModal';

export const ExportCenterView: React.FC = () => {
  const [selectedSessionCode, setSelectedSessionCode] = useState<string>(SESSIONS_LIST[SESSIONS_LIST.length - 1]?.session || '03/2026');
  const [copiedSql, setCopiedSql] = useState(false);
  const [sqlPreviewTab, setSqlPreviewTab] = useState<'complete' | 'gender' | 'session'>('complete');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  
  // PDF Reports Modal State
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);
  const [activeReportType, setActiveReportType] = useState<ReportType>('national_executive');
  const [pdfSessionTarget, setPdfSessionTarget] = useState<string>('03/2026');

  const selectedSession: SessionData | undefined = SESSIONS_LIST.find(s => s.session === selectedSessionCode) || SESSIONS_LIST[0];

  const handleOpenPDFReport = (reportType: ReportType, sessionCode?: string) => {
    setActiveReportType(reportType);
    if (sessionCode) setPdfSessionTarget(sessionCode);
    setIsPDFModalOpen(true);
  };

  const triggerSuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Previews
  const completeSqlPreview = generateCompleteSQL(data);
  const sessionSqlPreview = selectedSession ? generateSingleSessionSQL(selectedSession) : '';

  const handleCopySql = () => {
    const textToCopy = sqlPreviewTab === 'complete' ? completeSqlPreview : sessionSqlPreview;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Master Exports
  const handleExportMasterExcel = () => {
    exportAllDataExcel(data);
    triggerSuccess("Classeur Excel complet (.xlsx) téléchargé avec 8 feuilles certifiées !");
  };

  const handleExportMasterJSON = () => {
    exportToJSON(data, 'startup_act_tunisie_dataset_complet.json');
    triggerSuccess("Base de données complète (.json) téléchargée !");
  };

  const handleExportMasterSQL = () => {
    exportToSQL(completeSqlPreview, 'startup_act_tunisie_schema_and_data.sql');
    triggerSuccess("Script SQL complet avec tables de parité & 50 KPIs téléchargé !");
  };

  // Gender Parity Exports
  const handleExportGenderExcel = () => {
    exportGenderParityExcel();
    triggerSuccess("Tableaux de parité & genre (85 sessions, 10 secteurs) exportés en Excel !");
  };

  const handleExportGenderJSON = () => {
    exportToJSON({
      macro: GENDER_MACRO_STATS,
      sessions_85: getAll85SessionsGenderData(),
      secteurs_10: SECTOR_GENDER_DATA,
      yearly: YEARLY_GENDER_DATA
    }, 'startup_act_parite_genre_complet.json');
    triggerSuccess("Données complètes de parité & genre exportées en JSON !");
  };

  // KPI Catalog Exports
  const handleExportKPICatalogExcel = () => {
    exportKPICatalogExcel();
    triggerSuccess("Catalogue officiel des 50 KPIs exporté en Excel !");
  };

  const handleExportKPICatalogJSON = () => {
    exportToJSON(KPI_CATALOG, 'startup_act_catalogue_50_kpis.json');
    triggerSuccess("Catalogue des 50 KPIs exporté en JSON !");
  };

  // Individual Table Exports
  const handleExportSessionsExcel = () => {
    const sessionsData = SESSIONS_LIST.map(s => ({
      'ID': s.id,
      'Session': s.session,
      'Année': s.annee,
      'Mois': s.mois,
      'Candidatures': s.candidatures,
      'Labels Total': s.labels,
      'Nouveaux Labels Directs': s.newLabels,
      'Pré-Labels': s.preLabels,
      'Conversions': s.conversions,
      'Retraits': s.retraits,
      'Taux Acceptation (%)': s.tauxPct,
      'Taux Rejet (%)': s.tauxEchec,
      'Statut': s.statut,
      'Commentaires': s.commentaires,
      'PDF': s.pdf
    }));
    exportToExcel([{ sheetName: '85 Sessions', data: sessionsData }], 'startup_act_85_sessions.xlsx');
    triggerSuccess("Tableau des 85 sessions exporté en Excel !");
  };

  const handleExportSessionsJSON = () => {
    exportToJSON(SESSIONS_LIST, 'startup_act_85_sessions.json');
    triggerSuccess("Tableau des 85 sessions exporté en JSON !");
  };

  const handleExportStartupsExcel = () => {
    const startupsData = STARTUPS_LIST.map(st => ({
      'Nom Startup': st.name,
      'Secteur': st.secteur,
      'Statut': st.status,
      'Sessions d\'examen': st.sessions.join(', '),
      'Nombre de passages': st.sessions.length,
      'Fondateurs': st.founders.join(', '),
      'Décisions': st.decisions.join(' | ')
    }));
    exportToExcel([{ sheetName: 'Startups', data: startupsData }], 'startup_act_startups.xlsx');
    triggerSuccess("Tableau des startups exporté en Excel !");
  };

  const handleExportStartupsJSON = () => {
    exportToJSON(STARTUPS_LIST, 'startup_act_startups.json');
    triggerSuccess("Tableau des startups exporté en JSON !");
  };

  const handleExportFoundersExcel = () => {
    const foundersData = FOUNDERS_LIST.map(f => ({
      'Nom Fondateur': f.name,
      'Labellisé': f.isLabellise ? 'Oui' : 'Non',
      'Startups': f.startups.join(', '),
      'Nombre Startups': f.startups.length,
      'Sessions': f.sessions.join(', '),
      'Secteurs': f.secteurs.join(', ')
    }));
    exportToExcel([{ sheetName: 'Fondateurs', data: foundersData }], 'startup_act_fondateurs.xlsx');
    triggerSuccess("Tableau des fondateurs exporté en Excel !");
  };

  const handleExportFoundersJSON = () => {
    exportToJSON(FOUNDERS_LIST, 'startup_act_fondateurs.json');
    triggerSuccess("Tableau des fondateurs exporté en JSON !");
  };

  const handleExportAllCandidaturesExcel = () => {
    const allDossiers: any[] = [];
    SESSIONS_LIST.forEach(s => {
      s.entries.forEach((e, idx) => {
        allDossiers.push({
          'Session': s.session,
          'Année': s.annee,
          'N° Dossier': idx + 1,
          'Société': e.societe,
          'Fondateurs': e.fondateurs,
          'Secteur': e.secteur,
          'Résultat Officiel': e.resultat,
          'Décision': e.decision
        });
      });
    });
    exportToExcel([{ sheetName: 'Toutes Candidatures', data: allDossiers }], 'startup_act_toutes_candidatures_2958.xlsx');
    triggerSuccess("2 958 candidatures exportées en Excel !");
  };

  const handleExportAllCandidaturesJSON = () => {
    const allDossiers: any[] = [];
    SESSIONS_LIST.forEach(s => {
      s.entries.forEach((e, idx) => {
        allDossiers.push({
          session: s.session,
          annee: s.annee,
          dossierIndex: idx + 1,
          societe: e.societe,
          fondateurs: e.fondateurs,
          secteur: e.secteur,
          resultat: e.resultat,
          decision: e.decision
        });
      });
    });
    exportToJSON(allDossiers, 'startup_act_toutes_candidatures_2958.json');
    triggerSuccess("2 958 candidatures exportées en JSON !");
  };

  // Single session exports
  const handleExportSingleSessionExcel = () => {
    if (!selectedSession) return;
    exportSingleSessionExcel(selectedSession);
    triggerSuccess(`Session ${selectedSession.session} exportée en Excel !`);
  };

  const handleExportSingleSessionJSON = () => {
    if (!selectedSession) return;
    exportToJSON(selectedSession, `startup_act_session_${selectedSession.session.replace('/', '_')}.json`);
    triggerSuccess(`Session ${selectedSession.session} exportée en JSON !`);
  };

  const handleExportSingleSessionSQL = () => {
    if (!selectedSession) return;
    exportToSQL(sessionSqlPreview, `startup_act_session_${selectedSession.session.replace('/', '_')}.sql`);
    triggerSuccess(`Script SQL pour session ${selectedSession.session} téléchargé !`);
  };

  return (
    <div className="space-y-8 pb-16" id="export-center-view">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-emerald-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{downloadSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-emerald-950 uppercase tracking-wider">
                Centre d'Exportation Intégral & Multi-Formats
              </span>
              <span className="text-xs text-slate-400">Excel (.xlsx) • JSON • SQL Relationnel • Rapports PDF</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              Exportez Toutes les Données, Tables Genrées, SQL & Rapports PDF
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Téléchargez les 85 sessions, 1 311 labels, 623 pré-labels, 2 958 candidatures, les 4 764 fondateurs (avec ventilation Femmes/Hommes), le catalogue des 50 KPIs et générez des rapports PDF imprimables conformes au format institutionnel A4.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleOpenPDFReport('national_executive')}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-soft transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Générer Rapports PDF (.pdf)</span>
            </button>

            <button
              onClick={handleExportMasterExcel}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-soft transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tout en Excel (8 Feuilles)</span>
            </button>

            <button
              onClick={handleExportMasterSQL}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-soft transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Tout en SQL (.sql)</span>
            </button>

            <button
              onClick={handleExportMasterJSON}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 border border-slate-700 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Tout en JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: SÉLECTION DES RAPPORTS PDF MULTI-TYPES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <FileText className="w-5 h-5" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Générateur de Rapports PDF Thématiques & Fiches Officielles
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Exportez des synthèses analytiques prêtes à l'impression au format A4 selon votre thématique d'intérêt.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report 1: National Executive */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-gradient-to-b from-indigo-50/40 to-white flex flex-col justify-between space-y-3 hover:border-indigo-400 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Rapport National Complet</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  85 Sessions
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Bilan exécutif consolidé : 2 958 candidatures, 1 311 labels, 623 pré-labels, conversions (-502=121) et évolution annuelle 2019-2026.
              </p>
            </div>
            <button
              onClick={() => handleOpenPDFReport('national_executive')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Générer Rapport National PDF</span>
            </button>
          </div>

          {/* Report 2: Gender & Parity */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-gradient-to-b from-pink-50/40 to-white flex flex-col justify-between space-y-3 hover:border-pink-400 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-950 flex items-center space-x-1.5">
                  <HeartHandshake className="w-4 h-4 text-pink-600" />
                  <span>Rapport Parité & Genre (Femmes)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-800">
                  1 153 Femmes
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Focus démographique : ratios H/F, 1 153 femmes fondatrices, surperformance des équipes mixtes (+7.4 pts) et 10 secteurs décryptés.
              </p>
            </div>
            <button
              onClick={() => handleOpenPDFReport('gender_parity')}
              className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Générer Rapport Parité PDF</span>
            </button>
          </div>

          {/* Report 3: Audit & Compliance */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-gradient-to-b from-amber-50/40 to-white flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Rapport d'Audit & Conformité</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  21 Corrections
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Rapprochement contradictoire des 85 PVs scellés, justification technique des 21 corrections et certification d'intégrité à 100%.
              </p>
            </div>
            <button
              onClick={() => handleOpenPDFReport('audit_compliance')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Générer Rapport Audit PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: EXPORTATION PAR TABLE SPÉCIFIQUE (EXCEL & JSON) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-5">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
            <Table2 className="w-5 h-5 text-emerald-600" />
            <span>Exportations Ciblées par Table de Données (Excel & JSON)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Téléchargez chaque table individuelle en format Excel (.xlsx) et JSON (.json).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Table 1: Parité & Genre (85 Sessions & Secteurs) */}
          <div className="p-4.5 rounded-2xl border border-pink-200 bg-pink-50/30 hover:bg-pink-50/60 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-950 flex items-center space-x-1.5">
                  <HeartHandshake className="w-4 h-4 text-pink-600" />
                  <span>Table Parité & Genre (Sessions & Secteurs)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                  4 764 fondateurs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Décompte femmes (1 153), hommes (3 611), ratios H/F, % startups mixtes par session et par secteur.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-pink-100">
              <button
                onClick={handleExportGenderExcel}
                className="flex-1 py-1.5 bg-white hover:bg-pink-50 text-pink-700 border border-pink-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                onClick={handleExportGenderJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Table 2: Catalogue des 50 KPIs */}
          <div className="p-4.5 rounded-2xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-purple-600" />
                  <span>Catalogue des 50 KPIs Officiels</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  50 KPIs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Formules mathématiques, benchmarks, utilité opérationnelle et explications d'interprétation.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-purple-100">
              <button
                onClick={handleExportKPICatalogExcel}
                className="flex-1 py-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                onClick={handleExportKPICatalogJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Table 3: 85 Sessions */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">85 Sessions Officielles</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">85 lignes</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Totaux, labels, pré-labels, conversions, retraits et taux par session.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleExportSessionsExcel}
                className="flex-1 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportSessionsJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Table 4: Startups */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Table des Startups</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{META_DATA.uniqueStartupsCount} entités</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Startups labellisées, pré-labels, secteurs et historique de sessions.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleExportStartupsExcel}
                className="flex-1 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportStartupsJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Table 5: Fondateurs */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Table des Fondateurs</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">{META_DATA.uniqueFoundersCount} personnes</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Liste nominative des fondateurs et startups associées.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleExportFoundersExcel}
                className="flex-1 py-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportFoundersJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Table 6: 2958 Candidatures */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Toutes Candidatures Détaillées</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">2 958 dossiers</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tous les dossiers individuels examinés par le Collège avec décisions.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleExportAllCandidaturesExcel}
                className="flex-1 py-1.5 bg-white hover:bg-teal-50 text-teal-700 border border-teal-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportAllCandidaturesJSON}
                className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: EXPORT PAR SESSION INDIVIDUELLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Exportateur Dédié par Session (1 à 85)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sélectionnez n'importe quelle session pour exporter spécifiquement ses dossiers et son script SQL de table dédiée.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-slate-600">Choisir Session :</label>
            <select
              value={selectedSessionCode}
              onChange={(e) => setSelectedSessionCode(e.target.value)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              {SESSIONS_LIST.map((s) => (
                <option key={s.session} value={s.session}>
                  Session {s.session} — {getSessionLabel(s.session)} ({s.candidatures} cand., {s.labels} labels)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSession && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">
                    Session {selectedSession.session} ({getSessionLabel(selectedSession.session)})
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {selectedSession.labels} Labels ({selectedSession.newLabels} dir. + {selectedSession.conversions} conv.)
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {selectedSession.candidatures} Candidatures
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedSession.entriesCount} dossiers nominatifs indexés • {selectedSession.preLabels} pré-labels • {selectedSession.retraits} retraits
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenPDFReport('single_session', selectedSession.session)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Rapport PDF Session</span>
                </button>

                <button
                  onClick={handleExportSingleSessionExcel}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel (.xlsx)</span>
                </button>

                <button
                  onClick={handleExportSingleSessionJSON}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JSON</span>
                </button>

                <button
                  onClick={handleExportSingleSessionSQL}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>SQL (.sql)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: INTERACTIVE SQL VIEWER & DDL/DML SCHEMA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Générateur & Visualiseur de Code SQL (Tables Genrées, 50 KPIs & DDL/DML)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Code SQL prêt à l'exécution pour importer immédiatement la base dans PostgreSQL, MySQL, Supabase, Cloud SQL ou SQLite.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
              <button
                onClick={() => setSqlPreviewTab('complete')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  sqlPreviewTab === 'complete' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Base Complète (11 Tables)
              </button>
              <button
                onClick={() => setSqlPreviewTab('session')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  sqlPreviewTab === 'session' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Session {selectedSessionCode}
              </button>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copié !' : 'Copier SQL'}</span>
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-5 font-mono text-xs overflow-hidden border border-slate-800">
          <div className="overflow-x-auto max-h-[380px] scrollbar-thin">
            <pre className="text-emerald-400/90 leading-relaxed whitespace-pre font-mono">
              {sqlPreviewTab === 'complete' 
                ? completeSqlPreview.split('\n').slice(0, 140).join('\n') + `\n\n-- ... [${completeSqlPreview.split('\n').length - 140} lignes supplémentaires incluses dans le téléchargement .sql]`
                : sessionSqlPreview
              }
            </pre>
          </div>
        </div>
      </div>

      {/* Comprehensive PDF Report Modal */}
      {isPDFModalOpen && (
        <ComprehensivePDFReportsModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          initialReportType={activeReportType}
          initialSessionCode={pdfSessionTarget}
        />
      )}
    </div>
  );
};
