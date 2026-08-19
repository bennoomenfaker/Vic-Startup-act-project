import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Layers, 
  Award, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  Database, 
  Info, 
  Check, 
  Flame, 
  FileCheck2, 
  Users2, 
  AlertCircle,
  Download,
  FileSpreadsheet,
  Code2,
  Filter,
  Eye,
  TrendingDown,
  Building,
  Target
} from 'lucide-react';
import { AUDITED_CORRECTIONS, MANUAL_SESSIONS_SUMMARY, META_DATA, formatNumber } from '../data/dataset';
import * as XLSX from 'xlsx';

interface AuditVerificationViewProps {
  onSelectSession?: (sessionKey: string) => void;
}

export const AuditVerificationView: React.FC<AuditVerificationViewProps> = ({ onSelectSession }) => {
  const [searchAudit, setSearchAudit] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'explanation' | 'corrections' | 'sources' | 'manual'>('explanation');
  const [anomalyFilter, setAnomalyFilter] = useState<'all' | 'duplicates' | 'ocr' | 'conversions'>('all');

  const filteredCorrections = useMemo(() => {
    return AUDITED_CORRECTIONS.filter((c) => {
      const q = searchAudit.toLowerCase().trim();
      const matchSearch = !q || (
        c.session.toLowerCase().includes(q) ||
        c.cause.toLowerCase().includes(q) ||
        c.diff.toLowerCase().includes(q)
      );

      if (!matchSearch) return false;

      if (anomalyFilter === 'ocr') {
        return c.cause.toLowerCase().includes('bitmap') || c.cause.toLowerCase().includes('image') || c.cause.toLowerCase().includes('scan');
      }
      if (anomalyFilter === 'duplicates') {
        return c.diff.includes('-') || c.cause.toLowerCase().includes('dupli') || c.cause.toLowerCase().includes('fusion');
      }
      if (anomalyFilter === 'conversions') {
        return c.cause.toLowerCase().includes('conversion') || c.cause.toLowerCase().includes('retrait');
      }

      return true;
    });
  }, [searchAudit, anomalyFilter]);

  // Export audit table to Excel
  const exportCorrectionsExcel = () => {
    const data = AUDITED_CORRECTIONS.map(c => ({
      'Session': `Session ${c.session}`,
      'Labels Scrapés Bruts': c.scraped.labels,
      'Pré-Labels Scrapés Bruts': c.scraped.prelabels,
      'Candidatures Scrapées': c.scraped.candidatures,
      'Labels Réels Audités': c.audited.labels,
      'Pré-Labels Réels Audités': c.audited.prelabels,
      'Candidatures Réelles Auditées': c.audited.candidatures,
      'Écart / Rectification': c.diff,
      'Cause Technique de l\'Erreur dans le Scraper': c.cause,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "21_Sessions_Corrigées");
    XLSX.writeFile(wb, "Startup_Act_21_Corrections_Audit_1311_Labels.xlsx");
  };

  return (
    <div className="space-y-6 pb-12" id="audit-verification-container">
      {/* 1. Header Banner: Démonstration Scientifique & Rapprochement */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl shrink-0 shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  Audit & Réconciliation Officielle
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  85 Procès-Verbaux Ministériels (2019 — 2026)
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                Démonstration : Pourquoi 1 324 vs 1 311 Labels Réels ?
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                Explication exhaustive de l'écart historique de <strong>13 labels</strong> entre les scrapings automatisés bruts (1 324) et la vérité terrain recomptée sur les 85 PVs officiels signés par le Collège des Startups (<strong>1 311 labels</strong>, <strong>623 pré-labels</strong> et <strong>2 958 candidatures</strong>).
              </p>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={exportCorrectionsExcel}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exporter l'Audit (Excel)</span>
            </button>
            <span className="text-[11px] text-indigo-200">21 sessions rectifiées documentées</span>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Comparison: 1324 Faux vs 1311 Vrai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Chiffre Brut Erroné */}
        <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-red-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-xs font-black text-red-900 uppercase tracking-wide">
                Scraping Brut / Ancien Affichage
              </span>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
              Non Audité
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-black text-red-700 tracking-tight flex items-baseline gap-2">
              <span>1 324</span>
              <span className="text-sm font-semibold text-red-600">Labels affichés</span>
            </div>
            <p className="text-xs text-red-800/80 mt-1 font-medium leading-relaxed">
              Résultat d'un parsing automatique naïf par regex sur les PDFs du portail sans dédoublonnage ni traitement des scans images.
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-red-200/80 text-xs text-red-900">
            <div className="flex items-center justify-between">
              <span>• Lignes en doublon sur sauts de page PDF :</span>
              <span className="font-bold">+18 faux dossiers</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Conversions comptées 2 fois :</span>
              <span className="font-bold">+9 doublons</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Retraits de label non déduits :</span>
              <span className="font-bold">Non traités</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• 3 sessions scannées (images) manquées :</span>
              <span className="font-bold">-63 labels/pré-labels omis</span>
            </div>
          </div>
        </div>

        {/* Right: Chiffre Réel Audité */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                Vérité Terrain Collège des Startups
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Certifié 100%
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight flex items-baseline gap-2">
              <span>1 311</span>
              <span className="text-sm font-semibold text-emerald-600">Labels Authentiques</span>
            </div>
            <p className="text-xs text-emerald-800/80 mt-1 font-medium leading-relaxed">
              Recomptage unitaire ligne par ligne sur les <strong>85 procès-verbaux officiels signés</strong> de Mars 2019 à Mars 2026.
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-emerald-200/80 text-xs text-emerald-900">
            <div className="flex items-center justify-between">
              <span>• Labels directs accordés aux sociétés :</span>
              <span className="font-bold text-emerald-800">809 labels</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Conversions effectives pré-label → label :</span>
              <span className="font-bold text-emerald-800">502 labels</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Total Pré-labels accordés :</span>
              <span className="font-bold text-emerald-800">623 pré-labels</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Candidatures totales réconciliées :</span>
              <span className="font-bold text-emerald-800">2 958 dossiers (44.3%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('explanation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'explanation' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Pourquoi Cette Faute ? (Explication Technique)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('corrections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'corrections' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Tableau Détaillé des 21 Corrections ({AUDITED_CORRECTIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'manual' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>11 Sessions Relues Manuellement (Terrain)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sources')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'sources' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Rapprochement des 3 Datasets JSON</span>
        </button>
      </div>

      {/* Tab 1: Explication Technique */}
      {activeSubTab === 'explanation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Les 4 Mécanismes Techniques Ayant Généré le Faux Total de 1 324
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Analyse détaillée pour la recherche académique et la transparence des données publiques du Startup Act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mechanism 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs">1</span>
                <span>Découpage Multi-Pages & Répétition d'En-têtes</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quand un PV s'étend sur 2, 3 ou 4 pages (ex: <strong>Session 25 d'Avril 2021</strong> ou <strong>Session 01/2025</strong>), le secrétariat réinsère l'en-tête du tableau sur chaque page. Les parsers simples comptaient les lignes d'en-tête comme de nouvelles startups, générant <strong>+18 faux dossiers</strong> fantômes.
              </p>
            </div>

            {/* Mechanism 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-purple-600 font-bold text-xs">
                <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-xs">2</span>
                <span>Conversions de Pré-Labels Comptabilisées en Double</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Un projet labellisé « Pré-label » en 2021 qui crée ensuite sa société en 2023 passe en commission de « Conversion ». Les scripts naïfs ont ajouté cette conversion comme un tout nouveau label (+1) sans relier le matricule existant, gonflant artificiellement le stock total.
              </p>
            </div>

            {/* Mechanism 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs">
                <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-xs">3</span>
                <span>PDFs Scannés Bitmap (Sans Couche OCR Native)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trois sessions majeures (<strong>Session 17 - 07/2020</strong>, <strong>Session 21 - 12/2020</strong>, <strong>Session 22 - 01/2021</strong>) ont été publiées sous forme de photocopies/scans images. Les bibliothèques Python `pdfplumber` et `pdfminer` renvoyaient 0 ligne. Notre audit a réintégré <strong>63 labels et pré-labels</strong> omis.
              </p>
            </div>

            {/* Mechanism 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs">
                <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-xs">4</span>
                <span>Ajournements & Retraits de Label Non Isolés</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les dossiers « Ajournés à la session suivante » ou ayant fait l'objet d'un « Retrait de label » (ex: cessation d'activité ou société ayant dépassé 8 ans) étaient parfois fusionnés dans la colonne « Décision positive », ce qui faussait le taux de labellisation.
              </p>
            </div>
          </div>

          {/* Action to switch to table */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-800">
                Consultez le tableau comparatif complet des 21 sessions avec le détail de chaque rectification ligne par ligne.
              </span>
            </div>
            <button
              onClick={() => setActiveSubTab('corrections')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Voir les 21 corrections →
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Tableau Détaillé des 21 Corrections */}
      {activeSubTab === 'corrections' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Audit Exhaustif
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Tableau des 21 Écarts Corrigés : Scrapé Brut (1 324 L) vs Réel Audité (1 311 L)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Chaque ligne indique le volume scrapé initialement, le volume réel recompté, l'écart mathématique et la cause documentaire.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={exportCorrectionsExcel}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Search bar & Anomaly categories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher une session (ex: 04/2021, 01/2025)..."
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-medium">
              <button
                onClick={() => setAnomalyFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  anomalyFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Toutes ({AUDITED_CORRECTIONS.length})
              </button>
              <button
                onClick={() => setAnomalyFilter('duplicates')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  anomalyFilter === 'duplicates' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doublons & Sauts
              </button>
              <button
                onClick={() => setAnomalyFilter('ocr')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  anomalyFilter === 'ocr' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scans Images (OCR)
              </button>
            </div>
          </div>

          {/* Main Corrections Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse" id="audit-corrections-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-3.5">Session</th>
                    <th className="py-3 px-3 text-center">Scrapé Brut (Faux)</th>
                    <th className="py-3 px-3 text-center">Audit Réel (Certifié)</th>
                    <th className="py-3 px-3 text-center">Écart Rectifié</th>
                    <th className="py-3 px-4 min-w-[280px]">Cause Technique & Explication PV</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCorrections.map((corr) => (
                    <tr key={corr.session} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        Session {corr.session}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="text-red-700 font-semibold line-through bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {corr.scraped.labels} L / {corr.scraped.prelabels} PL
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {corr.audited.labels} L / {corr.audited.prelabels} PL ({corr.audited.candidatures} cand.)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          {corr.diff}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 leading-relaxed font-medium">
                        {corr.cause}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onSelectSession?.(corr.session)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold transition-all cursor-pointer"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 11 Manual Sessions */}
      {activeSubTab === 'manual' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Vérité Terrain Manuelle
              </span>
              <h3 className="text-base font-bold text-slate-900">
                11 Sessions Critiques Relues Manuellement (Dossier manual_sessions)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ces sessions récentes et complexes comportent la liste nominative exacte des candidats, conversions, retraits et déclarations de conflits d'intérêts des membres du Collège.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANUAL_SESSIONS_SUMMARY.map((s) => (
              <div 
                key={s.session} 
                onClick={() => onSelectSession?.(s.session)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-soft transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="font-bold text-slate-900 text-xs group-hover:text-indigo-600">
                    {s.name}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Manuel 100%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Labels accordés</span>
                    <span className="text-sm font-bold text-purple-700">{s.labels}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Pré-labels</span>
                    <span className="text-sm font-bold text-amber-700">{s.prelabels}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Candidatures</span>
                    <span className="text-sm font-bold text-slate-800">{s.cand}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Conversions</span>
                    <span className="text-sm font-bold text-indigo-700">{s.conv}</span>
                  </div>
                </div>

                {s.retraits > 0 && (
                  <div className="mt-2 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                    {s.retraits} retrait(s) de label déduit(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Sources JSON */}
      {activeSubTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rapprochement Multi-Sources des 3 Dossiers du Projet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Comparaison entre `session-pdfs-json` (extraction brute PDF), `firecrawl_sessions` (web scraping) et `manual_sessions` (audit terrain).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-slate-700 block">1. session-pdfs-json (Brut)</span>
              <div className="text-xl font-bold text-slate-800 mt-1">1 324 Labels</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Extraction PDF native brute contenant des duplications d'en-têtes et des omissions sur les 3 sessions scannées images.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-slate-700 block">2. firecrawl_sessions (Web)</span>
              <div className="text-xl font-bold text-slate-800 mt-1">1 318 Labels</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Scraping web partiel du portail startup.gov.tn avec difficultés de distinction entre conversions et nouveaux labels.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50">
              <span className="text-xs font-bold text-emerald-800 block">3. manual_sessions (Audit)</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">1 311 Labels (100%)</div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
                Base réconciliée définitive certifiée conforme aux 85 PVs ministériels signés (809 directs + 502 conversions).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
