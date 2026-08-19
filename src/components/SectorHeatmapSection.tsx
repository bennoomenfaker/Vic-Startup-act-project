import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Layers, 
  TrendingUp, 
  ArrowUpDown, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Activity,
  Award,
  Sparkles,
  Building2,
  Users2
} from 'lucide-react';
import { formatNumber } from '../data/dataset';

interface SectorHeatmapData {
  id: string;
  name: string;
  count: number;
  sharePct: number;
  candidatures: number;
  labelsGranted: number;
  preLabels: number;
  conversions: number;
  acceptanceRate: number;
  rejectionRate: number;
  conversionRate: number;
  avgFounders: number;
  category: 'deeptech' | 'health' | 'saas' | 'fintech' | 'agri' | 'commerce' | 'green' | 'edtech' | 'other';
  color: string;
}

const SECTOR_HEATMAP_DATA: SectorHeatmapData[] = [
  {
    id: 'health',
    name: 'HealthTech / MedTech & Biotech',
    count: 221,
    sharePct: 16.2,
    candidatures: 460,
    labelsGranted: 221,
    preLabels: 92,
    conversions: 78,
    acceptanceRate: 75.8,
    rejectionRate: 24.2,
    conversionRate: 84.8,
    avgFounders: 2.05,
    category: 'health',
    color: '#0284c7'
  },
  {
    id: 'commerce',
    name: 'E-Commerce & Marketplaces',
    count: 202,
    sharePct: 14.8,
    candidatures: 520,
    labelsGranted: 202,
    preLabels: 110,
    conversions: 84,
    acceptanceRate: 61.3,
    rejectionRate: 38.7,
    conversionRate: 76.4,
    avgFounders: 1.62,
    category: 'commerce',
    color: '#8b5cf6'
  },
  {
    id: 'saas',
    name: 'Logiciels B2B, Cloud & SaaS',
    count: 184,
    sharePct: 13.5,
    candidatures: 395,
    labelsGranted: 184,
    preLabels: 82,
    conversions: 68,
    acceptanceRate: 73.2,
    rejectionRate: 26.8,
    conversionRate: 82.9,
    avgFounders: 1.88,
    category: 'saas',
    color: '#6366f1'
  },
  {
    id: 'fintech',
    name: 'FinTech & AssurTech',
    count: 153,
    sharePct: 11.2,
    candidatures: 335,
    labelsGranted: 153,
    preLabels: 65,
    conversions: 53,
    acceptanceRate: 70.5,
    rejectionRate: 29.5,
    conversionRate: 81.5,
    avgFounders: 1.94,
    category: 'fintech',
    color: '#10b981'
  },
  {
    id: 'agri',
    name: 'AgriTech & FoodTech',
    count: 134,
    sharePct: 9.8,
    candidatures: 300,
    labelsGranted: 134,
    preLabels: 58,
    conversions: 46,
    acceptanceRate: 69.0,
    rejectionRate: 31.0,
    conversionRate: 79.3,
    avgFounders: 1.82,
    category: 'agri',
    color: '#84cc16'
  },
  {
    id: 'edtech',
    name: 'EdTech & HRTech',
    count: 116,
    sharePct: 8.5,
    candidatures: 270,
    labelsGranted: 116,
    preLabels: 50,
    conversions: 39,
    acceptanceRate: 66.6,
    rejectionRate: 33.4,
    conversionRate: 78.0,
    avgFounders: 1.74,
    category: 'edtech',
    color: '#f59e0b'
  },
  {
    id: 'green',
    name: 'GreenTech, Énergie & CleanTech',
    count: 104,
    sharePct: 7.6,
    candidatures: 215,
    labelsGranted: 104,
    preLabels: 44,
    conversions: 37,
    acceptanceRate: 72.7,
    rejectionRate: 27.3,
    conversionRate: 84.1,
    avgFounders: 1.90,
    category: 'green',
    color: '#14b8a6'
  },
  {
    id: 'deeptech',
    name: 'Intelligence Artificielle & DeepTech',
    count: 93,
    sharePct: 6.8,
    candidatures: 170,
    labelsGranted: 93,
    preLabels: 38,
    conversions: 34,
    acceptanceRate: 78.2,
    rejectionRate: 21.8,
    conversionRate: 89.5,
    avgFounders: 2.12,
    category: 'deeptech',
    color: '#ec4899'
  },
  {
    id: 'other',
    name: 'Logistique, Mobilité & Transport',
    count: 81,
    sharePct: 5.9,
    candidatures: 185,
    labelsGranted: 81,
    preLabels: 34,
    conversions: 26,
    acceptanceRate: 64.9,
    rejectionRate: 35.1,
    conversionRate: 76.5,
    avgFounders: 1.78,
    category: 'other',
    color: '#f97316'
  },
  {
    id: 'other2',
    name: 'IoT, Industrie 4.0 & Robotique',
    count: 78,
    sharePct: 5.7,
    candidatures: 168,
    labelsGranted: 78,
    preLabels: 30,
    conversions: 24,
    acceptanceRate: 69.8,
    rejectionRate: 30.2,
    conversionRate: 80.0,
    avgFounders: 2.02,
    category: 'deeptech',
    color: '#64748b'
  }
];

interface SectorHeatmapSectionProps {
  onOpenKPIByCode: (code: string) => void;
}

export const SectorHeatmapSection: React.FC<SectorHeatmapSectionProps> = ({
  onOpenKPIByCode,
}) => {
  const [activeMetric, setActiveMetric] = useState<'count' | 'acceptance' | 'rejection' | 'conversion'>('count');
  const [sortBy, setSortBy] = useState<'count' | 'acceptance' | 'rejection' | 'conversion'>('count');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedData = useMemo(() => {
    return [...SECTOR_HEATMAP_DATA].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'count') {
        valA = a.count; valB = b.count;
      } else if (sortBy === 'acceptance') {
        valA = a.acceptanceRate; valB = b.acceptanceRate;
      } else if (sortBy === 'rejection') {
        valA = a.rejectionRate; valB = b.rejectionRate;
      } else if (sortBy === 'conversion') {
        valA = a.conversionRate; valB = b.conversionRate;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [sortBy, sortOrder]);

  const handleSort = (field: 'count' | 'acceptance' | 'rejection' | 'conversion') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Intensity color generator for heatmap cells
  const getCellHeatmapBg = (value: number, min: number, max: number, type: 'positive' | 'negative' | 'neutral') => {
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
    if (type === 'positive') {
      // Emerald gradient
      if (ratio > 0.8) return 'bg-emerald-500 text-white font-black';
      if (ratio > 0.6) return 'bg-emerald-400 text-white font-bold';
      if (ratio > 0.4) return 'bg-emerald-100 text-emerald-900 font-semibold';
      return 'bg-emerald-50 text-emerald-800';
    } else if (type === 'negative') {
      // Rose/amber gradient for rejection
      if (ratio > 0.8) return 'bg-rose-500 text-white font-black';
      if (ratio > 0.6) return 'bg-rose-400 text-white font-bold';
      if (ratio > 0.4) return 'bg-rose-100 text-rose-900 font-semibold';
      return 'bg-rose-50 text-rose-800';
    } else {
      // Indigo gradient for volume/conversion
      if (ratio > 0.8) return 'bg-indigo-600 text-white font-black';
      if (ratio > 0.6) return 'bg-indigo-400 text-white font-bold';
      if (ratio > 0.4) return 'bg-indigo-100 text-indigo-900 font-semibold';
      return 'bg-indigo-50 text-indigo-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-6" id="sector-heatmap-section">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-purple-600" />
              <span>Matrice d'Intensité Sectorielle</span>
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              10 Secteurs Clés Analysés
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Heatmap Sectorielle : Acceptation, Rejet & Conversion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Cartographie thermique des performances de sélection par verticale d'activité. Cliquez sur les en-têtes pour ordonner la matrice.
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => { setActiveMetric('count'); handleSort('count'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetric === 'count' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volume Startups
          </button>
          <button
            onClick={() => { setActiveMetric('acceptance'); handleSort('acceptance'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetric === 'acceptance' 
                ? 'bg-white text-emerald-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Taux Acceptation
          </button>
          <button
            onClick={() => { setActiveMetric('rejection'); handleSort('rejection'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetric === 'rejection' 
                ? 'bg-white text-rose-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Taux Rejet (SEL-08)
          </button>
          <button
            onClick={() => { setActiveMetric('conversion'); handleSort('conversion'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetric === 'conversion' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Conversion Pré-Label
          </button>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] bg-slate-50/70">
              <th className="py-3 px-4 rounded-l-xl">Secteur / Verticale</th>
              <th 
                onClick={() => handleSort('count')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Startups</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Part %</th>
              <th className="py-3 px-3 text-right">Candidatures</th>
              <th 
                onClick={() => handleSort('acceptance')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Acceptation</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('rejection')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Rejet Strict</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('conversion')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Conv. Pré-Label</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 rounded-r-xl text-center">Co-Fondateurs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sortedData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Sector Name */}
                <td className="py-3 px-4 font-bold text-slate-900">
                  <div className="flex items-center space-x-2.5">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="truncate max-w-[200px] sm:max-w-none">{row.name}</span>
                  </div>
                </td>

                {/* Startups Count */}
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {formatNumber(row.count)}
                </td>

                {/* Share % */}
                <td className="py-3 px-3 text-right font-mono text-slate-500">
                  {row.sharePct.toFixed(1)}%
                </td>

                {/* Candidatures */}
                <td className="py-3 px-3 text-right font-mono text-slate-600">
                  {formatNumber(row.candidatures)}
                </td>

                {/* Acceptance Rate Heatmap Cell */}
                <td className="py-2 px-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-xl font-mono text-xs ${
                    getCellHeatmapBg(row.acceptanceRate, 60, 80, 'positive')
                  }`}>
                    {row.acceptanceRate.toFixed(1)}%
                  </span>
                </td>

                {/* Rejection Rate Heatmap Cell */}
                <td className="py-2 px-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-xl font-mono text-xs ${
                    getCellHeatmapBg(row.rejectionRate, 20, 40, 'negative')
                  }`}>
                    {row.rejectionRate.toFixed(1)}%
                  </span>
                </td>

                {/* Conversion Rate Heatmap Cell */}
                <td className="py-2 px-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-xl font-mono text-xs ${
                    getCellHeatmapBg(row.conversionRate, 75, 90, 'neutral')
                  }`}>
                    {row.conversionRate.toFixed(1)}%
                  </span>
                </td>

                {/* Avg Founders */}
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                  {row.avgFounders.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytical Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Insight 1: DeepTech Excellence */}
        <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
              DeepTech & IA : Plus Faible Rejet (21.8%)
            </h4>
            <p className="text-[11px] text-emerald-900/80 mt-1 font-medium leading-relaxed">
              Les projets DeepTech affichent le taux de conversion le plus élevé (89.5%) grâce à une forte intensité R&D et des équipes pluridisciplinaires (2.12 fondateurs/startup).
            </p>
          </div>
        </div>

        {/* Insight 2: E-Commerce Selectivity */}
        <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-100 flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider">
              E-Commerce : Sélectivité Accrue (38.7%)
            </h4>
            <p className="text-[11px] text-rose-900/80 mt-1 font-medium leading-relaxed">
              Taux de rejet le plus élevé de l'écosystème en raison du contrôle strict du critère d'innovation technologique propre et de scalabilité internationale.
            </p>
          </div>
        </div>

        {/* Insight 3: Diversification Anti-Monopole */}
        <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              Diversification : 77.8% Hors 1er Secteur
            </h4>
            <p className="text-[11px] text-indigo-900/80 mt-1 font-medium leading-relaxed">
              Le 1er secteur (HealthTech) ne représente que 16.2% du total, garantissant une polyvalence macro-économique équilibrée du vivier tunisien.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
