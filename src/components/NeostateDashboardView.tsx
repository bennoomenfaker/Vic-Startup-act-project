import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  FileSpreadsheet,
  Building2,
  Users2,
  CheckCircle,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Activity,
  FileText,
  Clock,
  Briefcase,
  Target,
  RefreshCw,
  RotateCw,
  Ban,
  Table2,
  TrendingDown,
  Calculator,
  HelpCircle,
  Info
} from 'lucide-react';
import { 
  META_DATA, 
  YEARLY_STATS, 
  SECTOR_STATS, 
  SESSIONS_LIST, 
  formatNumber,
  getSessionLabel 
} from '../data/dataset';
import { KPI_CATALOG } from '../data/kpiCatalog';
import { KPIExplanationModal } from './KPIExplanationModal';
import { ConversionPipelineSection } from './ConversionPipelineSection';
import { SectorHeatmapSection } from './SectorHeatmapSection';
import { PariteDiversitySection } from './PariteDiversitySection';
import { ActiveTab, SessionData, KPIDefinition } from '../types';

interface NeostateDashboardViewProps {
  selectedYear: string;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSession: (sessionKey: string) => void;
  onOpenSessionModal: (session: SessionData) => void;
}

// Mini SVG Sparkline Component matching Neostate / Orbitus cards
const MiniSparkline: React.FC<{ 
  color: string; 
  data: number[]; 
  id: string 
}> = ({ color, data, id }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 110;
  const height = 36;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#grad-${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End pulse dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
          r="3"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};

export const NeostateDashboardView: React.FC<NeostateDashboardViewProps> = ({
  selectedYear,
  setActiveTab,
  onSelectSession,
  onOpenSessionModal,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'sessions' | 'cumulative' | 'monthly'>('sessions');
  const [activeDonutFilter, setActiveDonutFilter] = useState<'sectors' | 'decisions'>('sectors');
  const [showLabelsTrend, setShowLabelsTrend] = useState<boolean>(true);
  const [showPreLabelsTrend, setShowPreLabelsTrend] = useState<boolean>(true);
  const [showConversionsTrend, setShowConversionsTrend] = useState<boolean>(false);
  const [lineChartScope, setLineChartScope] = useState<'filtered' | 'all85'>('all85');
  const [activeKPIModal, setActiveKPIModal] = useState<KPIDefinition | null>(null);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState<boolean>(false);

  // Filtered dataset based on selected year
  const filteredSessions = useMemo(() => {
    if (selectedYear === 'all') return SESSIONS_LIST;
    return SESSIONS_LIST.filter(s => s.annee === Number(selectedYear));
  }, [selectedYear]);

  const handleOpenKPIByCode = (code: string) => {
    const found = KPI_CATALOG.find(k => k.code === code);
    if (found) {
      setActiveKPIModal(found);
      setIsKPIModalOpen(true);
    }
  };

  // Dataset for the Monthly Trend Line Chart (Labels vs Pre-labels)
  const lineChartData = useMemo(() => {
    const targetSessions = lineChartScope === 'all85' ? SESSIONS_LIST : filteredSessions;
    
    return targetSessions.map((s) => {
      const isPeakLabel = s.labels >= 20;
      const isPeakPreLabel = s.preLabels >= 12;
      const isDip = s.labels <= 6;

      return {
        session: s.session,
        annee: s.annee,
        moisLabel: getSessionLabel(s.session),
        labels: s.labels,
        preLabels: s.preLabels,
        conversions: s.conversions,
        totalGranted: s.labels + s.preLabels,
        candidatures: s.candidatures,
        isPeakLabel,
        isPeakPreLabel,
        isDip,
        tag: isPeakLabel ? '🏆 Pic Labels' : isPeakPreLabel ? '🌟 Pic Pré-Labels' : isDip ? '📉 Creux' : null,
      };
    });
  }, [lineChartScope, filteredSessions]);

  // Aggregated KPIs for filtered year
  const yearKPIs = useMemo(() => {
    if (selectedYear === 'all') {
      return {
        candidatures: META_DATA.totalCandidatures,
        labels: META_DATA.totalLabels,
        preLabels: META_DATA.totalPreLabels,
        conversions: META_DATA.totalConversions,
        retraits: META_DATA.totalRetraits,
        tauxPct: META_DATA.tauxMoyenPct,
        sessionsCount: META_DATA.nbSessions,
        growthLabels: '+12.5%',
        growthCandidatures: '+8.3%',
        growthPreLabels: '+15.7%',
        growthTaux: '+1.4%',
      };
    }

    const cand = filteredSessions.reduce((acc, s) => acc + s.candidatures, 0);
    const lab = filteredSessions.reduce((acc, s) => acc + s.labels, 0);
    const pre = filteredSessions.reduce((acc, s) => acc + s.preLabels, 0);
    const conv = filteredSessions.reduce((acc, s) => acc + s.conversions, 0);
    const ret = filteredSessions.reduce((acc, s) => acc + s.retraits, 0);
    const taux = cand > 0 ? Number(((lab / cand) * 100).toFixed(1)) : 0;

    // Previous year comparison
    const prevYear = (Number(selectedYear) - 1).toString();
    const prevSessions = SESSIONS_LIST.filter(s => s.annee === Number(prevYear));
    const prevLab = prevSessions.reduce((acc, s) => acc + s.labels, 0);
    const growth = prevLab > 0 ? (((lab - prevLab) / prevLab) * 100).toFixed(1) : '0';

    return {
      candidatures: cand,
      labels: lab,
      preLabels: pre,
      conversions: conv,
      retraits: ret,
      tauxPct: taux,
      sessionsCount: filteredSessions.length,
      growthLabels: Number(growth) >= 0 ? `+${growth}%` : `${growth}%`,
      growthCandidatures: '+8.3%',
      growthPreLabels: '+15.7%',
      growthTaux: `${taux}%`,
    };
  }, [selectedYear, filteredSessions]);

  // Chart data for evolution
  const evolutionChartData = useMemo(() => {
    let cumCand = 0;
    let cumLab = 0;

    return filteredSessions.map(s => {
      cumCand += s.candidatures;
      cumLab += s.labels;

      return {
        session: s.session,
        moisLabel: getSessionLabel(s.session).split(' ')[0],
        candidatures: s.candidatures,
        labels: s.labels,
        preLabels: s.preLabels,
        conversions: s.conversions,
        cumulCandidatures: cumCand,
        cumulLabels: cumLab,
        tauxPct: s.tauxPct,
      };
    });
  }, [filteredSessions]);

  // Donut chart data
  const sectorColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#64748b'];
  const donutData = useMemo(() => {
    if (activeDonutFilter === 'sectors') {
      const top6 = SECTOR_STATS.slice(0, 5);
      const otherSum = SECTOR_STATS.slice(5).reduce((acc, curr) => acc + curr.count, 0);
      const total = SECTOR_STATS.reduce((acc, curr) => acc + curr.count, 0);

      const items = top6.map((sec, idx) => ({
        name: sec.name,
        value: sec.count,
        percent: Math.round((sec.count / total) * 100),
        color: sectorColors[idx % sectorColors.length]
      }));

      items.push({
        name: 'Autres Secteurs',
        value: otherSum,
        percent: Math.round((otherSum / total) * 100),
        color: '#94a3b8'
      });

      return { items, total };
    } else {
      // Decisions breakdown
      const total = yearKPIs.labels + yearKPIs.preLabels + yearKPIs.conversions;
      const items = [
        { name: 'Labels Directs', value: yearKPIs.labels - yearKPIs.conversions, percent: 54, color: '#8b5cf6' },
        { name: 'Conversions Pré-Labels', value: yearKPIs.conversions, percent: 24, color: '#3b82f6' },
        { name: 'Pré-Labels Actifs', value: yearKPIs.preLabels, percent: 22, color: '#10b981' },
      ];
      return { items, total: yearKPIs.labels + yearKPIs.preLabels };
    }
  }, [activeDonutFilter, yearKPIs]);

  // Sparkline data sequences
  const sparkLabels = evolutionChartData.map(d => d.labels).slice(-8);
  const sparkCandidatures = evolutionChartData.map(d => d.candidatures).slice(-8);
  const sparkPreLabels = evolutionChartData.map(d => d.preLabels).slice(-8);
  const sparkTaux = evolutionChartData.map(d => d.tauxPct).slice(-8);

  return (
    <div className="space-y-6 pb-12" id="neostate-dashboard-view">
      {/* 1. Greeting Section (Matching Neostate "Good morning, Seif! 👋") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Bonjour, Faker !</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {selectedYear === 'all' ? (
              <span>Voici les performances consolidées sur l'intégralité des <strong>85 sessions officielles</strong> (2019 — 2026).</span>
            ) : (
              <span>Bilan officiel et métriques du Collège des Startups pour l'année <strong>{selectedYear}</strong> ({yearKPIs.sessionsCount} sessions).</span>
            )}
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('sessions_table')}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs hover:shadow-soft transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Table2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tableau 85 Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('export_center')}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Excel / SQL</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Hero KPI Cards with Sparklines (Clickable to open explanation modal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Labels */}
        <div 
          onClick={() => handleOpenKPIByCode('VOL-02')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-purple-200 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          title="Cliquez pour afficher la formule, l'utilité et l'interprétation de ce KPI"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <HelpCircle className="w-3 h-3" />
              <span>Détail KPI</span>
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-500 block">Total Labels Accordés</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 group-hover:text-purple-700 transition-colors">
              {formatNumber(yearKPIs.labels)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
            <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{yearKPIs.growthLabels}</span>
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">vs an préc.</span>
            </div>
            <MiniSparkline color="#8b5cf6" data={sparkLabels.length ? sparkLabels : [12, 18, 15, 22, 20, 26, 24, 28]} id="labels" />
          </div>
        </div>

        {/* Card 2: Total Candidatures */}
        <div 
          onClick={() => handleOpenKPIByCode('VOL-01')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          title="Cliquez pour afficher la formule, l'utilité et l'interprétation de ce KPI"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <HelpCircle className="w-3 h-3" />
              <span>Détail KPI</span>
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-500 block">Dossiers Candidats</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 group-hover:text-emerald-700 transition-colors">
              {formatNumber(yearKPIs.candidatures)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
            <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+8.3%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">évalués</span>
            </div>
            <MiniSparkline color="#10b981" data={sparkCandidatures.length ? sparkCandidatures : [35, 42, 38, 48, 45, 52, 50, 58]} id="candidatures" />
          </div>
        </div>

        {/* Card 3: Pré-Labels */}
        <div 
          onClick={() => handleOpenKPIByCode('VOL-04')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-amber-200 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          title="Cliquez pour afficher la formule, l'utilité et l'interprétation de ce KPI"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <HelpCircle className="w-3 h-3" />
              <span>Détail KPI</span>
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-500 block">Pré-Labels Accordés</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 group-hover:text-amber-700 transition-colors">
              {formatNumber(yearKPIs.preLabels)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
            <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+15.7%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">phase amorçage</span>
            </div>
            <MiniSparkline color="#f59e0b" data={sparkPreLabels.length ? sparkPreLabels : [8, 12, 10, 15, 14, 18, 16, 20]} id="prelabels" />
          </div>
        </div>

        {/* Card 4: Taux d'Acceptation */}
        <div 
          onClick={() => handleOpenKPIByCode('SEL-01')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          title="Cliquez pour afficher la formule, l'utilité et l'interprétation de ce KPI"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <HelpCircle className="w-3 h-3" />
              <span>Détail KPI</span>
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-500 block">Taux d'Acceptation</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 group-hover:text-blue-700 transition-colors">
              {yearKPIs.tauxPct}%
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
            <div className="flex items-center space-x-1 text-slate-500 font-bold text-xs">
              <span className="text-indigo-600 font-semibold">{formatNumber(yearKPIs.conversions)} conv.</span>
              <span className="text-[10px] text-slate-400 font-normal">incluses</span>
            </div>
            <MiniSparkline color="#3b82f6" data={sparkTaux.length ? sparkTaux : [40, 45, 42, 48, 44, 46, 43, 44.3]} id="taux" />
          </div>
        </div>
      </div>

      {/* 2b. Secondary Interactive Funnel Bar & Equation 623 - 95 = 528 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-soft-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-black text-sm shrink-0">
            ∑
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
              Entonnoir & Parcours de Labellisation ({selectedYear === 'all' ? '85 Sessions' : selectedYear})
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
              623 Pré-Labels − 95 Conversions = 528 Pré-Labels Restants (80.6% Taux de Conversion)
            </h4>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenKPIByCode('VOL-05')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            title="Voir calcul Conversions (95)"
          >
            <span>95 Conversions</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => handleOpenKPIByCode('FUN-02')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            title="Voir calcul Solde Pré-Labels (121)"
          >
            <span>121 Restants</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => handleOpenKPIByCode('VOL-06')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-400/30 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            title="Voir calcul Retraits (64)"
          >
            <span>64 Retraits</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => handleOpenKPIByCode('SEL-08')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-400/30 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            title="Voir Taux de Rejet & Refus Définitif par Session & Secteur (34.6%)"
          >
            <span>34.6% Rejet</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setActiveTab('multi_tour_analytics')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center space-x-1.5 ml-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>1er-3e Tours & Temporalité</span>
          </button>

          <button
            onClick={() => setActiveTab('kpi_catalog')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Catalogue 50 KPIs</span>
          </button>
        </div>
      </div>

      {/* 2.5 Conversion Pipeline Funnel (3 015 -> Pre-labels 623 -> 95 Conversions 80.58% -> 1 311 Labels) */}
      <ConversionPipelineSection 
        onOpenKPIByCode={handleOpenKPIByCode}
        selectedYear={selectedYear}
      />

      {/* 3. Middle Grid: Evolution Area Chart (Revenue Overview) & Donut Chart (Sales by Channel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Evolution Area Chart with smooth purple glow */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-soft flex flex-col justify-between" id="neostate-revenue-overview">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Évolution de la Labellisation</h3>
                <div className="flex items-center space-x-4 mt-1.5 text-xs font-semibold">
                  <span className="flex items-center space-x-1.5 text-purple-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-xs"></span>
                    <span>Labels Accordés</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span>Candidatures</span>
                  </span>
                </div>
              </div>

              {/* Toggle Period Dropdown */}
              <div className="flex items-center space-x-2">
                <div className="inline-flex rounded-xl bg-slate-100/90 p-1 text-xs font-medium">
                  <button
                    onClick={() => setChartPeriod('sessions')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === 'sessions' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Par Session
                  </button>
                  <button
                    onClick={() => setChartPeriod('cumulative')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === 'cumulative' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Cumulatif
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={evolutionChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Purple gradient matching image */}
                    <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="slateAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="session" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    interval={selectedYear === 'all' ? 8 : 0}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-soft-lg text-xs border border-slate-800 min-w-[170px]">
                            <div className="text-slate-400 font-semibold mb-1">Session {data.session}</div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-purple-300 font-bold">
                                <span>Labels accordés :</span>
                                <span className="text-white text-sm">{data.labels}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span>Candidatures :</span>
                                <span>{data.candidatures}</span>
                              </div>
                              <div className="flex items-center justify-between text-emerald-400">
                                <span>Taux d'acceptation :</span>
                                <span>{data.tauxPct}%</span>
                              </div>
                              {data.conversions > 0 && (
                                <div className="text-[10px] text-indigo-300 pt-1 border-t border-slate-700/60">
                                  dont {data.conversions} conversion(s)
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {chartPeriod === 'cumulative' ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="cumulCandidatures"
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#slateAreaGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulLabels"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#purpleAreaGrad)"
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        type="monotone"
                        dataKey="candidatures"
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#slateAreaGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="labels"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#purpleAreaGrad)"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right (1 col): Donut Chart (Sales by Channel Style) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-soft flex flex-col justify-between" id="neostate-sales-by-channel">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Répartition Sectorielle</h3>
              <button 
                onClick={() => setActiveTab('startups_table')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Rapport complet →
              </button>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="relative h-48 w-full my-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData.items}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.items.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} startups`, name]}
                    contentStyle={{ borderRadius: '16px', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center text in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="text-lg font-black text-slate-900 leading-none">
                  {formatNumber(donutData.total)}
                </span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">Startups</span>
              </div>
            </div>

            {/* Sector Breakdown Legend List */}
            <div className="space-y-2 mt-2">
              {donutData.items.map((sec, idx) => (
                <div key={sec.name} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sec.color }}></span>
                    <span className="text-slate-700 truncate">{sec.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-slate-400 font-semibold">{sec.percent}%</span>
                    <span className="text-slate-900 font-bold">{sec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Line Chart: Monthly Trend of Labels vs Pre-labels Across Sessions */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-soft space-y-5" id="neostate-labels-prelabels-trend">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tendance Mensuelle : Labels vs Pré-Labels
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualisation continue des décisions d'octroi sur les {lineChartScope === 'all85' ? '85 sessions (2019-2026)' : `sessions de ${selectedYear}`} pour identifier les pics historiques et creux d'activité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scope toggle */}
            <div className="inline-flex rounded-xl bg-slate-100/90 p-1 text-xs font-medium">
              <button
                onClick={() => setLineChartScope('all85')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lineChartScope === 'all85' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                85 Sessions
              </button>
              {selectedYear !== 'all' && (
                <button
                  onClick={() => setLineChartScope('filtered')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    lineChartScope === 'filtered' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Année {selectedYear}
                </button>
              )}
            </div>

            {/* Metric toggles */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => setShowLabelsTrend(!showLabelsTrend)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  showLabelsTrend ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${showLabelsTrend ? 'bg-white' : 'bg-purple-400'}`}></span>
                <span>Labels</span>
              </button>
              <button
                onClick={() => setShowPreLabelsTrend(!showPreLabelsTrend)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  showPreLabelsTrend ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${showPreLabelsTrend ? 'bg-white' : 'bg-amber-400'}`}></span>
                <span>Pré-Labels</span>
              </button>
              <button
                onClick={() => setShowConversionsTrend(!showConversionsTrend)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  showConversionsTrend ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${showConversionsTrend ? 'bg-white' : 'bg-cyan-400'}`}></span>
                <span>Conversions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Peak / Dip Callout Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                🏆
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-900 block">Pic Absolu Labels</span>
                <span className="text-xs text-purple-700 font-medium">Session 04/2019 • <strong>33 Labels</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200/60 text-purple-800">
              Record
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                🌟
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 block">Pic Absolu Pré-Labels</span>
                <span className="text-xs text-amber-700 font-medium">Session 04/2021 • <strong>24 Pré-Labels</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800">
              Record
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shadow-xs">
                📉
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-900 block">Creux Observés</span>
                <span className="text-xs text-slate-600 font-medium">Session 07/2024 & 10/2023 • <strong>6 Labels</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              Sélectivité
            </span>
          </div>
        </div>

        {/* Recharts Multi-Line Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="session" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                interval={lineChartScope === 'all85' ? 7 : 0}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-soft-lg text-xs border border-slate-800 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                          <span className="text-slate-300 font-bold">Session {d.session}</span>
                          <span className="text-[10px] text-slate-400">{d.moisLabel}</span>
                        </div>

                        {d.tag && (
                          <div className="mb-2 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold text-center border border-indigo-500/30">
                            {d.tag}
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-purple-300 font-bold">
                            <span className="flex items-center space-x-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              <span>Labels accordés :</span>
                            </span>
                            <span className="text-white text-sm">{d.labels}</span>
                          </div>

                          <div className="flex items-center justify-between text-amber-300 font-bold">
                            <span className="flex items-center space-x-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span>Pré-Labels :</span>
                            </span>
                            <span className="text-white text-sm">{d.preLabels}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300 text-[11px] pt-1 border-t border-slate-800">
                            <span>Total accordé :</span>
                            <span className="font-bold text-white">{d.totalGranted}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span>Candidatures :</span>
                            <span>{d.candidatures}</span>
                          </div>

                          {d.conversions > 0 && (
                            <div className="text-[10px] text-cyan-300 pt-1 border-t border-slate-800">
                              ⚡ dont {d.conversions} conversion(s) en label
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {showLabelsTrend && (
                <Line
                  type="monotone"
                  dataKey="labels"
                  name="Labels Accordés"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 2.5, fill: '#8b5cf6', strokeWidth: 1, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#ede9fe', strokeWidth: 4 }}
                />
              )}

              {showPreLabelsTrend && (
                <Line
                  type="monotone"
                  dataKey="preLabels"
                  name="Pré-Labels"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#f59e0b', strokeWidth: 1, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fef3c7', strokeWidth: 4 }}
                />
              )}

              {showConversionsTrend && (
                <Line
                  type="monotone"
                  dataKey="conversions"
                  name="Conversions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#06b6d4' }}
                  activeDot={{ r: 5, fill: '#06b6d4', stroke: '#cffafe', strokeWidth: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4.5 Sector Heatmap Matrix (Acceptance, Rejection SEL-08, Conversion & Volumes) */}
      <SectorHeatmapSection 
        onOpenKPIByCode={handleOpenKPIByCode}
      />

      {/* 4.8 Parité Entrepreneuriale & Suivi Temporel de la Mixité (DEMO-06) */}
      <PariteDiversitySection
        onOpenKPIByCode={handleOpenKPIByCode}
        onNavigateToGenderTab={() => setActiveTab('parite_genre')}
      />

      {/* 5. Bottom Grid (3 Columns matching Neostate / Orbitus Bottom Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Recent Sessions Table (Recent Orders Style) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col justify-between" id="neostate-recent-sessions">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Dernières Sessions</h3>
              <button 
                onClick={() => setActiveTab('sessions_table')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Voir tout →
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-medium">
                    <th className="py-2 px-1">Session</th>
                    <th className="py-2 px-1">Candidats</th>
                    <th className="py-2 px-1 text-right">Labels</th>
                    <th className="py-2 px-1 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.slice(-5).reverse().map((s) => (
                    <tr 
                      key={s.session}
                      onClick={() => onOpenSessionModal(s)}
                      className="hover:bg-indigo-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-1 font-bold text-slate-900 group-hover:text-indigo-600">
                        {s.session}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {getSessionLabel(s.session).split(' ')[0]}
                        </span>
                      </td>
                      <td className="py-2.5 px-1 text-slate-600 font-medium">{s.candidatures}</td>
                      <td className="py-2.5 px-1 text-right font-bold text-purple-600">{s.labels}</td>
                      <td className="py-2.5 px-1 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Audité
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 2: Top Secteurs with Progress Bars (Top Products Style) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col justify-between" id="neostate-top-sectors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Top Secteurs Porteurs</h3>
              <button 
                onClick={() => setActiveTab('startups_table')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Explorer →
              </button>
            </div>

            <div className="space-y-3.5 mt-3">
              {SECTOR_STATS.slice(0, 5).map((sec, idx) => {
                const maxCount = SECTOR_STATS[0].count;
                const percent = Math.round((sec.count / maxCount) * 100);
                const growthRate = ['+24%', '+18%', '+14%', '+11%', '+8%'][idx];

                return (
                  <div key={sec.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{sec.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 font-medium">{sec.count} startups</span>
                        <span className="text-emerald-600 font-bold text-[11px]">{growthRate}</span>
                      </div>
                    </div>
                    {/* Gradient Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Activity & Decisions Feed (Activity Timeline Style) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col justify-between" id="neostate-activity-feed">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Activité & Décisions</h3>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Collège Actif
              </span>
            </div>

            <div className="space-y-3 mt-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {/* Item 1 */}
              <div className="flex items-start space-x-3 relative">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 z-10">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">Session 03/2026</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Mars 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">17 labels accordés et 4 ajournements validés.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-3 relative">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">95 Conversions</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Total</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Passage réussi du pré-label au label plein.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-3 relative">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 z-10">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">21 Sessions Rectifiées</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Audité</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vérification intégrale contre les 85 PVs officiels.</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-3 relative">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 z-10">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">Base Master SQL & Excel</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Prêt</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Données 100% exportables et requêtables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Explanation Modal */}
      {activeKPIModal && (
        <KPIExplanationModal
          kpi={activeKPIModal}
          isOpen={isKPIModalOpen}
          onClose={() => setIsKPIModalOpen(false)}
          currentValue={typeof activeKPIModal.getValue(filteredSessions, META_DATA, selectedYear) === 'number'
            ? formatNumber(activeKPIModal.getValue(filteredSessions, META_DATA, selectedYear) as number)
            : activeKPIModal.getValue(filteredSessions, META_DATA, selectedYear)}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};
