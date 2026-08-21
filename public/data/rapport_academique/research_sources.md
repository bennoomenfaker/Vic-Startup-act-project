# Notes de recherche sauvegardées

## Sources officielles Startup Tunisia

1. About Startup Act — https://startup.gov.tn/fr/startup_act/discover
   - Le site officiel présente le Startup Act comme un cadre de 20 mesures pour faciliter le lancement et le développement des startups tunisiennes.
   - Références juridiques indiquées : loi n° 2018-20 du 17 avril 2018 ; décret n° 2018-840 du 11 octobre 2018 ; circulaires BCT n° 2019-01 et 2019-02.
   - La page mentionne les avantages pour startups, investisseurs et entrepreneurs.

2. Comment obtenir le Label ? — https://startup.gov.tn/fr/startup_act/how_to_obtain_the_label
   - Le processus officiel distingue le cas d’un projet avec POC sans entreprise créée et celui d’une entreprise déjà créée.
   - Pour le Pré-Label, la page indique qu’un projet obtenant au moins 5 avis favorables peut obtenir le Pré-Label et dispose ensuite de 6 mois pour créer l’entreprise et obtenir le Label.
   - Pour une entreprise créée, le Label est accordé avec au moins 5 avis favorables.
   - Critères indiqués : âge inférieur à 8 ans, moins de 100 employés et seuil financier, indépendance du capital, innovation et scalabilité.

3. Résultats des sessions — https://startup.gov.tn/fr/startup_act/results
   - La page officielle publie un tableau par session avec nombre de candidatures, Labels accordés, Pré-Labels accordés, commentaires et rapport PDF.
   - Elle fournit les PDF de comptes rendus à utiliser comme source primaire pour l’audit.

4. Rapports annuels — https://startup.gov.tn/fr/annual-reports
   - La page officielle fournit les rapports annuels 2019, 2020 et 2021 de Startup Tunisia.
   - URLs PDF listées :
     - https://startup.gov.tn/sites/default/files/2021-11/Startup-Act-Annual-Report-2019-2020.pdf
     - https://startup.gov.tn/sites/default/files/2021-11/Startup_Tunisia_Rapport_Annuel_2020_FR.pdf
     - https://startup.gov.tn/sites/default/files/2022-10/Rapport_annuel_2021_VERSIONWEB_opt_1.pdf

## Sources du dépôt GitHub

5. Dépôt — https://github.com/bennoomenfaker/vic-2026-startup-act
   - Projet académique universitaire créé par Faker BEN NOOMEN dans le cadre du Master Professionnel VIC, collaboration ESEN Manouba × ISCAE Manouba.
   - Période annoncée : 2019–2026 ; 85 sessions de labellisation.
   - Parcours : VIC 2026 en cours, DDS 2025 ESSECT Tunis, IGP 2024 ISIMS Sfax, Licence Informatique de Gestion 2023 ESSECT Montfleury.

6. Corrections — https://github.com/bennoomenfaker/vic-2026-startup-act/blob/main/corrections.md
   - Le dépôt indique 85/85 sessions vérifiées, 82 par parser v7 + audit indépendant freebuff et 3 scans vectoriels confirmés manuellement.
   - Totaux corrigés déclarés : 1 311 Labels et 623 Prélabels.
   - Totaux avant correction déclarés : 1 324 Labels et 617 Prélabels.
   - Le dépôt signale 21 sessions corrigées et stocke les taux exacts et arrondis.

7. Guide quantitatif — https://github.com/bennoomenfaker/vic-2026-startup-act/blob/main/public/guide_etude_quantitative.md
   - Le guide propose l’analyse des sessions, des secteurs, de la création, des résultats PDF, des rapports annuels et des analyses croisées.
   - Il mentionne notamment le HHI sectoriel, les tendances temporelles, les retraits, les conversions Prélabel → Label, l’emploi, l’investissement, l’internationalisation et le genre.

## Points de vigilance pour le rapport

- Le dépôt documente des totaux Labels/Prélabels corrigés, mais les lignes détaillées PDF peuvent avoir des champs décalés ou des résultats concaténés. Il faut séparer compteur officiel par session et lignes individuelles extraites.
- Le total de candidatures doit être déclaré avec sa provenance exacte : la page catalogue/données corrigées mentionne 3 015, tandis que certaines agrégations historiques du dashboard_data.json mentionnent 2 958. Cette divergence doit être traitée comme une limite de qualité, non masquée.
- Les fondateurs et entreprises doivent être analysés à partir des champs contrôlés, avec un statut de confiance et sans inventer les valeurs manquantes.
