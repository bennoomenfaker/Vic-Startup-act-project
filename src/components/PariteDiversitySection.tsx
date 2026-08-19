import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Sparkles, 
  Award, 
  HelpCircle, 
  ArrowUpRight, 
  HeartHandshake, 
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatNumber } from '../data/dataset';

// Temporal diversity tracking data over the 85 sessions (by Year & Cohort)
const TEMPORAL_DIVERSITY_DATA = [
  { annee: '2019', femmesPct: 18.4, mixtesPct: 28.1, totalFondateurs: 520, femmes: 96, hommes: 424 },
  { annee: '2020', femmesPct: 20.1, mixtesPct: 30.5, totalFondateurs: 680, femmes: 137, hommes: 543 },
  { annee: '2021', femmesPct: 22.6, mixtesPct: 33.2, totalFondateurs: 840, femmes: 190, hommes: 650 },
  { annee: '2022', femmesPct: 24.8, mixtesPct: 35.8, totalFondateurs: 790, femmes: 196, hommes: 594 },
  { annee: '2023', femmesPct: 26.2, mixtesPct: 37.4, totalFondateurs: 750, femmes: 197, hommes: 553 },
  { annee: '2024', femmesPct: 28.5, mixtesPct: 40.1, totalFondateurs: 690, femmes: 197, hommes: 493 },
  { annee: '2025', femmesPct: 30.8, mixtesPct: 42.0, totalFondateurs: 380, femmes: 117, hommes: 263 },
  { annee: '2026', femmesPct: 31.4, mixtesPct: 42.6, totalFondateurs: 114, femmes: 36, hommes: 78 },
];

const SECTOR_DIVERSITY_DATA = [
  { sector: 'MedTech / Santé', femmesPct: 38.6, count: 221, color: '#0284c7' },
  { sector: 'EdTech & Formation', femmesPct: 36.2, count: 116, color: '#f59e0b' },
  { sector: 'GreenTech & Énergie', femmesPct: 30.5, count: 104, color: '#14b8a6' },
  { sector: 'E-Commerce & Marketplaces', femmesPct: 28.4, count: 202, color: '#8b5cf6' },
  { sector: 'B2B Software & SaaS', femmesPct: 24.1, count: 184, color: '#6366f1' },
  { sector: 'AgriTech & BioTech', femmesPct: 23.5, count: 134, color: '#84cc16' },
  { sector: 'FinTech & AssurTech', femmesPct: 19.8, count: 153, color: '#10b981' },
  { sector: 'IA & DeepTech', femmesPct: 17.5, count: 93, color: '#ec4899' },
];

const GENDER_PIE_DATA = [
  { name: 'Hommes Fondateurs', value: 3611, percent: 75.8, color: '#6366f1' },
  { name: 'Femmes Fondatrices', value: 1153, percent: 24.2, color: '#ec4899' },
];

interface PariteDiversitySectionProps {
  onOpenKPIByCode: (code: string) => void;
  onNavigateToGenderTab?: () => void;
}

export const PariteDiversitySection: React.FC<PariteDiversitySectionProps> = ({
  onOpenKPIByCode,
  onNavigateToGenderTab,
}) => {
  const [viewMode, setViewMode] = useState<'evolution' | 'volume'>('evolution');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-6" id="parite-diversity-section">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-50 text-pink-700 border border-pink-100 uppercase tracking-wider flex items-center space-x-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />
              <span>Démographie & Mixité</span>
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              4 764 Fondateurs Audités
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Indice de Parité Entrepreneuriale & Suivi Temporel de la Mixité (DEMO-06)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Analyse de la féminisation et de la mixité des équipes fondatrices sur l'intégralité des 85 sessions officielles (2019 — 2026).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onNavigateToGenderTab && (
            <button
              onClick={onNavigateToGenderTab}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-white" />
              <span>Analyse 85 Sessions Femmes vs Hommes →</span>
            </button>
          )}

          <button
            onClick={() => onOpenKPIByCode('DEMO-06')}
            className="px-3.5 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            title="Détail du KPI Parité (DEMO-06)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-600" />
            <span>Fiche (DEMO-06)</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: % Femmes */}
        <div 
          onClick={() => onOpenKPIByCode('DEMO-06')}
          className="bg-gradient-to-br from-pink-50/60 to-rose-50/40 rounded-2xl p-4.5 border border-pink-100 shadow-2xs hover:shadow-soft transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-800 uppercase tracking-wider">Femmes Fondatrices</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-200/60 text-pink-900">
              1 153 Femmes
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            24.2%
          </div>
          <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>18.4% (2019) ➔ 31.4% (2026)</span>
          </div>
        </div>

        {/* Card 2: Ratio H/F */}
        <div 
          onClick={() => onOpenKPIByCode('DEMO-06')}
          className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs hover:shadow-soft transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ratio Hommes / Femmes</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              3 611 H / 1 153 F
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-950 tracking-tight mt-2">
            3.13 <span className="text-xs font-medium text-slate-400">H pour 1 F</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            S'améliore vers 2.18 en 2026.
          </p>
        </div>

        {/* Card 3: Startups Mixtes */}
        <div 
          onClick={() => onOpenKPIByCode('DEMO-06')}
          className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs hover:shadow-soft transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Startups Mixtes</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              915 Startups
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-950 tracking-tight mt-2">
            34.8%
          </div>
          <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+14.5 pts depuis 2019</span>
          </div>
        </div>

        {/* Card 4: Top Secteur Paritaire */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Secteur Leader Mixité</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Top Parité
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight mt-2 truncate">
            MedTech (38.6%)
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Suivi par EdTech (36.2%) et GreenTech.
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Temporal Tracking Area Chart */}
        <div className="lg:col-span-2 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Évolution de la Part Féminine & des Équipes Mixtes (2019 — 2026)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Progression continue du taux de co-fondatrices sur les 85 sessions consécutives.
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-white p-1 text-xs font-bold border border-slate-200 shadow-2xs shrink-0">
              <button
                onClick={() => setViewMode('evolution')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'evolution' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pourcentages (%)
              </button>
              <button
                onClick={() => setViewMode('volume')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'volume' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Volumes (H vs F)
              </button>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'evolution' ? (
                <AreaChart
                  data={TEMPORAL_DIVERSITY_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="annee" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 50]} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any, name: any) => [`${value}%`, name === 'femmesPct' ? '% Femmes Fondatrices' : '% Startups Mixtes']}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(val) => val === 'femmesPct' ? 'Part de Femmes Fondatrices (%)' : 'Startups avec Équipe Mixte (%)'}
                  />
                  <Area
                    type="monotone"
                    dataKey="femmesPct"
                    stroke="#ec4899"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#pinkGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="mixtesPct"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#indigoGrad)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={TEMPORAL_DIVERSITY_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="annee" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="hommes" name="Hommes Fondateurs" fill="#6366f1" stackId="a" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="femmes" name="Femmes Fondatrices" fill="#ec4899" stackId="a" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Sector Parity Ranking */}
        <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Parité par Verticale</h3>
              <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                % Féminin
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {SECTOR_DIVERSITY_DATA.map((item) => (
                <div key={item.sector} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{item.sector}</span>
                    <span className="font-mono font-bold text-pink-700">{item.femmesPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                      style={{ width: `${(item.femmesPct / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
            La MedTech et l'EdTech dépassent 35% de mixité féminine.
          </div>
        </div>
      </div>
    </div>
  );
};
