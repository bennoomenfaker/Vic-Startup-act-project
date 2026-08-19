import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Award, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Percent,
  Flame,
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { formatNumber } from '../data/dataset';
import { KPIDefinition } from '../types';

interface ConversionPipelineSectionProps {
  onOpenKPIByCode: (code: string) => void;
  selectedYear?: string;
}

export const ConversionPipelineSection: React.FC<ConversionPipelineSectionProps> = ({
  onOpenKPIByCode,
  selectedYear = 'all',
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Core metrics for the 85 sessions pipeline
  const pipelineData = {
    candidatures: 3015,
    directLabels: 1216,
    preLabels: 623,
    rejected: 1024,
    conversions: 95,
    preLabelsRemaining: 121,
    totalLabels: 1311,
    retraits: 64,
    activeLabels: 1247,
    conversionRate: 80.58,
    acceptanceRate: 44.32,
    retentionRate: 95.12,
    rejectionRate: 34.62,
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-6" id="conversion-pipeline-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider flex items-center space-x-1.5">
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pipeline & Entonnoir Officiel</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              80.58% Conversion Pré-Label
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Entonnoir de Conversion des Candidatures en Startups Labellisées
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Traçabilité intégrale du flux : des <strong>3 015 dossiers examinés</strong> aux <strong>623 pré-labels</strong> et leur conversion vers les <strong>1 311 labels certifiés</strong> (équation 623 − 95 = 528).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenKPIByCode('FUN-01')}
            className="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            title="Détail du KPI Conversion (FUN-01)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Explication Formule (FUN-01)</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 relative">
        {/* Stage 1: Applications */}
        <div 
          onClick={() => { setActiveStep(1); onOpenKPIByCode('VOL-01'); }}
          className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
            activeStep === 1 
              ? 'bg-slate-900 text-white border-slate-900 shadow-soft-lg' 
              : 'bg-slate-50 hover:bg-slate-100/80 text-slate-900 border-slate-200/80'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              activeStep === 1 ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              Étape 1 · Entrée
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">100%</span>
          </div>

          <div className="my-4">
            <span className={`text-xs font-semibold block ${activeStep === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
              Dossiers Candidats Examinés
            </span>
            <div className={`text-3xl font-black tracking-tight mt-1 ${activeStep === 1 ? 'text-white' : 'text-slate-900'}`}>
              {formatNumber(pipelineData.candidatures)}
            </div>
            <p className={`text-[11px] mt-1.5 font-medium leading-relaxed ${activeStep === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
              85 sessions d'évaluation plénière par le Collège des Startups.
            </p>
          </div>

          <div className={`pt-3 border-t text-[11px] font-bold flex items-center justify-between ${
            activeStep === 1 ? 'border-white/10 text-indigo-300' : 'border-slate-200 text-indigo-600'
          }`}>
            <span>VOL-01 · Flux Global</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Stage 2: Dual Track (Direct vs Pre-label) */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-blue-50/70 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
              Étape 2 · Décision Collège
            </span>
            <span className="text-[10px] font-bold text-slate-500">2 Voies d'Accès</span>
          </div>

          {/* Sub-track A: Direct Labels */}
          <div 
            onClick={() => onOpenKPIByCode('VOL-03')}
            className="bg-white rounded-xl p-3 border border-purple-100 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-900 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Labels Directs</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                61.7% des labels
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              1 216 <span className="text-xs font-normal text-slate-500">sociétés</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sociétés déjà créées avant dépôt</span>
          </div>

          {/* Sub-track B: Pre-labels */}
          <div 
            onClick={() => onOpenKPIByCode('VOL-04')}
            className="bg-white rounded-xl p-3 border border-blue-100 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Pré-Labels Accordés</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                21.1% du flux
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              623 <span className="text-xs font-normal text-slate-500">porteurs d'idées</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sas d'amorçage + Bourse 6 mois</span>
          </div>

          {/* Sub-track C: Rejections */}
          <div 
            onClick={() => onOpenKPIByCode('SEL-08')}
            className="bg-slate-100/80 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between text-[11px] cursor-pointer hover:bg-slate-200/70 transition-colors"
          >
            <span className="font-bold text-slate-700">Refus & Ajournements</span>
            <span className="font-mono font-black text-slate-900">1 024 (34.6%)</span>
          </div>
        </div>

        {/* Stage 3: The Pre-label Funnel & Conversions */}
        <div 
          onClick={() => { setActiveStep(3); onOpenKPIByCode('FUN-01'); }}
          className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
            activeStep === 3 
              ? 'bg-blue-950 text-white border-blue-900 shadow-soft-lg' 
              : 'bg-blue-50/50 hover:bg-blue-50 text-slate-900 border-blue-200/80'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              activeStep === 3 ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              Étape 3 · Conversions
            </span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              80.58% Succès
            </span>
          </div>

          <div className="my-3 space-y-3">
            <div>
              <span className={`text-xs font-semibold block ${activeStep === 3 ? 'text-blue-200' : 'text-slate-600'}`}>
                Conversions en Labels Pleins
              </span>
              <div className={`text-3xl font-black tracking-tight mt-0.5 ${activeStep === 3 ? 'text-white' : 'text-blue-950'}`}>
                95 <span className="text-sm font-normal text-emerald-600 font-bold">(80.6%)</span>
              </div>
            </div>

            {/* Progress bar visual */}
            <div className="space-y-1">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '80.58%' }} title="95 convertis (15.2%)"></div>
                <div className="bg-amber-400 h-full" style={{ width: '19.42%' }} title="121 restants (19.42%)"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span className="text-emerald-700">95 Convertis</span>
                <span className="text-amber-700">121 Solde Restant</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl text-[11px] font-medium leading-tight ${
              activeStep === 3 ? 'bg-white/10 text-blue-100' : 'bg-white text-slate-600 border border-blue-100'
            }`}>
              <strong>Équation :</strong> 623 Pré-labels − 95 Conversions = <strong>121 Pré-labels</strong> restants en incubation ou échus.
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] font-bold flex items-center justify-between ${
            activeStep === 3 ? 'border-white/10 text-blue-300' : 'border-blue-100 text-blue-700'
          }`}>
            <span>FUN-01 · Taux de Conversion</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Stage 4: Certified Pool & Resilience */}
        <div 
          onClick={() => { setActiveStep(4); onOpenKPIByCode('VOL-02'); }}
          className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
            activeStep === 4 
              ? 'bg-purple-950 text-white border-purple-900 shadow-soft-lg' 
              : 'bg-purple-50/50 hover:bg-purple-50 text-slate-900 border-purple-200/80'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              activeStep === 4 ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-100 text-purple-800'
            }`}>
              Étape 4 · Vivier Certifié
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
              Vérité Terrain
            </span>
          </div>

          <div className="my-3 space-y-2.5">
            <div>
              <span className={`text-xs font-semibold block ${activeStep === 4 ? 'text-purple-200' : 'text-slate-600'}`}>
                Total Labels Accordés (85 Sessions)
              </span>
              <div className={`text-3xl font-black tracking-tight mt-0.5 ${activeStep === 4 ? 'text-white' : 'text-purple-950'}`}>
                1 311 <span className="text-xs font-normal text-purple-600 font-bold">(1 216 + 95)</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl text-[11px] space-y-1.5 ${
              activeStep === 4 ? 'bg-white/10 text-purple-100' : 'bg-white text-slate-700 border border-purple-100'
            }`}>
              <div className="flex items-center justify-between">
                <span>Parc Actif Net :</span>
                <strong className="font-mono text-emerald-600 font-extrabold">1 247 Startups</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Retraits prononcés :</span>
                <span className="font-mono text-rose-500 font-bold">− 64 labels (4.88%)</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Taux de maintien :</span>
                <strong className="text-emerald-700 font-bold">95.12% pérennité</strong>
              </div>
            </div>
          </div>

          <div className={`pt-3 border-t text-[11px] font-bold flex items-center justify-between ${
            activeStep === 4 ? 'border-white/10 text-purple-300' : 'border-purple-100 text-purple-700'
          }`}>
            <span>VOL-02 · Total Certifié</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Summary Formula Banner with clickable breakdown */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
            ∑
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider block">
              Synthèse Mathématique de l'Entonnoir
            </span>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              1 311 Labels = 1 216 Voie Directe (61.7%) + 95 Conversions de Pré-Labels (38.3% à 80.58% d'efficience)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenKPIByCode('FUN-02')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-indigo-200 hover:text-white transition-colors cursor-pointer"
          >
            Solde 121 Pré-labels
          </button>
          <button
            onClick={() => onOpenKPIByCode('ECO-01')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            Résilience 95.12%
          </button>
        </div>
      </div>
    </div>
  );
};
