import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Boxes,
  Users,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Receipt,
  ShoppingCart,
  Coins,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenNewOrderModal?: () => void;
  onOpenNewClientModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
}) => {
  const {
    getAllOrders,
    clients,
    maintenance,
    printOrders,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    invoices,
    payments,
    expenses,
    charges,
    contingencies,
    products,
    purchaseOrders,
    suppliers,
    cashMovements,
    company,
  } = useAppStore();

  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const allOrders = getAllOrders();

  // Financial calculations
  const totalRevenueReceived = payments.reduce((sum, p) => sum + p.amount, 0);

  const directExpensesSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidChargesSum = charges
    .filter((c) => c.status === 'Payée')
    .reduce((sum, c) => sum + c.amount, 0);
  const contingenciesSum = contingencies.reduce((sum, i) => sum + i.amount, 0);
  const totalOutflows = directExpensesSum + contingenciesSum;

  const netResult = totalRevenueReceived - totalOutflows;

  // Receivables from clients (Créances)
  const clientReceivables = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

  // Supplier debts (Dettes fournisseurs)
  const supplierDebts = purchaseOrders.reduce((sum, po) => sum + po.remainingAmount, 0);

  // Stock values & alerts
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );
  const lowStockProducts = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.minStock
  );
  const outOfStockProducts = products.filter((p) => p.currentStock <= 0);

  // Status breakdown
  const inProgressOrdersCount = allOrders.filter(
    (o) =>
      o.status !== 'Terminé' &&
      o.status !== 'Livré' &&
      o.status !== 'Validé' &&
      o.status !== 'Annulé'
  ).length;

  const completedOrdersCount = allOrders.filter(
    (o) => o.status === 'Terminé' || o.status === 'Livré' || o.status === 'Validé'
  ).length;

  // Services breakdown (CA by branch)
  const printCA = printOrders.reduce((sum, p) => sum + p.totalAmount, 0);
  const maintCA = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const graphCA = graphicProjects.reduce((sum, g) => sum + g.price, 0);
  const digiCA = digitalProjects.reduce((sum, d) => sum + d.budget, 0);
  const tshCA = tshirtOrders.reduce((sum, t) => sum + t.totalAmount, 0);
  const grandTotalCA = printCA + maintCA + graphCA + digiCA + tshCA || 1;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Welcome */}
      <div className="bg-gradient-to-r from-[#0d1c3f] via-[#122b68] to-[#0a1735] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider">
              Centre de Contrôle Général
            </span>
            <span className="text-xs text-blue-200">
              Daloa, Quartier Soleil 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            SYGEMA CI — Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
            Gestion intégrée en temps réel : Imprimerie, Maintenance informatique, Graphisme, Solutions numériques et Impression Tee-shirts.
          </p>
        </div>

        {/* Quick Contact & WhatsApp Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Nouvelle Commande</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Action Bar (The 8 requested buttons) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Actions Rapides Immédiates</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            id="btn-quick-order"
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-400 text-blue-900 transition text-center group"
          >
            <Printer className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Commande</span>
          </button>

          <button
            id="btn-quick-client"
            type="button"
            onClick={() => onNavigate('clients')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 text-emerald-900 transition text-center group"
          >
            <Users className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Client</span>
          </button>

          <button
            id="btn-quick-maintenance"
            type="button"
            onClick={() => onNavigate('maintenance')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-400 text-purple-900 transition text-center group"
          >
            <Wrench className="w-5 h-5 text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Intervention</span>
          </button>

          <button
            id="btn-quick-graphic"
            type="button"
            onClick={() => onNavigate('graphisme')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/70 hover:border-pink-400 text-pink-900 transition text-center group"
          >
            <Palette className="w-5 h-5 text-pink-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Graphisme</span>
          </button>

          <button
            id="btn-quick-digital"
            type="button"
            onClick={() => onNavigate('solutions_numeriques')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/70 hover:border-cyan-400 text-cyan-900 transition text-center group"
          >
            <Laptop className="w-5 h-5 text-cyan-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Numérique</span>
          </button>

          <button
            id="btn-quick-tshirt"
            type="button"
            onClick={() => onNavigate('teeshirt')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-400 text-amber-900 transition text-center group"
          >
            <Shirt className="w-5 h-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Tee-shirt</span>
          </button>

          <button
            id="btn-quick-quote"
            type="button"
            onClick={() => onNavigate('devis')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition text-center group"
          >
            <FileText className="w-5 h-5 text-slate-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Devis</span>
          </button>

          <button
            id="btn-quick-invoice"
            type="button"
            onClick={() => onNavigate('facturation')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 hover:border-indigo-400 text-indigo-900 transition text-center group"
          >
            <CreditCard className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">+ Facture</span>
          </button>
        </div>
      </div>

      {/* 3. PRIMARY FINANCIAL & OPERATIONAL STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recettes encaissées */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recettes Encaissées
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900">
              {formatFCFA(totalRevenueReceived)}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{payments.length} encaissements validés</span>
            </p>
          </div>
        </div>

        {/* Dépenses Totales */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dépenses & Sorties
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">
              {formatFCFA(totalOutflows)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dépenses + Charges + Imprévus
            </p>
          </div>
        </div>

        {/* Résultat Net (Bénéfice) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Résultat Net (Marge)
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                netResult >= 0
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3
              className={`text-2xl font-black ${
                netResult >= 0 ? 'text-blue-950' : 'text-amber-600'
              }`}
            >
              {formatFCFA(netResult)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {netResult >= 0 ? 'Solde bénéficiaire' : 'Déficit temporaire'}
            </p>
          </div>
        </div>

        {/* Créances Clients */}
        <div
          onClick={() => onNavigate('facturation')}
          className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Créances Clients
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-amber-700">
              {formatFCFA(clientReceivables)}
            </h3>
            <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <span>Restes à recouvrer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONAL STATUS & STOCK ALERTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commandes Actives */}
        <div
          onClick={() => onNavigate('commandes')}
          className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800 flex flex-col justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Commandes en cours
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-bold border border-blue-400/40">
              {inProgressOrdersCount} actives
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{allOrders.length}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {completedOrdersCount} terminées / livrées
            </p>
          </div>
        </div>

        {/* Interventions Maintenance */}
        <div
          onClick={() => onNavigate('maintenance')}
          className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between cursor-pointer hover:border-purple-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Atelier Maintenance
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-purple-950">{maintenance.length}</h3>
            <p className="text-xs text-purple-700 font-medium mt-1">
              {maintenance.filter((m) => m.status === 'En cours' || m.status === 'Reçu').length} appareils en atelier
            </p>
          </div>
        </div>

        {/* Valeur du Stock */}
        <div
          onClick={() => onNavigate('stocks')}
          className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between cursor-pointer hover:border-blue-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Valeur du Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">
              {formatFCFA(totalStockValue)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {products.length} articles référencés
            </p>
          </div>
        </div>

        {/* Alertes Stocks */}
        <div
          onClick={() => onNavigate('stocks')}
          className={`rounded-2xl p-5 shadow-xs border flex flex-col justify-between cursor-pointer transition ${
            outOfStockProducts.length > 0
              ? 'bg-rose-50/80 border-rose-300 hover:bg-rose-100/70'
              : lowStockProducts.length > 0
              ? 'bg-amber-50/80 border-amber-300 hover:bg-amber-100/70'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Alertes Stocks
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                outOfStockProducts.length > 0
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-amber-200 text-amber-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">
              {outOfStockProducts.length + lowStockProducts.length}
            </h3>
            <p className="text-xs font-semibold mt-1 text-rose-700">
              {outOfStockProducts.length > 0 && `${outOfStockProducts.length} en rupture `}
              {lowStockProducts.length > 0 && `(${lowStockProducts.length} faible)`}
              {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && 'Stock optimal'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. BREAKDOWN OF THE 5 SERVICES OF SYGEMA CI */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Répartition des 5 Pôles d'Activités SYGEMA CI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi d'activité et part contributive au chiffre d'affaires
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-blue-900 text-white rounded-lg">
            CA Global : {formatFCFA(grandTotalCA)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
          {/* Imprimerie */}
          <div
            onClick={() => onNavigate('imprimerie')}
            className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <Printer className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/60 text-blue-900">
                {Math.round((printCA / grandTotalCA) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2">
              Imprimerie & Bureautique
            </h3>
            <p className="text-xs text-slate-500">{printOrders.length} commandes</p>
            <p className="text-sm font-black text-blue-950 mt-2">
              {formatFCFA(printCA)}
            </p>
          </div>

          {/* Maintenance */}
          <div
            onClick={() => onNavigate('maintenance')}
            className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <Wrench className="w-5 h-5 text-purple-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200/60 text-purple-900">
                {Math.round((maintCA / grandTotalCA) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2">
              Maintenance Informatique
            </h3>
            <p className="text-xs text-slate-500">{maintenance.length} interventions</p>
            <p className="text-sm font-black text-purple-950 mt-2">
              {formatFCFA(maintCA)}
            </p>
          </div>

          {/* Graphisme */}
          <div
            onClick={() => onNavigate('graphisme')}
            className="p-4 rounded-xl border border-pink-200 bg-pink-50/40 hover:bg-pink-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <Palette className="w-5 h-5 text-pink-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-200/60 text-pink-900">
                {Math.round((graphCA / grandTotalCA) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2">
              Graphisme & Communication
            </h3>
            <p className="text-xs text-slate-500">{graphicProjects.length} projets</p>
            <p className="text-sm font-black text-pink-950 mt-2">
              {formatFCFA(graphCA)}
            </p>
          </div>

          {/* Solutions Numériques */}
          <div
            onClick={() => onNavigate('solutions_numeriques')}
            className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <Laptop className="w-5 h-5 text-cyan-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-200/60 text-cyan-900">
                {Math.round((digiCA / grandTotalCA) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2">
              Solutions Numériques
            </h3>
            <p className="text-xs text-slate-500">{digitalProjects.length} projets</p>
            <p className="text-sm font-black text-cyan-950 mt-2">
              {formatFCFA(digiCA)}
            </p>
          </div>

          {/* Impression Tee-shirt */}
          <div
            onClick={() => onNavigate('teeshirt')}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <Shirt className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                {Math.round((tshCA / grandTotalCA) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2">
              Impression Tee-shirt
            </h3>
            <p className="text-xs text-slate-500">{tshirtOrders.length} commandes</p>
            <p className="text-sm font-black text-amber-950 mt-2">
              {formatFCFA(tshCA)}
            </p>
          </div>
        </div>
      </div>

      {/* 6. RECENT ORDERS & WORKFLOW TABLE */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Dernières Commandes & Travaux Réalisés
            </h2>
            <p className="text-xs text-slate-500">
              Flux unifié transversal aux 5 pôles d'activités
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('commandes')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Voir toutes les commandes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Réf / N°</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Intitulé des travaux</th>
                <th className="py-2.5 px-3 text-right">Montant</th>
                <th className="py-2.5 px-3 text-right">Reste</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allOrders.slice(0, 8).map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => onNavigate(ord.category)}
                  className="hover:bg-slate-50/80 cursor-pointer transition"
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {ord.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{ord.clientName}</div>
                    <div className="text-[10px] text-slate-500">{ord.clientPhone}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 max-w-xs truncate">
                    {ord.title}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatFCFA(ord.totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold">
                    {ord.remainingAmount > 0 ? (
                      <span className="text-rose-600">{formatFCFA(ord.remainingAmount)}</span>
                    ) : (
                      <span className="text-emerald-600">Soldé</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 whitespace-nowrap">
                    {formatDateFr(ord.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: NOUVELLE COMMANDE (Strictly with the 5 services only!) */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Sélectionner le Service SYGEMA CI
              </h3>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Choisissez la branche d'activité pour laquelle vous souhaitez créer une nouvelle commande ou fiche :
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setOrderModalOpen(false);
                  onNavigate('imprimerie');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 hover:bg-blue-50 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Imprimerie & Bureautique</h4>
                    <p className="text-[11px] text-slate-500">Photocopies, reliure, saisie, documents</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderModalOpen(false);
                  onNavigate('maintenance');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-purple-200 hover:bg-purple-50 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Maintenance Informatique</h4>
                    <p className="text-[11px] text-slate-500">Réparation, diagnostic, installation Windows</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderModalOpen(false);
                  onNavigate('graphisme');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-pink-200 hover:bg-pink-50 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Graphisme & Communication</h4>
                    <p className="text-[11px] text-slate-500">Logos, affiches, flyers, cartes de visite</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderModalOpen(false);
                  onNavigate('solutions_numeriques');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-cyan-200 hover:bg-cyan-50 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Solutions Numériques</h4>
                    <p className="text-[11px] text-slate-500">Sites web, logiciels, réseaux informatiques</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderModalOpen(false);
                  onNavigate('teeshirt');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 hover:bg-amber-50 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Impression Tee-shirt</h4>
                    <p className="text-[11px] text-slate-500">Personnalisation DTF, sérigraphie, flocage</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
