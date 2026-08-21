# Plan de veille AE1 — État des lieux quantitatif du Startup Act (priorisé)

**Document source** : Google Docs « Plan de veille AE1 — État des lieux quantitatif » (colonne 9 de la Charte de cadrage AE1)
**Colonnes ajoutées** : **Remarque** (opérationnalité / couverture dans l'app) et **Priorité** (1 = faible → 5 = critique)

---

## ⚠️ Données corrigées — provenance (À LIRE EN PREMIER)

> **Les données du tableau `results` / `/sessions` du site startup.gov.tn sont FAUSSES.**
> L'utilisateur a **ré-extrait les données des PDF officiels des sessions** (`session-pdfs`), **recalculé et corrigé**.
> Cette correction est documentée dans la **page « Corrections » de l'app** (ancien tableau faux vs nouveau tableau corrigé, avec détail par session).

**Règle permanente (mémoire)** :
1. **Ne JAMAIS utiliser** les valeurs du site scrapé telles quelles (elles sont erronées sur 20 sessions / 85).
2. **Source de vérité** = données corrigées à partir des PDF officiels :
   | Indicateur | Valeur **corrigée** (à utiliser) | Ancienne valeur fausse (site) |
   |---|---|---|
   | Labels accordés | **1 311** | 1 324 |
   | Pré-labels accordés | **623** | 617 |
   | Candidatures (somme 85 sessions) | **2 958** | ~1 824 (anciennes « entrées PDF », périmé) |
   | Retraits de labels | **140** | 190 |
   | Conversions pré-label → label | **502** (taux 80,6 %) | — |
   | Sessions vérifiées / corrigées | 85 / 20 | — |
3. **Fichiers de référence** : `dashboard_data.json` (annuel + database), `parcours.json` (conversions/retraits), `corrections.json` (détail 20 corrections), `database_startups.json` (922 startups).
4. **Fichier périmé à ne pas utiliser** : `analyse_quantitative_results.json` (1 324 labels, 617 pré-labels, 190 retraits, « 1 824 entrées » = extractions PDF v6, pas des candidatures).
5. Le taux d'acceptation corrigé est **44,3 % (1 311/2 958)** — pas 44,8 %.

---

## 🌍 Veille comparative internationale — source externe (page « StartupBlink »)

> **Périmètre séparé** : la page `startupblink` de l'app est une **veille comparative** basée sur des données **externes** (StartupBlink — Global Startup Ecosystem Index 2026), jamais à confondre avec les données officielles corrigées du Startup Act (tableau ci-dessus). L'app affiche les deux périmètres séparément avec un bandeau de non-confusion.

**Données intégrées (vérifiées le 11/08/2026 contre 5 sources)** :
- Tunisie **#84 mondial**, +36,6 %, **#2 Afrique du Nord** (Égypte #65, Maroc #90) ;
- Villes classées : **Tunis #330**, **Sousse #1074** ;
- **156 startups** listées ; **GoMyCode #1** (SB Score 476, $9,7 M levés) ;
- Sources détaillées : page web `top-startups/tunisia`, API internes `/_next/data` (écosystème, fiche startup, leaderboards), rapport PDF officiel 2026 (p. 344–346).

**Fichiers** : `public/data/startupblink_tunisia.json` (copie locale archivée, non versionnée : `public/startupblinkecosystemreport2026.pdf`).
**Non intégrés (vérifiés, sans données TN)** : `startupblinkcorporate-report-2025.pdf`, `startupgenomegser-2026_9607.pdf`.
**À suivre** : Crunchbase (filtre Tunisie), Partech Africa Report, Africa: The Big Deal, Dealroom, rapports ANAVA – Smart Capital.

---

| Axe / sous-axe | Hypothèse | Question de veille | Informations recherchées | Sources envisagées | Méthodes | Outils | Remarque | Priorité |
|---|---|---|---|---|---|---|---|---|
| **Axe 1 — Dynamique du dispositif Startup Act** | Le dispositif Startup Act a connu une progression depuis son lancement, mais son évolution n'est probablement pas régulière selon les années et les sessions. | Comment le dispositif Startup Act a-t-il évolué quantitativement entre 2018 et 2026 ? | Candidatures ; sessions ; pré-labels ; labels ; conversions ; taux de labellisation ; retraits ; évolution annuelle et par session. | Startup Tunisia ; Smart Capital ; résultats officiels des sessions ; rapports annuels ; décisions de labellisation ; données institutionnelles. | Collecte documentaire exhaustive ; reconstitution chronologique ; analyse statistique descriptive ; analyse de séries temporelles. | **App interactive (Python/Streamlit)** ; Python (pandas) ; Excel ; Google Sheets ; Power BI. |  |  |
| 1.1. Candidatures | Le volume des candidatures a évolué selon la notoriété du dispositif, la conjoncture et les conditions d'accès. | Combien de candidatures ont été déposées depuis le lancement du dispositif et comment évoluent-elles ? | Nombre total de candidatures ; candidatures par année ; candidatures par session ; croissance annuelle ; moyenne par session ; périodes de hausse ou de baisse. | Résultats des sessions de labellisation ; Startup Tunisia ; archives institutionnelles. | Recensement exhaustif ; consolidation ; dédoublonnage ; analyse chronologique ; calcul de taux d'évolution. | **App (Dashboard + Sessions — KPI-26/28)** ; Python (pandas) ; Excel ; Google Sheets ; Power BI. | PV Session | 5 |
| 1.2. Sessions de labellisation | La fréquence et la régularité des sessions influencent le nombre de candidatures traitées et de labels attribués. | Combien de sessions ont été organisées et quelle a été leur régularité ? | Nombre total de sessions ; sessions par année ; dates ; intervalle moyen entre deux sessions ; candidatures moyennes par session ; sessions exceptionnelles. | Startup Tunisia ; publications officielles ; résultats des sessions. | Reconstitution du calendrier ; analyse descriptive ; mesure des intervalles. | **App (page Sessions — 85 sessions)** ; Python (pandas) ; Excel ; calendrier chronologique ; Power BI. | PV Session | 5 |
| 1.3. Pré-labels attribués | Le pré-label constitue une voie importante d'accès au dispositif pour les projets n'ayant pas encore créé leur entreprise. | Comment le nombre de pré-labels a-t-il évolué depuis le lancement du dispositif ? | Nombre total ; pré-labels par session et par année ; part dans les décisions ; évolution annuelle ; profils des bénéficiaires si disponibles. | Startup Tunisia ; résultats des sessions ; rapports annuels ; bases du Collège des startups. | Analyse statistique ; séries temporelles ; comparaison interannuelle. | **App (Dashboard + Parcours — cumul KPI-27)** ; Python (pandas) ; Excel ; Power BI. | PV Session | 5 |
| 1.4. Startup Labels attribués | Le nombre de labels a progressé, mais avec des variations importantes selon les sessions. | Combien de labels ont été attribués et comment leur nombre évolue-t-il ? | Labels directs ; anciens pré-labels devenus labels ; labels par session ; labels par année ; cumul ; évolution annuelle. | Résultats officiels des sessions ; Startup Tunisia ; Smart Capital. | Recensement exhaustif ; classification ; analyse cumulative ; comparaison annuelle. | **App (Dashboard + Parcours — cumul KPI-27)** ; Python (pandas) ; Excel ; Google Sheets ; Power BI. | PV Session | 5 |
| 1.5. Taux de labellisation | Le taux de labellisation varie selon la qualité des candidatures, les critères appliqués et les sessions. | Quelle proportion des candidatures aboutit à l'obtention d'un label ? | Nombre de candidatures ; nombre de labels ; taux global ; taux annuel ; taux par session ; taux de label direct ; écarts entre sessions. | Résultats officiels des sessions ; Startup Tunisia. | Calcul de ratios ; analyse comparative ; identification des valeurs extrêmes. | **App (calcul direct 1 311/2 958 = 44,3 %)** ; Python (pandas) ; Excel ; Power BI. | PV Session | 5 |
| 1.6. Conversion pré-label vers label | Une partie importante des pré-labels n'est probablement pas convertie dans les délais ou conditions prévus. | Combien de pré-labels sont convertis en labels et dans quels délais ? | Pré-labels convertis ; non convertis ; taux de conversion ; délai moyen et médian ; conversion par cohorte ; motifs de non-conversion si disponibles. | Startup Tunisia ; bases du Collège des startups ; RNE ; bénéficiaires. | Suivi de cohorte ; appariement des identifiants ; analyse de délai ; enquête complémentaire. | **App (page Parcours — 502 conversions, 80,6 %)** ; Python/R (appariement) ; Excel ; Power BI. | PV Session | 5 |
| 1.7. Retrait ou perte du label | Les retraits de label restent minoritaires mais fournissent des informations importantes sur les limites du dispositif et la pérennité des startups. | Combien de labels ont été retirés et pour quels motifs ? | Nombre total ; retraits par année ; motif réglementaire ; âge de la startup ; secteur ; localisation ; statut après retrait. | Startup Tunisia ; décisions officielles ; RNE ; textes réglementaires ; startups concernées. | Analyse documentaire ; classification des motifs ; analyse statistique ; étude de cas si nécessaire. | **App (page Parcours — 140 retraits)** ; Python (pandas) ; Excel ; Zotero ; Power BI. | PV Session | 5 |
| 1.8. Efficacité administrative du dispositif | L'évolution du nombre de dossiers peut avoir affecté les délais de traitement du dispositif. | Les délais entre candidature, décision, pré-label et label ont-ils évolué ? | Date de candidature ; date de session ; date de décision ; durée de traitement ; délai de conversion ; variations annuelles. | Startup Tunisia ; candidats ; bases de gestion du dispositif. | Analyse de processus ; mesure des délais ; analyse par cohorte. | Python (analyse de processus) ; Excel ; diagramme BPMN ; Power BI. | Demander à startup Tunisia | 3 |
| **Axe 2 — Caractéristiques des startups labellisées** | Les startups labellisées présentent des profils juridiques, sectoriels et organisationnels différenciés. | Quelles sont les principales caractéristiques des startups ayant obtenu le label ? | Secteur principal ; forme juridique ; date de création ; âge au label ; ancienneté ; taille de l'équipe ; caractéristiques organisationnelles. | Startup Tunisia ; RNE ; APII ; sites des startups ; questionnaires ; rapports. | Analyse descriptive ; classification ; consolidation de bases ; contrôle croisé. | **App (pages Secteurs + Startups)** ; Python (pandas) ; Excel ; Google Sheets ; Power BI. |  |  |
| 2.1. Secteur principal d'activité | Les startups labellisées sont concentrées dans un nombre limité de secteurs, notamment numériques. | Quels secteurs d'activité sont les plus représentés parmi les startups labellisées ? | Secteur principal ; sous-secteur ; technologie ; nombre et pourcentage par secteur ; classification officielle utilisée. | Startup Tunisia ; RNE ; APII ; sites web ; questionnaires. | Codification sectorielle ; analyse descriptive ; harmonisation des nomenclatures. | **App (page Secteurs — HHI, Top 4, KPI-39)** ; Python (harmonisation) ; Excel ; dictionnaire sectoriel ; Power BI. | PV Session | 5 |
| 2.2. Forme juridique | Certaines formes juridiques sont largement dominantes parmi les startups labellisées. | Quelles formes juridiques sont utilisées par les startups et comment évoluent-elles ? | SARL ; SUARL ; SA ; autres formes ; nombre ; pourcentage ; évolution annuelle ; changement de forme juridique. | RNE ; Startup Tunisia ; APII ; JORT si nécessaire. | Analyse descriptive ; comparaison temporelle. | Python (pandas) ; Excel ; Power BI ; extraction RNE. | Vérifier si les fondateurs sont aussi des associés | 3 |
| 2.3. Âge lors de la labellisation | La majorité des startups obtiennent le label peu de temps après leur création. | Quel est l'âge des entreprises au moment de l'obtention du label ? | Date de création ; date de labellisation ; âge en mois ou années ; moyenne ; médiane ; tranches d'âge ; écarts sectoriels. | RNE ; Startup Tunisia ; résultats des sessions. | Calcul de durée ; analyse statistique ; segmentation par cohorte. | **App (Dashboard — KPI-31/32, histogramme âge)** ; Python ; Excel ; Power BI. | PV Session: Label date - Année création | 5 |
| 2.4. Ancienneté actuelle | Les cohortes les plus anciennes permettent de mieux observer la pérennité du tissu startup. | Quelle est l'ancienneté des startups encore actives en 2026 ? | Date de création ; statut actuel ; ancienneté ; cohorte de label ; activité ou cessation. | RNE ; Startup Tunisia ; sites officiels ; startups. | Analyse de cohorte ; calcul d'ancienneté ; contrôle du statut. | **App (Dashboard — KPI-33)** ; Python ; Excel ; Power BI. | Concentrer sur les plus anciens lors d'étude d'impact | 5 |
| 2.5. Taille de l'équipe fondatrice | La plupart des startups sont créées par de petites équipes fondatrices. | Combien de fondateurs composent les équipes des startups labellisées ? | Nombre de fondateurs ; fondateur unique ; équipes de deux, trois ou plus ; évolution ; variations sectorielles. | Dossiers de candidature ; Startup Tunisia ; LinkedIn ; questionnaires. | Analyse descriptive ; vérification croisée ; enquête. | Python (comptage du champ `founders`) ; Excel ; Google Forms ; LinkedIn ; Power BI. | PV Session | 3 |
| 2.6. Taille de l'entreprise | Les startups labellisées sont principalement de petites structures, mais leur taille varie selon l'âge et le secteur. | Quelle est la taille des startups labellisées ? | Nombre de salariés ; tranches d'effectif ; moyenne ; médiane ; taille par âge, secteur et cohorte. | Reportings ; CNSS ; Startup Tunisia ; questionnaires. | Analyse statistique descriptive ; croisements multivariés simples. | Google Forms ; Excel ; Power BI (données CNSS/reportings). | Via Questionnaire / interview ou voir startup tunisia (rapport annuel des startups) | 4 |
| 2.7. Statut d'activité | Une partie des startups labellisées peut être inactive, en cessation ou redomiciliée. | Quel est le statut actuel des startups ayant obtenu le label ? | Active ; en sommeil ; en liquidation ; radiée ; acquise ; fusionnée ; redomiciliée ; label retiré. | RNE ; Startup Tunisia ; sites des startups ; presse économique ; questionnaires. | Vérification multi-source ; classification du statut ; analyse descriptive. | Python ; Excel ; Zotero ; Power BI ; vérification RNE. | Via Questionnaire / interview | 3 |
| **Axe 3 — Profil des entrepreneurs** | Les fondateurs des startups labellisées présentent des caractéristiques sociodémographiques et professionnelles spécifiques. | Qui sont les entrepreneurs ayant fondé les startups labellisées en Tunisie ? | Genre ; âge ; formation ; université ; expérience ; antécédents entrepreneuriaux ; statut étudiant ; diaspora. | Dossiers de candidature ; Startup Tunisia ; questionnaires ; LinkedIn ; universités ; réseaux de diaspora. | Analyse descriptive ; enquête ; appariement de données ; entretiens complémentaires. | Google Forms ; Python (nettoyage) ; Excel ; Power BI ; LinkedIn ; NVivo. | Via Questionnaire / interview importante pour savoir si le profil d'entrepreneur est important pour l'impact | 2/3 |
| 3.1. Nombre de fondateurs | Le nombre total de fondateurs est nettement supérieur au nombre de startups, mais les données sont dispersées. | Combien de fondateurs sont associés aux startups labellisées ? | Nombre total de personnes uniques ; nombre moyen de fondateurs par startup ; fondateurs présents dans plusieurs startups ; rôles. | Dossiers Startup Tunisia ; RNE ; questionnaires ; LinkedIn. | Dédoublonnage ; appariement des identités ; analyse descriptive. | Python (dédoublonnage des noms) ; Excel ; Power BI ; LinkedIn. | Via Questionnaire / interview pour analyser l'impact selon profil | 3 |
| 3.2. Genre | Les femmes sont sous-représentées parmi les fondateurs et dans les équipes dirigeantes. | Quelle est la répartition des fondateurs selon le genre ? | Nombre et pourcentage ; équipes mixtes ; startups fondées uniquement par des femmes ; évolution annuelle ; différences sectorielles et territoriales. | Dossiers de candidature ; Startup Tunisia ; questionnaires ; LinkedIn. | Analyse descriptive ; analyse croisée ; vérification manuelle si nécessaire. | Python (classification des prénoms) ; Excel ; Power BI ; LinkedIn. | PV Session: analyse les nom & recherche sur linked'in | 2 |
| 3.3. Âge des entrepreneurs | Les fondateurs sont principalement de jeunes adultes, mais certaines tranches d'âge sont moins représentées. | Quel est l'âge des fondateurs au moment de la candidature ou de la labellisation ? | Date de naissance ou âge ; âge moyen et médian ; tranches d'âge ; évolution par cohorte ; comparaison selon le genre et le secteur. | Dossiers de candidature ; questionnaires ; Startup Tunisia. | Statistiques descriptives ; segmentation. | Google Forms ; Excel ; Power BI. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.4. Niveau d'études | Les fondateurs possèdent majoritairement un niveau d'enseignement supérieur. | Quel est le niveau de formation des entrepreneurs ? | Diplôme le plus élevé ; domaine de formation ; doctorat ; ingénierie ; gestion ; autodidactes ; répartition. | Dossiers ; questionnaires ; LinkedIn ; universités. | Enquête ; codification des diplômes ; analyse descriptive. | Google Forms ; Excel ; Power BI. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.5. Université ou établissement d'origine | Certaines universités et écoles contribuent davantage à la création de startups labellisées. | Quels établissements ont formé le plus grand nombre de fondateurs ? | Université ; école ; pays d'études ; nombre de fondateurs ; domaines ; réseaux d'anciens. | Questionnaires ; LinkedIn ; universités ; dossiers de candidature. | Collecte déclarative ; normalisation des noms ; classement descriptif. | Google Forms ; Excel ; Power BI ; LinkedIn. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.6. Expérience professionnelle | Une expérience professionnelle antérieure facilite la création et le développement de la startup. | Quelle expérience les fondateurs possédaient-ils avant de créer leur startup ? | Nombre d'années ; secteur ; fonction ; expérience internationale ; salariat public ou privé ; première expérience. | Questionnaires ; LinkedIn ; entretiens. | Analyse descriptive ; segmentation ; analyse de parcours. | Google Forms ; Excel ; NVivo (entretiens). | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.7. Expérience entrepreneuriale antérieure | Une partie des fondateurs est composée d'entrepreneurs récidivistes. | Combien de fondateurs avaient déjà créé une entreprise ou une startup ? | Entreprises précédentes ; réussite ou échec ; nombre de projets ; secteur ; expérience de sortie. | Questionnaires ; RNE ; LinkedIn ; entretiens. | Analyse de parcours ; vérification documentaire ; statistique descriptive. | Google Forms ; Excel ; LinkedIn ; RNE. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.8. Entrepreneuriat étudiant | Le pré-label a facilité l'émergence de projets portés par des étudiants. | Quelle part des fondateurs était étudiante au moment du lancement du projet ? | Statut étudiant ; université ; programme étudiant-entrepreneur ; pré-label ; création ultérieure ; maintien du projet. | Universités ; pôles étudiants entrepreneurs ; Startup Tunisia ; questionnaires. | Analyse de cohorte ; enquête ; suivi de parcours. | Google Forms ; Excel ; Power BI. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| 3.9. Diaspora | La diaspora tunisienne joue un rôle significatif dans la création, le financement et l'internationalisation des startups. | Quelle est la contribution des entrepreneurs issus de la diaspora ? | Résidence antérieure ; pays ; retour en Tunisie ; cofondateurs à l'étranger ; marchés ; compétences ; investissements. | Questionnaires ; Startup Tunisia ; FIPA ; réseaux de diaspora ; LinkedIn. | Enquête ; entretiens ; cartographie des parcours. | Google Forms ; Excel ; QGIS (carte des pays) ; NVivo ; FIPA. | Via Questionnaire / interview pour analyser l'impact selon profil |  |
| **Axe 4 — Répartition territoriale et dynamique sectorielle** | Les startups sont fortement concentrées dans certains territoires et secteurs, et cette concentration évolue lentement. | Comment les startups labellisées sont-elles réparties sur le territoire et comment la structure sectorielle évolue-t-elle ? | Gouvernorat ; région ; localisation réelle ; secteur ; spécialisation ; concentration ; évolution annuelle ; écosystèmes régionaux. | Startup Tunisia ; RNE ; APII ; INS ; incubateurs régionaux ; technopoles ; rapports. | Analyse territoriale ; cartographie ; analyse sectorielle ; calcul d'indices de concentration. | **App (pages Secteurs + Géographie)** ; Python ; QGIS ; Excel ; Power BI. | Voir startup Tunisia | 3 |
| 4.1. Répartition par gouvernorat | Le Grand Tunis concentre une majorité des startups labellisées. | Combien de startups sont implantées dans chaque gouvernorat ? | Siège juridique ; lieu d'activité ; nombre ; pourcentage ; densité par population ou entreprises ; évolution. | Startup Tunisia ; RNE ; INS ; startups. | Géocodage ; analyse descriptive ; cartographie. | Python (géocodage des sièges) ; QGIS ; Excel ; Power BI. | Voir startup Tunisia |  |
| 4.2. Répartition par grande région | Les régions littorales sont davantage représentées que les régions intérieures. | Quelle est la répartition entre Grand Tunis, Nord-Est, Nord-Ouest, Centre-Est, Centre-Ouest, Sud-Est et Sud-Ouest ? | Nombre ; part ; densité ; évolution ; secteurs dominants ; emplois si disponibles. | Startup Tunisia ; INS ; RNE. | Agrégation territoriale ; analyse comparative ; cartographie. | Python ; QGIS ; Excel ; Power BI. | Voir startup Tunisia |  |
| 4.3. Concentration territoriale | Une part élevée des startups, des emplois et des secteurs technologiques est concentrée dans quelques gouvernorats. | Quel est le niveau de concentration territoriale du dispositif ? | Part des trois ou cinq premiers gouvernorats ; indice de concentration ; évolution ; poids du Grand Tunis. | Base consolidée de l'axe ; INS. | Calcul d'indices ; analyse comparative temporelle. | Python (calcul d'indices) ; Excel ; Power BI. |  |  |
| 4.4. Écosystèmes régionaux | La présence d'incubateurs, universités et technopoles influence la localisation des startups. | Quels territoires disposent d'un écosystème favorable à l'émergence de startups ? | Incubateurs ; universités ; technopoles ; investisseurs ; programmes ; nombre de startups ; spécialisation locale. | Ministères ; universités ; incubateurs ; technopoles ; APII ; Startup Tunisia. | Cartographie des acteurs ; analyse de corrélation descriptive ; étude territoriale. | QGIS ; Excel ; Power BI. | Axe d'étude 4 - Voir startup Tunisia, technopole et autres acteurs | 3 |
| 4.5. Répartition sectorielle | Les secteurs numériques dominent nettement l'écosystème labellisé. | Quelle est la part de chaque secteur dans l'ensemble des startups labellisées ? | Nombre ; pourcentage ; sous-secteur ; classement ; concentration ; secteurs émergents. | Startup Tunisia ; RNE ; APII ; sites des startups. | Harmonisation sectorielle ; statistiques descriptives. | **App (page Secteurs — HHI, Top 4)** ; Python (dictionnaire sectoriel) ; Excel ; Power BI. |  |  |
| 4.6. Évolution sectorielle annuelle | La composition sectorielle de l'écosystème évolue avec l'apparition de nouveaux domaines technologiques. | Quels secteurs progressent, stagnent ou reculent selon les cohortes de labellisation ? | Startups par secteur et par année ; taux de croissance ; entrées ; retraits ; secteurs émergents. | Startup Tunisia ; résultats des sessions ; base consolidée. | Analyse de séries temporelles ; matrice année-secteur. | **App (page Secteurs — KPI-39, Top 5)** ; Python (matrice année × secteur) ; Excel ; Power BI. |  |  |
| 4.7. Spécialisation territoriale | Certains gouvernorats ou régions développent une spécialisation sectorielle particulière. | Existe-t-il des spécialisations sectorielles selon les territoires ? | Secteur par gouvernorat ; poids relatif ; clusters ; universités ou technopoles associées. | Base consolidée ; APII ; technopoles ; universités. | Tableau croisé ; indice de spécialisation ; cartographie thématique. | Python (tableau croisé) ; QGIS ; Excel ; Power BI. |  |  |
| **Axe 5 — Innovation et potentiel technologique** | Les startups labellisées présentent un niveau d'innovation variable, et les données disponibles restent insuffisamment consolidées. | Quel est le profil d'innovation et le potentiel technologique des startups labellisées ? | DeepTech ; brevets ; marques ; logiciels ; domaines technologiques ; R&D ; collaborations scientifiques ; indicateurs disponibles. | Startup Tunisia ; INNORPI ; MESRS ; universités ; centres de recherche ; startups ; rapports DeepTech. | Analyse documentaire ; exploitation de bases ; questionnaire ; classification technologique ; études de cas. | Python ; Excel ; Power BI ; Zotero ; bases INNORPI ; Google Forms. | Via Questionnaire / interview pour analyser l'impact deeptech ---- voir livre blanc giz deeptech | 2/3 |
| 5.1. Identification des startups DeepTech | La part des startups DeepTech reste limitée et insuffisamment documentée. | Combien de startups labellisées peuvent être classées comme DeepTech ? | Définition retenue ; technologie ; intensité R&D ; origine scientifique ; TRL ; temps de développement ; barrières technologiques. | Startup Tunisia ; MESRS ; universités ; centres de recherche ; startups ; Livre Blanc Technoriat. | Définition opérationnelle ; grille de classification ; revue experte ; questionnaire. | Python (grille de classification DeepTech) ; Excel ; Google Forms ; Zotero. |  | 3 |
| 5.2. Domaines technologiques | Les startups se concentrent dans certains domaines numériques, tandis que les technologies scientifiques restent minoritaires. | Quels domaines technologiques sont représentés ? | IA ; Big Data ; cybersécurité ; IoT ; biotech ; greentech ; fintech ; agritech ; healthtech ; autres domaines. | Sites des startups ; dossiers ; questionnaires ; rapports sectoriels. | Codification technologique ; analyse descriptive ; classification multiple. | Python (codification technologique) ; Excel ; Power BI ; dictionnaire technologique. |  | 2 |
| 5.3. Brevets nationaux | Peu de startups disposent de brevets déposés en Tunisie. | Combien de startups ont déposé ou obtenu un brevet national ? | Demandes ; brevets accordés ; titulaires ; dates ; domaines ; statut ; co-déposants. | INNORPI ; startups ; cabinets de propriété intellectuelle. | Recherche dans les bases ; appariement avec la liste des startups ; vérification. | Base INNORPI ; Python (appariement des noms) ; Excel. |  | 3 |
| 5.4. Brevets internationaux | Les dépôts internationaux sont concentrés dans un nombre très limité de startups. | Combien de brevets internationaux sont associés aux startups labellisées ? | PCT ; EPO ; USPTO ; pays ; familles de brevets ; statut ; titulaires. | WIPO Patentscope ; Espacenet ; Google Patents ; startups. | Recherche brevet ; appariement des noms ; validation manuelle. | Patentscope ; Espacenet ; Google Patents ; Excel. |  | 3 |
| 5.5. Autres formes de propriété intellectuelle | Les startups utilisent davantage les marques, logiciels et secrets d'affaires que les brevets. | Quelles formes de propriété intellectuelle sont utilisées ? | Marques ; dessins et modèles ; logiciels ; licences ; secrets ; contrats de transfert ; protection internationale. | INNORPI ; startups ; cabinets PI ; questionnaires. | Questionnaire ; recherche dans les bases ; analyse descriptive. | Google Forms ; bases INNORPI ; Excel. |  |  |
| 5.6. Recherche et développement | Les dépenses et équipes de R&D sont concentrées dans certaines startups technologiques. | Quelle part des startups mène des activités structurées de R&D ? | Budget R&D ; personnel ; chercheurs ; projets ; équipements ; financement ; part du CA. | Startups ; MESRS ; programmes R&D ; états financiers. | Questionnaire ; analyse financière ; entretiens ciblés. | Google Forms ; Excel ; Power BI. | Via Questionnaire / interview | 3 |
| 5.7. Collaboration avec la recherche | Les liens entre startups, universités et laboratoires restent limités malgré leur importance pour la DeepTech. | Combien de startups collaborent avec des établissements de recherche ? | Partenariats ; laboratoires ; conventions ; chercheurs-fondateurs ; stages ; projets conjoints ; transferts. | Universités ; MESRS ; centres de recherche ; startups. | Cartographie des collaborations ; enquête ; entretiens. | Excel ; QGIS/cartographie réseau ; NVivo. | Via Questionnaire / interview | 2 |
| 5.8. Disponibilité et qualité des données d'innovation | Les données sur l'innovation sont moins disponibles et moins homogènes que les données de labellisation. | Quelles données d'innovation existent et quelles données doivent être collectées directement ? | Bases disponibles ; variables ; fréquence ; couverture ; données manquantes ; définitions ; accès. | Startup Tunisia ; INNORPI ; MESRS ; INS ; startups. | Audit des données ; analyse des écarts ; élaboration d'un dictionnaire. | Python (audit des données) ; Excel ; grille qualité. |  | 1 |

---

## Annexe — Analyse de couverture du plan de veille par rapport à l'app

**Statut par sous-axe** : ✅ Couvert dans l'app · ⚠️ Partiel (une partie des indicateurs) · ❌ Manquant (rien dans l'app)

### Axe 1 — Dynamique du dispositif

| Sous-axe | Statut | Ce qui manque |
|---|---|---|
| 1.1 Candidatures | ✅ | Total ✓, par année ✓, par session ✓, croissance annuelle ✓ (KPI-26), moyenne par session ✓ (KPI-28) |
| 1.2 Sessions | ⚠️ | 85 ✓, par année ✓, candidatures moyennes/session ✓ (KPI-28) — intervalle moyen entre sessions ❌ |
| 1.3 Pré-labels | ⚠️ | Total ✓, par année/session ✓, cumul ✓ (KPI-27) — évolution annuelle à affiner |
| 1.4 Labels | ⚠️ | Total ✓, par session ✓, cumul ✓ (KPI-27) — part des conversions à affiner |
| 1.5 Taux de labellisation | ⚠️ | Global 44,3 % ✓, annuel ✓, par session ✓ — taux de label direct ❌ (calculable) |
| 1.6 Conversion | ⚠️ | Nombre ✓, taux ✓ — délai moyen/médian ❌, par cohorte ❌, motifs ❌ |
| 1.7 Retrait | ⚠️ | Total ✓, par année ✓ — motif ❌, âge/secteur/localisation des retirés ❌, statut après retrait ❌ |
| 1.8 Efficacité administrative | ❌ | Délais de traitement (candidature→décision→label) : rien du tout |

### Axe 2 — Caractéristiques des startups

| Sous-axe | Statut | Ce qui manque |
|---|---|---|
| 2.1 Secteur principal | ✅ | Nombre ✓, % ✓, classement ✓, HHI ✓ |
| 2.2 Forme juridique | ❌ | Aucune donnée (à ajouter à database.csv) |
| 2.3 Âge à la labellisation | ✅ | Calculé (KPI-31 âge moyen 1,0 an, KPI-32 distribution) |
| 2.4 Ancienneté actuelle | ✅ | Calculé (KPI-33, 6,0 ans) |
| 2.5 Taille équipe fondatrice | ⚠️ | Champ founders texte — comptage possible |
| 2.6 Taille de l'entreprise (salariés) | ❌ | Données absentes |
| 2.7 Statut d'activité (cessation, liquidation…) | ❌ | Données absentes |

### Axe 3 — Profil des entrepreneurs

| Sous-axe | Statut | Ce qui manque |
|---|---|---|
| 3.1 Nombre de fondateurs | ⚠️ | Données founders dispersées |
| 3.2 Genre | ⚠️ | Seul un insight (35%→21%) existe — pas de page/analyse dédiée |
| 3.3 Âge des entrepreneurs | ❌ | Données absentes |
| 3.4 Niveau d'études | ❌ | Données absentes |
| 3.5 Université d'origine | ❌ | Données absentes |
| 3.6 Expérience professionnelle | ❌ | Données absentes |
| 3.7 Expérience entrepreneuriale | ❌ | Données absentes |
| 3.8 Entrepreneuriat étudiant | ❌ | Données absentes |
| 3.9 Diaspora | ❌ | Données absentes |

### Axe 4 — Répartition territoriale et dynamique sectorielle

| Sous-axe | Statut | Ce qui manque |
|---|---|---|
| 4.1 Répartition par gouvernorat | ❌ | L'app n'a que 4 zones du rapport 2021 (Grand Tunis 48%, Sousse 17%, Kairouan 13%, Kasserine 9%) |
| 4.2 Grande région (7 régions) | ⚠️ | Données 2021 du rapport, non actualisées |
| 4.3 Concentration territoriale | ⚠️ | 48% Grand Tunis affiché, mais pas d'indice de concentration |
| 4.4 Écosystèmes régionaux | ❌ | Données absentes |
| 4.5 Répartition sectorielle | ✅ | Complète |
| 4.6 Évolution sectorielle annuelle | ✅ | Calculé (KPI-39, Top 5 secteurs) |
| 4.7 Spécialisation territoriale | ❌ | Données absentes |

### Axe 5 — Innovation et potentiel technologique

| Sous-axe | Statut |
|---|---|
| 5.1 Startups DeepTech | ❌ |
| 5.2 Domaines technologiques | ❌ |
| 5.3 Brevets nationaux | ❌ |
| 5.4 Brevets internationaux | ❌ |
| 5.5 Autres formes de PI | ❌ |
| 5.6 R&D | ❌ |
| 5.7 Collaboration avec la recherche | ❌ |
| 5.8 Qualité des données innovation | ❌ |

> Tout l'Axe 5 est absent — c'est le bloc le plus lourd à couvrir (exige la collecte INNORPI, WIPO/Patentscope, questionnaires).

### Synthèse globale

| Bloc | ✅ | ⚠️ | ❌ |
|---|---|---|---|
| Axe 1 — Dynamique | 1 | 6 | 1 |
| Axe 2 — Caractéristiques | 3 | 1 | 3 |
| Axe 3 — Entrepreneurs | 0 | 2 | 7 |
| Axe 4 — Territorial/sectoriel | 2 | 2 | 3 |
| Axe 5 — Innovation | 0 | 0 | 8 |
| **Total (39 sous-axes)** | **6** | **11** | **22** |

### Priorités d'implémentation dans l'app

**Niveau 1 — Calculables immédiatement, zéro nouvelle donnée — ✅ implémenté dans l'app** :
1. Âge des startups à la labellisation (2.3) : histogramme + âge moyen/médian → Dashboard ✅
2. Ancienneté actuelle (2.4) : cohortes → Dashboard ✅
3. Évolutions annuelles + cumul (1.1, 1.4) : ligne cumulative labels/candidatures → Dashboard ✅
4. Moyenne candidatures/session + intervalle moyen (1.2) : KPI → Sessions ✅
5. Évolution sectorielle annuelle (4.6) : graphique année × secteur → Secteurs ✅

**Niveau 2 — Données à enrichir dans database.csv (débloque les axes 2, 3, 4)** :
6. Colonnes : Forme juridique, Gouvernorat, Genre fondateur(s), Date de naissance fondateur, Université → couvre 2.2, 3.1-3.5, 4.1, 4.3

**Niveau 3 — Collecte externe (axes 3.6-3.9, 5.x)** :
7. Questionnaire fondateurs (Google Forms) pour expérience, diaspora, entrepreneuriat étudiant
8. Recherche brevets (INNORPI, Patentscope/Espacenet) pour l'Axe 5

**Niveau 4 — Non couvert, à documenter comme limite** :
9. 1.7 motifs de retrait, 1.8 délais administratifs, 4.4 écosystèmes — nécessitent ANPR/entretiens

---

## Annexe — Couverture du catalogue de KPI (section 9 de la Charte de cadrage)

### KPI du Google Docs AE1 présents dans l'app ✅

| KPI (Google Docs) | Dans l'app ? |
|---|---|
| Total candidatures | ✅ |
| Labels total / par année / par session | ✅ |
| Prélabels total / par année / par session | ✅ |
| Total sessions / par année | ✅ |
| Taux de labellisation (global + par année + par session) | ✅ |
| Nombre de conversions + taux de conversion (80,6 %) | ✅ |
| Total retraits + par année | ✅ |
| Startups par secteur + % | ✅ |
| Répartition par région + % (Grand Tunis 48 %, etc.) | ✅ |
| HHI, Top 4, secteur dominant | ✅ |

### KPI du Google Docs AE1 manquants dans l'app ❌

**Axe de veille 1 — Dynamique du dispositif**

| KPI manquant | Calculable aujourd'hui ? |
|---|---|
| Taux d'évolution annuel des candidatures | ✅ Oui (données disponibles) |
| Évolution annuelle des labels et prélabels | ✅ Oui |
| Nombre moyen de candidatures par session | ✅ Implémenté (2 958/85 = 34,8) |
| Délai moyen de conversion prélabel→label | ⚠️ Partiellement (dates dans parcours.json) |
| Retraits par motif réglementaire | ❌ Données absentes (les PDF ne les détaillent pas) |

**Axe de veille 2 — Caractéristiques des startups**

| KPI manquant | Calculable ? |
|---|---|
| Nombre / % de startups par forme juridique | ❌ Données absentes (la base n'a pas ce champ) |
| Âge moyen lors de la labellisation | ✅ Oui (labelDate − anneeCreation) |
| Nombre de startups selon leur âge à la labellisation | ✅ Oui |
| Ancienneté moyenne | ✅ Oui |

**Axe de veille 3 — Profil des entrepreneurs**

| KPI manquant | Calculable ? |
|---|---|
| Nombre de fondateurs | ⚠️ Partiellement (champ founders texte) |
| Répartition par genre | ⚠️ Partiel (insight 35 %→21 % existe, mais pas de page dédiée) |
| Tranche d'âge / niveau d'études / université | ❌ Données absentes |
| Expérience pro / entrepreneuriat étudiant / diaspora | ❌ Données absentes |

**Axe de veille 4 — Répartition**

| KPI manquant | Calculable ? |
|---|---|
| Nombre / % de startups par gouvernorat | ❌ (l'app n'a que 4 régions du rapport 2021) |
| Évolution annuelle par secteur | ✅ Oui |

**Axe de veille 5 — Innovation**

| KPI manquant | Calculable ? |
|---|---|
| Nb / % de startups DeepTech, brevets, domaines tech | ❌ Données absentes |

### Améliorations possibles de l'app

**A. KPI calculables — ✅ désormais implémentés dans l'app** :
1. KPI « Moyenne candidatures/session » (34,8) + « Évolution annuelle des candidatures » (KPI-26) + « Cumul labels/pré-labels » (KPI-27) → Dashboard/Sessions ✅
2. Carte « Âge des startups à la labellisation » (histogramme) + KPI « Âge moyen » (KPI-31/32) + « Ancienneté » (KPI-33) → Dashboard ✅
3. Graphique « Évolution annuelle par secteur » (KPI-39) → page Secteurs ✅
4. Taux d'acceptation corrigé (44,3 % = 1 311/2 958) → Dashboard ✅

**B. Mettre à jour les données manquantes pour les KPI restants** :
- Colonnes Forme juridique, Gouvernorat, Genre fondateur, Année de naissance fondateur dans database.csv → permet 15+ KPI nouveaux
- Motifs de retrait : collecte via communiqués ANPR → page Parcours

**C. Intégrer les 6 axes dans l'app (aujourd'hui l'app ne couvre que l'AE1)** :
- Le serveur /api/livrables/ ne liste que le dossier livrables/ racine (server.py:65) → il ignore les 6 sous-dossiers d'axes
- Ajouter une page « Axes » avec les 6 chartes (docx AE2-AE6 sont déjà dans les dossiers) → lien direct vers les fichiers

**D. Corrections de cohérence appliquées dans l'app** :
- page Sessions : annonce « 2 958 candidatures » — ✅ correct (somme des 85 sessions, données corrigées), cohérent avec le taux moyen 44,3 %
- Insights : « 10,7 % (140 retraits sur 1 311 labels) » — ✅ corrigé (au lieu de « 190 retraits sur 1824 »)
- Titre page Startups : « 922 startups » — ✅ cohérent avec la base

> **Conclusion** : ~20 KPI du Google Docs sont déjà dans l'app. Il manque 15 KPI (dont 8 sont calculables dès maintenant avec les données existantes) et il y a 2 incohérences chiffrées à corriger dans l'app.

---

## Annexe — Catalogue complet des 40 KPI (25 existants + 15 à compléter → 7 désormais implémentés)

### A. Les 25 KPI déjà dans l'app ✅

| # | Nom précis du KPI | Description | Valeur actuelle | Page dans l'app |
|---|---|---|---|---|
| KPI-01 | Startups labellisées (base) | Nombre total de startups uniques référencées dans la base de données | 922 | Dashboard |
| KPI-02 | Labels accordés | Total cumulé de labels Startup Act attribués sur les 85 sessions | 1 311 (corrigé) | Dashboard |
| KPI-03 | Candidatures déposées | Nombre total de candidatures reçues sur la période 2019-2026 | 2 958 (somme des 85 sessions) | Dashboard |
| KPI-04 | Pré-labels accordés | Total de pré-labels attribués, corrigé vs PDF officiels | 623 | Dashboard |
| KPI-05 | Taux d'acceptation moyen | Part des candidatures ayant abouti à un label, agrégée sur la période | 44,3 % (1 311 / 2 958) | Dashboard |
| KPI-06 | Concentration sectorielle (HHI) | Indice de Herfindahl-Hirschman des parts de secteurs (modérée si < 1 500) | calculé en direct | Secteurs |
| KPI-07 | Secteur dominant | Secteur d'activité le plus représenté parmi les startups | Business Software (23 %) | Secteurs |
| KPI-08 | Top 4 secteurs | Part cumulée des 4 premiers secteurs dans le total des startups | 51,6 % | Secteurs |
| KPI-09 | Part Grand Tunis | % des startups implantées dans le Grand Tunis (rapport 2021) | 48 % | Géographie |
| KPI-10 | Part Sousse | % des startups implantées à Sousse | 17 % | Géographie |
| KPI-11 | Part Kairouan | % des startups implantées à Kairouan | 13 % | Géographie |
| KPI-12 | Part Kasserine | % des startups implantées à Kasserine | 9 % | Géographie |
| KPI-13 | Conversions pré-label → label | Nombre total de pré-labels convertis en labels | 502 | Parcours |
| KPI-14 | Taux de conversion | Part des pré-labels accordés convertis en labels | 80,6 % | Parcours |
| KPI-15 | Pré-labels accordés (Parcours) | Total de pré-labels dans la lecture Parcours pré-label → label | 623 | Parcours |
| KPI-16 | Retraits de labels | Total de labels retirés sur la période, par année | 140 | Parcours |
| KPI-17 | Labels issus de conversion | Part des labels provenant d'une conversion pré-label → label | 38,3 % | Parcours |
| KPI-18 | Sessions vérifiées | Nombre total de sessions de labellisation auditées | 85 | Corrections |
| KPI-19 | Sessions corrigées | Nombre de sessions dont les valeurs scrapées étaient fausses | 20 | Corrections |
| KPI-20 | Labels avant → après correction | Écart entre valeurs scrapées (startup.gov.tn) et PDF officiels | 1 324 → 1 311 | Corrections |
| KPI-21 | Pré-labels avant → après correction | Écart entre valeurs scrapées et PDF officiels | 617 → 623 | Corrections |
| KPI-22 | Candidatures 2019-2020 | Nombre de candidatures du premier rapport annuel | 416 | Rapports |
| KPI-23 | Emplois créés 2020 | Nombre d'emplois créés par les startups labellisées (rapport 2020) | 3 222 | Rapports |
| KPI-24 | Investissement 2021 | Montant total levé par les startups en 2021 | 157 M USD | Rapports |
| KPI-25 | Part des femmes fondatrices | Évolution de la part des femmes dans la création de startups | 35 % → 21 % | Rapports |

### B. Les 15 KPI à compléter ❌

**Axe 1 — Dynamique du dispositif**

| # | Nom précis du KPI | Description | Formule / données | Faisabilité | Page cible |
|---|---|---|---|---|---|
| KPI-26 | Taux de croissance annuel des candidatures | Variation en % du nombre de candidatures entre deux années consécutives | (Candᵢ − Candᵢ₋₁) / Candᵢ₋₁ × 100 | ✅ Implémenté | Dashboard |
| KPI-27 | Cumul et évolution annuelle des labels et pré-labels | Courbe cumulative des labels et pré-labels + taux de variation annuel | Σ labels et Σ pré-labels par année | ✅ Implémenté | Dashboard |
| KPI-28 | Nombre moyen de candidatures par session | Volume moyen de dossiers traités par session de labellisation | 2 958 / 85 = 34,8 | ✅ Implémenté | Dashboard |
| KPI-29 | Délai moyen de conversion pré-label → label | Temps moyen entre l'attribution du pré-label et sa conversion en label | Dates dans `parcours.json` | ⚠️ Partiellement calculable | Parcours |
| KPI-30 | Retraits par motif réglementaire | Répartition des 140 retraits selon le motif réglementaire | Communiqués ANPR / décisions officielles | ❌ Collecte externe | Parcours |

**Axe 2 — Caractéristiques des startups**

| # | Nom précis du KPI | Description | Formule / données | Faisabilité | Page cible |
|---|---|---|---|---|---|
| KPI-31 | Âge moyen à la labellisation | Âge moyen des startups au moment de l'obtention du label | labelDate − année de création → 1,0 an | ✅ Implémenté | Dashboard |
| KPI-32 | Distribution par âge à la labellisation | Répartition des startups par tranche d'âge au label (0-1 an, 1-2, 2-3, 3-5, 5+) | Histogramme sur les 922 startups | ✅ Implémenté | Dashboard |
| KPI-33 | Ancienneté moyenne actuelle | Âge moyen des startups en 2026 | 2026 − année de création → 6,0 ans | ✅ Implémenté | Dashboard |
| KPI-34 | Répartition par forme juridique | % de startups SARL, SUARL, SA et autres | Colonne « Forme juridique » à ajouter dans `database.csv` | ❌ Collecte (RNE) | Startups |

**Axe 3 — Profil des entrepreneurs**

| # | Nom précis du KPI | Description | Formule / données | Faisabilité | Page cible |
|---|---|---|---|---|---|
| KPI-35 | Nombre de fondateurs | Nombre moyen de fondateurs par startup + fondateurs uniques | Comptage et dédoublonnage du champ `founders` | ⚠️ Partiellement calculable | Startups |
| KPI-36 | Répartition des fondateurs par genre | % de femmes/hommes, équipes mixtes, startups 100 % féminines, évolution annuelle | Insight existant (35 % → 21 %) à structurer en page dédiée | ⚠️ Partiel | Nouvelle page « Entrepreneurs » |
| KPI-37 | Profil sociodémographique des fondateurs | Âge, niveau d'études, université d'origine, expérience pro, entrepreneuriat étudiant, diaspora | Questionnaire fondateurs (Google Forms) | ❌ Collecte externe | Nouvelle page « Entrepreneurs » |

**Axe 4 — Répartition territoriale et sectorielle**

| # | Nom précis du KPI | Description | Formule / données | Faisabilité | Page cible |
|---|---|---|---|---|---|
| KPI-38 | Répartition par gouvernorat | % de startups par gouvernorat (24) + densité et évolution | Géocodage des 922 startups (siège juridique) | ❌ Collecte (base à enrichir) | Géographie |
| KPI-39 | Évolution annuelle par secteur | Matrice année × secteur : secteurs en progression, stagnation ou recul | Tableau croisé sur les 922 startups | ✅ Implémenté | Secteurs |

**Axe 5 — Innovation et potentiel technologique**

| # | Nom précis du KPI | Description | Formule / données | Faisabilité | Page cible |
|---|---|---|---|---|---|
| KPI-40 | Part de startups DeepTech / brevets / PI | % de startups DeepTech, brevets nationaux et internationaux, marques et autres PI | INNORPI, Patentscope/Espacenet, questionnaire | ❌ Collecte externe | Nouvelle page « Innovation » |

### Récapitulatif de faisabilité des 15 KPI à compléter

| Faisabilité | KPI concernés | Nombre |
|---|---|---|
| ✅ **Implémentés dans l'app** | KPI-26, KPI-27, KPI-28, KPI-31, KPI-32, KPI-33, KPI-39 | 7 |
| ⚠️ Partiellement calculables (données existantes à nettoyer / structurer) | KPI-29, KPI-35, KPI-36 | 3 |
| ❌ Nécessitent une collecte externe | KPI-30, KPI-34, KPI-37, KPI-38, KPI-40 | 5 |
| **Total** | | **15** |

> **Note de cohérence** : la synthèse précédente comptait « 8 calculables » en incluant le délai de conversion (KPI-29) et le nombre de fondateurs (KPI-35) comme réalisables avec effort ; le récapitulatif ci-dessus les classe en « partiellement calculables » pour plus de précision. Les 7 calculables sont désormais implémentés dans l'app. Total catalogue : **25 existants + 15 à compléter = 40 KPI**.

---

## Statut d'implémentation dans l'app (mise à jour)

**7 KPI calculables ont été implémentés dans `streamlit-app/public/index.html`** (calculés en temps réel à partir des données corrigées : 922 startups, 1 311 labels, 623 pré-labels). Les 8 autres nécessitent une extraction/collecte et ne sont **pas** implémentés pour l'instant.

| # | Nom précis du KPI | Statut dans l'app | Valeur calculée | Emplacement |
|---|---|---|---|---|
| KPI-26 | Taux de croissance annuel des candidatures | ✅ Implémenté | 2020 : +30,9 % · 2021 : +17,4 % · 2022 : −16,7 % · 2023 : −0,8 % · 2024 : +11,4 % · 2025 : −4,3 % · 2026 : −74,3 % | Page Sessions — « Croissance annuelle des candidatures » |
| KPI-27 | Cumul et évolution annuelle des labels et pré-labels | ✅ Implémenté | Cumul labels 1 311 · cumul pré-labels 623 (courbe) | Dashboard — « Cumul des labels et pré-labels » |
| KPI-28 | Nombre moyen de candidatures par session | ✅ Implémenté | 34,8 (2 958 / 85) | Dashboard — card KPI |
| KPI-29 | Délai moyen de conversion pré-label → label | ⏸️ Non implémenté | — (dates de conversion absentes) | — |
| KPI-30 | Retraits par motif réglementaire | ⏸️ Non implémenté | — (collecte ANPR) | — |
| KPI-31 | Âge moyen à la labellisation | ✅ Implémenté | 1,0 an (922 startups) | Dashboard — card KPI |
| KPI-32 | Distribution par âge à la labellisation | ✅ Implémenté | 0 an : 465 · 1 an : 256 · 2 ans : 81 · 3 ans : 54 · 4-5 ans : 45 · 6+ ans : 21 | Dashboard — « Âge des startups à la labellisation » |
| KPI-33 | Ancienneté moyenne actuelle | ✅ Implémenté | 6,0 ans | Dashboard — card KPI |
| KPI-34 | Répartition par forme juridique | ⏸️ Non implémenté | — (collecte RNE) | — |
| KPI-35 | Nombre de fondateurs | ⏸️ Non implémenté | — (champ `founders` texte, à nettoyer) | — |
| KPI-36 | Répartition des fondateurs par genre | ⏸️ Non implémenté | — (classification à faire) | — |
| KPI-37 | Profil sociodémographique des fondateurs | ⏸️ Non implémenté | — (questionnaire) | — |
| KPI-38 | Répartition par gouvernorat | ⏸️ Non implémenté | — (géocodage à faire) | — |
| KPI-39 | Évolution annuelle par secteur | ✅ Implémenté | Top 5 : Business Software (35→46→53→27→23→19→9), Commerce (15→37→20→16→4→2→1), HealthTech, EdTech, AdTech | Page Secteurs — « Évolution annuelle par secteur — Top 5 » |
| KPI-40 | Part de startups DeepTech / brevets / PI | ⏸️ Non implémenté | — (collecte INNORPI) | — |

**Correction de cohérence appliquée dans l'app** : insight « Taux de retrait des labels : 10,4 % (190 retraits sur 1824) » → **« 10,7 % (140 retraits sur 1 311 labels) »** (données corrigées `parcours.json`).

> ⚠️ **Clarification données** : le total de **2 958 candidatures** (page Sessions/Dashboard) est la somme de la colonne candidatures des 85 sessions et reste cohérent avec le taux d'acceptation moyen (1 311/2 958 = 44,3 %). Le chiffre « 1 824 » provient du fichier périmé `analyse_quantitative_results.json` (`pdf_extracted.total_entrees` = anciennes entrées extraites des PDFs, 80/85 sessions) — **ce n'est pas le nombre de candidatures** et il a été écarté.
