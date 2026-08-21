# Étude quantitative du Startup Act tunisien
## Sessions de labellisation, corrections de données et répartition géographique des startups (2019–2026)

**Auteur : Faker BEN NOOMEN**  
**Formation : Mastère professionnel en Veille et Intelligence Compétitive (VIC)**  
**Établissements : ESEN Manouba × ISCAE Manouba**  
**Version : 21 août 2026**

> **Résumé.** Cette étude analyse quantitativement les sessions de labellisation du Startup Act tunisien à partir de 85 sessions couvrant la période 2019–2026, des rapports annuels officiels 2019, 2020 et 2021, des comptes rendus PDF et des fichiers structurés du dépôt de recherche. Le protocole sépare les compteurs officiels par session des lignes individuelles extraites, afin d’éviter de confondre un total administratif avec un nombre d’enregistrements correctement reconstruits. Après correction, le corpus de sessions totalise **1 311 Labels** et **623 Prélabels**, soit **1 934 décisions positives**. La somme des candidatures du tableau corrigé utilisé dans cette étude est de **2 958**, mais une autre valeur de **3 015** apparaît dans des éléments du site/dataset ; cette divergence reste une limite à résoudre avant toute publication statistique définitive.

## 1. Introduction et contexte

Le Startup Act constitue le cadre tunisien de soutien aux startups. Le site officiel le décrit comme un ensemble de 20 mesures structuré autour d’un label de mérite, avec des avantages pour les startups, les entrepreneurs et les investisseurs [3]. Le cadre juridique de référence comprend notamment la loi n° 2018-20 du 17 avril 2018, le décret n° 2018-840 du 11 octobre 2018 et des circulaires de la Banque Centrale de Tunisie [3]. La page officielle de procédure distingue le Pré-Label, le Label et les étapes d’examen, et indique notamment qu’un projet peut obtenir un Pré-Label à partir d’un minimum de cinq avis favorables avant de créer son entreprise et de demander le Label [5].

L’objectif de cette recherche est de produire un **état des lieux quantitatif, traçable et reproductible** du dispositif de labellisation. L’étude ne cherche pas à évaluer causalement l’efficacité économique du Startup Act ; elle vise d’abord à mesurer les volumes, les décisions, les trajectoires temporelles, la concentration sectorielle et les disparités géographiques observables dans les sources disponibles.

Le projet a été réalisé par **Faker BEN NOOMEN**, développeur full-stack et étudiant en Intelligence Stratégique et Gestion de Projet. Le dépôt indique un Mastère professionnel VIC en cours en 2026, en collaboration entre l’ESEN Manouba et l’ISCAE Manouba, après un Mastère DDS à l’ESSECT Tunis, un Master IGP à l’ISIMS Sfax et une Licence en Informatique de Gestion à l’ESSECT Montfleury [1].

## 2. Problématique et questions de recherche

La problématique générale est la suivante : **comment la labellisation Startup Act a-t-elle évolué en volume, en sélection, en concentration sectorielle et en répartition géographique entre 2019 et 2026, et dans quelle mesure les données publiées peuvent-elles être considérées comme cohérentes et auditables ?**

Cette problématique est déclinée en quatre questions. Premièrement, les volumes de candidatures et de décisions évoluent-ils régulièrement d’une année à l’autre ? Deuxièmement, la structure des décisions distingue-t-elle clairement Label, Prélabel, refus et retrait ? Troisièmement, les startups sont-elles concentrées dans le Grand Tunis ou observe-t-on une diffusion vers les autres régions ? Quatrièmement, les valeurs publiées dans le site et les fichiers structurés sont-elles cohérentes avec les PDF et les rapports annuels officiels ?

## 3. Sources et périmètre documentaire

Le corpus principal est constitué du tableau corrigé de 85 sessions présent dans `public/data/corrections.json`, du fichier `dashboard_data.json`, de 85 comptes rendus PDF, de 1 824 lignes PDF extraites et des trois rapports annuels conservés dans le dépôt. La page officielle « Results » publie pour chaque session le nombre de candidatures, les Labels accordés, les Pré-Labels accordés, des commentaires et un lien vers le rapport PDF [4]. Les rapports annuels officiels 2019, 2020 et 2021 sont également disponibles depuis la page « Rapports annuels » du site Startup Tunisia [6].

| Source | Rôle analytique | Niveau de confiance retenu |
|---|---|---|
| Page officielle des résultats | Référence institutionnelle des indicateurs par session | Élevé pour la publication, à auditer pour les incohérences |
| PDF des comptes rendus | Source primaire des décisions et des sociétés | Élevé lorsque le texte ou le scan est lisible |
| `corrections.json` | Tableau harmonisé et corrections session par session | Élevé pour les compteurs corrigés déclarés |
| `dashboard_data.json` | Séries annuelles, secteurs, créations et lignes PDF | Élevé pour les agrégats fournis, variable pour les lignes décalées |
| Rapports annuels 2019–2021 | Géographie, internationalisation, emplois et contexte | Élevé pour les agrégats publiés, périmètre à respecter |

Le dépôt documente **21 sessions corrigées**. Les totaux avant correction étaient de 1 324 Labels et 617 Prélabels ; les totaux après correction sont de 1 311 Labels et 623 Prélabels [2]. La correction représente donc une baisse de 13 Labels et une hausse de 6 Prélabels. Cette modification n’est pas une simple variation statistique : elle signale que des valeurs extraites ou recopiées automatiquement ne doivent pas être considérées comme définitives sans rapprochement avec les PDF.

## 4. Méthodologie

### 4.1. Design de recherche

La recherche adopte un design **quantitatif descriptif, longitudinal et documentaire**, complété par un audit de qualité des données. L’unité principale d’analyse est la **session de labellisation**. Une seconde unité, utilisée pour les analyses détaillées, est la ligne de décision associée à une société. Les rapports annuels forment une troisième couche documentaire : ils sont analysés comme des sources d’agrégats institutionnels et non comme une base individuelle homogène avec les PDF de sessions.

La méthode est structurée en quatre couches. La première consiste à inventorier les 85 sessions et à normaliser les dates. La deuxième consiste à utiliser le tableau corrigé pour les compteurs officiels `candidatures`, `labels` et `preLabels`. La troisième consiste à conserver séparément les lignes individuelles extraites des PDF, avec les champs société, fondateurs, secteur, résultat et contrôle qualité. La quatrième consiste à extraire les valeurs géographiques des rapports annuels sans les fusionner artificiellement avec les sessions lorsque le dénominateur ou la population étudiée diffère.

### 4.2. Définitions opérationnelles

Dans cette étude, **Label accordé** et **Prélabel accordé** sont deux catégories distinctes. Le total « décisions positives » est la somme descriptive des deux catégories, mais il ne doit pas être interprété automatiquement comme un taux de réussite individuel : une même startup peut apparaître dans une trajectoire Prélabel → Label, et les compteurs administratifs ne sont pas toujours une table de candidatures individuelles dédoublonnée.

Le taux de Label est défini comme suit :

> **Taux de Label par session = Labels accordés / candidatures de la session × 100.**

Le rapport présente aussi la part descriptive `Labels + Prélabels / candidatures`, mais l’appelle explicitement une **part de décisions positives agrégées** et non un taux individuel de sélection. Cette distinction est nécessaire pour éviter de compter deux fois une trajectoire ou d’interpréter un Prélabel comme un Label définitif.

### 4.3. Contrôle de qualité

Le contrôle s’est appuyé sur les écarts entre tableau original et tableau corrigé, la présence de 85 sessions, la conservation des taux exacts et arrondis, la comparaison avec les PDF et l’examen des champs fondateurs. Les données géographiques ont été transcrites à partir des pages des rapports annuels puis harmonisées avec prudence : « Nord » et « Nord-Est » sont regroupés sous l’étiquette **Nord / Nord-Est** uniquement pour permettre une comparaison visuelle, tandis que la valeur et la formulation d’origine restent documentées dans les fichiers CSV.

## 5. Résultats quantitatifs des sessions

Le tableau corrigé contient 85 sessions. La somme des candidatures est de **2 958**, la somme des Labels est de **1 311** et la somme des Prélabels est de **623**. La moyenne est de **34,8 candidatures par session**, avec une médiane de 36. Le taux de Label pondéré par les candidatures est de **44,3 %**. La somme descriptive des Labels et Prélabels représente **65,4 %** des candidatures, mais cette dernière valeur ne doit pas être lue comme un taux individuel de sélection pour les raisons méthodologiques exposées plus haut.

| Indicateur | Valeur | Interprétation méthodologique |
|---|---:|---|
| Sessions | 85 | Corpus complet annoncé pour 2019–2026 |
| Candidatures, somme du tableau corrigé | 2 958 | Dénominateur de l’analyse principale |
| Labels accordés | 1 311 | Compteur officiel corrigé |
| Prélabels accordés | 623 | Compteur officiel corrigé |
| Labels + Prélabels | 1 934 | Total descriptif de décisions positives |
| Taux de Label pondéré | 44,3 % | Labels / candidatures |
| Moyenne de candidatures par session | 34,8 | Moyenne arithmétique |
| Médiane de candidatures par session | 36 | Robustesse aux sessions atypiques |
| Sessions corrigées | 21 | Écart documenté entre tableau initial et tableau corrigé |

![Évolution annuelle des candidatures et décisions](https://private-us-east-1.manuscdn.com/sessionFile/QFmTVjkYnVZXY8QBUVziQH/sandbox/Q1Xs94DcmFXmToO1FMf8gd-images_1787300317535_na1fn_L2hvbWUvdWJ1bnR1L3N0YXJ0dXBfYWN0X2Z1bGwvZmlndXJlc19hY2FkZW1pY19yZXBvcnQvMDFfZXZvbHV0aW9uX2FubnVlbGxl.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUZtVFZqa1luVlpYWThRQlVWemlRSC9zYW5kYm94L1ExWHM5NERjbUZYbVRvTzFGTWY4Z2QtaW1hZ2VzXzE3ODczMDAzMTc1MzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTjBZWEowZFhCZllXTjBYMloxYkd3dlptbG5kWEpsYzE5aFkyRmtaVzFwWTE5eVpYQnZjblF2TURGZlpYWnZiSFYwYVc5dVgyRnViblZsYkd4bC5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIFF~JiwwiN1kh9mbV9x2WaQZ8PdD1XlZDa5sqN07Lv8VAiEAu76OCxTQAzQOs0nwBN97S5uOozQM7kCRoYMeOKaGF~o_)

L’année 2021 constitue le pic du volume de candidatures avec 478 candidatures, suivie de 2024 avec 440 et de 2025 avec 421. L’année 2026 ne comporte que trois sessions dans le corpus ; elle est donc partielle et ne doit pas être comparée directement à une année complète. Les Labels atteignent leur volume annuel le plus élevé en 2021 avec 245, tandis que les Prélabels sont les plus nombreux en 2020 avec 108.

| Année | Sessions | Candidatures | Labels | Prélabels | Taux de Label |
|---:|---:|---:|---:|---:|---:|
| 2019 | 10 | 311 | 186 | 58 | 59,8 % |
| 2020 | 12 | 407 | 209 | 108 | 51,4 % |
| 2021 | 12 | 478 | 245 | 106 | 51,3 % |
| 2022 | 12 | 398 | 174 | 90 | 43,7 % |
| 2023 | 12 | 395 | 161 | 80 | 40,8 % |
| 2024 | 12 | 440 | 144 | 74 | 32,7 % |
| 2025 | 12 | 421 | 149 | 90 | 35,4 % |
| 2026* | 3 | 108 | 43 | 17 | 39,8 % |
| **Total** | **85** | **2 958** | **1 311** | **623** | **44,3 %** |

*2026 est une année partielle dans le corpus observé.*

La corrélation linéaire entre le nombre de candidatures et le taux de Label par session est négative et modérée dans ce corpus, avec `r = -0,35`. Cette statistique est descriptive et ne constitue pas une preuve que l’augmentation du volume provoque une sélection plus stricte. En revanche, la corrélation entre candidatures et nombre brut de décisions positives est positive, `r = 0,62`, ce qui est mécaniquement plausible puisqu’une session plus grande offre davantage de dossiers susceptibles d’aboutir à une décision positive.

La saisonnalité montre que le mois d’avril concentre le plus grand nombre cumulé de Labels, avec 124, tandis que septembre en compte 93. Ces résultats doivent être interprétés avec le nombre de sessions observées par mois et les changements de calendrier institutionnel ; ils ne démontrent pas un effet causal du mois.

![Saisonnalité des décisions positives](https://private-us-east-1.manuscdn.com/sessionFile/QFmTVjkYnVZXY8QBUVziQH/sandbox/Q1Xs94DcmFXmToO1FMf8gd-images_1787300317535_na1fn_L2hvbWUvdWJ1bnR1L3N0YXJ0dXBfYWN0X2Z1bGwvZmlndXJlc19hY2FkZW1pY19yZXBvcnQvMDNfc2Fpc29ubmFsaXRl.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUZtVFZqa1luVlpYWThRQlVWemlRSC9zYW5kYm94L1ExWHM5NERjbUZYbVRvTzFGTWY4Z2QtaW1hZ2VzXzE3ODczMDAzMTc1MzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTjBZWEowZFhCZllXTjBYMloxYkd3dlptbG5kWEpsYzE5aFkyRmtaVzFwWTE5eVpYQnZjblF2TUROZmMyRnBjMjl1Ym1Gc2FYUmwucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzg5NDMwNDAwfX19XX0_&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEYCIQDSkksOO72zaju5zFUrW9gaeinrku0f~1uycvOQn2StgwIhAMunO1ragdzxLyoWwMjqJy4p~T~Vn9FRHNtsJa2CtCjW)

## 6. Analyse sectorielle

La base sectorielle du dépôt contient 922 startups et 18 secteurs principaux. Les quatre secteurs les plus représentés sont **Business Software and Services**, **Commerce and Shopping**, **HealthTech** et **EdTech**. Ils représentent ensemble environ **51,6 %** de la base sectorielle. L’indice de concentration de Herfindahl-Hirschman calculé sur les parts sectorielles est de **1 044**, ce qui correspond à une concentration modérée selon les seuils usuels de lecture descriptive.

| Rang | Secteur | Nombre | Part approximative |
|---:|---|---:|---:|
| 1 | Business Software and Services | 212 | 23,0 % |
| 2 | Commerce and Shopping | 95 | 10,3 % |
| 3 | HealthTech | 86 | 9,3 % |
| 4 | EdTech | 83 | 9,0 % |
| **Top 4** |  | **476** | **51,6 %** |

![Top 10 des secteurs](https://private-us-east-1.manuscdn.com/sessionFile/QFmTVjkYnVZXY8QBUVziQH/sandbox/Q1Xs94DcmFXmToO1FMf8gd-images_1787300317535_na1fn_L2hvbWUvdWJ1bnR1L3N0YXJ0dXBfYWN0X2Z1bGwvZmlndXJlc19hY2FkZW1pY19yZXBvcnQvMDRfc2VjdGV1cnM.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUZtVFZqa1luVlpYWThRQlVWemlRSC9zYW5kYm94L1ExWHM5NERjbUZYbVRvTzFGTWY4Z2QtaW1hZ2VzXzE3ODczMDAzMTc1MzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTjBZWEowZFhCZllXTjBYMloxYkd3dlptbG5kWEpsYzE5aFkyRmtaVzFwWTE5eVpYQnZjblF2TURSZmMyVmpkR1YxY25NLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4OTQzMDQwMH19fV19&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEYCIQCnDSxK-qjSpOjz3gTW-5Nn5WI8cBy-JL34gCUAWZvVsgIhAKFf3N8eppttETiFf77pm8BaKnT1Ki3CCUqvrqP-W~HW)

Ce résultat décrit une spécialisation relative, mais il ne signifie pas que les autres secteurs sont absents. Il met plutôt en évidence un noyau de secteurs de services numériques et de solutions technologiques autour duquel se concentre une part importante de la population observée.

## 7. Données géographiques extraites des rapports annuels

### 7.1. Répartition régionale des startups labellisées

Les trois rapports annuels ne donnent pas exactement la même nomenclature ni nécessairement le même périmètre de startups. Les pourcentages ci-dessous sont donc présentés comme des **agrégats publiés par année**, et non comme une géolocalisation reconstruite startup par startup. Le rapport 2019–2020 indique 75,4 % pour le Grand Tunis. Le rapport 2020 indique 70,5 %. Le rapport 2021 indique 70,09 % et précise que 47,2 % sont localisées à Tunis et 12,9 % à Ariana [6].

| Région harmonisée | 2019 | 2020 | 2021 |
|---|---:|---:|---:|
| Grand Tunis | 75,40 % | 70,50 % | 70,09 % |
| Nord / Nord-Est | 5,20 % | 6,60 % | 6,32 % |
| Nord-Ouest | 2,00 % | 1,50 % | 1,37 % |
| Centre-Ouest | 2,00 % | 2,60 % | 2,05 % |
| Centre-Est | 10,50 % | 10,80 % | 13,85 % |
| Sud-Est | 3,70 % | 6,70 % | 5,47 % |
| Sud-Ouest | 1,20 % | 1,30 % | 0,85 % |
| **Total** | **100,00 %** | **100,00 %** | **100,00 %** |

![Répartition régionale 2019–2021](https://private-us-east-1.manuscdn.com/sessionFile/QFmTVjkYnVZXY8QBUVziQH/sandbox/Q1Xs94DcmFXmToO1FMf8gd-images_1787300317535_na1fn_L2hvbWUvdWJ1bnR1L3N0YXJ0dXBfYWN0X2Z1bGwvZmlndXJlc19hY2FkZW1pY19yZXBvcnQvMDVfZ2VvZ3JhcGhpZV8yMDE5XzIwMjE.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUZtVFZqa1luVlpYWThRQlVWemlRSC9zYW5kYm94L1ExWHM5NERjbUZYbVRvTzFGTWY4Z2QtaW1hZ2VzXzE3ODczMDAzMTc1MzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTjBZWEowZFhCZllXTjBYMloxYkd3dlptbG5kWEpsYzE5aFkyRmtaVzFwWTE5eVpYQnZjblF2TURWZloyVnZaM0poY0docFpWOHlNREU1WHpJd01qRS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIQCQB4ojbCz30PeoXB6cCXZE8Pwu7Zzn2SIKUDCoXRhQgQIgUi2~mG4wKoXpLxtZLAyglJV7HUTjW318WI610Yd2J7Q_)

La conclusion la plus robuste est la **forte concentration métropolitaine**, avec environ sept startups labellisées sur dix dans le Grand Tunis sur les trois années. La part du Centre-Est progresse de 10,5 % en 2019 à 13,85 % en 2021, tandis que la part du Sud-Est augmente fortement entre 2019 et 2020 avant de se contracter légèrement en 2021. Le rapport 2020 interprète cette évolution comme une amélioration légère de la répartition territoriale et une consolidation du Centre et du Sud-Est [6].

### 7.2. Internationalisation

Les rapports annuels distinguent les startups tunisiennes qui ont créé des filiales à l’étranger et les startups étrangères ayant ouvert une filiale en Tunisie. En 2019, six startups tunisiennes sont indiquées comme internationales, avec huit filiales cumulées ; en 2020, treize startups tunisiennes représentent seize filiales cumulées. En 2021, le nombre de startups tunisiennes à l’international reste indiqué à treize. Du côté des startups étrangères en Tunisie, le rapport indique 14 en 2019, 19 en 2020 et 49 en 2021.

| Année | Startups tunisiennes à l’international | Startups étrangères en Tunisie | Information géographique publiée |
|---:|---:|---:|---|
| 2019 | 6 | 14 | Les filiales tunisiennes sont réparties entre Europe, MENA et Afrique ; les sièges étrangers sont majoritairement européens |
| 2020 | 13 | 19 | Les startups tunisiennes totalisent 16 filiales ; l’Europe reste la première destination |
| 2021 | 13 | 49 | 27 sièges étrangers en France, 5 aux États-Unis, 4 au Royaume-Uni, 5 aux Pays-Bas, puis plusieurs pays à un effectif |

Le rapport 2021 précise que les 49 startups étrangères ont leur siège social à l’étranger, que les sièges se concentrent fortement en France et que la connexion européenne reste dominante [6]. Cette série suggère une internationalisation institutionnelle plus visible, mais elle ne mesure ni le chiffre d’affaires international ni la survie des implantations.

### 7.3. Géographie des emplois en 2021

Le rapport annuel 2021 apporte une mesure différente : il ne décrit pas uniquement la localisation des startups, mais la localisation de la création d’emploi. Le Grand Tunis représente **62,3 %** des emplois créés en 2021, devant le Centre avec **13,3 %** et le Nord-Est avec **12,2 %**. Le Sud-Est représente **5,6 %**, tandis que le Nord-Ouest et le Centre-Ouest représentent chacun **2,8 %** [6]. Ces pourcentages ne doivent pas être confondus avec la répartition des startups : ils décrivent une distribution d’emplois et non une distribution d’entreprises.

## 8. Qualité des données et réponse à la question de la fiabilité du site

Les données du site officiel ne doivent pas être qualifiées globalement de « fausses ». La page officielle publie effectivement un tableau de résultats et renvoie vers des rapports PDF institutionnels [4]. En revanche, le dépôt documente que **21 sessions présentaient des valeurs à corriger** entre une table initialement scrapée et une table vérifiée à partir des PDF [2]. La formulation méthodologiquement correcte est donc la suivante : **la page et ses exports constituent des sources officielles, mais certaines valeurs extraites, recopiées ou agrégées dans les anciennes tables du projet étaient incohérentes et ont été corrigées**.

Le principal point non résolu concerne les candidatures. La somme du tableau corrigé utilisé pour l’analyse est de 2 958, tandis que des éléments du site ou du catalogue de KPI mentionnent 3 015. Le rapport ne choisit pas arbitrairement entre les deux : il utilise 2 958 pour les calculs sessionnels parce que cette valeur correspond à la somme vérifiable du tableau de 85 sessions, et conserve 3 015 comme valeur à auditer dans une prochaine version. Une publication académique devrait joindre le tableau session par session et expliquer cette divergence.

La deuxième limite concerne les lignes individuelles PDF. Le corpus contient 1 824 lignes extraites, dont 1 701 avec un champ fondateur non vide et 190 lignes contenant un retrait. Toutefois, certains PDF ou tableaux présentent des colonnes décalées et des résultats concaténés. Les lignes individuelles doivent donc être utilisées pour les analyses de sociétés et fondateurs avec un indicateur de confiance, tandis que les compteurs officiels par session doivent rester la référence pour les totaux.

La troisième limite est géographique. Les rapports annuels 2019, 2020 et 2021 fournissent des pourcentages agrégés, mais ils n’offrent pas une table uniforme de toutes les sociétés avec gouvernorat, latitude et longitude. L’analyse géographique est donc solide pour décrire la concentration régionale publiée, mais insuffisante pour mesurer une causalité territoriale ou produire une carte individuelle exhaustive.

## 9. Discussion

Les résultats dessinent un programme dont le volume de candidatures atteint un maximum en 2021, alors que le taux de Label calculé sur les candidatures diminue ensuite par rapport aux premières années. Cette évolution peut refléter plusieurs facteurs non observés : maturation du dispositif, variation de la qualité des dossiers, changements de composition sectorielle, exigences d’examen ou différences dans la gestion des sessions. Les données disponibles permettent de constater l’évolution, mais pas d’identifier le mécanisme causal.

La concentration géographique du Grand Tunis reste le résultat le plus stable de la période documentée. La baisse de 75,4 % à 70,09 % entre 2019 et 2021 peut être lue comme une légère déconcentration relative, surtout au profit du Centre-Est, mais elle ne constitue pas encore une transformation territoriale profonde. Une politique publique d’essaimage devrait donc être évaluée avec des indicateurs complémentaires : nombre de dossiers par région rapporté à la population entrepreneuriale, taux de Label régional, accès aux structures d’accompagnement, financement mobilisé et emplois créés.

L’internationalisation progresse nettement du côté des startups étrangères ayant une filiale en Tunisie, avec 49 entités en 2021 contre 19 en 2020 selon le rapport annuel. Toutefois, l’indicateur mesure une présence administrative ou organisationnelle, non directement l’impact économique. Il conviendrait de compléter cette série par les emplois, les investissements, le chiffre d’affaires consolidé et la durée de maintien de la filiale.

## 10. Recommandations méthodologiques et opérationnelles

La première recommandation est de maintenir deux tables analytiques séparées : une table `session_counters` pour les compteurs officiels et une table `decision_records` pour les lignes individuelles. Cette séparation empêche qu’une correction d’un compteur soit interprétée comme une correction automatique de chaque société.

La deuxième recommandation est d’ajouter à chaque ligne un champ `source_page`, un champ `extraction_method`, un champ `confidence_level` et un champ `last_verified_at`. Les fondateurs doivent être stockés dans une table relationnelle séparée, reliée à la société et à la session, afin de préserver les cas de plusieurs fondateurs et les changements de statut.

La troisième recommandation est de résoudre officiellement la divergence 2 958–3 015 candidatures. Il faut demander ou retrouver la table source qui explique les 57 candidatures supplémentaires, puis indiquer si elles correspondent à des doublons, des dossiers ajournés, des candidatures non présentées ou une autre définition administrative.

La quatrième recommandation est de publier un dictionnaire de données géographiques. Celui-ci doit préciser si le dénominateur est constitué de startups labellisées, de startups interrogées, d’emplois créés ou de sièges sociaux. Sans cette précision, deux pourcentages géographiques peuvent être comparés à tort.

## 11. Conclusion

Cette étude établit une base quantitative reproductible du Startup Act tunisien à partir de 85 sessions, de trois rapports annuels officiels et de données corrigées du dépôt. Les résultats les plus robustes sont les suivants : **1 311 Labels**, **623 Prélabels**, une forte concentration régionale autour du Grand Tunis, une progression du Centre-Est entre 2019 et 2021, un pic de candidatures en 2021 et une internationalisation croissante des startups étrangères implantées en Tunisie.

La conclusion scientifique doit toutefois rester prudente. Les corrections démontrent que les premières extractions ou tables scrapées pouvaient contenir des erreurs, mais elles ne permettent pas de dire que le site officiel est entièrement faux. La bonne pratique consiste à citer le site comme source institutionnelle, à utiliser les PDF comme source primaire de vérification, à conserver la table corrigée comme version analytique et à documenter les divergences non résolues, en particulier le total des candidatures.

## Références

[1] Faker BEN NOOMEN, dépôt du projet académique Startup Act, README et section auteur : [https://github.com/bennoomenfaker/vic-2026-startup-act](https://github.com/bennoomenfaker/vic-2026-startup-act).

[2] Faker BEN NOOMEN, corrections des données des sessions : [https://github.com/bennoomenfaker/vic-2026-startup-act/blob/main/corrections.md](https://github.com/bennoomenfaker/vic-2026-startup-act/blob/main/corrections.md).

[3] Startup Tunisia, « About Startup Act » : [https://startup.gov.tn/fr/startup_act/discover](https://startup.gov.tn/fr/startup_act/discover).

[4] Startup Tunisia, « Résultats des sessions de labellisation » : [https://startup.gov.tn/fr/startup_act/results](https://startup.gov.tn/fr/startup_act/results).

[5] Startup Tunisia, « Comment obtenir le Label ? » : [https://startup.gov.tn/fr/startup_act/how_to_obtain_the_label](https://startup.gov.tn/fr/startup_act/how_to_obtain_the_label).

[6] Startup Tunisia, « Rapports annuels » et rapports PDF 2019, 2020 et 2021 : [https://startup.gov.tn/fr/annual-reports](https://startup.gov.tn/fr/annual-reports).
