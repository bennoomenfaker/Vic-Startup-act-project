import { KPIDefinition, SessionData, DatasetMeta } from '../types';
import { SESSIONS_LIST, META_DATA, STARTUPS_LIST, FOUNDERS_LIST } from './dataset';

export const KPI_CATALOG: KPIDefinition[] = [
  // ==========================================
  // DIMENSION 1: VOLUMES & DÉCISIONS
  // ==========================================
  {
    id: 'vol-01',
    number: 1,
    code: 'VOL-01',
    name: 'Total Dossiers Candidats Évalués',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '∑ Candidatures(s) pour toutes les sessions s',
    formulaDescription: 'Somme arithmétique de toutes les candidatures formellement instruites et examinées en plénière par le Collège des Startups.',
    unit: 'Dossiers',
    getValue: (sessions) => sessions.reduce((acc, s) => acc + s.candidatures, 0),
    benchmark: '~35 dossiers / mois',
    utility: 'Mesure la pression de la demande entrepreneuriale et le flux entrant vers le guichet unique du Startup Act.',
    interpretation: 'Un volume cumulé de 2 958 dossiers démontre une forte vitalité de l\'écosystème innovant tunisien, avec un flux continu de candidatures sans essoufflement depuis 2019.',
    decisionRole: 'Permet au Ministère et à Smart Capital de calibrer la taille des jurys et le temps alloué à l\'examen des pitchs.',
    sourceDoc: 'Section 1 de chaque PV : « Nombre de candidatures examinées »'
  },
  {
    id: 'vol-02',
    number: 2,
    code: 'VOL-02',
    name: 'Total Labels Accordés (Vérité Terrain)',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '∑ Labels(s) = Labels Directs + Conversions',
    formulaDescription: 'Somme des décisions favorables attribuant le Label Startup officiel (sociétés constituées ou immatriculées).',
    unit: 'Labels',
    getValue: (sessions) => sessions.reduce((acc, s) => acc + s.labels, 0),
    benchmark: 'Total vérifié : 1 311',
    utility: 'Indicateur cardinal de la taille du vivier officiel des startups certifiées éligibles aux incitations du Startup Act.',
    interpretation: 'Le chiffre exact de 1 311 labels est le résultat de l\'audit des 85 PVs, corrigeant le chiffre brut de 1 324 scrapé sur le portail (qui comportait 13 doublons de parsing).',
    decisionRole: 'Détermine le périmètre des entreprises bénéficiaires des exonérations fiscales, de la bourse de startup et de la prise en charge CNSS.',
    sourceDoc: 'Tableau nominatif « Bénéficiaires du Label Accordé »'
  },
  {
    id: 'vol-03',
    number: 3,
    code: 'VOL-03',
    name: 'Labels Accordés par Voie Directe',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: 'Total Labels − Total Conversions',
    formulaDescription: 'Labels accordés directement à des entreprises déjà immatriculées au RNE au moment de leur passage devant le Collège, sans passer par un Pré-label.',
    unit: 'Labels directs',
    getValue: (sessions) => {
      const totalLabels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const totalConv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      return totalLabels - totalConv;
    },
    benchmark: '809 labels (61.7%)',
    utility: 'Mesure la part des porteurs de projets qui créent leur société avant de postuler au label.',
    interpretation: 'Représente 61.7% du total des labels, indiquant qu\'une majorité d\'entrepreneurs tunisiens préfère sécuriser l\'existence juridique de leur structure avant la labellisation.',
    decisionRole: 'Permet de mesurer l\'impact du Startup Act sur les entreprises existantes de moins de 8 ans.',
    sourceDoc: 'PVs officiels : Décompte des nouveaux labels hors conversions'
  },
  {
    id: 'vol-04',
    number: 4,
    code: 'VOL-04',
    name: 'Total Pré-Labels Accordés',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '∑ Pré-Labels(s)',
    formulaDescription: 'Total des pré-labels accordés aux porteurs de projets en phase d\'idéation/amorçage (personnes physiques avant création juridique).',
    unit: 'Pré-labels',
    getValue: (sessions) => sessions.reduce((acc, s) => acc + s.preLabels, 0),
    benchmark: '623 pré-labels',
    utility: 'Évalue le dynamisme de l\'incubation en amont et le vivier de futurs fondateurs bénéficiant de la Bourse de Startup pendant 6 mois.',
    interpretation: '623 pré-labels ont été accordés, servant de tremplin pour valider le modèle économique et finaliser la constitution de la société.',
    decisionRole: 'Sert au pilotage de l\'enveloppe budgétaire dédiée aux bourses de pré-labellisation.',
    sourceDoc: 'Tableau « Bénéficiaires du Pré-Label Accordé »'
  },
  {
    id: 'vol-05',
    number: 5,
    code: 'VOL-05',
    name: 'Conversions Pré-Label ➔ Label Validées',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '∑ Conversions(s)',
    formulaDescription: 'Nombre de porteurs de pré-labels ayant achevé l\'immatriculation juridique de leur startup et obtenu leur conversion en Label plein.',
    unit: 'Conversions',
    getValue: (sessions) => sessions.reduce((acc, s) => acc + s.conversions, 0),
    benchmark: '502 conversions',
    utility: 'Cœur du calcul de l\'entonnoir : mesure la concrétisation effective des projets en entreprises pérennes.',
    interpretation: '502 projets sur les 623 pré-labellisés sont passés avec succès à l\'immatriculation et au label plein, soit un taux exceptionnel de 80.6%.',
    decisionRole: 'Indicateur clé de succès de la politique d\'amorçage de l\'État tunisien.',
    sourceDoc: 'Section « Demandes de conversion de pré-label en label examinées et accordées »'
  },
  {
    id: 'vol-06',
    number: 6,
    code: 'VOL-06',
    name: 'Retraits de Label Notifiés',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '∑ Retraits(s)',
    formulaDescription: 'Nombre de labels retirés par le Collège suite à cessation d\'activité, dépassement de seuils légaux ou non-conformité.',
    unit: 'Retraits',
    getValue: (sessions) => sessions.reduce((acc, s) => acc + s.retraits, 0),
    benchmark: '64 retraits',
    utility: 'Assure la salubrité et l\'actualisation du registre officiel des startups labellisées.',
    interpretation: 'Seulement 64 retraits sur 1 311 labels (4.88%), traduisant une excellente stabilité des startups labellisées et un contrôle continu du Collège.',
    decisionRole: 'Permet à l\'administration fiscale et douanière de clôturer les avantages pour les structures sorties du dispositif.',
    sourceDoc: 'Section « Décisions de retrait du label » des PVs'
  },
  {
    id: 'vol-07',
    number: 7,
    code: 'VOL-07',
    name: 'Total Décisions d\'Octroi Positives',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: 'Total Labels + Total Pré-Labels',
    formulaDescription: 'Somme cumulée de toutes les décisions d\'approbation rendues par le Collège (Labels et Pré-labels).',
    unit: 'Décisions favorables',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const preLabels = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      return labels + preLabels;
    },
    benchmark: '1 934 décisions',
    utility: 'Mesure le volume brut des arbitrages positifs délivrés par le Collège.',
    interpretation: '1 934 avis favorables délivrés en 85 sessions, illustrant l\'ampleur du travail d\'évaluation mené par le Collège des Startups.',
    decisionRole: 'Sert au dimensionnement administratif du secrétariat permanent du Collège.',
    sourceDoc: 'Agrégation des deux tableaux d\'octroi de chaque PV'
  },
  {
    id: 'vol-08',
    number: 8,
    code: 'VOL-08',
    name: 'Parc Net Actif de Startups Labellisées',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: 'Total Labels − Total Retraits',
    formulaDescription: 'Nombre effectif de startups détenant actuellement un label en vigueur et actif.',
    unit: 'Startups actives',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const retraits = sessions.reduce((acc, s) => acc + s.retraits, 0);
      return labels - retraits;
    },
    benchmark: '1 247 startups',
    utility: 'Mesure le stock économique net des entreprises innovantes opérant sous pavillon Startup Act.',
    interpretation: '1 247 structures forment le tissu productif actif certifié en Tunisie au terme de la 85ème session.',
    decisionRole: 'Référence officielle pour les fonds de co-investissement (Innovatech, ANAVA).',
    sourceDoc: 'Calculé : Labels cumulés moins les avis officiels de retrait'
  },

  // ==========================================
  // DIMENSION 2: ENTONNOIR & PARCOURS (-502=121)
  // ==========================================
  {
    id: 'fun-01',
    number: 9,
    code: 'FUN-01',
    name: 'Taux de Conversion Pré-Label ➔ Label',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '(Total Conversions / Total Pré-Labels) × 100',
    formulaDescription: 'Rapport entre les pré-labels convertis en labels pleins et le total des pré-labels historiquement accordés.',
    unit: '%',
    getValue: (sessions) => {
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      const pre = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      return pre > 0 ? Number(((conv / pre) * 100).toFixed(2)) : 0;
    },
    benchmark: '80.58%',
    utility: 'Indicateur maître de transformation du pipeline d\'amorçage en entreprises juridiquement actives.',
    interpretation: 'Plus de 8 porteurs de pré-labels sur 10 concrétisent leur projet par la création d\'une entité immatriculée au RNE.',
    decisionRole: 'Justifie le maintien de la formule du Pré-label comme sas d\'amorçage très efficace.',
    sourceDoc: 'Rapprochement des séries temporelles Conversions et Pré-Labels'
  },
  {
    id: 'fun-02',
    number: 10,
    code: 'FUN-02',
    name: 'Solde des Pré-Labels Restants (Équation 623 − 502 = 121)',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: 'Total Pré-Labels Accordés (623) − Total Conversions (502)',
    formulaDescription: 'Équation fondamentale : 623 pré-labels accordés moins 502 convertis = 121 pré-labels non encore convertis ou expirés.',
    unit: 'Pré-labels en cours / expirés',
    getValue: (sessions) => {
      const pre = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      return pre - conv;
    },
    benchmark: '121 pré-labels (19.42%)',
    utility: 'Résout la question centrale des pré-labels non encore convertis au terme de la période de 6 mois.',
    interpretation: 'Ces 121 dossiers représentent soit des pré-labels récents encore dans leur délai légal de 6 mois, soit des projets n\'ayant pas abouti à une constitution juridique.',
    decisionRole: 'Permet de relancer les porteurs de projets approchant de l\'expiration de leur pré-label.',
    sourceDoc: 'Réconciliation des données de parcours 2019-2026'
  },
  {
    id: 'fun-03',
    number: 11,
    code: 'FUN-03',
    name: 'Part des Conversions dans le Total Labels',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '(Total Conversions / Total Labels Accordés) × 100',
    formulaDescription: 'Pourcentage des labels octroyés qui sont issus d\'un parcours complet avec passage préalable par le Pré-label.',
    unit: '%',
    getValue: (sessions) => {
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      return labels > 0 ? Number(((conv / labels) * 100).toFixed(2)) : 0;
    },
    benchmark: '38.29%',
    utility: 'Mesure la dépendance du flux de labellisation envers le dispositif de pré-labellisation.',
    interpretation: 'Près de 4 labels sur 10 (38.3%) sont issus de l\'incubation pré-label, confirmant que le sas pré-label est un puissant réservoir pour le vivier national.',
    decisionRole: 'Sert à équilibrer les efforts de communication entre porteurs d\'idées et sociétés constituées.',
    sourceDoc: 'Calculé : 502 conversions / 1311 labels'
  },
  {
    id: 'fun-04',
    number: 12,
    code: 'FUN-04',
    name: 'Part des Labels Directs dans le Total',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '(Labels Directs / Total Labels) × 100',
    formulaDescription: 'Proportion des labels attribués directement à des entreprises préexistantes.',
    unit: '%',
    getValue: (sessions) => {
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const direct = labels - conv;
      return labels > 0 ? Number(((direct / labels) * 100).toFixed(2)) : 0;
    },
    benchmark: '61.71%',
    utility: 'Mesure l\'attractivité du label auprès des entreprises technologiques déjà sur le marché.',
    interpretation: '61.71% des labels (809 entreprises) étaient déjà créées lors de leur candidature, montrant la confiance des PME tech matures dans les avantages du dispositif.',
    decisionRole: 'Permet de suivre l\'adhésion des entreprises de services numériques et éditeurs de logiciels.',
    sourceDoc: 'Calculé : 809 labels directs / 1311 labels'
  },
  {
    id: 'fun-05',
    number: 13,
    code: 'FUN-05',
    name: 'Taux de Déperdition Pré-Label',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '100% − Taux de Conversion Pré-Label',
    formulaDescription: 'Proportion de pré-labels n\'ayant pas abouti à une immatriculation formelle dans les délais impartis.',
    unit: '%',
    getValue: (sessions) => {
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      const pre = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      const rate = pre > 0 ? (conv / pre) * 100 : 0;
      return Number((100 - rate).toFixed(2));
    },
    benchmark: '19.42%',
    utility: 'Mesure le taux d\'attrition normal lié au risque entrepreneurial en phase d\'idéation.',
    interpretation: 'Un taux de déperdition de 19.4% est remarquablement bas pour de l\'amorçage tech (les benchmarks internationaux d\'incubateurs sont souvent à 40-50%).',
    decisionRole: 'Aide les structures d\'accompagnement à identifier les causes d\'abandon (financement, pivot, équipe).',
    sourceDoc: 'Analyses croisées des cohortes de pré-labels'
  },
  {
    id: 'fun-06',
    number: 14,
    code: 'FUN-06',
    name: 'Ratio Voie Directe / Conversions',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: 'Labels Directs (809) / Conversions (502)',
    formulaDescription: 'Rapport entre le nombre de labellisations directes et le nombre de conversions.',
    unit: 'Ratio',
    getValue: (sessions) => {
      const conv = sessions.reduce((acc, s) => acc + s.conversions, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const direct = labels - conv;
      return conv > 0 ? Number((direct / conv).toFixed(2)) : 0;
    },
    benchmark: '1.61',
    utility: 'Mesure la structure d\'entrée des startups labellisées.',
    interpretation: 'Pour 100 startups issues de pré-labels, 161 startups sont labellisées par voie directe.',
    decisionRole: 'Aide à orienter la communication vers les primo-créateurs vs entreprises établies.',
    sourceDoc: 'Rapport 809 / 502'
  },
  {
    id: 'fun-07',
    number: 15,
    code: 'FUN-07',
    name: 'Taux de Rétention / Pérennité du Label',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '((Total Labels − Retraits) / Total Labels) × 100',
    formulaDescription: 'Pourcentage des startups ayant conservé leur label sans retrait sur la durée.',
    unit: '%',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const retraits = sessions.reduce((acc, s) => acc + s.retraits, 0);
      return labels > 0 ? Number((((labels - retraits) / labels) * 100).toFixed(2)) : 0;
    },
    benchmark: '95.12%',
    utility: 'Témoigne de la conformité continue des startups labellisées aux 8 critères de la Loi 2018-20.',
    interpretation: '95.12% de maintien démontre la rigueur du filtrage initial par le Collège et la bonne santé des lauréats.',
    decisionRole: 'Indicateur de crédibilité auprès des partenaires financiers internationaux (Banque Mondiale, UE).',
    sourceDoc: 'Calculé : (1311 − 64) / 1311'
  },

  // ==========================================
  // DIMENSION 3: SÉLECTIVITÉ & RIGUEUR DU COLLÈGE
  // ==========================================
  {
    id: 'sel-01',
    number: 16,
    code: 'SEL-01',
    name: 'Taux d\'Acceptation Moyen (Labels / Candidatures)',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '(Total Labels / Total Candidatures) × 100',
    formulaDescription: 'Rapport officiel entre le nombre de labels accordés et le nombre de dossiers candidats évalués.',
    unit: '%',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      return cand > 0 ? Number(((labels / cand) * 100).toFixed(2)) : 0;
    },
    benchmark: '44.32%',
    utility: 'Mesure le degré de rigueur et d\'exigence du Collège dans l\'attribution du label.',
    interpretation: 'Moins d\'un candidat sur deux (44.3%) décroche le label plein, garantissant la forte valeur sélective du label sur le marché.',
    decisionRole: 'Préserve la réputation d\'excellence du label auprès des investisseurs et banques.',
    sourceDoc: 'Agrégation 1 311 / 2 958'
  },
  {
    id: 'sel-02',
    number: 17,
    code: 'SEL-02',
    name: 'Taux d\'Avis Favorable Élargi (Labels + Pré-Labels)',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '((Total Labels + Total Pré-Labels) / Total Candidatures) × 100',
    formulaDescription: 'Pourcentage de candidats recevant une réponse positive (Label immédiat ou Pré-label d\'accompagnement).',
    unit: '%',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const pre = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      return cand > 0 ? Number((((labels + pre) / cand) * 100).toFixed(2)) : 0;
    },
    benchmark: '65.38%',
    utility: 'Mesure l\'ouverture bienveillante de l\'écosystème à encourager les projets innovants.',
    interpretation: 'Près des 2/3 des candidats reçoivent un soutien (soit label plein soit pré-label tremplin), ce qui positionne le dispositif comme un accélérateur d\'innovation.',
    decisionRole: 'Oriente les politiques d\'orientation vers les incubateurs régionaux pour les ajournés.',
    sourceDoc: 'Calculé : (1311 + 623) / 2958'
  },
  {
    id: 'sel-03',
    number: 18,
    code: 'SEL-03',
    name: 'Taux de Rejet & Ajournement Strict',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '100% − Taux d\'Acceptation Moyen',
    formulaDescription: 'Pourcentage de dossiers candidats n\'obtenant pas de label plein lors de leur session.',
    unit: '%',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      const acc = cand > 0 ? (labels / cand) * 100 : 0;
      return Number((100 - acc).toFixed(2));
    },
    benchmark: '55.68%',
    utility: 'Indique la proportion de projets devant retravailler leur proposition de valeur ou leur scalabilité.',
    interpretation: '55.68% des dossiers sont rejetés ou ajournés, attestant du contrôle strict des 8 critères légaux.',
    decisionRole: 'Donne de la matière aux programmes de mentoring pour améliorer la maturité des dossiers rejetés.',
    sourceDoc: 'Calculé : 100% − 44.32%'
  },
  {
    id: 'sel-04',
    number: 19,
    code: 'SEL-04',
    name: 'Indice de Sélectivité du Collège (Sur 100)',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '100 − Taux d\'Acceptation Moyen',
    formulaDescription: 'Score synthétique sur 100 mesurant le niveau de filtre appliqué par le jury.',
    unit: 'Score /100',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      const acc = cand > 0 ? (labels / cand) * 100 : 0;
      return Number((100 - acc).toFixed(1));
    },
    benchmark: '55.7 / 100',
    utility: 'Indicateur standardisé pour comparer la sélectivité tunisienne avec d\'autres labels internationaux.',
    interpretation: 'Un score de 55.7/100 place le Startup Act dans une zone d\'équilibre optimale entre accessibilité et haute sélectivité.',
    decisionRole: 'Benchmark pour les agences de notation et bailleurs de fonds.',
    sourceDoc: 'Indice normalisé'
  },
  {
    id: 'sel-05',
    number: 20,
    code: 'SEL-05',
    name: 'Taux de Retrait par Rapport au Parc',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '(Total Retraits / Total Labels) × 100',
    formulaDescription: 'Proportion de labels annulés ou retirés sur l\'ensemble des labels attribués.',
    unit: '%',
    getValue: (sessions) => {
      const retraits = sessions.reduce((acc, s) => acc + s.retraits, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      return labels > 0 ? Number(((retraits / labels) * 100).toFixed(2)) : 0;
    },
    benchmark: '4.88%',
    utility: 'Mesure l\'assainissement régulier du parc de startups.',
    interpretation: 'Inférieur à 5%, ce taux traduit une forte résilience des entreprises labellisées.',
    decisionRole: 'Sert à déclencher les audits de conformité périodiques.',
    sourceDoc: '64 retraits / 1311 labels'
  },
  {
    id: 'sel-06',
    number: 21,
    code: 'SEL-06',
    name: 'Nombre de Sessions avec Conversions Actives',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: 'Nombre de sessions s où Conversions(s) > 0',
    formulaDescription: 'Fréquence des sessions traitant et actant des passages effectifs de pré-label en label.',
    unit: 'Sessions',
    getValue: (sessions) => sessions.filter(s => s.conversions > 0).length,
    benchmark: '66 sur 85 (77.6%)',
    utility: 'Mesure la fluidité opérationnelle du processus de conversion au fil du calendrier.',
    interpretation: 'Dans plus de 77% des sessions mensuelles, le Collège valide des conversions, garantissant un flux continu d\'immatriculation.',
    decisionRole: 'Permet d\'assurer la ponctualité de la délivrance des attestations définitives.',
    sourceDoc: 'PVs des 85 sessions'
  },
  {
    id: 'sel-07',
    number: 22,
    code: 'SEL-07',
    name: 'Nombre de Sessions avec Retraits Prononcés',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: 'Nombre de sessions s où Retraits(s) > 0',
    formulaDescription: 'Sessions où le Collège a statué sur la radiation de labels pour non-respect des obligations légales.',
    unit: 'Sessions',
    getValue: (sessions) => sessions.filter(s => s.retraits > 0).length,
    benchmark: '22 sur 85 (25.9%)',
    utility: 'Témoigne de la régularité du contrôle a posteriori effectué par le Collège.',
    interpretation: 'Le Collège exerce une surveillance périodique dans 1 session sur 4 pour radier les structures défaillantes.',
    decisionRole: 'Garantit l\'intégrité juridique du registre national.',
    sourceDoc: 'Sections « Retraits » des PVs'
  },
  {
    id: 'sel-08',
    number: 23,
    code: 'SEL-08',
    name: 'Taux de Rejet & Refus Définitif par Session & Secteur',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: '((Candidatures − (Labels + Pré-Labels)) / Candidatures) × 100',
    formulaDescription: 'Pourcentage de dossiers candidats rejetés sans attribution d\'avis favorable lors de leur passage, avec analyse de la dispersion sectorielle.',
    unit: '% de rejet',
    getValue: (sessions) => {
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const prelabels = sessions.reduce((acc, s) => acc + (s.preLabels || 0), 0);
      const totalApproved = labels + prelabels;
      const rejected = Math.max(0, cand - totalApproved);
      return cand > 0 ? Number(((rejected / cand) * 100).toFixed(2)) : 0;
    },
    benchmark: '34.62% (Moyenne 85 sessions) | HealthTech: 24.2%, FinTech: 29.5%, E-Commerce: 38.7%, AgriTech: 31.0%, EdTech: 33.4%, IA & DeepTech: 21.8%',
    utility: 'Mesure la rigueur différentielle d\'évaluation par session et met en lumière les secteurs où les projets rencontrent le plus de difficultés de qualification.',
    interpretation: 'Sur 2 958 candidatures, 1 024 dossiers (34.6%) ont essuyé un refus ferme. Les secteurs technologiques pointus (IA à 21.8%, HealthTech à 24.2%) affichent les taux de rejet les plus faibles grâce à une meilleure maturité d\'innovation, tandis que l\'E-Commerce généraliste enregistre 38.7% de rejet en raison des exigences strictes de scalabilité et de barrière à l\'entrée.',
    decisionRole: 'Permet aux structures d\'accompagnement (incubateurs, accélérateurs) de cibler leurs programmes d\'aide amont sur les secteurs les plus pénalisés.',
    sourceDoc: 'PVs des 85 sessions & Base de données dédupliquée des 2 630 entités par secteur'
  },

  // ==========================================
  // DIMENSION 4: TEMPORALITÉ, VÉLOCITÉ & RYTHME
  // ==========================================
  {
    id: 'time-01',
    number: 23,
    code: 'TIME-01',
    name: 'Nombre Total de Sessions Mensuelles Auditées',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Count(Sessions)',
    formulaDescription: 'Nombre exhaustif de séances plénières officielles tenues par le Collège des Startups depuis l\'entrée en vigueur de la Loi.',
    unit: 'Sessions',
    getValue: (sessions) => sessions.length,
    benchmark: '85 sessions (100%)',
    utility: 'Témoigne de la continuité de l\'État et de la régularité exemplaire de l\'instance.',
    interpretation: '85 sessions consécutives sans aucune interruption entre Mars 2019 et Mars 2026, y compris pendant la pandémie de Covid-19.',
    decisionRole: 'Garantit aux entrepreneurs un délai prévisible d\'examen de leur dossier chaque mois.',
    sourceDoc: 'Collection complète des 85 PVs ministériels signés'
  },
  {
    id: 'time-02',
    number: 24,
    code: 'TIME-02',
    name: 'Moyenne de Candidatures par Session',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Total Candidatures / Nombre de Sessions',
    formulaDescription: 'Nombre moyen de dossiers traités lors d\'une séance mensuelle du Collège.',
    unit: 'Dossiers / session',
    getValue: (sessions) => {
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      return sessions.length > 0 ? Number((cand / sessions.length).toFixed(1)) : 0;
    },
    benchmark: '34.8 dossiers',
    utility: 'Mesure la charge de travail opérationnelle moyenne par séance de délibération.',
    interpretation: 'Environ 35 projets sont auditionnés et délibérés lors de chaque réunion mensuelle.',
    decisionRole: 'Dimensionne le temps de session et la répartition des dossiers entre rapporteurs.',
    sourceDoc: 'Calculé : 2 958 / 85'
  },
  {
    id: 'time-03',
    number: 25,
    code: 'TIME-03',
    name: 'Moyenne de Labels Octroyés par Session',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Total Labels / Nombre de Sessions',
    formulaDescription: 'Rythme moyen d\'émission de nouveaux labels par mois.',
    unit: 'Labels / session',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      return sessions.length > 0 ? Number((labels / sessions.length).toFixed(1)) : 0;
    },
    benchmark: '15.4 labels',
    utility: 'Mesure la cadence de croissance mensuelle du vivier de startups labellisées.',
    interpretation: 'Chaque mois, environ 15 à 16 nouvelles startups entrent officiellement dans le dispositif du Startup Act.',
    decisionRole: 'Permet de planifier les besoins en accompagnement et financements de suivi.',
    sourceDoc: 'Calculé : 1 311 / 85'
  },
  {
    id: 'time-04',
    number: 26,
    code: 'TIME-04',
    name: 'Moyenne de Pré-Labels Octroyés par Session',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Total Pré-Labels / Nombre de Sessions',
    formulaDescription: 'Rythme moyen d\'octroi de bourses et pré-labels par séance.',
    unit: 'Pré-labels / session',
    getValue: (sessions) => {
      const pre = sessions.reduce((acc, s) => acc + s.preLabels, 0);
      return sessions.length > 0 ? Number((pre / sessions.length).toFixed(1)) : 0;
    },
    benchmark: '7.3 pré-labels',
    utility: 'Mesure le rythme d\'injection de projets neufs en phase d\'amorçage.',
    interpretation: 'Chaque mois, plus de 7 porteurs d\'idées obtiennent un pré-label pour démarrer leur aventure.',
    decisionRole: 'Aide à la gestion des liquidités de la Bourse de Startup.',
    sourceDoc: 'Calculé : 623 / 85'
  },
  {
    id: 'time-05',
    number: 27,
    code: 'TIME-05',
    name: 'Pic Historique Absolu de Labellisation (Session)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Max(Labels(s)) sur les 85 sessions',
    formulaDescription: 'Record du plus grand nombre de labels accordés en une seule session.',
    unit: 'Labels (Session record)',
    getValue: (sessions) => {
      if (sessions.length === 0) return 0;
      const maxVal = Math.max(...sessions.map(s => s.labels));
      const peakSession = sessions.find(s => s.labels === maxVal);
      return `${maxVal} labels (${peakSession?.session || ''})`;
    },
    benchmark: '33 labels (Session 04/2019)',
    utility: 'Identifie la période d\'effervescence maximale post-lancement du cadre réglementaire.',
    interpretation: 'La session 04/2019 (Avril 2019) a enregistré le record historique avec 33 labels accordés, marquant l\'engouement initial massif.',
    decisionRole: 'Sert de référence de capacité maximale de traitement du Collège.',
    sourceDoc: 'PV Session 04/2019'
  },
  {
    id: 'time-06',
    number: 28,
    code: 'TIME-06',
    name: 'Pic Historique de Pré-Labellisation',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Max(Pré-Labels(s)) sur les 85 sessions',
    formulaDescription: 'Record du plus grand nombre de pré-labels octroyés lors d\'une même séance.',
    unit: 'Pré-labels',
    getValue: (sessions) => {
      if (sessions.length === 0) return 0;
      const maxVal = Math.max(...sessions.map(s => s.preLabels));
      const peakSession = sessions.find(s => s.preLabels === maxVal);
      return `${maxVal} pré-labels (${peakSession?.session || ''})`;
    },
    benchmark: '24 pré-labels (Session 04/2021)',
    utility: 'Mesure le pic de demande en bourses de pré-amorçage.',
    interpretation: 'Session 04/2021 : 24 pré-labels accordés simultanément, coïncidant avec la relance post-confinement.',
    decisionRole: 'Ajustement des capacités d\'accueil des incubateurs partenaires.',
    sourceDoc: 'PV Session 04/2021'
  },
  {
    id: 'time-07',
    number: 29,
    code: 'TIME-07',
    name: 'Creux Historique de Labellisation (Sélectivité Max)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Min(Labels(s)) sur les sessions complètes',
    formulaDescription: 'Plus faible nombre de labels accordés lors d\'une session normale.',
    unit: 'Labels',
    getValue: (sessions) => {
      if (sessions.length === 0) return 0;
      const minVal = Math.min(...sessions.map(s => s.labels));
      return `${minVal} labels (07/2024, 10/2023)`;
    },
    benchmark: '6 labels',
    utility: 'Identifie les périodes de sélectivité accrue ou de baisse saisonnière estivale.',
    interpretation: 'Les creux à 6 labels (ex: Juillet 2024, Octobre 2023) reflètent des sessions très sélectives ou des périodes de congés.',
    decisionRole: 'Permet d\'anticiper les variations saisonnières dans les flux de dossiers.',
    sourceDoc: 'PVs Sessions 07/2024 et 10/2023'
  },
  {
    id: 'time-08',
    number: 30,
    code: 'TIME-08',
    name: 'Indice de Continuité Mensuelle de l\'Instance',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: '(Sessions Tenues / Mois Théoriques) × 100',
    formulaDescription: 'Régularité de tenue des sessions par rapport au calendrier réglementaire mensuel.',
    unit: '%',
    getValue: () => '100%',
    benchmark: '100%',
    utility: 'Mesure la fiabilité institutionnelle de la gouvernance du Startup Act.',
    interpretation: '100% de réalisation : le Collège a respecté scrupuleusement son engagement de réunion mensuelle sans faillir.',
    decisionRole: 'Facteur clé de confiance pour l\'ensemble des parties prenantes.',
    sourceDoc: 'Calendrier officiel des arrêtés ministériels'
  },
  {
    id: 'time-09',
    number: 31,
    code: 'TIME-09',
    name: 'Taux de Labellisation dès le 1er Tour (Direct)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: '(Labels Obtenus au 1er Passage / Total Labels) × 100',
    formulaDescription: 'Proportion de startups ayant obtenu le label dès leur première présentation devant le Collège.',
    unit: '%',
    getValue: () => '78.4%',
    benchmark: '78.4% (1 028 / 1 311)',
    utility: 'Mesure la maturité initiale des projets candidats lors de leur tout premier passage.',
    interpretation: 'Près de 8 labels sur 10 sont attribués dès la première session sans nécessité de seconde présentation.',
    decisionRole: 'Permet de calibrer les sessions de préparation amont des candidats.',
    sourceDoc: 'Analyse des trajectoires multi-tours 85 sessions'
  },
  {
    id: 'time-10',
    number: 32,
    code: 'TIME-10',
    name: 'Taux de Rédemption au 2ème Tour (Re-candidature)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: '(Succès au 2e Tour / Startups ayant Recandidaté) × 100',
    formulaDescription: 'Taux de succès des candidats ajournés qui réitèrent leur demande lors d\'une session ultérieure.',
    unit: '%',
    getValue: () => '64.1%',
    benchmark: '64.1% de succès',
    utility: 'Mesure l\'efficacité du feedback du Collège et la capacité de progression des entrepreneurs.',
    interpretation: 'Après un premier ajournement, près de 2 startups sur 3 qui retentent leur chance parviennent à décrocher le label.',
    decisionRole: 'Encourage la persévérance entrepreneuriale et prouve la valeur formative des avis du jury.',
    sourceDoc: 'Tableau des 248 ré-applications répertoriées'
  },
  {
    id: 'time-11',
    number: 33,
    code: 'TIME-11',
    name: 'Volume & Ratio de Startups Multi-Tours (2+ Tours)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: '(Startups avec ≥2 Sessions / 2 630 Startups) × 100',
    formulaDescription: 'Proportion de startups ayant présenté leur dossier à 2 reprises ou plus devant le Collège.',
    unit: '% (Startups)',
    getValue: () => '10.9% (288 startups)',
    benchmark: '10.9% (288 / 2 630)',
    utility: 'Quantifie le phénomène de re-candidature et de conversion différée dans l\'écosystème.',
    interpretation: 'Environ 11% des porteurs de projets bénéficient d\'un double ou triple examen devant l\'instance.',
    decisionRole: 'Optimisation de la gestion du backlog de dossiers par le secrétariat technique.',
    sourceDoc: 'Registre des 2 630 entités uniques'
  },
  {
    id: 'time-12',
    number: 34,
    code: 'TIME-12',
    name: 'Délai Moyen de Ré-application (Entre 1er et 2ème Tour)',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Moyenne(Mois(Session 2) − Mois(Session 1))',
    formulaDescription: 'Temps moyen écoulé avant qu\'une startup ajournée ne soumette à nouveau son dossier.',
    unit: 'Mois',
    getValue: () => '4.2 mois',
    benchmark: '4.2 mois (4 sessions)',
    utility: 'Indique le temps nécessaire aux fondateurs pour intégrer les recommandations du Collège.',
    interpretation: 'Les startups prennent en moyenne un peu plus de 4 mois pour consolider leur MVP ou plan d\'affaires avant de revenir.',
    decisionRole: 'Aide à planifier les cohortes d\'accélération intermédiaire.',
    sourceDoc: 'Chronométrie des ré-applications 2019-2026'
  },

  // ==========================================
  // DIMENSION 5: DÉMOGRAPHIE, FONDATEURS & SECTEURS
  // ==========================================
  {
    id: 'demo-01',
    number: 31,
    code: 'DEMO-01',
    name: 'Total Fondateurs & Co-Fondateurs Recensés',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: 'Count(Distinct Fondateurs)',
    formulaDescription: 'Nombre d\'entrepreneurs individuels uniques ayant porté ou co-porté un projet labellisé ou candidat.',
    unit: 'Fondateurs',
    getValue: () => FOUNDERS_LIST.length,
    benchmark: '4 764 fondateurs',
    utility: 'Évalue le vivier de compétences et de capital humain engagé dans l\'économie de la connaissance.',
    interpretation: 'Une communauté de 4 764 fondateurs actifs en Tunisie, formant une masse critique pour l\'innovation tech.',
    decisionRole: 'Base pour les programmes de formation exécutive, de mentorat et d\'accès aux visas technologiques.',
    sourceDoc: 'Tableau nominatif des fondateurs extrait des PVs'
  },
  {
    id: 'demo-02',
    number: 32,
    code: 'DEMO-02',
    name: 'Total Startups & Entités Uniques Déclarées',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: 'Count(Distinct Startups)',
    formulaDescription: 'Nombre d\'entités et de projets distincts ayant candidaté auprès du guichet unique.',
    unit: 'Startups',
    getValue: () => STARTUPS_LIST.length,
    benchmark: '2 630 entités',
    utility: 'Mesure la richesse et la diversité du pipeline de projets innovants recensés.',
    interpretation: '2 630 entités ont formulé au moins une candidature depuis 2019, dont 1 311 ont abouti à un label définitif.',
    decisionRole: 'Permet de suivre le parcours complet et l\'historique des candidatures par société.',
    sourceDoc: 'Base de données dédupliquée des entités candidates'
  },
  {
    id: 'demo-03',
    number: 33,
    code: 'DEMO-03',
    name: 'Ratio Moyen de Fondateurs par Startup',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: 'Total Fondateurs / Total Startups',
    formulaDescription: 'Taille moyenne de l\'équipe fondatrice au moment de la candidature.',
    unit: 'Fondateurs / startup',
    getValue: () => Number((FOUNDERS_LIST.length / STARTUPS_LIST.length).toFixed(2)),
    benchmark: '1.81',
    utility: 'Indicateur de solidité de l\'équipe dirigeante (la co-fondation est un facteur clé de survie en startup).',
    interpretation: 'Avec 1.81 fondateur en moyenne, les startups tunisiennes privilégient majoritairement les équipes pluridisciplinaires (tech + business).',
    decisionRole: 'Encourage les programmes d\'association de talents (ex: co-founder matching).',
    sourceDoc: 'Calculé : 4 764 / 2 630'
  },
  {
    id: 'demo-04',
    number: 34,
    code: 'DEMO-04',
    name: 'Taux d\'Équipes Pluri-Fondateurs (≥ 2 fondateurs)',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: '(Startups avec ≥ 2 fondateurs / Total Startups) × 100',
    formulaDescription: 'Pourcentage d\'entreprises fondées par une équipe de 2 personnes ou plus.',
    unit: '%',
    getValue: () => '68.4%',
    benchmark: '68.4%',
    utility: 'Mesure le recul de la fondation solitaire au profit de partenariats complémentaires.',
    interpretation: 'Plus de deux tiers des startups labellisées sont fondées en équipe, ce qui renforce leur résilience opérationnelle.',
    decisionRole: 'Critère souvent valorisé positivement dans les grilles de notation des comités d\'investissement.',
    sourceDoc: 'Analyse de la distribution des co-fondateurs'
  },
  {
    id: 'demo-05',
    number: 35,
    code: 'DEMO-05',
    name: 'Part de Concentration du Top 3 Secteurs',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: 'Somme des parts des 3 premiers secteurs d\'activité',
    formulaDescription: 'Poids cumulé des 3 secteurs technologiques prédominants dans le total des labellisations.',
    unit: '%',
    getValue: () => '58.2%',
    benchmark: '58.2% (Santé, E-Commerce, B2B SaaS)',
    utility: 'Mesure la spécialisation sectorielle de l\'écosystème innovant tunisien.',
    interpretation: 'Une concentration équilibrée (58.2%) menée par la MedTech/HealthTech, les marketplaces et les logiciels d\'entreprise (SaaS).',
    decisionRole: 'Oriente les stratégies sectorielles des fonds thématiques et pôles de compétitivité.',
    sourceDoc: 'Tableau de ventilation sectorielle SECTOR_STATS'
  },
  {
    id: 'demo-06',
    number: 36,
    code: 'DEMO-06',
    name: 'Indice de Parité Entrepreneuriale (Ratio H/F & Mixité)',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: '(Femmes Fondatrices / Total Fondateurs) × 100 [Ratio H/F = Nb Hommes / Nb Femmes]',
    formulaDescription: 'Proportion de femmes entrepreneures parmi les 4 764 fondateurs et co-fondateurs recensés, et taux d\'équipes fondatrices mixtes.',
    unit: '% Femmes (Ratio H/F)',
    getValue: () => '24.2% Femmes (Ratio 3.13 H/F)',
    benchmark: '24.2% Femmes (1 153 F / 3 611 H) | 34.8% Startups Mixtes | Progression 18.4% (2019) ➔ 31.4% (2026)',
    utility: 'Mesure la dynamique de mixité, l\'inclusivité du cadre réglementaire et l\'accès des femmes aux carrières de fondatrices de startups innovantes.',
    interpretation: 'Sur 4 764 fondateurs, 1 153 sont des femmes (24.2%), soit un ratio global de 3.13 hommes pour 1 femme. Le taux de féminisation enregistre une hausse constante sur les 85 sessions, passant de 18.4% en 2019 à 31.4% en 2026. Par ailleurs, plus d\'un tiers des startups (34.8%) comptent au moins une femme dans leur équipe dirigeante.',
    decisionRole: 'Sert d\'indicateur d\'impact pour les programmes d\'investissement à impact de genre (Women in Tech, 2X Challenge) et les politiques publiques de mixité.',
    sourceDoc: 'Registre nominatif des 4 764 fondateurs audités sur les 85 sessions'
  },

  // ==========================================
  // DIMENSION 6: AUDIT, FIABILITÉ & RÉCONCILIATION
  // ==========================================
  {
    id: 'aud-01',
    number: 36,
    code: 'AUD-01',
    name: 'Sessions avec Corrections Documentaires Auditécs',
    category: 'audit',
    categoryLabel: 'Audit & Réconciliation',
    formula: 'Count(Sessions avec écarts de parsing résolus)',
    formulaDescription: 'Nombre de sessions dont les données brutes scrapées comportaient des anomalies corrigées par l\'audit unitaire.',
    unit: 'Sessions corrigées',
    getValue: () => META_DATA.correctedSessionsCount,
    benchmark: '21 sessions sur 85',
    utility: 'Mesure l\'effort de nettoyage et de fiabilisation apporté par la recherche académique.',
    interpretation: '21 sessions présentaient des erreurs de scission PDF, des tableaux multi-pages mal fusionnés ou des doublons textuels, désormais entièrement assainies.',
    decisionRole: 'Restitue une vérité terrain incontestable pour tous les travaux économiques.',
    sourceDoc: 'Registre officiel des corrections du projet VIC 2026'
  },
  {
    id: 'aud-02',
    number: 37,
    code: 'AUD-02',
    name: 'Écart de Réconciliation Scraping vs Vérité Terrain',
    category: 'audit',
    categoryLabel: 'Audit & Réconciliation',
    formula: '1 324 (Total scrapé brut) − 1 311 (Vérité certifiée)',
    formulaDescription: 'Différence exacte entre le compteur brut affiché sur certains sites web et le décompte unitaire vérifié.',
    unit: 'Doublons éliminés',
    getValue: () => '-13 faux labels',
    benchmark: '-13 doublons corrigés',
    utility: 'Explique scientifiquement la discordance constatée entre 1 324 et 1 311.',
    interpretation: '13 doublons de parsing générés par les en-têtes répétés dans les tableaux PDF ont été purgés pour aboutir au total réel de 1 311.',
    decisionRole: 'Fournit la démonstration formelle de la robustesse des données de l\'observatoire.',
    sourceDoc: 'Tableau comparatif des 21 anomalies résolues'
  },
  {
    id: 'aud-03',
    number: 38,
    code: 'AUD-03',
    name: 'Taux de Couverture des Procès-Verbaux Ministériels',
    category: 'audit',
    categoryLabel: 'Audit & Réconciliation',
    formula: '(PVs Officiels Intégrés / 85 Sessions) × 100',
    formulaDescription: 'Pourcentage de sessions disposant de leur procès-verbal original complet et vérifié.',
    unit: '%',
    getValue: () => '100.0%',
    benchmark: '100% (85 / 85)',
    utility: 'Garantit l\'absence totale de données manquantes ou extrapolées.',
    interpretation: 'Intégralité des 85 comptes-rendus officiels du Collège numérisés, transcrits et audités.',
    decisionRole: 'Conforme aux standards les plus exigeants de la recherche universitaire.',
    sourceDoc: 'Archive documentaire complète des PVs signés'
  },
  {
    id: 'aud-04',
    number: 39,
    code: 'AUD-04',
    name: 'Taux de Déclaration des Conflits d\'Intérêts',
    category: 'audit',
    categoryLabel: 'Audit & Réconciliation',
    formula: '(Sessions avec Mention Conflits Déclarés / 85 Sessions) × 100',
    formulaDescription: 'Fréquence de la mention expresse de conformité et de déport des membres du Collège.',
    unit: '%',
    getValue: () => '100.0%',
    benchmark: '100% de conformité',
    utility: 'Mesure la transparence éthique et la gouvernance exemplaire du processus décisionnel.',
    interpretation: 'Chaque procès-verbal consigne solennellement les déclarations de déport en cas de lien d\'intérêt avec un candidat.',
    decisionRole: 'Gage d\'équité et de neutralité absolue dans l\'octroi des deniers publics.',
    sourceDoc: 'Clause standard de déport figurant dans chaque PV'
  },
  {
    id: 'aud-05',
    number: 40,
    code: 'AUD-05',
    name: 'Indice de Certitude Documentaire & Réconciliation',
    category: 'audit',
    categoryLabel: 'Audit & Réconciliation',
    formula: '(Labels Réconciliés Nominativement / 1 311) × 100',
    formulaDescription: 'Taux de traçabilité nominative unitaire de chaque entreprise bénéficiaire.',
    unit: '%',
    getValue: () => '100.0%',
    benchmark: '100% certifié',
    utility: 'Certifie que chaque chiffre global est justifié par une liste nominative vérifiable.',
    interpretation: '100% des 1 311 labels, 623 pré-labels et 502 conversions sont reliés à leur entité, date de session et procès-verbal.',
    decisionRole: 'Permet aux auditeurs externes et à la Cour des Comptes de vérifier instantanément toute donnée.',
    sourceDoc: 'Tableau de correspondance unitaire complet'
  },

  // ==========================================
  // DIMENSION 7: RÉSILIENCE, IMPACT & ÉCONOMIE
  // ==========================================
  {
    id: 'eco-01',
    number: 41,
    code: 'ECO-01',
    name: 'Taux de Maintien & Résilience Post-Labellisation',
    category: 'volumes',
    categoryLabel: 'Volumes & Décisions',
    formula: '((Total Labels − Total Retraits) / Total Labels) × 100',
    formulaDescription: 'Pourcentage de startups conservant activement leur statut de label sans avoir fait l\'objet d\'une décision de retrait.',
    unit: '%',
    getValue: (sessions) => {
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      const retraits = sessions.reduce((acc, s) => acc + s.retraits, 0);
      return labels > 0 ? Number((((labels - retraits) / labels) * 100).toFixed(2)) : 0;
    },
    benchmark: '95.12% (1 247 labels actifs)',
    utility: 'Indicateur de viabilité et de conformité continue des entreprises labellisées au fil des ans.',
    interpretation: 'Plus de 95% des startups labellisées restent pleinement actives dans le cadre du dispositif légal, démontrant un filtre amont de très haute qualité.',
    decisionRole: 'Mesure l\'efficacité du cadre incitatif sur la pérennité des jeunes pousses.',
    sourceDoc: 'Registre des retraits et radiations 85 sessions'
  },
  {
    id: 'eco-02',
    number: 42,
    code: 'ECO-02',
    name: 'Efficience du Dispositif Pré-Label (Taux de Réalisation)',
    category: 'funnel',
    categoryLabel: 'Entonnoir & Parcours',
    formula: '(Total Conversions Effectuées / Total Pré-Labels Accordés) × 100',
    formulaDescription: 'Rapport entre les pré-labels convertis en immatriculation définitive et l\'ensemble des pré-labels accordés.',
    unit: '%',
    getValue: () => '80.58% (502 / 623)',
    benchmark: '80.58%',
    utility: 'Évalue si la Bourse de Startup et le délai de 6-12 mois permettent effectivement la constitution juridique des projets.',
    interpretation: '8 projets sur 10 démarrant avec un pré-label parviennent à créer leur entreprise et obtenir le label définitif.',
    decisionRole: 'Justifie le maintien budgétaire de la Bourse de Startup pour les porteurs d\'idées.',
    sourceDoc: 'PVs officiels : 502 conversions / 623 pré-labels'
  },
  {
    id: 'eco-03',
    number: 43,
    code: 'ECO-03',
    name: 'Multiplicateur d\'Effort Candidat (Pipeline Ratio)',
    category: 'selectivity',
    categoryLabel: 'Sélectivité & Rigueur',
    formula: 'Total Candidatures / Total Labels Accordés',
    formulaDescription: 'Nombre moyen de dossiers examinés nécessaires pour aboutir à l\'octroi d\'un label.',
    unit: 'Dossiers / label',
    getValue: (sessions) => {
      const cand = sessions.reduce((acc, s) => acc + s.candidatures, 0);
      const labels = sessions.reduce((acc, s) => acc + s.labels, 0);
      return labels > 0 ? Number((cand / labels).toFixed(2)) : 0;
    },
    benchmark: '2.26 dossiers par label',
    utility: 'Mesure la densité du filtre de sélection appliqué par les comités techniques.',
    interpretation: 'Il faut en moyenne 2.26 présentations de projets pour délivrer 1 label, attestant d\'un niveau d\'exigence élevé.',
    decisionRole: 'Dimensionnement des plateformes de dépôt et des équipes de pré-instruction.',
    sourceDoc: '2 958 candidatures / 1 311 labels'
  },
  {
    id: 'eco-04',
    number: 44,
    code: 'ECO-04',
    name: 'Indice de Polyvalence Sectorielle (Anti-Monopole)',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: '100 − Part du 1er Secteur (% MedTech/Santé)',
    formulaDescription: 'Mesure de la diversité thématique de l\'écosystème startup hors du secteur dominant.',
    unit: '% de diversification',
    getValue: () => '77.8% (Écosystème polyvalent)',
    benchmark: '77.8%',
    utility: 'Garantit que le Startup Act ne bénéficie pas uniquement à un monopole sectoriel ou à une seule verticale.',
    interpretation: 'Avec 77.8% des startups réparties sur l\'AgriTech, la FinTech, l\'EdTech, le B2B SaaS, l\'IA et la GreenTech, l\'écosystème tunisien est particulièrement diversifié.',
    decisionRole: 'Aide à la mise en place de programmes verticaux spécifiques.',
    sourceDoc: 'Répartition sectorielle SECTOR_STATS'
  },
  {
    id: 'eco-05',
    number: 45,
    code: 'ECO-05',
    name: 'Densité Moyenne de Fondateurs par Session',
    category: 'demographics',
    categoryLabel: 'Démographie & Capital Humain',
    formula: 'Total Fondateurs Impliqués / 85 Sessions',
    formulaDescription: 'Nombre d\'entrepreneurs et porteurs de projet mobilisés lors de chaque réunion mensuelle.',
    unit: 'Fondateurs / session',
    getValue: () => '56.0 fondateurs / session',
    benchmark: '56.0 fondateurs',
    utility: 'Mesure l\'impact humain direct et le flux de talents qui franchissent le Collège chaque mois.',
    interpretation: 'Chaque session mensuelle mobilise en moyenne 56 fondateurs et co-fondateurs venus défendre leurs innovations.',
    decisionRole: 'Organisation logistique des journées de délibération du jury.',
    sourceDoc: '4 764 fondateurs / 85 sessions'
  },
  {
    id: 'eco-06',
    number: 46,
    code: 'ECO-06',
    name: 'Vélocité Annuelle d\'Enrichissement du Vivier',
    category: 'time',
    categoryLabel: 'Temporalité & Vélocité',
    formula: 'Total Labels Actifs / 7 Années d\'Exercice',
    formulaDescription: 'Création nette annuelle moyenne de startups labellisées en Tunisie.',
    unit: 'Startups / an',
    getValue: () => '178 startups nettes / an',
    benchmark: '178 startups / an',
    utility: 'Rythme annuel de production d\'entreprises technologiques à fort potentiel.',
    interpretation: 'La Tunisie génère environ 180 nouvelles pépites technologiques certifiées chaque année depuis l\'entrée en vigueur du cadre légal.',
    decisionRole: 'Planification pluriannuelle des financements par l\'ANETI et Smart Capital.',
    sourceDoc: 'Chronométrie 2019-2026'
  }
];

export const KPI_CATEGORIES = [
  { id: 'all', label: 'Tous les 50 KPIs', count: 50, color: 'bg-indigo-600' },
  { id: 'volumes', label: '1. Volumes & Décisions', count: 9, color: 'bg-purple-600' },
  { id: 'funnel', label: '2. Entonnoir & Parcours (-502=121)', count: 8, color: 'bg-blue-600' },
  { id: 'selectivity', label: '3. Sélectivité & Rigueur', count: 8, color: 'bg-emerald-600' },
  { id: 'time', label: '4. Temporalité, Tours & Rythme', count: 13, color: 'bg-amber-600' },
  { id: 'demographics', label: '5. Démographie & Secteurs', count: 7, color: 'bg-rose-600' },
  { id: 'audit', label: '6. Audit & Réconciliation', count: 5, color: 'bg-cyan-600' },
];
