import React from 'react';
import { 
  X, 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Lightbulb, 
  Layers, 
  Target, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Share2
} from 'lucide-react';
import { KPIDefinition } from '../types';

interface KPIExplanationModalProps {
  kpi: KPIDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  currentValue?: string | number;
  selectedYear?: string;
}

export const KPIExplanationModal: React.FC<KPIExplanationModalProps> = ({
  kpi,
  isOpen,
  onClose,
  currentValue,
  selectedYear = 'all',
}) => {
  if (!isOpen || !kpi) return null;

  const getCategoryColor = (cat: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" id="kpi-explanation-modal-backdrop">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 tracking-wider">
              {kpi.code}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getCategoryColor(kpi.category)}`}>
              {kpi.categoryLabel}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              KPI #{kpi.number} / 50
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {kpi.name}
          </h2>

          {/* Current Value Display Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Valeur Calculée ({selectedYear === 'all' ? '85 Sessions' : `Année ${selectedYear}`})
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight flex items-baseline space-x-2">
                <span>{currentValue ?? kpi.benchmark ?? 'N/A'}</span>
                <span className="text-xs font-semibold text-slate-300">{kpi.unit}</span>
              </div>
            </div>

            {kpi.benchmark && (
              <div className="text-right pl-4 border-l border-white/15">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Benchmark 85 Sessions
                </span>
                <span className="text-xs font-bold text-indigo-200 block mt-0.5">
                  {kpi.benchmark}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto custom-scrollbar">
          {/* 1. Mathematical Formula Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Formule Mathématique & Définition Algorithmique</span>
            </div>
            
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 font-mono text-xs font-bold text-purple-700 shadow-2xs overflow-x-auto">
              {kpi.formula}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {kpi.formulaDescription}
            </p>
          </div>

          {/* 2. Utilité Métier & Rôle Décisionnel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Utilité Métier</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {kpi.utility}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                <Target className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Pilotage & Rôle Décisionnel</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {kpi.decisionRole}
              </p>
            </div>
          </div>

          {/* 3. Interprétation Analytique Approfondie */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Interprétation Économique & Analytique</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {kpi.interpretation}
            </p>
          </div>

          {/* 4. Source Documentaire & Traçabilité */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
              <span><strong>Source PV :</strong> {kpi.sourceDoc}</span>
            </div>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Vérifié</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Observatoire National Startup Act Tunisie (VIC 2026)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
