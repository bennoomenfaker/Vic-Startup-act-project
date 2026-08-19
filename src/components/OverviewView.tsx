import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { KPICards } from './KPICards';
import { 
  META_DATA, 
  YEARLY_STATS, 
  SECTOR_STATS, 
  SESSIONS_LIST, 
  formatNumber,
  getSessionLabel 
} from '../data/dataset';
import { ActiveTab } from '../types';

interface OverviewViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSession: (sessionKey: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab, onSelectSession }) => {
  const [chartType, setChartType] = useState<'yearly' | 'monthly' | 'cumulative'>('yearly');

  // Prepare monthly trend data
  const monthlyData = SESSIONS_LIST.map((s, idx) => {
    return {
      session: s.session,
      candidatures: s.candidatures,
      labels: s.labels,
      preLabels: s.preLabels,
      conversions: s.conversions,
      retraits: s.retraits,
      taux: s.tauxPct
    };
  });

  // Prepare cumulative progression data
  let cumCandidatures = 0;
  let cumLabels = 0;
  let cumPreLabels = 0;
  let cumConversions = 0;
  const cumulativeData = SESSIONS_LIST.map((s) => {
    cumCandidatures += s.candidatures;
    cumLabels += s.labels;
    cumPreLabels += s.preLabels;
    cumConversions += s.conversions;
    return {
      session: s.session,
      candidatures: cumCandidatures,
      labels: cumLabels,
      preLabels: cumPreLabels,
      conversions: cumConversions
    };
  });

  const SECTOR_COLORS = [
    '#059669', '#0284c7', '#6366f1', '#8b5cf6', '#d97706',
    '#ec4899', '#14b8a6', '#f43f5e', '#64748b', '#84cc16'
  ];

  const topSectors = SECTOR_STATS.slice(0, 8);

  const yearlyChartData = YEARLY_STATS.map(y => ({
    year: String(y.year),
    candidatures: y.candidatures,
    labels: y.labels,
    preLabels: y.preLabels,
    taux: typeof y.tauxAcceptation === 'string' ? parseFloat(y.tauxAcceptation) : y.tauxAcceptation
  }));

  return (
    <div className="space-y-6 pb-12" id="overview-container">
      {/* Top Banner / Welcome context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Observatoire Startup Act Tunisie
            </span>
            <span className="text-xs text-slate-300">Collège des Startups</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2 text-white">
            Bilan des 85 Sessions Officielles (Mars 2019 — Mars 2026)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Consolidation et audit rigoureux des 85 procès-verbaux du Collège des Startups : <strong className="text-white">1 311 labels accordés</strong> (dont 502 conversions de pré-labels), <strong className="text-white">623 pré-labels</strong>, et <strong className="text-white">2 958 candidatures</strong> traitées.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="overview-btn-export"
            onClick={() => setActiveTab('export_center')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Centre d'Exportation (Excel / SQL)</span>
          </button>
          <button
            id="overview-btn-sessions"
            onClick={() => setActiveTab('sessions_table')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tableau 85 Sessions</span>
          </button>
          <button
            id="overview-btn-audit"
            onClick={() => setActiveTab('audit_verification')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Audit & Vérification</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KPICards onSelectMetric={(m) => {
        if (m === 'startups') setActiveTab('startups_table');
        else if (m === 'founders') setActiveTab('founders_table');
        else setActiveTab('sessions_table');
      }} />

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Evolution Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between" id="evolution-chart-card">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Évolution de la Labellisation</h3>
                <p className="text-xs text-slate-500">Candidatures, labels accordés et pré-labels</p>
              </div>

              {/* Toggle chart period */}
              <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
                <button
                  id="btn-chart-yearly"
                  onClick={() => setChartType('yearly')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    chartType === 'yearly' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Par Année (2019-2026)
                </button>
                <button
                  id="btn-chart-monthly"
                  onClick={() => setChartType('monthly')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    chartType === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  85 Sessions Mensuelles
                </button>
                <button
                  id="btn-chart-cumulative"
                  onClick={() => setChartType('cumulative')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    chartType === 'cumulative' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cumulatif
                </button>
              </div>
            </div>

            <div className="h-72 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'yearly' ? (
                  <BarChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="candidatures" name="Candidatures" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="labels" name="Labels accordés" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="preLabels" name="Pré-Labels" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chartType === 'monthly' ? (
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="session" stroke="#64748b" fontSize={10} interval={6} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="candidatures" name="Candidatures" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="labels" name="Labels" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="preLabels" name="Pré-Labels" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                  </AreaChart>
                ) : (
                  <LineChart data={cumulativeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="session" stroke="#64748b" fontSize={10} interval={8} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="candidatures" name="Total Candidatures (Cumul)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="labels" name="Total Labels (Cumul)" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="conversions" name="Conversions Pré-Label (Cumul)" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>85 sessions traitées de Mars 2019 à Mars 2026</span>
            </span>
            <span className="font-medium text-slate-700">Moyenne: 34.8 candidatures / session</span>
          </div>
        </div>

        {/* Right Col: Conversion Dynamics & Key Mechanics */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between" id="conversion-funnel-card">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Entonnoir & Conversion</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                80.6% Succès
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Dynamique des passages du pré-label au label définitif et retraits.
            </p>

            <div className="space-y-3.5 mt-4">
              {/* Funnel step 1: Candidatures */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 font-semibold">1. Candidatures Déposées</span>
                  <span className="text-slate-900 font-bold">2 958 (100%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Funnel step 2: Labels directs */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-700 font-semibold">2. Labels Accordés Directement</span>
                  <span className="text-slate-900 font-bold">809 (27.3%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(809 / 2958) * 100}%` }}></div>
                </div>
              </div>

              {/* Funnel step 3: Pré-Labels */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-indigo-700 font-semibold">3. Pré-Labels Accordés</span>
                  <span className="text-slate-900 font-bold">623 (21.1%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(623 / 2958) * 100}%` }}></div>
                </div>
              </div>

              {/* Funnel step 4: Pré-labels convertis */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-purple-700 font-semibold">4. Pré-Labels Convertis en Labels</span>
                  <span className="text-slate-900 font-bold">502 (80.6% de conv.)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(502 / 623) * 100}%` }}></div>
                </div>
              </div>

              {/* Funnel step 5: Retraits */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-rose-700 font-semibold">5. Retraits de Label (Perte / Âge &gt; 8 ans)</span>
                  <span className="text-slate-900 font-bold">140 (10.7% des labels)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${(140 / 1311) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/80 rounded-lg border border-emerald-100 text-xs text-emerald-900">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-950">Total Global Labellisées :</strong>
                <p className="text-emerald-800 mt-0.5">
                  809 (nouveaux) + 502 (convertis) = <strong>1 311 labels officiels</strong> au 03/2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sectors Breakdown and Yearly Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sectors Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="sectors-breakdown-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Secteurs Dominants</h3>
              <p className="text-xs text-slate-500">Distribution par domaine d'activité</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">18 secteurs</span>
          </div>

          <div className="space-y-2.5 mt-4">
            {topSectors.map((sec, idx) => {
              const pct = ((sec.count / 850) * 100).toFixed(0);
              return (
                <div key={sec.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[200px]" title={sec.name}>
                      {idx + 1}. {sec.name}
                    </span>
                    <span className="font-semibold text-slate-900">{sec.count} startups</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (sec.count / 212) * 100)}%`,
                        backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('startups_table')}
            className="w-full mt-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Explorer toutes les startups par secteur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Yearly Acceptance Rates Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="yearly-summary-table-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Synthèse Annuelle (2019 — 2026)</h3>
              <p className="text-xs text-slate-500">Détail des volumes et taux de succès par millésime</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              8 Années d'activité
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left border-collapse" id="overview-yearly-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3">Année</th>
                  <th className="py-2.5 px-3 text-center">Sessions</th>
                  <th className="py-2.5 px-3 text-right">Candidatures</th>
                  <th className="py-2.5 px-3 text-right">Labels Accordés</th>
                  <th className="py-2.5 px-3 text-right">Pré-Labels</th>
                  <th className="py-2.5 px-3 text-right">Taux Acceptation</th>
                  <th className="py-2.5 px-3 text-right">Taux Échec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {YEARLY_STATS.map((yr) => (
                  <tr key={yr.year} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{yr.year}</span>
                      {Number(yr.year) === 2026 && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                          T1 (3 sess.)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{yr.nbSessions}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800">{yr.candidatures}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{yr.labels}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-indigo-600">{yr.preLabels}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {yr.tauxAcceptation}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-medium">
                      {yr.tauxEchec}%
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="py-2.5 px-3">Total Global</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">{META_DATA.nbSessions}</td>
                  <td className="py-2.5 px-3 text-right text-white">{formatNumber(META_DATA.totalCandidatures)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">{formatNumber(META_DATA.totalLabels)}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300">{formatNumber(META_DATA.totalPreLabels)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-300">{META_DATA.tauxMoyenPct}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">55.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Latest Sessions Quick Preview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="latest-sessions-preview">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Dernières Sessions Enregistrées (2026)</h3>
            <p className="text-xs text-slate-500">Sessions récentes du Collège des Startups</p>
          </div>
          <button
            onClick={() => setActiveTab('sessions_table')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>Voir l'intégralité des 85 sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
          {SESSIONS_LIST.slice(-3).reverse().map((s) => (
            <div 
              key={s.session}
              onClick={() => {
                onSelectSession(s.session);
                setActiveTab('session_explorer');
              }}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Session {s.session}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {s.tauxPct}% acceptation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{getSessionLabel(s.session)}</p>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center border-t border-slate-200/60 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Candidats</span>
                  <span className="font-semibold text-slate-800">{s.candidatures}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Labels</span>
                  <span className="font-bold text-emerald-700">{s.labels}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pré-Labels</span>
                  <span className="font-semibold text-indigo-600">{s.preLabels}</span>
                </div>
              </div>

              {s.commentaires && (
                <p className="text-[10px] text-slate-500 mt-2 bg-white px-2 py-1 rounded border border-slate-100 truncate">
                  {s.commentaires}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
