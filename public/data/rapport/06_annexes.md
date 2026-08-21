# **6. Annexes**

## **Annexe 1 : Liste des 85 sessions analysées**
*(Lien vers `public/data/tableau_sessions.md` ou `dashboard_data.json`)*
- **Format** : Tableau avec les colonnes :
  - Date de la session.
  - Nombre de candidatures.
  - Labels (corrigés vs publiés).
  - Prélabels (corrigés vs publiés).
  - Taux d’acceptation.
  - Commentaires (ex. : "Session corrigée", "PDF illisible").

## **Annexe 2 : Extraits des corrections**
*(Lien vers `corrections.md`)*
- **Exemple** :
  | **Session** | **Labels publiés** | **Labels corrigés** | **Écart** | **Source**          |
  |-------------|--------------------|---------------------|-----------|---------------------|
  | 01/2020     | 45                 | 42                  | -3        | PDF officiel        |

## **Annexe 3 : Code source du parseur**
*(Lien vers `scripts/parse_pdfs_v7.py`)*
```python
# Exemple de code pour extraire les données des PDF
import PyPDF2

def extract_pdf_data(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text
```

## **Annexe 4 : Tableau de bord interactif**
*(Lien vers le dossier du dashboard, ex: `dashboard/index.html`)*
- **Fonctionnalités** :
  - Visualisation des **taux d’acceptation par année**.
  - Répartition **sectorielle et géographique**.
  - **Filtres** par période, secteur, région.

## **Annexe 5 : Grille d’évaluation qualité**
*(Lien vers `3_grille_evaluation_charte_cadrage.md`)*
- **Score** : 100/100 (validation immédiate).