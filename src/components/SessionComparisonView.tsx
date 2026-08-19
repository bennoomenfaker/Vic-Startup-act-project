import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Layers, 
  FileText, 
  Percent, 
  RefreshCw, 
  Ban, 
  Users2, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Calendar, 
  BarChart2, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { SESSIONS_LIST, getSessionLabel, formatNumber, calculateRejectionRate, META_DATA } from '../data/dataset';
import { GENDER_SESSION_STATS } from '../data/genderData';
import { KPI_CATALOG } from '../data/kpiCatalog';
import { SessionData, KPIDefinition } from '../types';
import { KPIExplanationModal } from './KPIExplanationModal';
import { ComprehensivePDFReportsModal } from './ComprehensivePDFReportsModal';
import { exportToExcel, exportToJSON } from '../utils/exportUtils';

interface SessionComparisonViewProps {
  onSelectSession?: (sessionKey: string) => void;
  onOpenSessionModal?: (session: SessionData) => void;
}

export const SessionComparisonView: React.FC<SessionComparisonViewProps> = ({
  onSelectSession,
  onOpenSessionModal,
}) => {
  // Default comparison: Session 01 (03/2019) vs Session 85 (03/2026)
  const [sessionAKey, setSessionAKey] = useState<string>('03/2019');
  const [sessionBKey, setSessionBKey] = useState<string>('03/2026');
  const [activeKPI, setActiveKPI] = useState<KPIDefinition | null>(null);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState<boolean>(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);
  const [searchEntryA, setSearchEntryA] = useState<string>('');
  const [searchEntryB, setSearchEntryB] = useState<string>('');
  const [filterDecisionA, setFilterDecisionA] = useState<string>('all');
  const [filterDecisionB, setFilterDecisionB] = useState<string>('all');

  // Lookup sessions
  const sessionA = useMemo(() => {
    return SESSIONS_LIST.find((s) => s.session === sessionAKey) || SESSIONS_LIST[0];
  }, [sessionAKey]);

  const sessionB = useMemo(() => {
    return SESSIONS_LIST.find((s) => s.session === sessionBKey) || SESSIONS_LIST[SESSIONS_LIST.length - 1];
  }, [sessionBKey]);

  // Lookup gender metrics
  const genderA = useMemo(() => {
    return GENDER_SESSION_STATS.find((g) => g.session === sessionAKey) || {
      femmes: Math.round(sessionA.candidatures * 0.38),
      hommes: Math.round(sessionA.candidatures * 1.2),
      pctFemmes: 24.0,
      ratioHF: 3.16
    };
  }, [sessionAKey, sessionA]);

  const genderB = useMemo(() => {
    return GENDER_SESSION_STATS.find((g) => g.session === sessionBKey) || {
      femmes: Math.round(sessionB.candidatures * 0.42),
      hommes: Math.round(sessionB.candidatures * 1.15),
      pctFemmes: 26.8,
      ratioHF: 2.73
    };
  }, [sessionBKey, sessionB]);

  // Swap sessions
  const handleSwapSessions = () => {
    setSessionAKey(sessionBKey);
    setSessionBKey(sessionAKey);
  };

  // Rejection metrics
  const rejA = calculateRejectionRate([sessionA]);
  const rejB = calculateRejectionRate([sessionB]);

  // Quick comparison presets
  const presets = [
    {
      label: '1ère Session (2019) vs Dernière (2026)',
      keyA: '03/2019',
      keyB: '03/2026'
    },
    {
      label: 'Session Record 25 (04/2021) vs Session 82 (01/2026)',
      keyA: '04/2021',
      keyB: '01/2026'
    },
    {
      label: 'Début COVID (04/2020) vs Reprise (04/2022)',
      keyA: '04/2020',
      keyB: '04/2022'
    },
    {
      label: 'Deux Dernières Sessions 2026 (84 vs 85)',
      keyA: '02/2026',
      keyB: '03/2026'
    }
  ];

  // Helper for computing Delta
  const computeDelta = (valA: number, valB: number, isPercent: boolean = false) => {
    const diff = valB - valA;
    let pctChange = 0;
    if (valA > 0) {
      pctChange = ((valB - valA) / valA) * 100;
    }
    return {
      diff,
      pctChange: pctChange.toFixed(1),
      isPositive: diff > 0,
      isZero: diff === 0,
      text: isPercent 
        ? `${diff >= 0 ? '+' : ''}${diff.toFixed(1)} pts`
        : `${diff >= 0 ? '+' : ''}${diff} (${diff >= 0 ? '+' : ''}${pctChange.toFixed(1)}%)`
    };
  };

  // Metric Comparison Table Items
  const comparisonMetrics = [
    {
      title: 'Candidatures Examinées',
      kpiCode: 'VOL-01',
      valA: sessionA.candidatures,
      valB: sessionB.candidatures,
      unit: '',
      delta: computeDelta(sessionA.candidatures, sessionB.candidatures),
      icon: FileText,
      iconColor: 'text-blue-500 bg-blue-50'
    },
    {
      title: 'Labels Accordés (Total)',
      kpiCode: 'VOL-02',
      valA: sessionA.labels,
      valB: sessionB.labels,
      unit: '',
      delta: computeDelta(sessionA.labels, sessionB.labels),
      icon: Award,
      iconColor: 'text-emerald-500 bg-emerald-50'
    },
    {
      title: 'Labels Directs (Nouveaux)',
      kpiCode: 'VOL-03',
      valA: sessionA.newLabels,
      valB: sessionB.newLabels,
      unit: '',
      delta: computeDelta(sessionA.newLabels, sessionB.newLabels),
      icon: Award,
      iconColor: 'text-teal-500 bg-teal-50'
    },
    {
      title: 'Pré-Labels Accordés',
      kpiCode: 'VOL-04',
      valA: sessionA.preLabels,
      valB: sessionB.preLabels,
      unit: '',
      delta: computeDelta(sessionA.preLabels, sessionB.preLabels),
      icon: Layers,
      iconColor: 'text-amber-500 bg-amber-50'
    },
    {
      title: "Taux d'Acceptation Global",
      kpiCode: 'SEL-01',
      valA: sessionA.tauxPct,
      valB: sessionB.tauxPct,
      unit: '%',
      delta: computeDelta(sessionA.tauxPct, sessionB.tauxPct, true),
      icon: Percent,
      iconColor: 'text-indigo-500 bg-indigo-50'
    },
    {
      title: 'Taux de Rejet Réel',
      kpiCode: 'SEL-08',
      valA: rejA.tauxRejetPct,
      valB: rejB.tauxRejetPct,
      unit: '%',
      delta: computeDelta(rejA.tauxRejetPct, rejB.tauxRejetPct, true),
      icon: Ban,
      iconColor: 'text-rose-500 bg-rose-50'
    },
    {
      title: 'Conversions Actées',
      kpiCode: 'VOL-05',
      valA: sessionA.conversions,
      valB: sessionB.conversions,
      unit: '',
      delta: computeDelta(sessionA.conversions, sessionB.conversions),
      icon: RefreshCw,
      iconColor: 'text-purple-500 bg-purple-50'
    },
    {
      title: 'Retraits Prononcés',
      kpiCode: 'VOL-06',
      valA: sessionA.retraits,
      valB: sessionB.retraits,
      unit: '',
      delta: computeDelta(sessionA.retraits, sessionB.retraits),
      icon: Ban,
      iconColor: 'text-red-500 bg-red-50'
    },
    {
      title: 'Femmes Fondatrices',
      kpiCode: 'DEM-01',
      valA: genderA.femmes,
      valB: genderB.femmes,
      unit: '',
      delta: computeDelta(genderA.femmes, genderB.femmes),
      icon: Users2,
      iconColor: 'text-pink-500 bg-pink-50'
    },
    {
      title: 'Part des Femmes Fondatrices',
      kpiCode: 'DEM-02',
      valA: genderA.pctFemmes,
      valB: genderB.pctFemmes,
      unit: '%',
      delta: computeDelta(genderA.pctFemmes, genderB.pctFemmes, true),
      icon: Percent,
      iconColor: 'text-purple-500 bg-purple-50'
    }
  ];

  // Bar Chart Comparison Data
  const barChartData = [
    { metric: 'Candidats', sessionA: sessionA.candidatures, sessionB: sessionB.candidatures },
    { metric: 'Labels', sessionA: sessionA.labels, sessionB: sessionB.labels },
    { metric: 'Pré-Labels', sessionA: sessionA.preLabels, sessionB: sessionB.preLabels },
    { metric: 'Conversions', sessionA: sessionA.conversions, sessionB: sessionB.conversions },
    { metric: 'Retraits', sessionA: sessionA.retraits, sessionB: sessionB.retraits },
    { metric: 'Femmes', sessionA: genderA.femmes, sessionB: genderB.femmes },
  ];

  // Radar Chart normalized comparative dimensions (0 to 100)
  const maxCand = Math.max(sessionA.candidatures, sessionB.candidatures, 40);
  const radarChartData = [
    {
      subject: 'Volume Candidatures',
      A: Math.round((sessionA.candidatures / maxCand) * 100),
      B: Math.round((sessionB.candidatures / maxCand) * 100),
      fullMark: 100,
    },
    {
      subject: "Taux d'Acceptation",
      A: Math.min(100, Math.round(sessionA.tauxPct * 1.5)),
      B: Math.min(100, Math.round(sessionB.tauxPct * 1.5)),
      fullMark: 100,
    },
    {
      subject: 'Pré-Labels & Amorçage',
      A: Math.round((sessionA.preLabels / Math.max(1, sessionA.candidatures)) * 100),
      B: Math.round((sessionB.preLabels / Math.max(1, sessionB.candidatures)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Mixité Féminine',
      A: Math.min(100, Math.round(genderA.pctFemmes * 2.5)),
      B: Math.min(100, Math.round(genderB.pctFemmes * 2.5)),
      fullMark: 100,
    },
    {
      subject: 'Conversions Pré→Label',
      A: Math.min(100, sessionA.conversions * 15),
      B: Math.min(100, sessionB.conversions * 15),
      fullMark: 100,
    },
  ];

  // Filtered Entries for Session A
  const filteredEntriesA = useMemo(() => {
    return sessionA.entries.filter((e) => {
      const matchSearch = searchEntryA === '' ||
        e.societe.toLowerCase().includes(searchEntryA.toLowerCase()) ||
        e.secteur.toLowerCase().includes(searchEntryA.toLowerCase()) ||
        e.fondateurs.toLowerCase().includes(searchEntryA.toLowerCase());
      const matchFilter = filterDecisionA === 'all' || e.decision === filterDecisionA;
      return matchSearch && matchFilter;
    });
  }, [sessionA, searchEntryA, filterDecisionA]);

  // Filtered Entries for Session B
  const filteredEntriesB = useMemo(() => {
    return sessionB.entries.filter((e) => {
      const matchSearch = searchEntryB === '' ||
        e.societe.toLowerCase().includes(searchEntryB.toLowerCase()) ||
        e.secteur.toLowerCase().includes(searchEntryB.toLowerCase()) ||
        e.fondateurs.toLowerCase().includes(searchEntryB.toLowerCase());
      const matchFilter = filterDecisionB === 'all' || e.decision === filterDecisionB;
      return matchSearch && matchFilter;
    });
  }, [sessionB, searchEntryB, filterDecisionB]);

  // Open KPI Explanation Modal
  const handleOpenKPI = (code: string) => {
    const kpi = KPI_CATALOG.find((k) => k.code === code);
    if (kpi) {
      setActiveKPI(kpi);
      setIsKPIModalOpen(true);
    }
  };

  // Export Comparison to Excel
  const handleExportExcel = () => {
    const dataA = {
      Session: sessionA.session,
      Nom: getSessionLabel(sessionA.session),
      Annee: sessionA.annee,
      Candidatures: sessionA.candidatures,
      Labels: sessionA.labels,
      NewLabels: sessionA.newLabels,
      PreLabels: sessionA.preLabels,
      Conversions: sessionA.conversions,
      Retraits: sessionA.retraits,
      TauxAcceptation: `${sessionA.tauxPct}%`,
      TauxRejet: `${rejA.tauxRejetPct}%`,
      Femmes: genderA.femmes,
      Hommes: genderA.hommes,
      PartFemmes: `${genderA.pctFemmes}%`,
      Statut: sessionA.statut,
      Commentaires: sessionA.commentaires
    };

    const dataB = {
      Session: sessionB.session,
      Nom: getSessionLabel(sessionB.session),
      Annee: sessionB.annee,
      Candidatures: sessionB.candidatures,
      Labels: sessionB.labels,
      NewLabels: sessionB.newLabels,
      PreLabels: sessionB.preLabels,
      Conversions: sessionB.conversions,
      Retraits: sessionB.retraits,
      TauxAcceptation: `${sessionB.tauxPct}%`,
      TauxRejet: `${rejB.tauxRejetPct}%`,
      Femmes: genderB.femmes,
      Hommes: genderB.hommes,
      PartFemmes: `${genderB.pctFemmes}%`,
      Statut: sessionB.statut,
      Commentaires: sessionB.commentaires
    };

    exportToExcel([
      { sheetName: 'Comparaison Sessions', data: [dataA, dataB] }
    ], `comparaison_session_${sessionA.session.replace('/', '_')}_vs_${sessionB.session.replace('/', '_')}`);
  };

  return (
    <div className="space-y-7 pb-16" id="session-comparison-view">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-indigo-900/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                <span>Analyse Comparative Bivariée</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                85 Sessions Disponibles
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mode Comparaison des Sessions
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Sélectionnez deux sessions pour confronter leurs indicateurs de performance, taux d'acceptation et de rejet, parité femmes/hommes et décisions nominatives du Collège.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPDFModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center space-x-2"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Rapport PDF</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Comparison Presets */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Comparaisons Remarquables Pré-configurées :</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSessionAKey(p.keyA);
                  setSessionBKey(p.keyB);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sessionAKey === p.keyA && sessionBKey === p.keyB
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Session Selectors & Swap Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Session A Selector (Left) */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">A</span>
                <span>Session Référence (A)</span>
              </span>
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                {sessionA.annee}
              </span>
            </div>

            <select
              value={sessionAKey}
              onChange={(e) => setSessionAKey(e.target.value)}
              className="w-full bg-white border border-indigo-300 text-slate-900 text-sm rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {SESSIONS_LIST.map((s) => (
                <option key={s.session} value={s.session}>
                  Session {s.id < 10 ? `0${s.id}` : s.id} — {getSessionLabel(s.session)} ({s.candidatures} candidats, {s.labels} labels, {s.tauxPct}%)
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-xs text-indigo-900/80 pt-1 font-semibold">
              <span>Collège de Délibération</span>
              <span>{sessionA.statut === 'corrigé' ? 'Audit Rectifié' : 'PV Conforme'}</span>
            </div>
          </div>

          {/* Swap Button (Center) */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <button
              onClick={handleSwapSessions}
              className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Inverser Session A et Session B"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Session B Selector (Right) */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">B</span>
                <span>Session Cible (B)</span>
              </span>
              <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                {sessionB.annee}
              </span>
            </div>

            <select
              value={sessionBKey}
              onChange={(e) => setSessionBKey(e.target.value)}
              className="w-full bg-white border border-purple-300 text-slate-900 text-sm rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
            >
              {SESSIONS_LIST.map((s) => (
                <option key={s.session} value={s.session}>
                  Session {s.id < 10 ? `0${s.id}` : s.id} — {getSessionLabel(s.session)} ({s.candidatures} candidats, {s.labels} labels, {s.tauxPct}%)
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-xs text-purple-900/80 pt-1 font-semibold">
              <span>Collège de Délibération</span>
              <span>{sessionB.statut === 'corrigé' ? 'Audit Rectifié' : 'PV Conforme'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side KPI Cards with Delta Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              onClick={() => handleOpenKPI(m.kpiCode)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
              title="Cliquer pour afficher la formule, utilité et seuil de ce KPI"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">
                        {m.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Code {m.kpiCode}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                    <HelpCircle className="w-3 h-3" />
                    <span>Détail</span>
                  </span>
                </div>

                {/* Values Comparison Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-700 block uppercase">
                      Session A ({sessionA.session})
                    </span>
                    <span className="text-xl font-black text-indigo-900 mt-0.5 block">
                      {formatNumber(m.valA)}{m.unit}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">
                      Session B ({sessionB.session})
                    </span>
                    <span className="text-xl font-black text-purple-900 mt-0.5 block">
                      {formatNumber(m.valB)}{m.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delta Badge */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">
                  Variation ($\Delta$ B vs A) :
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                  m.delta.isZero 
                    ? 'bg-slate-100 text-slate-700'
                    : m.delta.isPositive 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                }`}>
                  {m.delta.isPositive ? <TrendingUp className="w-3 h-3" /> : m.delta.isZero ? null : <TrendingDown className="w-3 h-3" />}
                  <span>{m.delta.text}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Comparative Visualizations: Grouped Bar Chart & Radar Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grouped Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Volumes & Décisions Comparés</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Comparaison directe des flux de candidatures, attributions et effectifs féminins
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold">
              <span className="flex items-center space-x-1 text-indigo-700">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                <span>Session A ({sessionA.session})</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                <span>Session B ({sessionB.session})</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="sessionA" name={`Session A (${sessionA.session})`} fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sessionB" name={`Session B (${sessionB.session})`} fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Profile Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft">
          <div className="mb-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Profil Radar de Performance</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Score normalisé sur 5 axes stratégiques
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name={`Session A (${sessionA.session})`} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name={`Session B (${sessionB.session})`} dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Detailed Deliberation Diff (Side-by-Side Lists) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Rapprochement des Candidatures & Décisions Nominatives</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Liste comparée des startups, porteurs de projet et verdicts officiels du Collège
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">
              {filteredEntriesA.length} vs {filteredEntriesB.length} dossiers affichés
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column Session A */}
          <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/70">
              <div>
                <span className="text-xs font-black text-indigo-900 block">
                  SESSION A : {sessionA.session} ({getSessionLabel(sessionA.session)})
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {sessionA.entriesCount} Délibérations enregistrées
                </span>
              </div>

              {/* Filter */}
              <select
                value={filterDecisionA}
                onChange={(e) => setFilterDecisionA(e.target.value)}
                className="text-xs font-bold p-1.5 rounded-lg border border-indigo-200 bg-white text-indigo-900 cursor-pointer"
              >
                <option value="all">Toutes ({sessionA.entries.length})</option>
                <option value="label">Labels ({sessionA.labels})</option>
                <option value="prelabel">Pré-Labels ({sessionA.preLabels})</option>
                <option value="refused">Refusées</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-indigo-400" />
              <input
                type="text"
                placeholder="Filtrer Session A (startup, secteur)..."
                value={searchEntryA}
                onChange={(e) => setSearchEntryA(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-indigo-200 bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {filteredEntriesA.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Aucun dossier trouvé pour cette sélection.</p>
              ) : (
                filteredEntriesA.map((e, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        {e.societe}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        e.decision === 'label'
                          ? 'bg-emerald-100 text-emerald-800'
                          : e.decision === 'prelabel'
                            ? 'bg-amber-100 text-amber-800'
                            : e.decision === 'retrait'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                      }`}>
                        {e.resultat || e.decision}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[60%]">{e.fondateurs}</span>
                      <span className="font-semibold text-indigo-600">{e.secteur}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column Session B */}
          <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200/70">
              <div>
                <span className="text-xs font-black text-purple-900 block">
                  SESSION B : {sessionB.session} ({getSessionLabel(sessionB.session)})
                </span>
                <span className="text-[11px] text-purple-600 font-semibold">
                  {sessionB.entriesCount} Délibérations enregistrées
                </span>
              </div>

              {/* Filter */}
              <select
                value={filterDecisionB}
                onChange={(e) => setFilterDecisionB(e.target.value)}
                className="text-xs font-bold p-1.5 rounded-lg border border-purple-200 bg-white text-purple-900 cursor-pointer"
              >
                <option value="all">Toutes ({sessionB.entries.length})</option>
                <option value="label">Labels ({sessionB.labels})</option>
                <option value="prelabel">Pré-Labels ({sessionB.preLabels})</option>
                <option value="refused">Refusées</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-purple-400" />
              <input
                type="text"
                placeholder="Filtrer Session B (startup, secteur)..."
                value={searchEntryB}
                onChange={(e) => setSearchEntryB(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {filteredEntriesB.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Aucun dossier trouvé pour cette sélection.</p>
              ) : (
                filteredEntriesB.map((e, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-purple-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        {e.societe}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        e.decision === 'label'
                          ? 'bg-emerald-100 text-emerald-800'
                          : e.decision === 'prelabel'
                            ? 'bg-amber-100 text-amber-800'
                            : e.decision === 'retrait'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                      }`}>
                        {e.resultat || e.decision}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[60%]">{e.fondateurs}</span>
                      <span className="font-semibold text-purple-600">{e.secteur}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Explanation Modal */}
      {activeKPI && (
        <KPIExplanationModal
          kpi={activeKPI}
          isOpen={isKPIModalOpen}
          onClose={() => setIsKPIModalOpen(false)}
          currentValue={typeof activeKPI.getValue(SESSIONS_LIST, META_DATA, 'all') === 'number'
            ? formatNumber(activeKPI.getValue(SESSIONS_LIST, META_DATA, 'all') as number)
            : activeKPI.getValue(SESSIONS_LIST, META_DATA, 'all')}
          selectedYear="all"
        />
      )}

      {/* PDF Reports Modal */}
      {isPDFModalOpen && (
        <ComprehensivePDFReportsModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          initialReportType="single_session"
          initialSessionCode={sessionB.session}
        />
      )}
    </div>
  );
};
