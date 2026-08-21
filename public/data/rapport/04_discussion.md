# **4. Discussion**

## **4.1 Interprétation des résultats**
### **4.1.1 Fiabilité des données**
- Les **20 sessions corrigées** montrent que les erreurs sur startup.gov.tn sont **systématiques** (ex. : mauvais comptage des labels/prélabels).
- **Impact** : Sans correction, les décideurs publics baseraient leurs analyses sur des **données fausses**.

### **4.1.2 Taux de conversion et retraits**
- **80,6 % de conversion** prélabel→label : Le dispositif de prélabellisation est **efficace** pour filtrer les candidatures.
- **140 retraits** : Un **taux de mortalité du label** de ~10 % (140/1 311) suggère un **suivi post-labellisation à renforcer**.

### **4.1.3 Baisse du taux d’acceptation**
- **61,7 % → 36,3 %** : Possible **durcissement des critères** ou **augmentation des candidatures non qualifiées**.
- **Recommandation** : Analyser les **motifs de rejet** pour ajuster les critères.

## **4.2 Limites de l’étude**
| **Limite**                          | **Explication**                                                                 | **Solution proposée**                          |
|-------------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------|
| **Données manquantes**              | Certains PDF sont illisibles (scans vectoriels).                                | Vérification manuelle (déjà appliquée).       |
| **Période limitée**                 | Analyse sur 2019-2026 (pas de données antérieures à 2019).                     | Étendre l’étude aux sessions pré-2019 si disponibles. |
| **Absence de motifs de retrait**    | Les raisons des 140 retraits ne sont pas détaillées dans les PDF.               | Compléter par des entretiens avec l’ANPR.    |
| **Hétérogénéité des formats**       | Certains PDF ont des structures différentes.                                   | Standardiser le parsing (déjà fait via `parse_pdfs_v7.py`). |

## **4.3 Recommandations**
### **4.3.1 Pour les décideurs publics**
1. **Corriger les données officielles** sur startup.gov.tn (alignement sur les PDF).
2. **Automatiser la collecte** :
   - Utiliser un **parseur validé** (ex. : `parse_pdfs_v7.py`).
   - Mettre en place un **système de vérification automatique**.
3. **Améliorer la transparence** :
   - Publier les **motifs des retraits de labels**.
   - Rendre publics les **taux de conversion** et les **statistiques sectorielles**.

### **4.3.2 Pour l’écosystème startup**
1. **Sensibiliser les startups** :
   - Organiser des **ateliers** sur les critères de labellisation.
   - Clarifier les **exigences post-labellisation** pour réduire les retraits.
2. **Renforcer l’accompagnement** :
   - Proposer un **suivi personnalisé** aux startups prélabellisées.

### **4.3.3 Pour la suite du Livre Blanc**
1. **Intégrer les données corrigées** dans les analyses des autres axes (AE2 à AE6).
2. **Croiser les indicateurs quantitatifs** (AE1) avec les analyses qualitatives (ex. : impacts économiques).
3. **Étendre l’étude** :
   - Analyser les **liens entre labellisation et performance des startups** (chiffre d’affaires, emploi).
   - Comparer avec des **benchmarks internationaux** (ex. : Startup Act marocain, français).