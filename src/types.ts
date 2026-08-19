export interface SessionEntry {
  societe: string;
  fondateurs: string;
  secteur: string;
  resultat: string;
  decision: 'label' | 'prelabel' | 'refused' | 'retrait' | 'ajourne' | 'unknown' | string;
}

export interface SessionData {
  id: number;
  session: string; // e.g. "03/2019"
  annee: number;
  mois: number;
  candidatures: number;
  labels: number;
  newLabels: number;
  preLabels: number;
  conversions: number;
  retraits: number;
  tauxPct: number;
  tauxEchec: number;
  statut: 'conforme' | 'corrigé' | string;
  commentaires: string;
  pdf: string;
  pdfUrl: string;
  entriesCount: number;
  entries: SessionEntry[];
}

export interface StartupItem {
  name: string;
  sessions: string[];
  decisions: string[];
  founders: string[];
  secteur: string;
  status: 'Labellisée' | 'Pré-Label' | 'Retrait' | 'Candidat' | string;
}

export interface FounderItem {
  name: string;
  startups: string[];
  sessions: string[];
  secteurs: string[];
  isLabellise: boolean;
}

export interface YearlyStat {
  year: number | string;
  candidatures: number;
  labels: number;
  preLabels: number;
  nbSessions: number;
  tauxAcceptation: string | number;
  tauxEchec: string | number;
  conversions?: number;
  retraits?: number;
}

export interface SectorStat {
  name: string;
  count: number;
}

export interface DatasetMeta {
  nbSessions: number;
  totalCandidatures: number;
  totalLabels: number;
  totalNewLabels: number;
  totalPreLabels: number;
  totalConversions: number;
  preLabelsRestants: number;
  totalRetraits: number;
  tauxMoyenPct: number;
  conversionRatePct: number;
  uniqueStartupsCount: number;
  uniqueFoundersCount: number;
  correctedSessionsCount: number;
  firstSession: string;
  lastSession: string;
  verifiedDate: string;
}

export interface StartupActDataset {
  meta: DatasetMeta;
  yearlyStats: YearlyStat[];
  sectorStats: SectorStat[];
  parcours: {
    totalConversions: number;
    totalNewPreLabels: number;
    totalNewLabels: number;
    totalRetraits: number;
    totalLabels: number;
    convRate: number;
    pctLabelsFromConversions: number;
    sessionsWithConversions: number;
    sessionsWithRetraits: number;
    preLabelsRestants: number;
    preLabelsRestantsPct: number;
  };
  sessions: SessionData[];
  startups: StartupItem[];
  founders: FounderItem[];
}

export interface KPIDefinition {
  id: string;
  number: number;
  code: string;
  name: string;
  category: 'volumes' | 'funnel' | 'selectivity' | 'time' | 'demographics' | 'audit';
  categoryLabel: string;
  formula: string;
  formulaDescription: string;
  unit: string;
  getValue: (filteredSessions: SessionData[], meta: DatasetMeta, selectedYear: string) => number | string;
  benchmark?: string;
  utility: string;
  interpretation: string;
  decisionRole: string;
  sourceDoc: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'sessions_table' 
  | 'startups_table' 
  | 'founders_table' 
  | 'parite_genre' 
  | 'session_explorer' 
  | 'session_comparison' 
  | 'kpi_catalog' 
  | 'multi_tour_analytics' 
  | 'documents_pvs' 
  | 'audit_verification' 
  | 'export_center' 
  | 'about';

