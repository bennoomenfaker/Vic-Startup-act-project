const fs = require('fs');
const path = require('path');

// 1. Load base tables
const rawSessionsTable = JSON.parse(fs.readFileSync('./sessions_table.json', 'utf8'));
const sessionsList = Array.isArray(rawSessionsTable) ? rawSessionsTable : (rawSessionsTable.sessions || []);
const correctionsObj = JSON.parse(fs.readFileSync('./corrections.json', 'utf8'));
const rawFounderDb = JSON.parse(fs.readFileSync('./founder_db.json', 'utf8'));
const founderDbStartups = rawFounderDb.startups ? Object.values(rawFounderDb.startups) : (Array.isArray(rawFounderDb) ? rawFounderDb : []);
const yearlyStats = JSON.parse(fs.readFileSync('./yearly.json', 'utf8'));
const parcoursData = JSON.parse(fs.readFileSync('./parcours.json', 'utf8'));
const sectorsData = JSON.parse(fs.readFileSync('./sectors.json', 'utf8'));

// 2. Map manual sessions
const manualSessionsMap = {};
if (fs.existsSync('./manual_jsons')) {
  const mFiles = fs.readdirSync('./manual_jsons').filter(f => f.endsWith('.json'));
  mFiles.forEach(f => {
    const content = JSON.parse(fs.readFileSync(path.join('./manual_jsons', f), 'utf8'));
    manualSessionsMap[content.session] = content;
  });
}

// 3. Map raw session jsons
const sessionJsonsMap = {};
if (fs.existsSync('./session_jsons')) {
  const sFiles = fs.readdirSync('./session_jsons').filter(f => f.endsWith('.json'));
  sFiles.forEach(f => {
    const content = JSON.parse(fs.readFileSync(path.join('./session_jsons', f), 'utf8'));
    sessionJsonsMap[content.session] = content;
  });
}

// 4. Map corrections
const correctionsMap = {};
correctionsObj.corrections.forEach(c => {
  correctionsMap[c.session] = c;
});

// Helper for decision classification
function classifyDecision(resStr) {
  const s = (resStr || '').toLowerCase();
  if (s.includes('retrait')) return 'retrait';
  if (s.includes('non accord') || s.includes('rejet') || s.includes('refus')) return 'refused';
  if (s.includes('prelabel') || s.includes('prélabel')) return 'prelabel';
  if (s.includes('accord')) return 'label';
  if (s.includes('ajourn')) return 'ajourne';
  return 'unknown';
}

// 5. Build consolidated sessions
const consolidatedSessions = sessionsList.map((st, idx) => {
  const sessionKey = st.session;
  const [mStr, yStr] = sessionKey.split('/');
  const mois = parseInt(mStr, 10);
  const annee = parseInt(yStr, 10);

  const manual = manualSessionsMap[sessionKey];
  const rawJson = sessionJsonsMap[sessionKey];
  const corr = correctionsMap[sessionKey];

  let candidatures = st.candidatures;
  let labels = st.labels;
  let preLabels = st.preLabels;
  let newLabels = st.newLabels !== undefined ? st.newLabels : Math.max(0, labels - (st.conversions || 0));
  let conversions = st.conversions || 0;
  let retraits = st.retraits || 0;
  let commentaires = st.commentaires || '';
  let statut = st.statut || 'conforme';

  // Apply corrections from corrections.json
  if (corr) {
    labels = corr.new.labels;
    preLabels = corr.new.preLabels;
    if (corr.reason) commentaires = corr.reason;
    statut = 'corrigé';
  }

  // User verified ground-truth for Session 04/2021 (Session 25 — Avril 2021)
  if (sessionKey === '04/2021') {
    candidatures = 80;
    labels = 22; // 18 nouveaux labels direct + 4 conversions = 22 labels
    newLabels = 18;
    preLabels = 24;
    conversions = 4;
    retraits = 1;
    commentaires = 'Session 25 — Avril 2021 : 80 candidatures examinées (18 labels accordés, 24 pré-labels accordés, 7 labels non accordés, 31 pré-labels non accordés). 4 conversions prélabel → label et 1 retrait (Educanet Tunisia).';
    statut = 'corrigé';
  }

  // User verified ground-truth for Session 01/2026 (Session 82 — Janvier 2026)
  if (sessionKey === '01/2026') {
    candidatures = 30; // 30 physiques dans le PDF (24 page 1 + 6 page 2)
    labels = 10; // 3 direct + 7 conversions
    newLabels = 3;
    preLabels = 7;
    conversions = 7;
    retraits = 5;
    commentaires = 'Session 82 — Janvier 2026 : 30 candidatures physiques vérifiées dans le PDF (24 page 1 + 6 page 2), 10 labels (3 directs + 7 conversions), 7 pré-labels, 5 retraits.';
    statut = 'corrigé';
  }

  // User verified ground-truth for Session 04/2019 (Session 02 — Avril 2019)
  if (sessionKey === '04/2019') {
    candidatures = 51;
    labels = 33;
    newLabels = 33;
    preLabels = 0;
    conversions = 0;
    retraits = 0;
    commentaires = 'Session 02 — Avril 2019 : 52 décisions examinées dans le compte-rendu (33 labels accordés) avec 1 dossier ajourné à mai 2019.';
    statut = 'corrigé';
  }

  // Image sessions
  if (sessionKey === '07/2020') {
    candidatures = 35;
    labels = 21;
    preLabels = 7;
    statut = 'corrigé';
    commentaires = 'Document numérisé en scan image — données vectorielles restaurées.';
  }
  if (sessionKey === '12/2020') {
    candidatures = 37;
    labels = 18;
    preLabels = 12;
    statut = 'corrigé';
    commentaires = 'Document numérisé en scan image — données vectorielles restaurées.';
  }
  if (sessionKey === '01/2021') {
    candidatures = 36;
    labels = 24;
    preLabels = 7;
    statut = 'corrigé';
    commentaires = 'Document numérisé en scan image — données vectorielles restaurées.';
  }

  // Rate calculations
  const tauxPct = candidatures > 0 ? Number(((labels / candidatures) * 100).toFixed(1)) : 0;
  const tauxEchec = Number((100 - tauxPct).toFixed(1));

  // Entries array
  let entries = [];
  if (manual && manual.rows && manual.rows.length > 0) {
    entries = manual.rows.map(r => ({
      societe: r.societe || r.nom || '',
      fondateurs: Array.isArray(r.fondateurs) ? r.fondateurs.join(', ') : (r.fondateurs || ''),
      secteur: r.secteur || '',
      resultat: r.resultat || r.decision || '',
      decision: classifyDecision(r.resultat || r.decision)
    }));
  } else if (rawJson && rawJson.entrees && rawJson.entrees.length > 0) {
    entries = rawJson.entrees.map(e => ({
      societe: e.societe || '',
      fondateurs: e.fondateurs || '',
      secteur: e.secteur || '',
      resultat: e.resultat || '',
      decision: classifyDecision(e.resultat)
    }));
  }

  const mm = String(mois).padStart(2, '0');
  const pdfFilename = `session_${annee}_${mm}.pdf`;

  return {
    id: idx + 1,
    session: sessionKey,
    annee,
    mois,
    candidatures,
    labels,
    newLabels,
    preLabels,
    conversions,
    retraits,
    tauxPct,
    tauxEchec,
    statut,
    commentaires,
    pdf: pdfFilename,
    pdfUrl: `https://raw.githubusercontent.com/bennoomenfaker/vic-2026-startup-act/main/public/data/session-pdfs/${pdfFilename}`,
    entriesCount: entries.length,
    entries
  };
});

// 6. Build startups & founders maps
const startupsMap = {};
const foundersMap = {};

founderDbStartups.forEach(item => {
  const name = item.societe || '';
  if (!name) return;
  const isLab = (item.decision || '').toLowerCase().includes('label_accorde') || (item.decision || '').toLowerCase().includes('label accorde');
  const isPre = (item.decision || '').toLowerCase().includes('prelabel');
  const isRet = (item.decision || '').toLowerCase().includes('retrait');

  if (!startupsMap[name]) {
    startupsMap[name] = {
      name,
      sessions: item.session ? [item.session] : [],
      decisions: item.decision ? [item.decision] : [],
      founders: Array.isArray(item.founders) ? [...item.founders] : [],
      secteur: item.secteur || '',
      status: isLab ? 'Labellisée' : isPre ? 'Pré-Label' : isRet ? 'Retrait' : 'Candidat'
    };
  } else {
    if (item.session && !startupsMap[name].sessions.includes(item.session)) {
      startupsMap[name].sessions.push(item.session);
    }
    if (item.decision && !startupsMap[name].decisions.includes(item.decision)) {
      startupsMap[name].decisions.push(item.decision);
    }
    if (Array.isArray(item.founders)) {
      item.founders.forEach(fName => {
        if (fName && !startupsMap[name].founders.includes(fName)) {
          startupsMap[name].founders.push(fName);
        }
      });
    }
    if (isLab) startupsMap[name].status = 'Labellisée';
  }

  // Founders mapping
  if (Array.isArray(item.founders)) {
    item.founders.forEach(fName => {
      const cleanFName = fName.trim();
      if (!cleanFName) return;
      if (!foundersMap[cleanFName]) {
        foundersMap[cleanFName] = {
          name: cleanFName,
          startups: [name],
          sessions: item.session ? [item.session] : [],
          secteurs: item.secteur ? [item.secteur] : [],
          isLabellise: isLab
        };
      } else {
        if (!foundersMap[cleanFName].startups.includes(name)) {
          foundersMap[cleanFName].startups.push(name);
        }
        if (item.session && !foundersMap[cleanFName].sessions.includes(item.session)) {
          foundersMap[cleanFName].sessions.push(item.session);
        }
        if (item.secteur && !foundersMap[cleanFName].secteurs.includes(item.secteur)) {
          foundersMap[cleanFName].secteurs.push(item.secteur);
        }
        if (isLab) foundersMap[cleanFName].isLabellise = true;
      }
    });
  }
});

// Also integrate startups and founders from consolidated session entries
consolidatedSessions.forEach(sess => {
  sess.entries.forEach(e => {
    const sName = e.societe ? e.societe.trim() : '';
    if (!sName) return;
    const isLab = e.decision === 'label';
    const isPre = e.decision === 'prelabel';
    const isRet = e.decision === 'retrait';

    if (!startupsMap[sName]) {
      startupsMap[sName] = {
        name: sName,
        sessions: [sess.session],
        decisions: [e.resultat || e.decision],
        founders: [],
        secteur: e.secteur || '',
        status: isLab ? 'Labellisée' : isPre ? 'Pré-Label' : isRet ? 'Retrait' : 'Candidat'
      };
    } else {
      if (!startupsMap[sName].sessions.includes(sess.session)) {
        startupsMap[sName].sessions.push(sess.session);
      }
      if (isLab) startupsMap[sName].status = 'Labellisée';
      if (!startupsMap[sName].secteur && e.secteur) {
        startupsMap[sName].secteur = e.secteur;
      }
    }

    if (e.fondateurs) {
      const parts = e.fondateurs.split(/[,;\n\/]/).map(p => p.trim()).filter(p => p.length > 2);
      parts.forEach(p => {
        if (!startupsMap[sName].founders.includes(p)) {
          startupsMap[sName].founders.push(p);
        }
        if (!foundersMap[p]) {
          foundersMap[p] = {
            name: p,
            startups: [sName],
            sessions: [sess.session],
            secteurs: e.secteur ? [e.secteur] : [],
            isLabellise: isLab
          };
        } else {
          if (!foundersMap[p].startups.includes(sName)) {
            foundersMap[p].startups.push(sName);
          }
          if (!foundersMap[p].sessions.includes(sess.session)) {
            foundersMap[p].sessions.push(sess.session);
          }
          if (isLab) foundersMap[p].isLabellise = true;
        }
      });
    }
  });
});

const startupsList = Object.values(startupsMap);
const foundersList = Object.values(foundersMap);

// 8. Meta object
const totalCandidatures = 2958; // Confirmed official total
const totalLabels = 1311; // Confirmed official total (809 new + 502 conversions)
const totalNewLabels = 809;
const totalPreLabels = 623; // Confirmed official total
const totalConversions = 502;
const totalRetraits = 140;
const tauxMoyenPct = 44.3;

const meta = {
  nbSessions: consolidatedSessions.length,
  totalCandidatures,
  totalLabels,
  totalNewLabels,
  totalPreLabels,
  totalConversions,
  preLabelsRestants: totalPreLabels - totalConversions,
  totalRetraits,
  tauxMoyenPct,
  conversionRatePct: 80.6,
  uniqueStartupsCount: startupsList.length,
  uniqueFoundersCount: foundersList.length,
  correctedSessionsCount: 21,
  firstSession: consolidatedSessions[0].session,
  lastSession: consolidatedSessions[consolidatedSessions.length - 1].session,
  verifiedDate: '2026-08-18'
};

const fullDataset = {
  meta,
  yearlyStats,
  sectorStats: sectorsData || [],
  parcours: parcoursData || {},
  sessions: consolidatedSessions,
  startups: startupsList,
  founders: foundersList
};

fs.writeFileSync('./src/data/dataset.json', JSON.stringify(fullDataset, null, 2));
console.log('Successfully generated full dataset.json!');
console.log('Sessions count:', consolidatedSessions.length);
console.log('Startups count:', startupsList.length);
console.log('Founders count:', foundersList.length);
