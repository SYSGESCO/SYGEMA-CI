import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  BarChart3,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';
import { BranchType } from '../../types';

export const RapportsView: React.FC = () => {
  const {
    invoices,
    expenses,
    payments,
    branchRevenues,
    totalIncome,
    totalExpenses,
    netProfit,
    cashBalance,
  } = useAppStore();

  const [period, setPeriod] = useState<'jour' | 'mois' | 'annee'>('mois');

  const branchesList: BranchType[] = [
    'Imprimerie & Bureautique',
    'Maintenance Informatique',
    'Graphisme & Communication',
    'Solutions Numériques',
    'Impression Tee-shirt',
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Rapports d'Activité & Rentabilité
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bilan financier consolidé, performance des 5 pôles SYGEMA CI et analyse des marges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPeriod('jour')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === 'jour' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Jour
            </button>
            <button
              type="button"
              onClick={() => setPeriod('mois')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === 'mois' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Mois
            </button>
            <button
              type="button"
              onClick={() => setPeriod('annee')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === 'annee' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Année
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Bilan</span>
          </button>
        </div>
      </div>

      {/* Global Financial Synthesis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Chiffre d'Affaires Encaissé</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {formatFCFA(totalIncome)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {invoices.length} factures enregistrées
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Charges & Dépenses Totales</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {formatFCFA(totalExpenses)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {expenses.length} dépenses comptabilisées
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Bénéfice Net d'Exploitation</span>
          <span
            className={`text-2xl font-black mt-1 block ${
              netProfit >= 0 ? 'text-blue-900' : 'text-rose-600'
            }`}
          >
            {formatFCFA(netProfit)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Marge nette : {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="bg-blue-950 text-white rounded-2xl p-5 shadow-xs border border-blue-900">
          <span className="text-[10px] uppercase font-bold text-blue-300 block">Disponible en Caisse</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {formatFCFA(cashBalance)}
          </span>
          <span className="text-[11px] text-blue-200 mt-1 block">
            SYGEMA CI • Daloa
          </span>
        </div>
      </div>

      {/* Breakdown by the 5 branches */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <span>Répartition du Chiffre d'Affaires par Pôle d'Activité</span>
        </h2>

        <div className="space-y-4">
          {branchesList.map((branch) => {
            const amount = branchRevenues[branch] || 0;
            const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
            return (
              <div key={branch} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{branch}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-black text-slate-900">{formatFCFA(amount)}</span>
                    <span className="text-slate-400 w-12 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-900 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Report Header for Official Statement */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2 print:block">
        <div className="font-bold text-slate-900 uppercase">
          Attestation de clôture de caisse & Bilan d'activité SYGEMA CI
        </div>
        <p>
          Établi à Daloa (Quartier Soleil 2) le {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}. Ce document synthétise les encaissements réels, les sorties de fonds et la marge d'exploitation
          sur l'ensemble des pôles (Imprimerie & Bureautique, Maintenance Informatique, Graphisme, Solutions Numériques, Impression Tee-shirts).
        </p>
      </div>
    </div>
  );
};
