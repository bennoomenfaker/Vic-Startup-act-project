import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  HelpCircle, 
  Target, 
  TrendingUp, 
  Layers, 
  Award, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Users2, 
  Scale, 
  ChevronRight,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileCode,
  FileText
} from 'lucide-react';
import { KPI_CATALOG, KPI_CATEGORIES } from '../data/kpiCatalog';
import { 
  SESSIONS_LIST, 
  META_DATA, 
  formatNumber,
  calculateRejectionRate,
  calculateSectorRejectionMetrics,
  calculateSessionRejectionMetrics
} from '../data/dataset';
import { KPIDefinition, SessionData } from '../types';
import { KPIExplanationModal } from './KPIExplanationModal';
import { exportKPICatalogExcel, exportToJSON } from '../utils/exportUtils';
import { ComprehensivePDFReportsModal } from './ComprehensivePDFReportsModal';

interface KPICatalogViewProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
}

export const KPICatalogView: React.FC<KPICatalogViewProps> = ({
  selectedYear,
  onSelectYear,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeKPI, setActiveKPI] = useState<KPIDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);

  // Filtered sessions based on global year filter
  const filteredSessions = useMemo(() => {
    if (selectedYear === 'all') return SESSIONS_LIST;
    return SESSIONS_LIST.filter(s => s.annee === Number(selectedYear));
  }, [selectedYear]);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return KPI_CATALOG.filter((kpi) => {
      const matchCategory = selectedCategory === 'all' || kpi.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.utility.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenKPI = (kpi: KPIDefinition) => {
    setActiveKPI(kpi);
    setIsModalOpen(true);
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'volumes': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'funnel': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'selectivity': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'time': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'demographics': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'audit': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-7 pb-16" id="kpi-catalog-view">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-indigo-900/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider flex items-center space-x-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                <span>Référentiel Métier & Algorithmique</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {KPI_CATALOG.length} KPIs Dynamiques
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Catalogue des {KPI_CATALOG.length} KPIs du Startup Act Tunisie
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Chaque indicateur est recalculé en temps réel selon l'année sélectionnée, avec sa formule mathématique certifiée, son utilité décisionnelle, son rôle de pilotage et sa traçabilité sur les 85 PVs.
            </p>
          </div>

          {/* Quick Actions & Year Filter Pill inside Header */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPDFModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>Guide PDF 50 KPIs</span>
              </button>

              <button
                onClick={exportKPICatalogExcel}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => exportToJSON(KPI_CATALOG, 'startup_act_catalogue_50_kpis.json')}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-300" />
                <span>JSON</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Filtre d'Année Appliqué
              </span>
              <div className="flex flex-wrap gap-1">
                {['all', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => onSelectYear(yr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedYear === yr 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {yr === 'all' ? '85 Sessions' : yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Funnel Focus Highlight Card (-502=121 Equation) */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              ∑
            </div>
            <div>
              <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider block">
                Équation Centrale du Parcours de Labellisation
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                623 Pré-Labels − 502 Conversions = 121 Pré-Labels Restants (80.6% Taux de Conversion)
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Le total officiel de <strong>1 311 labels</strong> se décompose mathématiquement en <strong>809 labels directs</strong> + <strong>502 conversions</strong> de pré-labels après immatriculation juridique.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenKPI(KPI_CATALOG[9])}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 flex items-center justify-center space-x-2"
          >
            <span>Détail du Calcul</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {KPI_CATEGORIES.map((cat) => {
            const dynamicCount = cat.id === 'all' 
              ? KPI_CATALOG.length 
              : KPI_CATALOG.filter(k => k.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white shadow-soft`
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {dynamicCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher formule, code, KPI..."
            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-2xl bg-white border border-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* 4. KPI Grid (50 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCatalog.map((kpi) => {
          const rawValue = kpi.getValue(filteredSessions, META_DATA, selectedYear);
          const formattedVal = typeof rawValue === 'number' ? formatNumber(rawValue) : rawValue;
          const isRejectionKPI = kpi.code === 'SEL-08';

          return (
            <div
              key={kpi.id}
              onClick={() => handleOpenKPI(kpi)}
              className={`bg-white rounded-3xl p-5 border shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                isRejectionKPI 
                  ? 'border-rose-200 hover:border-rose-400 bg-gradient-to-b from-white via-white to-rose-50/20' 
                  : 'border-slate-100 hover:border-indigo-200'
              }`}
              id={`kpi-card-${kpi.code.toLowerCase()}`}
            >
              <div>
                {/* Header with Code and Category */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black tracking-wider ${
                      isRejectionKPI ? 'bg-rose-700 text-white' : 'bg-slate-900 text-white'
                    }`}>
                      {kpi.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(kpi.category)}`}>
                      {kpi.categoryLabel.split('.')[1] || kpi.categoryLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    #{kpi.number}
                  </span>
                </div>

                {/* Name */}
                <h3 className={`text-sm font-bold transition-colors mt-3 line-clamp-2 ${
                  isRejectionKPI ? 'text-slate-900 group-hover:text-rose-700' : 'text-slate-900 group-hover:text-indigo-600'
                }`}>
                  {kpi.name}
                </h3>

                {/* Value for current filter */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Valeur {selectedYear === 'all' ? '(85 Sessions)' : `(${selectedYear})`}
                    </span>
                    <div className={`text-2xl font-black tracking-tight mt-0.5 ${
                      isRejectionKPI ? 'text-rose-700' : 'text-slate-900'
                    }`}>
                      {formattedVal} <span className="text-xs font-semibold text-slate-500">{kpi.unit}</span>
                    </div>
                  </div>

                  {kpi.benchmark && (
                    <div className="text-right max-w-[140px]">
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Benchmark
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 block truncate" title={kpi.benchmark}>
                        {kpi.benchmark.split('|')[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Formula Snippet */}
                <div className={`mt-3.5 p-2.5 rounded-xl border font-mono text-[11px] font-semibold truncate ${
                  isRejectionKPI ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 border-slate-100 text-purple-700'
                }`}>
                  {kpi.formula}
                </div>

                {/* SEL-08 Specific Sector Rejection Matrix Preview */}
                {isRejectionKPI && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                      Dispersion Sectorielle du Rejet :
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">DeepTech: 21.8%</span>
                      <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Santé: 24.2%</span>
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">SaaS: 26.8%</span>
                      <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">E-Commerce: 38.7%</span>
                    </div>
                  </div>
                )}

                {/* Short utility description */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 font-medium">
                  {kpi.utility}
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                isRejectionKPI ? 'border-rose-100 text-rose-600 group-hover:text-rose-700' : 'border-slate-100 text-indigo-600 group-hover:text-indigo-700'
              }`}>
                <span className="flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Voir calcul & interprétation</span>
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for detail explanation */}
      {activeKPI && (
        <KPIExplanationModal
          kpi={activeKPI}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentValue={typeof activeKPI.getValue(filteredSessions, META_DATA, selectedYear) === 'number' 
            ? formatNumber(activeKPI.getValue(filteredSessions, META_DATA, selectedYear) as number) 
            : activeKPI.getValue(filteredSessions, META_DATA, selectedYear)}
          selectedYear={selectedYear}
        />
      )}

      {/* PDF Handbook Modal */}
      {isPDFModalOpen && (
        <ComprehensivePDFReportsModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          initialReportType="kpi_handbook"
        />
      )}
    </div>
  );
};
