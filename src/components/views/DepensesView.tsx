import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  TrendingDown,
  Plus,
  Search,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  AlertOctagon,
  Calendar,
  Trash2,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';

interface DepensesViewProps {
  initialTab?: 'depenses' | 'caisse';
}

export const DepensesView: React.FC<DepensesViewProps> = ({ initialTab = 'depenses' }) => {
  const {
    expenses,
    cashMovements,
    addExpense,
    deleteExpense,
    resetExpenses,
    currentUser,
    cashBalance,
    totalIncome,
    totalExpenses,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'depenses' | 'caisse'>(initialTab);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Consommables & Fournitures' as ExpenseCategory,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paidBy: currentUser.name,
    paymentMethod: 'Espèces' as PaymentMethod,
    receiptRef: '',
    notes: '',
  });

  const categories: ExpenseCategory[] = [
    'Consommables & Fournitures',
    'Loyer & Local',
    'Électricité (CIE)',
    'Connexion Internet',
    'Maintenance Matériel',
    'Transport & Logistique',
    'Salaires & Rémunérations',
    'Imprévus & Urgences',
    'Autre',
  ];

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      category: 'Consommables & Fournitures',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paidBy: currentUser.name,
      paymentMethod: 'Espèces',
      receiptRef: `FACT-${Date.now().toString().slice(-4)}`,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0) return;

    addExpense(formData);
    setIsModalOpen(false);
  };

  const filteredExpenses = expenses.filter((e) => {
    const match =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      (e.receiptRef && e.receiptRef.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === 'TOUS' || e.category === filterCategory;
    return match && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Dépenses, Charges & Caisse
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enregistrement des charges fixes, achats consommables, imprévus et tenue du journal de caisse
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {expenses.length > 0 && (
            <button
              id="btn-reset-expenses"
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm transition"
              title="Remettre à zéro toutes les dépenses"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Remettre à zéro</span>
            </button>
          )}

          <button
            id="btn-add-expense"
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer une Dépense</span>
          </button>
        </div>
      </div>

      {resetSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Le registre des dépenses et décaissements a été remis à zéro avec succès (0 FCFA).</span>
          </div>
          <button
            type="button"
            onClick={() => setResetSuccessMsg(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Financial Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Encaissé (Recettes)</span>
            <span className="text-2xl font-black text-emerald-700">{formatFCFA(totalIncome)}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Décaissements (Dépenses)</span>
            <span className="text-2xl font-black text-rose-600">{formatFCFA(totalExpenses)}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xs border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Solde Net en Caisse SYGEMA</span>
            <span className={`text-2xl font-black ${cashBalance >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
              {formatFCFA(cashBalance)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('depenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'depenses'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Registre des Dépenses ({expenses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('caisse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'caisse'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Journal des Mouvements de Caisse ({cashMovements.length})</span>
        </button>
      </div>

      {/* TAB 1: DÉPENSES */}
      {activeTab === 'depenses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par libellé de dépense, reçu..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['TOUS', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterCategory === cat
                      ? 'bg-rose-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Date & Réf</th>
                    <th className="py-3 px-4">Libellé de la Dépense</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Mode de Paiement</th>
                    <th className="py-3 px-4">Engagé par</th>
                    <th className="py-3 px-4 text-right">Montant (FCFA)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Aucune dépense trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-slate-900">
                            {formatDateFr(exp.date)}
                          </span>
                          {exp.receiptRef && (
                            <span className="block text-[10px] text-slate-400">
                              Réf: {exp.receiptRef}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{exp.title}</div>
                          {exp.notes && (
                            <div className="text-[11px] text-slate-500 italic mt-0.5">
                              {exp.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-900 border border-rose-200">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {exp.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{exp.paidBy}</td>
                        <td className="py-3.5 px-4 text-right font-black text-rose-600 text-sm">
                          -{formatFCFA(exp.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Supprimer la dépense "${exp.title}" ?`)) {
                                deleteExpense(exp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAISSE MOVEMENTS */}
      {activeTab === 'caisse' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Flux Financiers d'Entrée & de Sortie
            </h3>
            <span className="text-xs font-bold text-slate-600">
              Solde Théorique :{' '}
              <strong className="text-amber-600 font-black">
                {formatFCFA(cashBalance)}
              </strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description & Origine</th>
                  <th className="py-3 px-4">Opérateur</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cashMovements.map((mov) => {
                  const isEntry = mov.type === 'Entrée';
                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatDateFr(mov.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isEntry
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}
                        >
                          {isEntry ? (
                            <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 text-rose-600" />
                          )}
                          {mov.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {mov.description}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{mov.performedBy}</td>
                      <td
                        className={`py-3 px-4 text-right font-black text-sm ${
                          isEntry ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isEntry ? '+' : '-'}
                        {formatFCFA(mov.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Enregistrer une Dépense / Décaissement
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Motif / Désignation de la dépense *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Achat cartouche d'encre noire HP ou Facture CIE"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catégorie de Dépense *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ExpenseCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Décaissement (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-rose-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mode de Règlement
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as PaymentMethod,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Espèces">Espèces (Caisse locale)</option>
                    <option value="Wave">Wave</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de paiement
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  N° Facture / Reçu justificatif
                </label>
                <input
                  type="text"
                  value={formData.receiptRef}
                  onChange={(e) => setFormData({ ...formData, receiptRef: e.target.value })}
                  placeholder="Ex: RECU-CIE-202604"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations supplémentaires
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Détails, fournisseur, urgence..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-sm"
                >
                  Valider le Décaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM RESET */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Remise à zéro des dépenses
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Êtes-vous certain de vouloir remettre à zéro l'ensemble des dépenses et décaissements ?
              Cette opération effacera le registre des dépenses et réajustera le total des sorties à 0 FCFA.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  resetExpenses();
                  setIsResetModalOpen(false);
                  setResetSuccessMsg(true);
                  setTimeout(() => setResetSuccessMsg(false), 4000);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Confirmer la Remise à Zéro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
