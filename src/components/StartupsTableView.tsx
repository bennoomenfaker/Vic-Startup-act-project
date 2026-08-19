import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Building2, 
  Users, 
  Calendar, 
  Award, 
  Tag, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Database
} from 'lucide-react';
import { STARTUPS_LIST, SECTOR_STATS, formatNumber } from '../data/dataset';
import { StartupItem } from '../types';
import { exportToExcel, exportToJSON, exportToSQL } from '../utils/exportUtils';

interface StartupsTableViewProps {
  onSelectFounder?: (founderName: string) => void;
  onSelectSession?: (sessionKey: string) => void;
}

export const StartupsTableView: React.FC<StartupsTableViewProps> = ({ 
  onSelectFounder, 
  onSelectSession 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedStartup, setSelectedStartup] = useState<StartupItem | null>(null);

  // Filter startups
  const filteredStartups = useMemo(() => {
    return STARTUPS_LIST.filter((st) => {
      // Sector filter
      if (selectedSector !== 'all') {
        if (!st.secteur || !st.secteur.toLowerCase().includes(selectedSector.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'labellise' && !st.status.includes('Label')) return false;
        if (selectedStatus === 'prelabel' && !st.status.includes('Pré')) return false;
        if (selectedStatus === 'retrait' && !st.status.includes('Retrait')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = st.name.toLowerCase().includes(q);
        const matchFounder = st.founders.some(f => f.toLowerCase().includes(q));
        const matchSector = (st.secteur || '').toLowerCase().includes(q);
        const matchSession = st.sessions.some(s => s.toLowerCase().includes(q));

        if (!matchName && !matchFounder && !matchSector && !matchSession) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedSector, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStartups.length / pageSize) || 1;
  const paginatedStartups = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStartups.slice(start, start + pageSize);
  }, [filteredStartups, currentPage, pageSize]);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSector, selectedStatus, pageSize]);

  // Export to Excel (.xlsx)
  const exportToExcelTable = () => {
    const dataToExport = filteredStartups.map(st => ({
      'Nom Startup': st.name,
      'Fondateurs': st.founders.join(', '),
      'Secteur': st.secteur || 'Non spécifié',
      'Statut': st.status,
      'Sessions': st.sessions.join(', '),
      'Nombre de passages': st.sessions.length,
      'Décisions': st.decisions.join(' | ')
    }));
    exportToExcel([{ sheetName: 'Startups', data: dataToExport }], `startup_act_tunisie_startups_${filteredStartups.length}.xlsx`);
  };

  // Export to JSON
  const exportToJSONTable = () => {
    exportToJSON(filteredStartups, `startup_act_tunisie_startups_${filteredStartups.length}.json`);
  };

  // Export to SQL
  const exportToSQLTable = () => {
    const lines: string[] = [];
    lines.push(`-- STARTUP ACT TUNISIE - TABLE DES STARTUPS (${filteredStartups.length} entités)`);
    lines.push(`CREATE TABLE IF NOT EXISTS startups (`);
    lines.push(`  id SERIAL PRIMARY KEY,`);
    lines.push(`  name VARCHAR(255) NOT NULL UNIQUE,`);
    lines.push(`  secteur VARCHAR(100),`);
    lines.push(`  status VARCHAR(50),`);
    lines.push(`  sessions TEXT[],`);
    lines.push(`  founders TEXT[]`);
    lines.push(`);\n`);

    lines.push(`INSERT INTO startups (name, secteur, status, sessions, founders) VALUES`);
    const values = filteredStartups.map(st => {
      const name = st.name.replace(/'/g, "''");
      const sec = (st.secteur || '').replace(/'/g, "''");
      const stat = st.status.replace(/'/g, "''");
      const sess = `ARRAY[${st.sessions.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]`;
      const fnds = `ARRAY[${st.founders.map(f => `'${f.replace(/'/g, "''")}'`).join(',')}]`;
      return `('${name}', '${sec}', '${stat}', ${sess}, ${fnds})`;
    });

    for (let i = 0; i < values.length; i += 500) {
      const chunk = values.slice(i, i + 500);
      lines.push(chunk.join(',\n') + ';\n');
      if (i + 500 < values.length) {
        lines.push(`INSERT INTO startups (name, secteur, status, sessions, founders) VALUES`);
      }
    }

    exportToSQL(lines.join('\n'), `startup_act_startups_${filteredStartups.length}.sql`);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Nom_Startup', 'Fondateurs', 'Secteur', 'Statut', 'Sessions'];
    const rows = filteredStartups.map(st => [
      `"${st.name.replace(/"/g, '""')}"`,
      `"${st.founders.join(', ').replace(/"/g, '""')}"`,
      `"${(st.secteur || 'Non spécifié').replace(/"/g, '""')}"`,
      st.status,
      `"${st.sessions.join(', ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `startups_tunisie_startup_act_${filteredStartups.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    if (status.includes('Retrait')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          Retrait de label
        </span>
      );
    }
    if (status.includes('Pré')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
          Pré-Label
        </span>
      );
    }
    if (status.includes('Label')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          Label accordé
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-12" id="startups-table-container">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Tableau Global des Startups
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {formatNumber(filteredStartups.length)} entités répertoriées
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Répertoire National des Candidats et Entreprises Labellisées
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recherche transversale par nom d'entreprise, nom de fondateur, secteur d'activité ou session.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-startups-excel"
              onClick={exportToExcelTable}
              title="Exporter les startups affichées en fichier Excel .xlsx"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              id="btn-export-startups-json"
              onClick={exportToJSONTable}
              title="Exporter les startups affichées en fichier JSON"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>

            <button
              id="btn-export-startups-sql"
              onClick={exportToSQLTable}
              title="Générer et télécharger le script SQL (.sql) pour les startups"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQL</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4 pt-4 border-t border-slate-100">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-startups-input"
              type="text"
              placeholder="Rechercher par startup (ex: Datavora, Enova), fondateur, secteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Sector filter dropdown */}
          <div className="sm:col-span-4">
            <select
              id="select-startup-sector-filter"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tous les secteurs d'activité ({SECTOR_STATS.length})</option>
              {SECTOR_STATS.map((sec) => (
                <option key={sec.name} value={sec.name}>
                  {sec.name} ({sec.count})
                </option>
              ))}
            </select>
          </div>

          {/* Status filter dropdown */}
          <div className="sm:col-span-3">
            <select
              id="select-startup-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="labellise">Labellisée (Label accordé)</option>
              <option value="prelabel">Pré-Label accordé</option>
              <option value="retrait">Retrait de label</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="startups-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" id="global-startups-table">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[200px]">Société / Startup</th>
                <th className="py-3 px-4 min-w-[220px]">Fondateur(s) Référencé(s)</th>
                <th className="py-3 px-4 min-w-[160px]">Secteur d'Activité</th>
                <th className="py-3 px-4 text-center">Statut Décision</th>
                <th className="py-3 px-4 text-center">Sessions de Passage</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedStartups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Aucune startup trouvée pour ces critères de recherche.
                  </td>
                </tr>
              ) : (
                paginatedStartups.map((st, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={st.name + idx}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStartup(st)}
                    >
                      {/* Row index */}
                      <td className="py-3 px-4 text-center font-medium text-slate-400 group-hover:text-slate-600">
                        {globalIdx}
                      </td>

                      {/* Startup Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-700 group-hover:text-blue-700 font-bold shrink-0 transition-colors">
                            {st.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-700 text-sm">
                              {st.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Founders */}
                      <td className="py-3 px-4">
                        {st.founders && st.founders.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {st.founders.map((f, fIdx) => (
                              <span
                                key={fIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectFounder?.(f);
                                }}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900 transition-colors"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Non spécifié au PV</span>
                        )}
                      </td>

                      {/* Sector */}
                      <td className="py-3 px-4">
                        {st.secteur ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-800 border border-slate-200">
                            {st.secteur}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(st.status)}
                      </td>

                      {/* Sessions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {st.sessions.map((sess) => (
                            <span
                              key={sess}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectSession?.(sess);
                              }}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
                              title={`Session ${sess}`}
                            >
                              {sess}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <span>Afficher</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded border border-slate-300 bg-white font-medium focus:outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>par page — Total : <strong>{filteredStartups.length}</strong> startups</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-600">
              Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Startup Details Modal Drawer */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedStartup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedStartup.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStartup.secteur || 'Secteur non spécifié'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStartup(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Statut d'attribution :</span>
                  <span className="font-semibold text-slate-900">{getStatusBadge(selectedStartup.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Nombre de sessions associées :</span>
                  <span className="font-semibold text-slate-900">{selectedStartup.sessions.length}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Fondateur(s) identifié(s) :</span>
                </h4>
                {selectedStartup.founders.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedStartup.founders.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 font-medium border border-purple-200">
                        {f}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Aucun nom de fondateur explicite dans le PV officiel</p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Historique des Sessions :</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedStartup.sessions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStartup(null);
                        onSelectSession?.(s);
                      }}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                    >
                      Session {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStartup(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
