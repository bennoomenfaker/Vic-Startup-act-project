# **Mémoire - Livre Blanc Startup Act Tunisien**

## **📌 Description du projet**
Ce mémoire documente le travail réalisé dans le cadre du **Livre Blanc Startup Act Tunisien**, un projet national mené par l’équipe de la **classe VIC (Veille et Intelligence Compétitive)** en collaboration entre **ESEN Manouba** et **ISCAE Manouba**, avec le soutien de l’**ATVIC**. 

Le projet est structuré en **6 axes de veille stratégique**, chacun abordant un aspect clé du Startup Act tunisien. L’objectif global est de produire un **diagnostic complet** du programme, incluant des **données fiables**, des **analyses approfondies**, et des **recommandations stratégiques** pour les décideurs publics et les acteurs de l’écosystème startup.

---

## **📊 Aperçu des 6 axes du Livre Blanc**

| **Axe** | **Titre** | **Objectif Principal** | **Livrables** | **Dossier** |
|---------|-----------|------------------------|---------------|-------------|
| **AE1** | **État des lieux quantitatif** | Fiabiliser les données de labellisation (2019-2026) en corrigeant les erreurs du site officiel. | Charte de cadrage, plan de veille, jeu de données corrigé, tableau de bord interactif. | [`axe 1 etat de lieux quantitatif`](../../axe%201%20etat%20de%20lieux%20quantitatif/) |
| **AE2** | **Cadre juridique et gouvernance** | Évaluer la cohérence du dispositif réglementaire et son application. | Charte de cadrage, plan de veille, analyse des textes juridiques. | [`axe 2 cadre juridique et gouvernance`](../../axe%202%20cadre%20juridique%20et%20gouvernance/) |
| **AE3** | **Financement des startups** | Analyser l’efficacité des mécanismes de financement et leur impact. | Charte de cadrage, plan de veille, cartographie des dispositifs financiers. | [`axe 3 financeme,nts des startups`](../../axe%203%20financeme,nts%20des%20startups/) |
| **AE4** | **Accompagnement et écosystème** | Étudier l’organisation de l’écosystème et les services d’accompagnement. | Charte de cadrage, plan de veille, analyse des acteurs et structures. | [`axe 4 accompagnement et ecosysteme`](../../axe%204%20accompagnement%20et%20ecosysteme/) |
| **AE5** | **Évaluation des impacts** | Mesurer les effets du Startup Act sur l’économie, l’emploi et l’innovation. | Charte de cadrage, plan de veille, indicateurs d’impact. | [`axe 5 evalusation des impact`](../../axe%205%20evalusation%20des%20impact/) |
| **AE6** | **Benchmark international** | Comparer le Startup Act tunisien avec des dispositifs similaires à l’international. | Charte de cadrage, plan de veille, analyse comparative. | [`axe 6 benchmarking internationnelle`](../../axe%206%20benchmarking%20internationale/) |

---

## **📁 Structure du dossier `memoire/`**
```
memoire/
├── 00_cover_page.md          # Page de garde
├── 01_introduction.md        # Contexte, objectifs, problématique
├── 02_methodologie.md        # Méthodes de collecte, vérification, outils
├── 03_resultats.md           # Indicateurs corrigés, analyses
├── 04_discussion.md          # Interprétation, limites, recommandations
├── 05_conclusion.md          # Synthèse et perspectives
├── 06_annexes.md            # Tableaux, codes, liens vers les données
├── 07_bibliographie.md      # Sources officielles, outils, références
└── README.md                # Ce fichier
```

---

## **📖 Contenu des fichiers**

### **1. [00_cover_page.md](./00_cover_page.md)**
- Page de garde du mémoire.
- Informations sur l’auteur, l’encadrement, et le projet.

### **2. [01_introduction.md](./01_introduction.md)**
- **Contexte général** : Présentation du Startup Act tunisien et de son dispositif de labellisation.
- **Problématique** : Erreurs identifiées dans les données officielles (ex. : 1 324 labels publiés vs 1 311 corrigés).
- **Objectifs** : Fiabiliser le référentiel chiffré via une méthodologie rigoureuse.
- **Périmètre** : Géographique (Tunisie), temporel (2019-2026), thématique (labellisation).

### **3. [02_methodologie.md](./02_methodologie.md)**
- **Sources de données** : PDF officiels, startup.gov.tn, rapports annuels, etc.
- **Processus de collecte et correction** :
  - Extraction des données via un parseur Python (`parse_pdfs_v7.py`).
  - Vérification par audit indépendant (0 divergence).
  - Correction manuelle des 3 sessions illisibles.
- **Outils utilisés** : Python, JSON/CSV, Chart.js, Leaflet, Excel, Git/GitHub.
- **Validation qualité** : Double extraction, audit, vérification manuelle.

### **4. [03_resultats.md](./03_resultats.md)**
- **Indicateurs corrigés** :
  - Labels : **1 311** (vs 1 324 publiés).
  - Prélabels : **623** (vs 617 publiés).
  - Taux de conversion prélabel→label : **80,6 %**.
  - Part des labels issus de conversions : **38,3 %**.
  - Retraits de labels : **140**.
  - Taux d’acceptation : **61,7 % (2019) → 36,3 % (2025)**.
- **Analyse des tendances** :
  - Volumétrie globale.
  - Taux d’acceptation et retraits.
  - Saisonnalité (pics en décembre et mai).
  - Répartition sectorielle et géographique.

### **5. [04_discussion.md](./04_discussion.md)**
- **Interprétation des résultats** :
  - Fiabilité des données et impact des corrections.
  - Taux de conversion et retraits.
  - Baisse du taux d’acceptation.
- **Limites de l’étude** :
  - Données manquantes (PDF illisibles).
  - Période limitée (2019-2026).
  - Absence de motifs de retrait.
- **Recommandations** :
  - Pour les décideurs publics (correction des données, automatisation).
  - Pour l’écosystème startup (sensibilisation, accompagnement).
  - Pour la suite du Livre Blanc (intégration des données, extension de l’étude).

### **6. [05_conclusion.md](./05_conclusion.md)**
- **Synthèse** : Résumé des résultats et de leur impact.
- **Perspectives** :
  - Court terme (finalisation du tableau de bord, diffusion).
  - Moyen terme (mise à jour des données, extension de l’étude).
  - Long terme (pérennisation de la veille).

### **7. [06_annexes.md](./06_annexes.md)**
- **Liste des 85 sessions analysées** (lien vers `public/data/tableau_sessions.md`).
- **Extraits des corrections** (lien vers `corrections.md`).
- **Code source du parseur** (exemple en Python).
- **Tableau de bord interactif** (lien vers `dashboard/index.html`).
- **Grille d’évaluation qualité** (lien vers `3_grille_evaluation_charte_cadrage.md`).

### **8. [07_bibliographie.md](./07_bibliographie.md)**
- **Sources officielles** : Loi n° 2018-20, startup.gov.tn, PDF des sessions.
- **Outils et technologies** : Python, Chart.js, Leaflet, Git/GitHub.
- **Références académiques** : VIC (ESEN × ISCAE), ATVIC.
- **Autres ressources** : Rapport annuel 2021 du Startup Act.

---

## **🔗 Liens utiles**
- **Dossier des données** : [`public/data/`](../../public/data/)
- **Scripts Python** : [`scripts/`](../../scripts/)
- **Tableau de bord** : [`dashboard/`](../../dashboard/)
- **Livrables principaux** : [`livrables/`](../../livrables/)

---

## **📂 Dossiers des axes**
Pour accéder directement aux livrables de chaque axe :
- **AE1** : [`axe 1 etat de lieux quantitatif`](../../axe%201%20etat%20de%20lieux%20quantitatif/)
- **AE2** : [`axe 2 cadre juridique et gouvernance`](../../axe%202%20cadre%20juridique%20et%20gouvernance/)
- **AE3** : [`axe 3 financeme,nts des startups`](../../axe%203%20financeme,nts%20des%20startups/)
- **AE4** : [`axe 4 accompagnement et ecosysteme`](../../axe%204%20accompagnement%20et%20ecosysteme/)
- **AE5** : [`axe 5 evalusation des impact`](../../axe%205%20evalusation%20des%20impact/)
- **AE6** : [`axe 6 benchmarking internationnelle`](../../axe%206%20benchmarking%20internationale/)

---

## **📌 Comment utiliser ce mémoire ?**
1. **Lire dans l’ordre** : Commencez par `00_cover_page.md` et suivez la numérotation.
2. **Consulter les annexes** : Pour plus de détails sur les données et les outils.
3. **Explorer les liens** : Les fichiers sont interconnectés pour une navigation fluide.
4. **Analyser les axes** : Chaque axe est détaillé dans son dossier respectif et dans le fichier [`08_axes.md`](./08_axes.md).

---

## **💡 Contribuer**
- Pour **ajouter des informations**, modifiez les fichiers Markdown correspondants.
- Pour **corriger des erreurs**, ouvrez une issue ou un pull request sur GitHub.
- Pour **poser des questions**, contactez l’auteur : **Faker BEN NOOMEN**.