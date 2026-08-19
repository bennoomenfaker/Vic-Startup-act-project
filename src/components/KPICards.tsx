import React from 'react';
import { 
  Award, 
  Layers, 
  FileText, 
  Percent, 
  RefreshCw, 
  Ban, 
  Building, 
  Users 
} from 'lucide-react';
import { META_DATA, formatNumber } from '../data/dataset';

interface KPICardsProps {
  onSelectMetric?: (metricKey: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ onSelectMetric }) => {
  const cards = [
    {
      id: 'kpi-labels',
      title: 'Labels Accordés',
      value: formatNumber(META_DATA.totalLabels),
      subtitle: `${formatNumber(META_DATA.totalNewLabels)} directs + ${formatNumber(META_DATA.totalConversions)} conversions`,
      badge: 'Total Officiel',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Award,
      iconBg: 'bg-emerald-500 text-white',
      accentBorder: 'border-emerald-200 hover:border-emerald-300',
      highlight: true,
      onClick: () => onSelectMetric?.('labels')
    },
    {
      id: 'kpi-prelabels',
      title: 'Pré-Labels',
      value: formatNumber(META_DATA.totalPreLabels),
      subtitle: `${META_DATA.conversionRatePct}% transformés en labels`,
      badge: `${META_DATA.preLabelsRestants} en cours / non conv.`,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Layers,
      iconBg: 'bg-indigo-500 text-white',
      accentBorder: 'border-indigo-200 hover:border-indigo-300',
      onClick: () => onSelectMetric?.('prelabels')
    },
    {
      id: 'kpi-candidatures',
      title: 'Candidatures Totales',
      value: formatNumber(META_DATA.totalCandidatures),
      subtitle: `Sur 85 sessions (2019 — 2026)`,
      badge: '85 Sessions',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FileText,
      iconBg: 'bg-blue-500 text-white',
      accentBorder: 'border-blue-200 hover:border-blue-300',
      onClick: () => onSelectMetric?.('candidatures')
    },
    {
      id: 'kpi-taux',
      title: "Taux Moyen d'Acceptation",
      value: `${META_DATA.tauxMoyenPct}%`,
      subtitle: 'Ratio labels / candidatures déposées',
      badge: 'Taux Échec: 55.7%',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Percent,
      iconBg: 'bg-teal-500 text-white',
      accentBorder: 'border-teal-200 hover:border-teal-300',
      onClick: () => onSelectMetric?.('taux')
    },
    {
      id: 'kpi-conversions',
      title: 'Conversions Pré-Label → Label',
      value: formatNumber(META_DATA.totalConversions),
      subtitle: `80.6% de taux de succès conversion`,
      badge: '38.3% des labels',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: RefreshCw,
      iconBg: 'bg-purple-500 text-white',
      accentBorder: 'border-purple-200 hover:border-purple-300',
      onClick: () => onSelectMetric?.('conversions')
    },
    {
      id: 'kpi-retraits',
      title: 'Retraits de Label',
      value: formatNumber(META_DATA.totalRetraits),
      subtitle: 'Âge > 8 ans, cessation ou non-respect',
      badge: 'Suivi rigoureux',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Ban,
      iconBg: 'bg-rose-500 text-white',
      accentBorder: 'border-rose-200 hover:border-rose-300',
      onClick: () => onSelectMetric?.('retraits')
    },
    {
      id: 'kpi-startups',
      title: 'Startups & Candidats Uniques',
      value: formatNumber(META_DATA.uniqueStartupsCount),
      subtitle: 'Entités identifiées et indexées',
      badge: 'Base consolidée',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Building,
      iconBg: 'bg-slate-700 text-white',
      accentBorder: 'border-slate-200 hover:border-slate-300',
      onClick: () => onSelectMetric?.('startups')
    },
    {
      id: 'kpi-founders',
      title: 'Fondateurs Référencés',
      value: formatNumber(META_DATA.uniqueFoundersCount),
      subtitle: 'Porteurs de projets et co-fondateurs',
      badge: 'Annuaire complet',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Users,
      iconBg: 'bg-amber-500 text-white',
      accentBorder: 'border-amber-200 hover:border-amber-300',
      onClick: () => onSelectMetric?.('founders')
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" id="kpi-cards-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            onClick={card.onClick}
            className={`relative p-4 rounded-xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
              card.accentBorder
            } ${card.highlight ? 'ring-2 ring-emerald-500/20 bg-gradient-to-br from-white via-white to-emerald-50/30' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 truncate">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
