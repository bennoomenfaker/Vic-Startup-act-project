# **2. Méthodologie**

## **2.1 Sources de données**
| **Source**                          | **Description**                                                                 | **Priorité** |
|-------------------------------------|---------------------------------------------------------------------------------|--------------|
| **PDF officiels des 85 sessions**   | Données brutes vérifiables (comptes rendus des sessions de labellisation).     | 5            |
| **startup.gov.tn (tableau `/sessions`)** | Source officielle de référence (mais erronée).                              | 5            |
| **Rapports annuels du Startup Act** | Synthèses et évolutions du programme.                                         | 4            |
| **Loi n° 2018-20**                   | Cadre juridique du dispositif.                                                 | 4            |
| **Base des startups labellisées**   | Détail des sociétés (secteur, année, région).                                  | 3            |

## **2.2 Processus de collecte et correction**
### **Étape 1 : Collecte**
- Téléchargement des **85 PDF officiels** (`public/data/session-pdfs/`).
- Extraction des données via un **parseur positionnel Python (v7)** → `pdf_parsed_v7.json`.

### **Étape 2 : Vérification**
- Comparaison systématique avec le tableau `/sessions` de startup.gov.tn.
- **Audit indépendant** : re-extraction complète → **0 divergence**.

### **Étape 3 : Correction**
- Mise à jour des totaux (`dashboard_data.json`, `sessions.json`).
- Vérification manuelle des **3 sessions illisibles** (07/2020, 12/2020, 01/2021).

### **Étape 4 : Analyse**
- Calcul des **indicateurs clés** :
  - Taux de conversion prélabel→label : **80,6 %**.
  - Part des labels issus de conversions : **38,3 %**.
  - Taux d’acceptation : **61,7 % (2019) → 36,3 % (2025)**.
- **Modèle de comptage** :
  - `labels` = nouveaux labels + conversions prélabel→label.
  - `prélabels` = nouveaux prélabels (hors conversions).

## **2.3 Outils utilisés**
| **Outil**               | **Usage**                                                                 |
|------------------------|---------------------------------------------------------------------------|
| **Python**             | Parsing des PDF (`parse_pdfs_v7.py`), calculs, génération de JSON.      |
| **JSON/CSV**           | Stockage des données structurées (`dashboard_data.json`, `parcours.json`). |
| **Chart.js + Leaflet** | Tableau de bord interactif (visualisation des indicateurs).              |
| **Excel**              | Tableaux de synthèse (`2_plan_de_veille_AE1_etat_des_lieux_quantitatif.xlsx`). |
| **Git/GitHub**         | Versionnage du code et des livrables.                                      |

## **2.4 Validation qualité**
- **Double extraction** : Parseur v7 + re-extraction indépendante.
- **Audit** : 0 divergence entre les sources.
- **Vérification manuelle** : 3 sessions illisibles → **85/85 sessions vérifiées**.