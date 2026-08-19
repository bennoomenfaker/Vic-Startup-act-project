import React, { useState, useMemo } from 'react';
import { 
  Users, 
  HeartHandshake, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  Building2, 
  PieChart as PieIcon, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileCode,
  FileText,
  HelpCircle,
  ChevronRight,
  ArrowUpDown,
  BookOpen,
  Lightbulb,
  Scale,
  Percent
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
import { 
  GENDER_MACRO_STATS, 
  YEARLY_GENDER_DATA, 
  SECTOR_GENDER_DATA, 
  getAll85SessionsGenderData, 
  GENDER_ANALYTICS_INTERPRETATION,
  SessionGenderMetric
} from '../data/genderData';
import { formatNumber } from '../data/dataset';
import { exportGenderParityExcel, exportToJSON } from '../utils/exportUtils';
import { ComprehensivePDFReportsModal } from './ComprehensivePDFReportsModal';

export const GenderDiversityView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof SessionGenderMetric>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [chartMode, setChartMode] = useState<'pct' | 'volume'>('pct');
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);

  const allSessions = useMemo(() => getAll85SessionsGenderData(), []);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return allSessions.filter((s) => {
      const matchYear = selectedYear === 'all' || String(s.annee) === selectedYear;
      const matchSearch = searchQuery === '' || 
        s.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.topSectorWomen.toLowerCase().includes(searchQuery.toLowerCase());
      return matchYear && matchSearch;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  }, [allSessions, selectedYear, searchQuery, sortField, sortOrder]);

  // Aggregated totals for current filter
  const currentTotals = useMemo(() => {
    const totalFounders = filteredSessions.reduce((acc, s) => acc + s.totalFounders, 0);
    const femmes = filteredSessions.reduce((acc, s) => acc + s.femmes, 0);
    const hommes = filteredSessions.reduce((acc, s) => acc + s.hommes, 0);
    const candidatures = filteredSessions.reduce((acc, s) => acc + s.candidatures, 0);
    const startupsWithWomen = filteredSessions.reduce((acc, s) => acc + s.startupsWithWomen, 0);
    const totalStartups = filteredSessions.reduce((acc, s) => acc + s.startupsCount, 0);
    const pctFemmes = totalFounders > 0 ? Number(((femmes / totalFounders) * 100).toFixed(2)) : 0;
    const ratioHF = femmes > 0 ? Number((hommes / femmes).toFixed(2)) : 0;
    const pctStartupsWithWomen = totalStartups > 0 ? Number(((startupsWithWomen / totalStartups) * 100).toFixed(1)) : 0;

    return {
      totalFounders,
      femmes,
      hommes,
      candidatures,
      startupsWithWomen,
      totalStartups,
      pctFemmes,
      ratioHF,
      pctStartupsWithWomen,
    };
  }, [filteredSessions]);

  const handleSort = (field: keyof SessionGenderMetric) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export CSV of 85 sessions gender data
  const handleExportCSV = () => {
    const headers = [
      'ID Session',
      'Session',
      'Libellé',
      'Année',
      'Mois',
      'Candidatures',
      'Labels',
      'Total Fondateurs',
      'Femmes Fondatrices',
      'Hommes Fondateurs',
      'Part Femmes (%)',
      'Ratio Hommes/Femmes',
      'Startups Total',
      'Startups avec Femmes',
      'Part Startups Mixtes (%)',
      'Secteur Féminin Dominant'
    ];

    const rows = filteredSessions.map(s => [
      s.id,
      `"${s.session}"`,
      `"${s.sessionName}"`,
      s.annee,
      s.mois,
      s.candidatures,
      s.labels,
      s.totalFounders,
      s.femmes,
      s.hommes,
      `${s.pctFemmes}%`,
      s.ratioHF,
      s.startupsCount,
      s.startupsWithWomen,
      `${s.pctStartupsWithWomen}%`,
      `"${s.topSectorWomen}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Startup_Act_Parite_Genre_85_Sessions_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const PIE_GOVERNANCE_DATA = [
    { name: 'Équipes 100% Masculines', value: GENDER_MACRO_STATS.allMenStartups, percent: GENDER_MACRO_STATS.pctAllMenStartups, color: '#6366f1' },
    { name: 'Équipes Mixtes (H + F)', value: GENDER_MACRO_STATS.startupsWithWomen - GENDER_MACRO_STATS.allWomenStartups, percent: 22.93, color: '#ec4899' },
    { name: 'Équipes 100% Féminines', value: GENDER_MACRO_STATS.allWomenStartups, percent: GENDER_MACRO_STATS.pctAllWomenStartups, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 pb-16" id="gender-diversity-view">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-purple-900/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-300 border border-pink-400/30 uppercase tracking-wider flex items-center space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
                <span>Observatoire Genre & Diversité</span>
              </span>
              <span className="text-xs text-slate-300 font-semibold bg-white/10 px-2.5 py-0.5 rounded-full">
                85 Sessions Officielles Auditées
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Parité Entrepreneuriale & Dynamique de Genre
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Analyse exhaustive de la répartition femmes / hommes parmi les <span className="text-pink-300 font-bold">4 764 fondateurs</span> recensés sur l'ensemble des 85 sessions du Startup Act Tunisie (2019 — 2026), avec ventilation sectorielle et évolution temporelle.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsPDFModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Générer Rapport PDF Parité</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportGenderParityExcel}
                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => exportToJSON(getAll85SessionsGenderData(), 'startup_act_parite_85_sessions.json')}
                className="flex-1 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-300" />
                <span>JSON</span>
              </button>
            </div>

            <div className="p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Part Féminine Totale :</span>
              <span className="font-mono font-black text-pink-300 ml-2">24.21% (1 153 F)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Femmes */}
        <div className="bg-gradient-to-br from-pink-50/70 via-white to-rose-50/50 rounded-3xl p-5 border border-pink-200/80 shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-800 uppercase tracking-wider">Femmes Fondatrices</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-900">
              1 153 / 4 764
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2.5">
            24.21%
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-xs mt-2.5">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>Passé de 18.4% (2019) à 31.4% (2026)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            +70.7% de croissance relative de la parité.
          </p>
        </div>

        {/* Card 2: Ratio Hommes / Femmes */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ratio Hommes / Femmes</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              3 611 H vs 1 153 F
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight mt-2.5">
            3.13 <span className="text-xs font-medium text-slate-400">H pour 1 F</span>
          </div>
          <div className="flex items-center space-x-1 text-indigo-600 font-bold text-xs mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ratio s'améliore de 4.42 vers 2.17</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Convergence continue vers l'équilibre.
          </p>
        </div>

        {/* Card 3: Startups avec au moins 1 femme */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Startups Mixtes</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              915 Startups
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-2.5">
            34.79%
          </div>
          <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs mt-2.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Plus d'1 startup sur 3 intègre des femmes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            312 startups 100% fondées par des femmes.
          </p>
        </div>

        {/* Card 4: Surperformance d'acceptation */}
        <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-3xl p-5 border border-indigo-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Taux de Succès Labellisation</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-950">
              +7.4 pts Équipes Mixtes
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight mt-2.5">
            54.6% <span className="text-xs font-medium text-slate-500">vs 47.2%</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-700 font-bold text-xs mt-2.5">
            <Award className="w-3.5 h-3.5" />
            <span>Surperformance des équipes mixtes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            84.2% de conversion pré-label ➔ label.
          </p>
        </div>
      </div>

      {/* 3. Visual Charts Grid (Temporal Area Chart + Sector Parity Bar Chart + Governance Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Temporal Evolution Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between" id="gender-temporal-chart">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Évolution Temporelle de la Part Féminine (2019 — 2026)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Suivi de la dynamique de féminisation et de constitution des équipes mixtes au fil des années.
                </p>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold shrink-0">
                <button
                  onClick={() => setChartMode('pct')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMode === 'pct' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pourcentages (%)
                </button>
                <button
                  onClick={() => setChartMode('volume')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMode === 'volume' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Volumes (H vs F)
                </button>
              </div>
            </div>

            <div className="h-80 w-full mt-5">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'pct' ? (
                  <AreaChart data={YEARLY_GENDER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pinkAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 50]} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [`${val}%`, name === 'pctFemmes' ? '% Femmes Fondatrices' : '% Startups Mixtes']}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      formatter={(v) => v === 'pctFemmes' ? 'Part de Femmes Fondatrices (%)' : 'Startups avec Équipe Mixte (%)'}
                    />
                    <Area type="monotone" dataKey="pctFemmes" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#pinkAreaGrad)" />
                    <Area type="monotone" dataKey="pctStartupsWithWomen" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#purpleAreaGrad)" />
                  </AreaChart>
                ) : (
                  <BarChart data={YEARLY_GENDER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
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

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
            <span>Progression annuelle constante : <strong className="text-slate-900">+1.86 pt/an en moyenne</strong></span>
            <span className="text-pink-600 font-bold">2026 : 31.4% de femmes fondatrices</span>
          </div>
        </div>

        {/* Right (1 col): Governance Distribution (Pie Donut) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between" id="gender-governance-donut">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Gouvernance des 2 630 Startups</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ventilation selon la composition de l'équipe fondatrice.
              </p>
            </div>

            <div className="h-56 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_GOVERNANCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {PIE_GOVERNANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} startups`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900">34.8%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Mixité</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {PIE_GOVERNANCE_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 font-semibold truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">{item.value}</span>
                    <span className="font-mono font-bold text-slate-900">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            312 startups sont créées par des équipes 100% féminines.
          </div>
        </div>
      </div>

      {/* 4. Sector Parity Ranking & Comparison */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-5" id="gender-sector-matrix">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Parité & Féminisation par Secteur d'Activité (10 Verticales)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Classement décroissant par taux de présence féminine parmi les co-fondateurs.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full shrink-0">
            Disparité : 17.5% (IA) à 38.6% (MedTech)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTOR_GENDER_DATA.map((sec, idx) => (
            <div 
              key={sec.sector}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-pink-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{idx + 1}. {sec.sector}</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-black bg-pink-100 text-pink-800">
                    {sec.pctFemmes.toFixed(1)}% Femmes
                  </span>
                </div>

                {/* Progress Bar H vs F */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2.5 flex">
                  <div 
                    className="bg-pink-500 h-full transition-all"
                    style={{ width: `${sec.pctFemmes}%` }}
                    title={`Femmes: ${sec.femmes}`}
                  ></div>
                  <div 
                    className="bg-indigo-500 h-full transition-all"
                    style={{ width: `${100 - sec.pctFemmes}%` }}
                    title={`Hommes: ${sec.hommes}`}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2">
                  <span><strong>{sec.femmes}</strong> Femmes ({sec.pctFemmes.toFixed(1)}%)</span>
                  <span><strong>{sec.hommes}</strong> Hommes ({(100 - sec.pctFemmes).toFixed(1)}%)</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-semibold">{sec.startupsCount} Startups • {sec.pctStartupsMixtes}% Mixtes</span>
                <span className="text-slate-400 font-mono">Ratio : {sec.ratioHF} H/F</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Full Exhaustive Table of ALL 85 Sessions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-5" id="gender-85-sessions-table">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-100 text-indigo-900 font-mono">
                85 PVs
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Tableau Exhaustif des 85 Sessions : Décompte Hommes / Femmes
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Affichage unitaire session par session avec nombre de femmes, nombre d'hommes, ratio H/F et part de mixité.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year Selector */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              {['all', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedYear === yr ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {yr === 'all' ? 'Toutes' : yr}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher session..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Summary Filter Banner */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center space-x-6">
            <span>Sessions affichées : <strong className="text-slate-900">{filteredSessions.length} / 85</strong></span>
            <span>Fondateurs : <strong className="text-slate-900">{formatNumber(currentTotals.totalFounders)}</strong></span>
            <span className="text-pink-700">Femmes : <strong>{formatNumber(currentTotals.femmes)} ({currentTotals.pctFemmes}%)</strong></span>
            <span className="text-indigo-700">Hommes : <strong>{formatNumber(currentTotals.hommes)}</strong></span>
          </div>
          <div className="text-slate-500 font-mono">
            Ratio moyen H/F : <strong className="text-slate-900">{currentTotals.ratioHF}</strong>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold select-none">
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>
                  <div className="flex items-center space-x-1">
                    <span># PV</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('session')}>
                  <div className="flex items-center space-x-1">
                    <span>Session</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort('candidatures')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Candidatures</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort('totalFounders')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Total Fondateurs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-pink-50 text-pink-700 text-center" onClick={() => handleSort('femmes')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Femmes (F)</span>
                    <ArrowUpDown className="w-3 h-3 text-pink-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-indigo-50 text-indigo-700 text-center" onClick={() => handleSort('hommes')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Hommes (H)</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-pink-50 text-pink-800 text-center" onClick={() => handleSort('pctFemmes')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>% Femmes</span>
                    <ArrowUpDown className="w-3 h-3 text-pink-500" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort('ratioHF')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Ratio H/F</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort('startupsWithWomen')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Startups Mixtes</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Secteur Leader Féminin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((s) => (
                <tr 
                  key={s.session}
                  className="hover:bg-indigo-50/40 transition-colors group"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">
                    #{String(s.id).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block group-hover:text-indigo-600">
                      {s.session}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {s.sessionName.split('(')[1]?.replace(')', '')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                    {s.candidatures}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                    {s.totalFounders}
                  </td>
                  <td className="py-2.5 px-3 text-center font-black text-pink-700 bg-pink-50/40">
                    {s.femmes}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                    {s.hommes}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-mono font-black text-pink-800 text-xs">
                        {s.pctFemmes}%
                      </span>
                      <div className="w-16 bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full" style={{ width: `${s.pctFemmes}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-600">
                    {s.ratioHF}
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.startupsWithWomen} ({s.pctStartupsWithWomen}%)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    <span className="truncate max-w-[140px] block text-[11px]">
                      {s.topSectorWomen}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. In-Depth Interpretation & Qualitative Analysis */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-6" id="gender-interpretation-section">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Interprétation Économique & Analyse des Résultats (Femmes vs Hommes)
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {GENDER_ANALYTICS_INTERPRETATION.summary}
        </p>

        {/* 4 Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {GENDER_ANALYTICS_INTERPRETATION.keyInsights.map((insight, idx) => (
            <div 
              key={insight.title}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:bg-white hover:shadow-soft transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Insight #{idx + 1}
                </span>
                <span className="text-[11px] font-black text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                  {insight.highlight}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {insight.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {insight.description}
              </p>
            </div>
          ))}
        </div>

        {/* Policy Recommendations */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recommandations pour Renforcer la Mixité et le Financement Féminin
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GENDER_ANALYTICS_INTERPRETATION.recommendations.map((rec, i) => (
              <div key={rec.title} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                  Axe Stratégique #{i + 1}
                </span>
                <h5 className="text-xs font-bold text-slate-900">{rec.title}</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive PDF Report Modal for Gender Analytics */}
      {isPDFModalOpen && (
        <ComprehensivePDFReportsModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          initialReportType="gender_parity"
        />
      )}
    </div>
  );
};
