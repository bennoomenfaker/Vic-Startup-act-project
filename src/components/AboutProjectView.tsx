import React from 'react';
import { 
  Building2, 
  Award, 
  Layers, 
  GraduationCap, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldCheck, 
  ExternalLink, 
  Code2, 
  Database, 
  Sparkles, 
  Users2, 
  Compass, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  FileText, 
  Scale, 
  Lightbulb, 
  Briefcase, 
  Check,
  ArrowRight,
  Download
} from 'lucide-react';
import { META_DATA } from '../data/dataset';
import { ActiveTab } from '../types';

interface AboutProjectViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8 pb-16" id="about-project-container">
      {/* 1. Hero Presentation Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-10 shadow-soft-lg border border-indigo-900/60 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recherche Académique & Ingénierie de Données (VIC 2026)</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ESEN • ISCAE Manouba
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Observatoire & Audit Analytique du Startup Act Tunisie
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Projet universitaire et analytique dédié à l'extraction, la vérification unitaire et la valorisation interactive des <strong>85 procès-verbaux officiels</strong> du Collège des Startups (Mars 2019 — Mars 2026), réconciliant le total authentique de <strong>1 311 labels</strong>, <strong>623 pré-labels</strong> et <strong>2 958 candidatures</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Accéder au Dashboard Neostate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('export_center')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Télécharger la Base Master</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Figures Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Sessions Auditées</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">85</span>
          <span className="text-[11px] text-indigo-600 font-semibold">Mars 2019 — Mars 2026</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Labels Accordés</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-1 block">1 311</span>
          <span className="text-[11px] text-purple-600 font-semibold">809 directs + 502 conv.</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Pré-Labels Accordés</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 block">623</span>
          <span className="text-[11px] text-amber-600 font-semibold">Idées & Amorçage</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
          <span className="text-xs font-bold text-slate-400 block uppercase">Candidatures Évaluées</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 block">2 958</span>
          <span className="text-[11px] text-emerald-600 font-semibold">44.3% taux de succès</span>
        </div>
      </div>

      {/* 3. Section 1 : Le Cadre Légal du Startup Act Tunisie */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">1. Le Cadre Légal : La Loi n° 2018-20 (Startup Act)</h2>
            <p className="text-xs text-slate-500">Un dispositif juridique pionnier pour propulser l'entrepreneuriat innovant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <p>
              Promulgué le <strong>17 avril 2018</strong>, le <em>Startup Act Tunisie</em> (Loi n° 2018-20) est un cadre juridique d'avant-garde conçu pour faciliter le lancement, le développement et l'internationalisation des startups tunisiennes.
            </p>
            <p>
              Il accorde aux porteurs de projets et aux entreprises labellisées un ensemble d'avantages fiscaux, financiers, douaniers et administratifs afin de lever les freins historiques à l'innovation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 text-xs block mb-1">🎯 5 Critères de Labellisation</span>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• Âge inférieur à 8 ans</li>
                  <li>• Effectif &lt; 100 salariés et Total bilan &lt; 15 MDT</li>
                  <li>• Capital détenu à &gt; 2/3 par des personnes physiques</li>
                  <li>• Modèle économique innovant & scalable</li>
                  <li>• Potentiel de croissance économique élevé</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 text-xs block mb-1">🎁 Principaux Avantages Accordés</span>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• <strong>Bourse de Startup</strong> pour les fondateurs (jusqu'à 5k DT/mois)</li>
                  <li>• <strong>Congé pour création</strong> (1 an renouvelable)</li>
                  <li>• <strong>Prise en charge des charges patronales</strong> (CNSS)</li>
                  <li>• <strong>Compte spécial en devises</strong> libre d'utilisation</li>
                  <li>• <strong>Exonération sur les plus-values</strong> de cession</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Pillar Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 text-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                Processus d'Octroi du Label
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Les 3 Statuts Officiels</h3>
              
              <div className="space-y-2.5 mt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100/80">
                  <span className="font-bold text-amber-700 block">1. Le Pré-Label</span>
                  <span className="text-[11px] text-slate-500">Pour les projets en phase idée / amorçage avant la création juridique. Valable 6 mois.</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-indigo-100/80">
                  <span className="font-bold text-purple-700 block">2. Le Label Startup</span>
                  <span className="text-[11px] text-slate-500">Attribué aux sociétés légalement constituées. Valable 8 ans avec suivi annuel.</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-indigo-100/80">
                  <span className="font-bold text-emerald-700 block">3. La Conversion</span>
                  <span className="text-[11px] text-slate-500">Passage réussi d'un Pré-label à un Label plein après immatriculation (502 cas).</span>
                </div>
              </div>
            </div>

            <a
              href="https://startup.gov.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-xs font-bold text-indigo-700 hover:text-indigo-800 pt-2 border-t border-indigo-100"
            >
              <span>Portail officiel startup.gov.tn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Section 2 : Le Collège des Startups & 85 Sessions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">2. Le Collège des Startups & les 85 Procès-Verbaux</h2>
            <p className="text-xs text-slate-500">L'instance décisionnelle collégiale et indépendante</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Composition Paritaire</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Le Collège est composé de 9 membres : 4 représentants de l'administration et des structures d'appui, et 5 experts indépendants de l'écosystème entrepreneurial et des investisseurs en capital-risque (VCs).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Rythme Mensuel Strict</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Depuis <strong>Mars 2019</strong>, le Collège se réunit chaque mois pour évaluer les dossiers soumis. Au total, <strong>85 sessions officielles</strong> se sont tenues sans interruption jusqu'à Mars 2026.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparence & PVs Publics</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Chaque session fait l'objet d'un procès-verbal public signé énumérant nominativement les startups candidates, les décisions prises (accord, ajournement, refus, retrait) et les déclarations de conflits d'intérêts.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Section 3 : Objectifs du Projet de Recherche (VIC / ESEN / ISCAE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">3. Contexte Académique, Auteur & Objectifs du Projet</h2>
            <p className="text-xs text-slate-500">Initiative de recherche et d'ingénierie de données (VIC 2026 - ESEN / ISCAE)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <p>
              Ce projet a été développé par <strong>Faker Ben Noomen</strong> dans le cadre des travaux de recherche appliquée et d'innovation (VIC - Virtual Innovation Challenge 2026) en partenariat avec l'<strong>ESEN</strong> (École Supérieure d'Économie Numérique) et l'<strong>ISCAE</strong> (Institut Supérieur de Comptabilité et d'Administration des Entreprises de Manouba).
            </p>

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">
              Les 4 Objectifs Majeurs du Projet :
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>1. Audit & Fiabilisation Exhaustive :</strong> Corriger les 21 sessions problématiques et les erreurs de parsing PDF pour établir une vérité terrain incontestable (1 311 labels réels).</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>2. Démocratisation de l'Open Data :</strong> Rendre toutes les données requêtables et téléchargeables en formats ouverts (Excel multi-feuilles, SQL relationnel et JSON).</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>3. Visualisation Haute Performance :</strong> Offrir aux chercheurs, décideurs et investisseurs un tableau de bord analytique dynamique (style Neostate/Orbitus) avec filtres globaux.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>4. Annuaire Structuré des Fondateurs & Startups :</strong> Cartographier 2 630 entités et 4 764 fondateurs pour mesurer la dynamique entrepreneuriale par secteur et millésime.</span>
              </div>
            </div>
          </div>

          {/* Repo & Tech Stack Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-900 block flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Stack Technique & Références du Projet</span>
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Framework Frontend</span>
                <span className="font-bold text-slate-800">React 18 + Vite + TypeScript</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Design System</span>
                <span className="font-bold text-slate-800">Tailwind CSS + Neostate UI Style</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Moteur Graphique</span>
                <span className="font-bold text-slate-800">Recharts + SVG Custom Sparklines</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Moteur d'Export</span>
                <span className="font-bold text-slate-800">SheetJS (xlsx) + DDL/DML SQL Chunker</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Validation des Données</span>
                <span className="font-bold text-emerald-700">Audit 85 PVs Ministériels</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://github.com/bennoomenfaker/vic-2026-startup-act"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub : bennoomenfaker/vic-2026-startup-act</span>
                <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
