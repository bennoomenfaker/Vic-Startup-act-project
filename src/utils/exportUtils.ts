import * as XLSX from 'xlsx';
import { SessionData, StartupItem, FounderItem, StartupActDataset } from '../types';
import { AUDITED_CORRECTIONS, YEARLY_STATS, COMPREHENSIVE_YEARLY_STATS } from '../data/dataset';
import { getAll85SessionsGenderData, SECTOR_GENDER_DATA, YEARLY_GENDER_DATA, GENDER_MACRO_STATS } from '../data/genderData';
import { KPI_CATALOG } from '../data/kpiCatalog';

/**
 * Trigger browser file download for a Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export any JavaScript object or array as a formatted JSON file
 */
export function exportToJSON(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

/**
 * Export multi-sheet or single-sheet data into an Excel .xlsx workbook
 */
export function exportToExcel(sheets: { sheetName: string; data: any[] }[], filename: string) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, data }) => {
    // Sanitize sheet name (max 31 chars, no special forbidden chars in Excel)
    const cleanName = sheetName.replace(/[:\\/?*[\]]/g, '_').substring(0, 31);
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, cleanName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Export SQL script as a .sql file
 */
export function exportToSQL(sqlContent: string, filename: string) {
  const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.sql') ? filename : `${filename}.sql`);
}

/**
 * SQL Escaper helper
 */
function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val).replace(/'/g, "''").replace(/\\/g, '\\\\');
  return `'${str}'`;
}

/**
 * Generate Complete SQL Schema and INSERT statements for the entire dataset
 * Including Gender Parity tables (Sessions & Secteurs) and the 50 KPIs
 */
export function generateCompleteSQL(dataset: StartupActDataset): string {
  const lines: string[] = [];

  lines.push(`-- =========================================================================`);
  lines.push(`-- STARTUP ACT TUNISIE (2019 - 2026) - BASE DE DONNÉES COMPLÈTE & CERTIFIÉE`);
  lines.push(`-- Généré le : ${new Date().toISOString()}`);
  lines.push(`-- Métriques Officielles : 85 Sessions, 1 311 Labels, 623 Pré-labels, 3 015 Candidatures`);
  lines.push(`-- Démographie : 4 764 Fondateurs (1 153 Femmes, 3 611 Hommes)`);
  lines.push(`-- =========================================================================\n`);

  lines.push(`-- 1. Nettoyage des anciennes tables`);
  lines.push(`DROP TABLE IF EXISTS kpi_catalogue CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS genre_parite_sessions CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS genre_parite_secteurs CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS session_dossiers CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS startup_founders CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS startups CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS founders CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS audit_corrections CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS yearly_stats CASCADE;`);
  lines.push(`DROP TABLE IF EXISTS sessions CASCADE;\n`);

  lines.push(`-- 2. Table des 85 Sessions`);
  lines.push(`CREATE TABLE sessions (`);
  lines.push(`  id INT PRIMARY KEY,`);
  lines.push(`  session_code VARCHAR(10) NOT NULL UNIQUE,`);
  lines.push(`  annee INT NOT NULL,`);
  lines.push(`  mois INT NOT NULL,`);
  lines.push(`  candidatures INT NOT NULL,`);
  lines.push(`  labels INT NOT NULL,`);
  lines.push(`  new_labels INT NOT NULL,`);
  lines.push(`  pre_labels INT NOT NULL,`);
  lines.push(`  conversions INT NOT NULL,`);
  lines.push(`  retraits INT NOT NULL,`);
  lines.push(`  taux_pct DECIMAL(5,2) NOT NULL,`);
  lines.push(`  taux_echec DECIMAL(5,2) NOT NULL,`);
  lines.push(`  statut VARCHAR(20) NOT NULL,`);
  lines.push(`  commentaires TEXT,`);
  lines.push(`  pdf_filename VARCHAR(255),`);
  lines.push(`  pdf_url TEXT`);
  lines.push(`);\n`);

  lines.push(`-- 3. Table de Parité et Genre par Session (85 Sessions)`);
  lines.push(`CREATE TABLE genre_parite_sessions (`);
  lines.push(`  session_id INT PRIMARY KEY REFERENCES sessions(id),`);
  lines.push(`  session_code VARCHAR(10) NOT NULL,`);
  lines.push(`  annee INT NOT NULL,`);
  lines.push(`  total_founders INT NOT NULL,`);
  lines.push(`  femmes INT NOT NULL,`);
  lines.push(`  hommes INT NOT NULL,`);
  lines.push(`  pct_femmes DECIMAL(5,2) NOT NULL,`);
  lines.push(`  ratio_hf DECIMAL(5,2) NOT NULL,`);
  lines.push(`  startups_count INT NOT NULL,`);
  lines.push(`  startups_with_women INT NOT NULL,`);
  lines.push(`  pct_startups_with_women DECIMAL(5,2) NOT NULL,`);
  lines.push(`  all_women_startups INT NOT NULL,`);
  lines.push(`  top_sector_women VARCHAR(100)`);
  lines.push(`);\n`);

  lines.push(`-- 4. Table de Parité et Genre par Secteur (10 Secteurs)`);
  lines.push(`CREATE TABLE genre_parite_secteurs (`);
  lines.push(`  id SERIAL PRIMARY KEY,`);
  lines.push(`  secteur VARCHAR(150) NOT NULL UNIQUE,`);
  lines.push(`  total_founders INT NOT NULL,`);
  lines.push(`  femmes INT NOT NULL,`);
  lines.push(`  hommes INT NOT NULL,`);
  lines.push(`  pct_femmes DECIMAL(5,2) NOT NULL,`);
  lines.push(`  ratio_hf DECIMAL(5,2) NOT NULL,`);
  lines.push(`  startups_count INT NOT NULL,`);
  lines.push(`  pct_startups_mixtes DECIMAL(5,2) NOT NULL,`);
  lines.push(`  trend_description TEXT`);
  lines.push(`);\n`);

  lines.push(`-- 5. Table des Dossiers et Candidatures par Session`);
  lines.push(`CREATE TABLE session_dossiers (`);
  lines.push(`  id SERIAL PRIMARY KEY,`);
  lines.push(`  session_code VARCHAR(10) NOT NULL,`);
  lines.push(`  session_id INT REFERENCES sessions(id),`);
  lines.push(`  societe VARCHAR(255) NOT NULL,`);
  lines.push(`  fondateurs TEXT,`);
  lines.push(`  secteur VARCHAR(100),`);
  lines.push(`  resultat TEXT,`);
  lines.push(`  decision VARCHAR(50) NOT NULL`);
  lines.push(`);\n`);

  lines.push(`-- 6. Table des Startups`);
  lines.push(`CREATE TABLE startups (`);
  lines.push(`  id SERIAL PRIMARY KEY,`);
  lines.push(`  name VARCHAR(255) NOT NULL UNIQUE,`);
  lines.push(`  secteur VARCHAR(100),`);
  lines.push(`  status VARCHAR(50),`);
  lines.push(`  sessions TEXT[],`);
  lines.push(`  nb_sessions INT`);
  lines.push(`);\n`);

  lines.push(`-- 7. Table des Fondateurs`);
  lines.push(`CREATE TABLE founders (`);
  lines.push(`  id SERIAL PRIMARY KEY,`);
  lines.push(`  name VARCHAR(255) NOT NULL UNIQUE,`);
  lines.push(`  is_labellise BOOLEAN DEFAULT FALSE,`);
  lines.push(`  nb_startups INT DEFAULT 1`);
  lines.push(`);\n`);

  lines.push(`-- 8. Table d'Association Startup - Fondateur`);
  lines.push(`CREATE TABLE startup_founders (`);
  lines.push(`  startup_name VARCHAR(255) NOT NULL,`);
  lines.push(`  founder_name VARCHAR(255) NOT NULL,`);
  lines.push(`  PRIMARY KEY (startup_name, founder_name)`);
  lines.push(`);\n`);

  lines.push(`-- 9. Table des 50 KPIs Métriques et Décisionnels`);
  lines.push(`CREATE TABLE kpi_catalogue (`);
  lines.push(`  code VARCHAR(20) PRIMARY KEY,`);
  lines.push(`  number INT NOT NULL,`);
  lines.push(`  name VARCHAR(255) NOT NULL,`);
  lines.push(`  category VARCHAR(50) NOT NULL,`);
  lines.push(`  formula TEXT NOT NULL,`);
  lines.push(`  unit VARCHAR(50) NOT NULL,`);
  lines.push(`  benchmark TEXT,`);
  lines.push(`  utility TEXT,`);
  lines.push(`  interpretation TEXT,`);
  lines.push(`  decision_role TEXT,`);
  lines.push(`  source_doc TEXT`);
  lines.push(`);\n`);

  lines.push(`-- 10. Table des Statistiques Annuelles`);
  lines.push(`CREATE TABLE yearly_stats (`);
  lines.push(`  year INT PRIMARY KEY,`);
  lines.push(`  nb_sessions INT NOT NULL,`);
  lines.push(`  candidatures INT NOT NULL,`);
  lines.push(`  labels INT NOT NULL,`);
  lines.push(`  pre_labels INT NOT NULL,`);
  lines.push(`  conversions INT,`);
  lines.push(`  retraits INT,`);
  lines.push(`  taux_acceptation DECIMAL(5,2),`);
  lines.push(`  taux_echec DECIMAL(5,2)`);
  lines.push(`);\n`);

  lines.push(`-- 11. Table des 21 Corrections Documentées & Audit`);
  lines.push(`CREATE TABLE audit_corrections (`);
  lines.push(`  session_code VARCHAR(10) PRIMARY KEY,`);
  lines.push(`  scraped_labels INT,`);
  lines.push(`  scraped_prelabels INT,`);
  lines.push(`  scraped_candidatures INT,`);
  lines.push(`  audited_labels INT,`);
  lines.push(`  audited_prelabels INT,`);
  lines.push(`  audited_candidatures INT,`);
  lines.push(`  diff_description TEXT,`);
  lines.push(`  cause_technique TEXT`);
  lines.push(`);\n`);

  lines.push(`-- =========================================================================`);
  lines.push(`-- INSERTIONS DE DONNÉES`);
  lines.push(`-- =========================================================================\n`);

  // Insert sessions
  lines.push(`-- Insertion des 85 Sessions Officielles`);
  lines.push(`INSERT INTO sessions (id, session_code, annee, mois, candidatures, labels, new_labels, pre_labels, conversions, retraits, taux_pct, taux_echec, statut, commentaires, pdf_filename, pdf_url) VALUES`);
  const sessionValues = dataset.sessions.map(s => {
    return `(${s.id}, ${escapeSql(s.session)}, ${s.annee}, ${s.mois}, ${s.candidatures}, ${s.labels}, ${s.newLabels}, ${s.preLabels}, ${s.conversions}, ${s.retraits}, ${s.tauxPct}, ${s.tauxEchec}, ${escapeSql(s.statut)}, ${escapeSql(s.commentaires)}, ${escapeSql(s.pdf)}, ${escapeSql(s.pdfUrl)})`;
  });
  lines.push(sessionValues.join(',\n') + ';\n');

  // Insert Parité & Genre (85 Sessions)
  lines.push(`-- Insertion des Métriques de Parité (85 Sessions)`);
  const gender85 = getAll85SessionsGenderData();
  lines.push(`INSERT INTO genre_parite_sessions (session_id, session_code, annee, total_founders, femmes, hommes, pct_femmes, ratio_hf, startups_count, startups_with_women, pct_startups_with_women, all_women_startups, top_sector_women) VALUES`);
  const genderValues = gender85.map(g => {
    return `(${g.id}, ${escapeSql(g.session)}, ${g.annee}, ${g.totalFounders}, ${g.femmes}, ${g.hommes}, ${g.pctFemmes}, ${g.ratioHF}, ${g.startupsCount}, ${g.startupsWithWomen}, ${g.pctStartupsWithWomen}, ${g.allWomenStartups}, ${escapeSql(g.topSectorWomen)})`;
  });
  lines.push(genderValues.join(',\n') + ';\n');

  // Insert Parité par Secteur
  lines.push(`-- Insertion des Métriques de Parité (10 Secteurs)`);
  lines.push(`INSERT INTO genre_parite_secteurs (secteur, total_founders, femmes, hommes, pct_femmes, ratio_hf, startups_count, pct_startups_mixtes, trend_description) VALUES`);
  const sectorGenderValues = SECTOR_GENDER_DATA.map(sec => {
    return `(${escapeSql(sec.sector)}, ${sec.totalFounders}, ${sec.femmes}, ${sec.hommes}, ${sec.pctFemmes}, ${sec.ratioHF}, ${sec.startupsCount}, ${sec.pctStartupsMixtes}, ${escapeSql(sec.growthTrend)})`;
  });
  lines.push(sectorGenderValues.join(',\n') + ';\n');

  // Insert KPI Catalogue
  lines.push(`-- Insertion du Catalogue des 50 KPIs`);
  lines.push(`INSERT INTO kpi_catalogue (code, number, name, category, formula, unit, benchmark, utility, interpretation, decision_role, source_doc) VALUES`);
  const kpiValues = KPI_CATALOG.map(k => {
    return `(${escapeSql(k.code)}, ${k.number}, ${escapeSql(k.name)}, ${escapeSql(k.category)}, ${escapeSql(k.formula)}, ${escapeSql(k.unit)}, ${escapeSql(k.benchmark || '')}, ${escapeSql(k.utility)}, ${escapeSql(k.interpretation)}, ${escapeSql(k.decisionRole)}, ${escapeSql(k.sourceDoc)})`;
  });
  lines.push(kpiValues.join(',\n') + ';\n');

  // Insert session dossiers
  lines.push(`-- Insertion des Dossiers et Décisions par Session`);
  const dossierRows: string[] = [];
  dataset.sessions.forEach(s => {
    s.entries.forEach(e => {
      dossierRows.push(`(${escapeSql(s.session)}, ${s.id}, ${escapeSql(e.societe)}, ${escapeSql(e.fondateurs)}, ${escapeSql(e.secteur)}, ${escapeSql(e.resultat)}, ${escapeSql(e.decision)})`);
    });
  });

  if (dossierRows.length > 0) {
    for (let i = 0; i < dossierRows.length; i += 500) {
      const chunk = dossierRows.slice(i, i + 500);
      lines.push(`INSERT INTO session_dossiers (session_code, session_id, societe, fondateurs, secteur, resultat, decision) VALUES`);
      lines.push(chunk.join(',\n') + ';\n');
    }
  }

  // Insert Startups
  lines.push(`-- Insertion des Startups`);
  const startupRows = dataset.startups.map(st => {
    const sessStr = `{${st.sessions.map(s => `"${s}"`).join(',')}}`;
    return `(${escapeSql(st.name)}, ${escapeSql(st.secteur || 'Non spécifié')}, ${escapeSql(st.status)}, ${escapeSql(sessStr)}, ${st.sessions.length})`;
  });

  for (let i = 0; i < startupRows.length; i += 500) {
    const chunk = startupRows.slice(i, i + 500);
    lines.push(`INSERT INTO startups (name, secteur, status, sessions, nb_sessions) VALUES`);
    lines.push(chunk.join(',\n') + ';\n');
  }

  // Insert Founders
  lines.push(`-- Insertion des Fondateurs`);
  const founderRows = dataset.founders.map(f => {
    return `(${escapeSql(f.name)}, ${f.isLabellise ? 'TRUE' : 'FALSE'}, ${f.startups.length})`;
  });

  for (let i = 0; i < founderRows.length; i += 500) {
    const chunk = founderRows.slice(i, i + 500);
    lines.push(`INSERT INTO founders (name, is_labellise, nb_startups) VALUES`);
    lines.push(chunk.join(',\n') + ';\n');
  }

  // Insert Yearly Stats
  lines.push(`-- Insertion des Statistiques Annuelles`);
  lines.push(`INSERT INTO yearly_stats (year, nb_sessions, candidatures, labels, pre_labels, conversions, retraits, taux_acceptation, taux_echec) VALUES`);
  const yearlyRows = COMPREHENSIVE_YEARLY_STATS.map(y => {
    return `(${y.year}, ${y.nbSessions}, ${y.candidatures}, ${y.labels}, ${y.preLabels}, ${y.conversions}, ${y.retraits}, ${y.tauxAcceptation}, ${y.tauxEchec})`;
  });
  lines.push(yearlyRows.join(',\n') + ';\n');

  // Insert Audit Corrections
  lines.push(`-- Insertion des 21 Rectifications d'Audit`);
  lines.push(`INSERT INTO audit_corrections (session_code, scraped_labels, scraped_prelabels, scraped_candidatures, audited_labels, audited_prelabels, audited_candidatures, diff_description, cause_technique) VALUES`);
  const auditRows = AUDITED_CORRECTIONS.map(a => {
    return `(${escapeSql(a.session)}, ${a.scraped.labels}, ${a.scraped.prelabels}, ${a.scraped.candidatures}, ${a.audited.labels}, ${a.audited.prelabels}, ${a.audited.candidatures}, ${escapeSql(a.diff)}, ${escapeSql(a.cause)})`;
  });
  lines.push(auditRows.join(',\n') + ';\n');

  return lines.join('\n');
}

/**
 * Generate SQL for a Single Session
 */
export function generateSingleSessionSQL(session: SessionData): string {
  const lines: string[] = [];
  lines.push(`-- Données Officielles pour la Session ${session.session} (${session.annee}-${session.mois})`);
  lines.push(`-- Fichier Source : ${session.pdf}\n`);

  lines.push(`INSERT INTO sessions (id, session_code, annee, mois, candidatures, labels, new_labels, pre_labels, conversions, retraits, taux_pct, taux_echec, statut, commentaires, pdf_filename, pdf_url)`);
  lines.push(`VALUES (${session.id}, ${escapeSql(session.session)}, ${session.annee}, ${session.mois}, ${session.candidatures}, ${session.labels}, ${session.newLabels}, ${session.preLabels}, ${session.conversions}, ${session.retraits}, ${session.tauxPct}, ${session.tauxEchec}, ${escapeSql(session.statut)}, ${escapeSql(session.commentaires)}, ${escapeSql(session.pdf)}, ${escapeSql(session.pdfUrl)});\n`);

  if (session.entries && session.entries.length > 0) {
    lines.push(`-- ${session.entries.length} Dossiers examinés lors de cette session`);
    lines.push(`INSERT INTO session_dossiers (session_code, session_id, societe, fondateurs, secteur, resultat, decision) VALUES`);
    const entriesRows = session.entries.map(e => {
      return `(${escapeSql(session.session)}, ${session.id}, ${escapeSql(e.societe)}, ${escapeSql(e.fondateurs)}, ${escapeSql(e.secteur)}, ${escapeSql(e.resultat)}, ${escapeSql(e.decision)})`;
    });
    lines.push(entriesRows.join(',\n') + ';\n');
  }

  return lines.join('\n');
}

/**
 * Export All Data into a Master Excel Workbook (8 Tabs)
 */
export function exportAllDataExcel(dataset: StartupActDataset) {
  // Sheet 1: 85 Sessions
  const sessionsData = dataset.sessions.map(s => ({
    'ID': s.id,
    'Session': s.session,
    'Année': s.annee,
    'Mois': s.mois,
    'Candidatures': s.candidatures,
    'Labels Total': s.labels,
    'Nouveaux Labels': s.newLabels,
    'Pré-Labels': s.preLabels,
    'Conversions': s.conversions,
    'Retraits': s.retraits,
    'Taux Acceptation (%)': s.tauxPct,
    'Taux Rejet (%)': s.tauxEchec,
    'Statut': s.statut,
    'Commentaires': s.commentaires,
    'PDF': s.pdf
  }));

  // Sheet 2: Parité & Genre (85 Sessions)
  const gender85Data = getAll85SessionsGenderData().map(g => ({
    'ID': g.id,
    'Session': g.session,
    'Année': g.annee,
    'Mois': g.mois,
    'Candidatures': g.candidatures,
    'Labels': g.labels,
    'Total Fondateurs': g.totalFounders,
    'Femmes': g.femmes,
    'Hommes': g.hommes,
    'Part Femmes (%)': g.pctFemmes,
    'Ratio Hommes/Femmes': g.ratioHF,
    'Startups Total': g.startupsCount,
    'Startups avec Femmes': g.startupsWithWomen,
    'Part Startups Mixtes (%)': g.pctStartupsWithWomen,
    'Startups 100% Féminines': g.allWomenStartups,
    'Secteur Féminin Dominant': g.topSectorWomen
  }));

  // Sheet 3: Parité (10 Secteurs)
  const sectorGenderData = SECTOR_GENDER_DATA.map(sec => ({
    'Secteur': sec.sector,
    'Total Fondateurs': sec.totalFounders,
    'Femmes': sec.femmes,
    'Hommes': sec.hommes,
    'Part Femmes (%)': sec.pctFemmes,
    'Ratio H/F': sec.ratioHF,
    'Startups': sec.startupsCount,
    'Part Startups Mixtes (%)': sec.pctStartupsMixtes,
    'Tendance & Dynamique': sec.growthTrend
  }));

  // Sheet 4: Catalogue des 50 KPIs
  const kpiData = KPI_CATALOG.map(k => ({
    'Code': k.code,
    'N°': k.number,
    'Nom du KPI': k.name,
    'Catégorie': k.categoryLabel,
    'Formule Mathématique': k.formula,
    'Description Formule': k.formulaDescription,
    'Unité': k.unit,
    'Benchmark': k.benchmark || 'N/A',
    'Utilité': k.utility,
    'Interprétation': k.interpretation,
    'Rôle de Décision': k.decisionRole,
    'Source Officielle': k.sourceDoc
  }));

  // Sheet 5: Startups (2630)
  const startupsData = dataset.startups.map(st => ({
    'Nom Startup': st.name,
    'Secteur': st.secteur || 'Non spécifié',
    'Statut Final': st.status,
    'Sessions': st.sessions.join(', '),
    'Nombre de Passages': st.sessions.length,
    'Fondateurs': st.founders.join(', ')
  }));

  // Sheet 6: Fondateurs (4764)
  const foundersData = dataset.founders.map(f => ({
    'Nom Fondateur': f.name,
    'Labellisé': f.isLabellise ? 'Oui' : 'Non',
    'Startups Associées': f.startups.join(', '),
    'Nombre de Startups': f.startups.length,
    'Sessions': f.sessions.join(', '),
    'Secteurs': f.secteurs.join(', ')
  }));

  // Sheet 7: Toutes les Candidatures Détaillées (3015)
  const allDossiersData: any[] = [];
  dataset.sessions.forEach(s => {
    s.entries.forEach(e => {
      allDossiersData.push({
        'Session': s.session,
        'Année': s.annee,
        'Société': e.societe,
        'Fondateurs': e.fondateurs,
        'Secteur': e.secteur,
        'Résultat Officiel': e.resultat,
        'Type Décision': e.decision
      });
    });
  });

  // Sheet 8: Audit & 21 Corrections
  const auditData = AUDITED_CORRECTIONS.map(a => ({
    'Session': a.session,
    'Scrapé Brut (Labels)': a.scraped.labels,
    'Scrapé Brut (Pré-labels)': a.scraped.prelabels,
    'Scrapé Brut (Candidatures)': a.scraped.candidatures,
    'Audit Réel (Labels)': a.audited.labels,
    'Audit Réel (Pré-labels)': a.audited.prelabels,
    'Audit Réel (Candidatures)': a.audited.candidatures,
    'Écart Corrigé': a.diff,
    'Cause Technique': a.cause
  }));

  // Sheet 9: Synthèse Temporelle Annuelle (2019 - 2026)
  const yearlyData = COMPREHENSIVE_YEARLY_STATS.map(y => ({
    'Année': y.year,
    'Nombre de Sessions': y.nbSessions,
    'Plage des Sessions': y.sessionRange,
    'Candidatures Examinées': y.candidatures,
    'Labels Accordés (Total)': y.labels,
    'Nouveaux Labels': y.newLabels,
    'Pré-Labels Accordés': y.preLabels,
    'Conversions Actées': y.conversions,
    'Retraits Prononcés': y.retraits,
    'Taux d\'Acceptation (%)': y.tauxAcceptation,
    'Taux de Rejet (%)': y.tauxEchec
  }));

  exportToExcel([
    { sheetName: '85 Sessions', data: sessionsData },
    { sheetName: 'Synthese Annuelle 2019-2026', data: yearlyData },
    { sheetName: 'Parite Genre 85 Sessions', data: gender85Data },
    { sheetName: 'Parite 10 Secteurs', data: sectorGenderData },
    { sheetName: 'Catalogue 50 KPIs', data: kpiData },
    { sheetName: 'Toutes Candidatures', data: allDossiersData },
    { sheetName: 'Startups (2630)', data: startupsData },
    { sheetName: 'Fondateurs (4764)', data: foundersData },
    { sheetName: 'Audit 21 Corrections', data: auditData }
  ], 'startup_act_tunisie_donnees_completes.xlsx');
}

/**
 * Export Gender Parity Data in Excel
 */
export function exportGenderParityExcel() {
  const gender85Data = getAll85SessionsGenderData().map(g => ({
    'ID Session': g.id,
    'Code Session': g.session,
    'Libellé Session': g.sessionName,
    'Année': g.annee,
    'Mois': g.mois,
    'Candidatures': g.candidatures,
    'Labels Accordés': g.labels,
    'Total Fondateurs': g.totalFounders,
    'Femmes Fondatrices': g.femmes,
    'Hommes Fondateurs': g.hommes,
    'Part Femmes (%)': g.pctFemmes,
    'Ratio Hommes/Femmes': g.ratioHF,
    'Startups Total': g.startupsCount,
    'Startups avec Femmes (Mixtes)': g.startupsWithWomen,
    'Part Startups Mixtes (%)': g.pctStartupsWithWomen,
    'Startups 100% Féminines': g.allWomenStartups,
    'Secteur Féminin Dominant': g.topSectorWomen
  }));

  const sectorGenderData = SECTOR_GENDER_DATA.map(sec => ({
    'Secteur': sec.sector,
    'Total Fondateurs': sec.totalFounders,
    'Femmes Fondatrices': sec.femmes,
    'Hommes Fondateurs': sec.hommes,
    'Part Femmes (%)': sec.pctFemmes,
    'Ratio Hommes/Femmes': sec.ratioHF,
    'Startups': sec.startupsCount,
    'Part Startups Mixtes (%)': sec.pctStartupsMixtes,
    'Dynamique & Ancrage': sec.growthTrend
  }));

  const yearlyGenderData = YEARLY_GENDER_DATA.map(y => ({
    'Année': y.year,
    'Total Fondateurs': y.totalFounders,
    'Femmes Fondatrices': y.femmes,
    'Hommes Fondateurs': y.hommes,
    'Part Femmes (%)': y.pctFemmes,
    'Ratio Hommes/Femmes': y.ratioHF,
    'Startups Total': y.startupsTotal,
    'Startups avec Femmes': y.startupsWithWomen,
    'Part Startups Mixtes (%)': y.pctStartupsWithWomen,
    'Évolution Annuelle': y.growthPct
  }));

  exportToExcel([
    { sheetName: '85 Sessions Parite', data: gender85Data },
    { sheetName: '10 Secteurs Parite', data: sectorGenderData },
    { sheetName: 'Evolution Annuelle 2019-2026', data: yearlyGenderData }
  ], 'startup_act_parite_genre_et_demographie.xlsx');
}

/**
 * Export KPI Catalog in Excel
 */
export function exportKPICatalogExcel() {
  const kpiData = KPI_CATALOG.map(k => ({
    'Code': k.code,
    'N°': k.number,
    'Nom du KPI': k.name,
    'Catégorie': k.categoryLabel,
    'Formule Mathématique': k.formula,
    'Description Formule': k.formulaDescription,
    'Unité': k.unit,
    'Benchmark': k.benchmark || 'N/A',
    'Utilité Opérationnelle': k.utility,
    'Interprétation Analytique': k.interpretation,
    'Rôle dans la Décision': k.decisionRole,
    'Source Officielle': k.sourceDoc
  }));

  exportToExcel([
    { sheetName: '50 KPIs Startup Act', data: kpiData }
  ], 'startup_act_catalogue_50_kpis.xlsx');
}

/**
 * Export Single Session in Excel
 */
export function exportSingleSessionExcel(session: SessionData) {
  const infoData = [{
    'Code Session': session.session,
    'Année': session.annee,
    'Mois': session.mois,
    'Candidatures Examinées': session.candidatures,
    'Total Labels Accordés': session.labels,
    'Nouveaux Labels Directs': session.newLabels,
    'Pré-Labels Accordés': session.preLabels,
    'Conversions Pré-Label -> Label': session.conversions,
    'Retraits de Label': session.retraits,
    'Taux Acceptation (%)': session.tauxPct,
    'Taux Rejet (%)': session.tauxEchec,
    'Statut Audit': session.statut,
    'Observations & Notes': session.commentaires,
    'Nom Fichier PDF': session.pdf,
    'Lien PDF Officiel': session.pdfUrl
  }];

  const dossiersData = (session.entries || []).map((e, idx) => ({
    'N°': idx + 1,
    'Société / Projet': e.societe,
    'Fondateurs': e.fondateurs,
    'Secteur': e.secteur,
    'Résultat Officiel': e.resultat,
    'Classification Décision': e.decision
  }));

  const cleanSessionName = session.session.replace('/', '_');
  exportToExcel([
    { sheetName: `Session ${cleanSessionName}`, data: infoData },
    { sheetName: `Dossiers (${dossiersData.length})`, data: dossiersData }
  ], `startup_act_session_${cleanSessionName}.xlsx`);
}
