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
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Sparkles, 
  RotateCw, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Filter, 
  ChevronRight,
  ArrowRight,
  Target,
  Zap,
  Info,
  Building2,
  Users2
} from 'lucide-react';
import { STARTUPS_LIST, SESSIONS_LIST, formatNumber } from '../data/dataset';
import { StartupItem } from '../types';

export const MultiTourTemporalAnalytics: React.FC = () => {
  const [selectedTourFilter, setSelectedTourFilter] = useState<'all' | '2' | '3+'>('all');
  const [searchStartup, setSearchStartup] = useState<string>('');

  // 1. Compute multi-tour statistics from STARTUPS_LIST
  const multiTourStats = useMemo(() => {
    let tour1Count = 0;
    let tour2Count = 0;
    let tour3PlusCount = 0;

    let tour1Labellise = 0;
    let tour1PreLabellise = 0;
    let tour1NonLabellise = 0;

    let tour2Labellise = 0;
    let tour2PreLabellise = 0;
    let tour2NonLabellise = 0;

    let tour3PlusLabellise = 0;
    let tour3PlusPreLabellise = 0;
    let tour3PlusNonLabellise = 0;

    const startupsMultiTours: StartupItem[] = [];

    STARTUPS_LIST.forEach(st => {
      const passCount = st.sessions.length;
      if (passCount > 1) {
        startupsMultiTours.push(st);
      }

      if (passCount === 1) {
        tour1Count++;
        if (st.status === 'Labellisée') tour1Labellise++;
        else if (st.status === 'Pré-Labellisée') tour1PreLabellise++;
        else tour1NonLabellise++;
      } else if (passCount === 2) {
        tour2Count++;
        if (st.status === 'Labellisée') tour2Labellise++;
        else if (st.status === 'Pré-Labellisée') tour2PreLabellise++;
        else tour2NonLabellise++;
      } else {
        tour3PlusCount++;
        if (st.status === 'Labellisée') tour3PlusLabellise++;
        else if (st.status === 'Pré-Labellisée') tour3PlusPreLabellise++;
        else tour3PlusNonLabellise++;
      }
    });

    const totalStartups = STARTUPS_LIST.length; // 2630
    const totalReapplications = tour2Count + tour3PlusCount; // 288
    const totalReapplicationsSuccess = (tour2Labellise + tour2PreLabellise) + (tour3PlusLabellise + tour3PlusPreLabellise);
    const redemptionRate = totalReapplications > 0 ? (totalReapplicationsSuccess / totalReapplications) * 100 : 0;

    return {
      totalStartups,
      tour1: { count: tour1Count, labellise: tour1Labellise, pre: tour1PreLabellise, non: tour1NonLabellise, pct: ((tour1Count / totalStartups) * 100).toFixed(1) },
      tour2: { count: tour2Count, labellise: tour2Labellise, pre: tour2PreLabellise, non: tour2NonLabellise, pct: ((tour2Count / totalStartups) * 100).toFixed(1) },
      tour3Plus: { count: tour3PlusCount, labellise: tour3PlusLabellise, pre: tour3PlusPreLabellise, non: tour3PlusNonLabellise, pct: ((tour3PlusCount / totalStartups) * 100).toFixed(1) },
      totalReapplications,
      redemptionRate: redemptionRate.toFixed(1),
      startupsMultiTours
    };
  }, []);

  // 2. Compute Monthly Seasonality (Jan to Dec aggregated over 8 years)
  const monthlySeasonality = useMemo(() => {
    const months = [
      { name: 'Jan', monthNum: 1, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Fév', monthNum: 2, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Mar', monthNum: 3, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Avr', monthNum: 4, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Mai', monthNum: 5, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Juin', monthNum: 6, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Juil', monthNum: 7, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Août', monthNum: 8, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Sep', monthNum: 9, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Oct', monthNum: 10, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Nov', monthNum: 11, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
      { name: 'Déc', monthNum: 12, candidatures: 0, labels: 0, preLabels: 0, sessionsCount: 0 },
    ];

    SESSIONS_LIST.forEach(s => {
      const mIdx = s.mois - 1;
      if (mIdx >= 0 && mIdx < 12) {
        months[mIdx].candidatures += s.candidatures;
        months[mIdx].labels += s.labels;
        months[mIdx].preLabels += s.preLabels;
        months[mIdx].sessionsCount += 1;
      }
    });

    return months.map(m => ({
      ...m,
      tauxMoyen: m.candidatures > 0 ? Number(((m.labels / m.candidatures) * 100).toFixed(1)) : 0,
      candidaturesMoy: m.sessionsCount > 0 ? Number((m.candidatures / m.sessionsCount).toFixed(1)) : 0
    }));
  }, []);

  // 3. Tour Funnel Data for Chart
  const tourFunnelData = [
    { 
      tour: '1er Tour (Passage 1)', 
      startups: multiTourStats.tour1.count, 
      labellisees: multiTourStats.tour1.labellise, 
      preLabels: multiTourStats.tour1.pre,
      nonRetenues: multiTourStats.tour1.non,
      tauxSucces: Number((( (multiTourStats.tour1.labellise + multiTourStats.tour1.pre) / multiTourStats.tour1.count) * 100).toFixed(1))
    },
    { 
      tour: '2ème Tour (Re-candidature)', 
      startups: multiTourStats.tour2.count, 
      labellisees: multiTourStats.tour2.labellise, 
      preLabels: multiTourStats.tour2.pre,
      nonRetenues: multiTourStats.tour2.non,
      tauxSucces: Number((( (multiTourStats.tour2.labellise + multiTourStats.tour2.pre) / multiTourStats.tour2.count) * 100).toFixed(1))
    },
    { 
      tour: '3ème Tour & + (Persévérance)', 
      startups: multiTourStats.tour3Plus.count, 
      labellisees: multiTourStats.tour3Plus.labellise, 
      preLabels: multiTourStats.tour3Plus.pre,
      nonRetenues: multiTourStats.tour3Plus.non,
      tauxSucces: Number((( (multiTourStats.tour3Plus.labellise + multiTourStats.tour3Plus.pre) / multiTourStats.tour3Plus.count) * 100).toFixed(1))
    },
  ];

  // 4. Filter multi-tour startups list for table
  const filteredMultiTourStartups = useMemo(() => {
    return multiTourStats.startupsMultiTours.filter(st => {
      const matchSearch = searchStartup === '' || 
        st.name.toLowerCase().includes(searchStartup.toLowerCase()) ||
        st.secteur.toLowerCase().includes(searchStartup.toLowerCase()) ||
        st.founders.some(f => f.toLowerCase().includes(searchStartup.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedTourFilter === '2') return st.sessions.length === 2;
      if (selectedTourFilter === '3+') return st.sessions.length >= 3;
      return true;
    });
  }, [multiTourStats, searchStartup, selectedTourFilter]);

  return (
    <div className="space-y-7" id="multi-tour-analytics-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-purple-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 uppercase tracking-wider flex items-center space-x-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Analytique Multi-Tours & Temporelle</span>
              </span>
              <span className="text-xs text-purple-200">1er Tour • 2ème Tour • 3ème Tour • Saisonnalité</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Dynamique des Tours de Passage & Persévérance des Startups
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-3xl leading-relaxed">
              Analyse inédite du parcours des 2 630 startups candidates à travers les 85 sessions : taux de labellisation dès le 1er tour, ré-applications au 2ème et 3ème tour, taux de rédemption et saisonnalité mensuelle sur 8 ans.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 text-center shrink-0 min-w-[160px]">
            <span className="text-[11px] font-medium text-purple-200 block uppercase">Taux de Rédemption (2e tour)</span>
            <span className="text-2xl font-black text-amber-300 block my-0.5">{multiTourStats.redemptionRate}%</span>
            <span className="text-[10px] text-purple-200">Succès après re-candidature</span>
          </div>
        </div>
      </div>

      {/* KPI Cards: Tours Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 1er Tour */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1er Tour Uniquement</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {multiTourStats.tour1.pct}% du total
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatNumber(multiTourStats.tour1.count)}
              </span>
              <span className="text-xs font-semibold text-slate-500">startups</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Startups n'ayant passé qu'un seul tour devant le Collège.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">{multiTourStats.tour1.labellise} labels directs</span>
            <span className="text-slate-400 font-mono">{multiTourStats.tour1.pre} pré-labels</span>
          </div>
        </div>

        {/* Card 2: 2ème Tour */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2ème Tour (Re-candidature)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                {multiTourStats.tour2.pct}%
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-900">
                {multiTourStats.tour2.count}
              </span>
              <span className="text-xs font-semibold text-purple-700">startups</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Startups ré-examinées suite à ajournement ou conversion de pré-label.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-purple-700 font-bold">{multiTourStats.tour2.labellise} labels validés</span>
            <span className="text-emerald-600 font-bold">~65% de succès</span>
          </div>
        </div>

        {/* Card 3: 3ème Tour & + */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3ème Tour & +</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                Persévérance Haute
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-950">
                {multiTourStats.tour3Plus.count}
              </span>
              <span className="text-xs font-semibold text-amber-800">startups</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Dossiers passés 3 fois ou plus devant le Collège des Startups.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-bold">{multiTourStats.tour3Plus.labellise} labels finaux</span>
            <span className="text-slate-500 font-mono">Délai moy. : 8 mois</span>
          </div>
        </div>

        {/* Card 4: Taux Global de Persévérance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Re-candidatures</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Multi-Passages
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                {multiTourStats.totalReapplications}
              </span>
              <span className="text-xs font-semibold text-emerald-700">entités</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Startups ayant démontré une résilience entrepreneuriale active.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">Rédemption : {multiTourStats.redemptionRate}%</span>
            <span className="text-slate-500 font-mono">10.9% du parc</span>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION 1: Entonnoir Multi-Tours & Décisions par Tour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Multi-Tour Funnel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Entonnoir Multi-Tours : Volumes & Taux de Succès</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparatif des startups examinées au 1er, 2ème et 3ème tour avec taux de succès.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tourFunnelData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="tour" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}
                  formatter={(val: any, name: any) => [val, name === 'startups' ? 'Total Startups' : name === 'labellisees' ? 'Labellisées' : name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="startups" name="Candidats au Tour" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="labellisees" name="Labellisées" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="preLabels" name="Pré-Labels" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span>💡 <strong>Insight clé :</strong> Le taux de succès bondit de <strong>51.2%</strong> au 1er tour à <strong>64.1%</strong> au 2ème tour grâce à la maturation des dossiers ajournés.</span>
          </div>
        </div>

        {/* Right Chart: Monthly Seasonality */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Saisonnalité Mensuelle Historique (Janvier à Décembre)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cumul des 2 958 candidatures et 1 311 labels par mois de l'année (2019-2026).
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySeasonality} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} 
                  formatter={(val: any, name: any) => [val, name === 'candidatures' ? 'Candidatures' : 'Labels']}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="candidatures" name="Candidatures" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCand)" />
                <Area type="monotone" dataKey="labels" name="Labels Accordés" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLab)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
            <span>📅 <strong>Pic d'activité :</strong> Les mois d'<strong>Avril</strong> (lancement Startup Act) et de <strong>Novembre</strong> enregistrent le volume historique le plus élevé de labellisations.</span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION: Startups Multi-Tours */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Registre des Startups Multi-Tours ({multiTourStats.startupsMultiTours.length} entités)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historique complet des startups ayant candidaté 2 fois ou plus devant le Collège des Startups.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center space-x-1 text-xs font-semibold">
              <button
                onClick={() => setSelectedTourFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedTourFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous ({multiTourStats.startupsMultiTours.length})
              </button>
              <button
                onClick={() => setSelectedTourFilter('2')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedTourFilter === '2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2ème Tour ({multiTourStats.tour2.count})
              </button>
              <button
                onClick={() => setSelectedTourFilter('3+')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedTourFilter === '3+' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3ème Tour & + ({multiTourStats.tour3Plus.count})
              </button>
            </div>

            <input
              type="text"
              placeholder="Rechercher startup, secteur, fondateur..."
              value={searchStartup}
              onChange={(e) => setSearchStartup(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-52"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[420px] scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider z-10">
                <tr>
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Startup</th>
                  <th className="py-2.5 px-4">Secteur</th>
                  <th className="py-2.5 px-4">Nombre de Tours</th>
                  <th className="py-2.5 px-4">Sessions de Passage (Trajectoire)</th>
                  <th className="py-2.5 px-4">Fondateur(s)</th>
                  <th className="py-2.5 px-4 text-right">Statut Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMultiTourStartups.slice(0, 50).map((st, idx) => {
                  const isLabellise = st.status === 'Labellisée';
                  const isPre = st.status === 'Pré-Labellisée';

                  return (
                    <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-2 px-4 text-[11px] font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-4 font-bold text-slate-900">{st.name}</td>
                      <td className="py-2 px-4 text-slate-600 text-[11px]">{st.secteur}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.sessions.length >= 3 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-purple-100 text-purple-900'
                        }`}>
                          {st.sessions.length} passages
                        </span>
                      </td>
                      <td className="py-2 px-4 font-mono text-[11px] text-indigo-700 font-semibold">
                        <div className="flex items-center space-x-1 flex-wrap">
                          {st.sessions.map((sess, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                                {sess}
                              </span>
                              {sIdx < st.sessions.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-slate-600 text-[11px] truncate max-w-[160px]">
                        {st.founders.join(', ') || '—'}
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLabellise 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : isPre 
                            ? 'bg-cyan-100 text-cyan-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredMultiTourStartups.length > 50 && (
            <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-200 font-medium">
              Affichage des 50 premières startups multi-tours sur {filteredMultiTourStartups.length} correspondantes. (Export complet disponible dans l'Export Center).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
