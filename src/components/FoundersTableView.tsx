import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users2, 
  Download, 
  Building, 
  Calendar, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Briefcase,
  FileSpreadsheet,
  FileCode,
  Database
} from 'lucide-react';
import { FOUNDERS_LIST, formatNumber } from '../data/dataset';
import { FounderItem } from '../types';
import { exportToExcel, exportToJSON, exportToSQL } from '../utils/exportUtils';

interface FoundersTableViewProps {
  onSelectStartup?: (startupName: string) => void;
  onSelectSession?: (sessionKey: string) => void;
}

export const FoundersTableView: React.FC<FoundersTableViewProps> = ({
  onSelectStartup,
  onSelectSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabellise, setFilterLabellise] = useState<'all' | 'labellise' | 'multiple'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedFounder, setSelectedFounder] = useState<FounderItem | null>(null);

  // Filter founders
  const filteredFounders = useMemo(() => {
    return FOUNDERS_LIST.filter((f) => {
      if (filterLabellise === 'labellise' && !f.isLabellise) return false;
      if (filterLabellise === 'multiple' && f.startups.length < 2) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchStartup = f.startups.some(s => s.toLowerCase().includes(q));
        const matchSector = f.secteurs.some(sec => sec.toLowerCase().includes(q));

        if (!matchName && !matchStartup && !matchSector) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterLabellise]);

  const totalPages = Math.ceil(filteredFounders.length / pageSize) || 1;
  const paginatedFounders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFounders.slice(start, start + pageSize);
  }, [filteredFounders, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterLabellise, pageSize]);

  // Export to Excel (.xlsx)
  const exportToExcelTable = () => {
    const dataToExport = filteredFounders.map(f => ({
      'Nom Fondateur': f.name,
      'Labellisé': f.isLabellise ? 'Oui' : 'Non',
      'Startups': f.startups.join(', '),
      'Nombre Startups': f.startups.length,
      'Sessions': f.sessions.join(', '),
      'Secteurs': f.secteurs.join(', ')
    }));
    exportToExcel([{ sheetName: 'Fondateurs', data: dataToExport }], `startup_act_tunisie_fondateurs_${filteredFounders.length}.xlsx`);
  };

  // Export to JSON
  const exportToJSONTable = () => {
    exportToJSON(filteredFounders, `startup_act_tunisie_fondateurs_${filteredFounders.length}.json`);
  };

  // Export to SQL
  const exportToSQLTable = () => {
    const lines: string[] = [];
    lines.push(`-- STARTUP ACT TUNISIE - TABLE DES FONDATEURS (${filteredFounders.length} personnes)`);
    lines.push(`CREATE TABLE IF NOT EXISTS founders (`);
    lines.push(`  id SERIAL PRIMARY KEY,`);
    lines.push(`  name VARCHAR(255) NOT NULL UNIQUE,`);
    lines.push(`  is_labellise BOOLEAN DEFAULT FALSE,`);
    lines.push(`  nb_startups INT DEFAULT 1,`);
    lines.push(`  startups TEXT[],`);
    lines.push(`  sessions TEXT[]`);
    lines.push(`);\n`);

    lines.push(`INSERT INTO founders (name, is_labellise, nb_startups, startups, sessions) VALUES`);
    const values = filteredFounders.map(f => {
      const name = f.name.replace(/'/g, "''");
      const sts = `ARRAY[${f.startups.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]`;
      const sess = `ARRAY[${f.sessions.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]`;
      return `('${name}', ${f.isLabellise ? 'TRUE' : 'FALSE'}, ${f.startups.length}, ${sts}, ${sess})`;
    });

    for (let i = 0; i < values.length; i += 500) {
      const chunk = values.slice(i, i + 500);
      lines.push(chunk.join(',\n') + ';\n');
      if (i + 500 < values.length) {
        lines.push(`INSERT INTO founders (name, is_labellise, nb_startups, startups, sessions) VALUES`);
      }
    }

    exportToSQL(lines.join('\n'), `startup_act_fondateurs_${filteredFounders.length}.sql`);
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Nom_Fondateur', 'Startups_Fondees', 'Nombre_Startups', 'Secteurs', 'Sessions'];
    const rows = filteredFounders.map(f => [
      `"${f.name.replace(/"/g, '""')}"`,
      `"${f.startups.join(', ').replace(/"/g, '""')}"`,
      f.startups.length,
      `"${f.secteurs.join(', ').replace(/"/g, '""')}"`,
      `"${f.sessions.join(', ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fondateurs_startup_act_tunisie_${filteredFounders.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12" id="founders-table-container">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                Annuaire National des Fondateurs
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {formatNumber(filteredFounders.length)} fondateurs identifiés
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Porteurs de Projets & Entrepreneurs de l'Écosystème
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Index complet des fondateurs cités dans les PV officiels du Collège des Startups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-founders-excel"
              onClick={exportToExcelTable}
              title="Exporter les fondateurs affichés en fichier Excel .xlsx"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              id="btn-export-founders-json"
              onClick={exportToJSONTable}
              title="Exporter les fondateurs affichés en fichier JSON"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>

            <button
              id="btn-export-founders-sql"
              onClick={exportToSQLTable}
              title="Générer et télécharger le script SQL (.sql) pour les fondateurs"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQL</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-founders-input"
              type="text"
              placeholder="Rechercher par nom de fondateur ou nom de startup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              id="select-founders-filter"
              value={filterLabellise}
              onChange={(e: any) => setFilterLabellise(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="all">Tous les fondateurs</option>
              <option value="labellise">Avec au moins un Label accordé</option>
              <option value="multiple">Multi-fondateurs (2+ startups)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="founders-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" id="global-founders-table">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[200px]">Fondateur / Entrepreneur</th>
                <th className="py-3 px-4 min-w-[220px]">Startup(s) Associée(s)</th>
                <th className="py-3 px-4 min-w-[160px]">Secteur(s)</th>
                <th className="py-3 px-4 text-center">Nombre de Startups</th>
                <th className="py-3 px-4 text-center">Sessions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedFounders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Aucun fondateur ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                paginatedFounders.map((f, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={f.name + idx}
                      className="hover:bg-purple-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedFounder(f)}
                    >
                      <td className="py-3 px-4 text-center font-medium text-slate-400 group-hover:text-slate-600">
                        {globalIdx}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                            {f.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-purple-700 text-sm">
                              {f.name}
                            </span>
                            {f.isLabellise && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Label
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {f.startups.map((stName, sIdx) => (
                            <span
                              key={sIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectStartup?.(stName);
                              }}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 hover:bg-blue-100 hover:text-blue-900 transition-colors"
                            >
                              {stName}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {f.secteurs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.secteurs.map((sec, secIdx) => (
                              <span key={secIdx} className="text-[11px] text-slate-600">
                                {sec}{secIdx < f.secteurs.length - 1 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded text-xs ${
                          f.startups.length > 1 ? 'bg-purple-100 text-purple-900 font-extrabold' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {f.startups.length}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {f.sessions.map((sess) => (
                            <span
                              key={sess}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectSession?.(sess);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
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

        {/* Pagination */}
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
            <span>par page — Total : <strong>{filteredFounders.length}</strong> fondateurs</span>
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

      {/* Founder Details Modal */}
      {selectedFounder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedFounder.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedFounder.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedFounder.isLabellise ? 'Bénéficiaire du Label Startup Act' : 'Candidat Référencé'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFounder(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Startups fondées ou co-fondées ({selectedFounder.startups.length}) :</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedFounder.startups.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 font-semibold border border-blue-200">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {selectedFounder.secteurs.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secteurs d'intervention :</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedFounder.secteurs.map((sec, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-medium border border-emerald-200">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sessions du Collège :</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedFounder.sessions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedFounder(null);
                        onSelectSession?.(s);
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200 hover:bg-amber-100 cursor-pointer"
                    >
                      Session {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFounder(null)}
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
