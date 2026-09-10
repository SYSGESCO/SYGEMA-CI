import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import {
  formatFCFA,
  formatDateFr,
  formatDateLongFr,
  getCurrentWeekRange,
  isDateToday,
  isDateInThisWeek,
  getWeekDays,
} from '../../utils/formatters';
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
  ShoppingBag,
  Shield,
  Eye,
  Filter,
  UserCheck,
  Sparkles,
  Calendar,
  CalendarDays,
  Sun,
  Wallet,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { PrintableDocType } from '../PrintableDocumentModal';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenNewOrderModal?: () => void;
  onOpenNewClientModal?: () => void;
  onOpenPrint?: (doc: PrintableDocType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenPrint,
}) => {
  const {
    getAllOrders,
    clients,
    maintenance,
    printOrders,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    quotes,
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
  const [activityOriginFilter, setActivityOriginFilter] = useState<'ALL' | 'GERANT' | 'ADMIN'>('ALL');

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

  // Gérant specific statistics (Saisies et activités du Gérant)
  const isGerantEntity = (createdBy?: string, createdByRole?: string) => {
    return createdByRole === 'Gérant' || (createdBy && createdBy.toLowerCase().includes('gérant'));
  };

  const gerantOrders = allOrders.filter((o) => isGerantEntity(o.createdBy, o.createdByRole));
  const gerantOrdersAmount = gerantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const gerantPayments = payments.filter((p) => isGerantEntity(p.receivedBy, p.createdByRole));
  const gerantPaymentsAmount = gerantPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const gerantQuotes = quotes.filter((q) => isGerantEntity(q.createdBy, q.createdByRole));
  const gerantQuotesAmount = gerantQuotes.reduce((sum, q) => sum + (q.totalAmount || 0), 0);

  const gerantClients = clients.filter((c) => isGerantEntity(c.createdBy, c.createdByRole));
  const gerantInvoices = invoices.filter((i) => isGerantEntity(i.createdBy, i.createdByRole));

  // 1. Recette Journalière (Aujourd'hui)
  const todayPayments = payments.filter((p) => isDateToday(p.date, p.createdAt));
  const todayRevenue = todayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const todayOrders = allOrders.filter((o) => isDateToday(o.date, o.createdAt));
  const todayOrdersAmount = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const todayExpensesList = expenses.filter((e) => isDateToday(e.date, e.createdAt));
  const todayExpensesSum = todayExpensesList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const todayNetResult = todayRevenue - todayExpensesSum;

  // Recette du jour spécifique du Gérant
  const gerantTodayPayments = todayPayments.filter((p) => isGerantEntity(p.receivedBy, p.createdByRole));
  const gerantTodayRevenue = gerantTodayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // 2. Recette Gagnée en Semaine (Semaine en cours)
  const currentWeekInfo = getCurrentWeekRange();
  const weekPayments = payments.filter((p) => isDateInThisWeek(p.date, p.createdAt));
  const weekRevenue = weekPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const weekOrders = allOrders.filter((o) => isDateInThisWeek(o.date, o.createdAt));
  const weekOrdersAmount = weekOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const weekExpensesList = expenses.filter((e) => isDateInThisWeek(e.date, e.createdAt));
  const weekExpensesSum = weekExpensesList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const weekNetResult = weekRevenue - weekExpensesSum;

  // Recette de la semaine spécifique du Gérant
  const gerantWeekPayments = weekPayments.filter((p) => isGerantEntity(p.receivedBy, p.createdByRole));
  const gerantWeekRevenue = gerantWeekPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Répartition par jour des 7 jours de la semaine courante (Lundi à Dimanche)
  const weekDays = getWeekDays();
  const weekDailyStats = weekDays.map((day) => {
    const dayPayments = payments.filter((p) => {
      const pDate = p.date ? p.date.split('T')[0] : '';
      const cDate = p.createdAt ? p.createdAt.split('T')[0] : '';
      return pDate === day.dateISO || cDate === day.dateISO;
    });
    const amount = dayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return {
      ...day,
      amount,
      count: dayPayments.length,
    };
  });
  const maxDayAmount = Math.max(...weekDailyStats.map((d) => d.amount), 1);

  // Filtered orders according to selection
  const filteredOrders = allOrders.filter((ord) => {
    if (activityOriginFilter === 'GERANT') {
      return isGerantEntity(ord.createdBy, ord.createdByRole);
    }
    if (activityOriginFilter === 'ADMIN') {
      return !isGerantEntity(ord.createdBy, ord.createdByRole);
    }
    return true;
  });

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider">
              Centre de Contrôle Général
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-800/80 text-blue-200 font-semibold text-[11px] border border-blue-700/60 flex items-center gap-1.5">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>Supervision Complète : Direction & Saisies Gérant</span>
            </span>
            <span className="text-xs text-blue-200">
              Daloa, Quartier Soleil 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            SYGEMA CI — Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
            Supervision transversale en temps réel : Imprimerie, Maintenance informatique, Graphisme, Solutions numériques et Impression Tee-shirts. Données enregistrées par le gérant et la direction unifiées.
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

      {/* 2.5. FOCUS RECETTES : JOURNALIÈRE & SEMAINE */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0d1e42] to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-blue-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Point des Recettes : Aujourd'hui & Cette Semaine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wider">
                  En direct
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Suivi précis des encaissements réels pour la journée du {formatDateLongFr(new Date())} et la {currentWeekInfo.label.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('caisse')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-blue-100 text-xs font-bold border border-blue-600/50 transition"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              <span>Voir la Caisse</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('facturation')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Règlements & Reçus</span>
            </button>
          </div>
        </div>

        {/* 2 Big Cards Grid: Journalière & Semaine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* CARTE 1: RECETTE JOURNALIÈRE */}
          <div className="bg-slate-950/70 rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-500/60 transition flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Recette Journalière (Aujourd'hui)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {formatDateFr(new Date().toISOString())}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    {formatFCFA(todayRevenue)}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      <strong>{todayPayments.length}</strong> encaissement{todayPayments.length > 1 ? 's' : ''} enregistré{todayPayments.length > 1 ? 's' : ''} aujourd'hui
                    </span>
                  </p>
                </div>

                {gerantTodayPayments.length > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-right">
                    <div className="text-[10px] uppercase font-bold text-amber-300">Encaissé par Gérant</div>
                    <div className="text-xs font-black text-amber-200 font-mono">
                      {formatFCFA(gerantTodayRevenue)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800/90 text-xs">
              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Commandes du jour</span>
                <span className="font-bold text-slate-200 block mt-0.5">
                  {todayOrders.length} dossier{todayOrders.length > 1 ? 's' : ''}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatFCFA(todayOrdersAmount)}
                </span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Dépenses du jour</span>
                <span className="font-bold text-rose-300 block mt-0.5">
                  {formatFCFA(todayExpensesSum)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {todayExpensesList.length} sortie{todayExpensesList.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bénéfice net du jour</span>
                <span className={`font-black block mt-0.5 ${todayNetResult >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {formatFCFA(todayNetResult)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {todayNetResult >= 0 ? 'Solde positif' : 'Déficit journalier'}
                </span>
              </div>
            </div>
          </div>

          {/* CARTE 2: RECETTE GAGNÉE EN SEMAINE */}
          <div className="bg-slate-950/70 rounded-2xl p-5 border border-blue-500/30 hover:border-blue-500/60 transition flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Recette Gagnée en Semaine
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-200 bg-blue-900/60 px-2.5 py-0.5 rounded-lg border border-blue-700/50">
                  {currentWeekInfo.label}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-blue-300 font-mono tracking-tight">
                    {formatFCFA(weekRevenue)}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      <strong>{weekPayments.length}</strong> encaissement{weekPayments.length > 1 ? 's' : ''} cette semaine
                    </span>
                  </p>
                </div>

                {gerantWeekPayments.length > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-right">
                    <div className="text-[10px] uppercase font-bold text-amber-300">Gérant cette semaine</div>
                    <div className="text-xs font-black text-amber-200 font-mono">
                      {formatFCFA(gerantWeekRevenue)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Bar Chart: 7 Jours de la semaine courante (Lun - Dim) */}
            <div className="pt-3 mt-3 border-t border-slate-800/90">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Dynamique hebdomadaire (Lun - Dim)</span>
                <span className="text-slate-300 font-mono">Net hebdo : <strong className={weekNetResult >= 0 ? 'text-emerald-400' : 'text-amber-400'}>{formatFCFA(weekNetResult)}</strong></span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 items-end h-16 pt-1">
                {weekDailyStats.map((dayStat, idx) => {
                  const heightPercent = maxDayAmount > 0 ? Math.max(8, (dayStat.amount / maxDayAmount) * 100) : 8;
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[9px] py-0.5 px-1.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-20 font-mono">
                        {dayStat.dayName} {dayStat.dayNumber} : {formatFCFA(dayStat.amount)}
                      </div>
                      <div className="w-full bg-slate-800 rounded-t overflow-hidden flex items-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t transition-all ${
                            dayStat.isToday
                              ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-xs'
                              : dayStat.amount > 0
                              ? 'bg-blue-500 group-hover:bg-blue-400'
                              : 'bg-slate-700/50'
                          }`}
                        />
                      </div>
                      <span className={`text-[9px] mt-1 font-bold ${dayStat.isToday ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {dayStat.dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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

      {/* 3.5. SUPERVISION DES ACTIVITÉS ENREGISTRÉES PAR LE GÉRANT */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-5 sm:p-6 border border-amber-300 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Supervision de l'Activité & Saisies du Gérant
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  En direct
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Centralisation de toutes les données saisies par le Gérant (commandes des 5 services, devis, clients, encaissements).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivityOriginFilter(activityOriginFilter === 'GERANT' ? 'ALL' : 'GERANT')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activityOriginFilter === 'GERANT'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                  : 'bg-white hover:bg-amber-50 text-slate-800 border border-amber-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {activityOriginFilter === 'GERANT'
                  ? 'Filtre actif : Saisies du Gérant'
                  : 'Filtrer les tableaux sur le Gérant'}
              </span>
            </button>
          </div>
        </div>

        {/* 6 Cards for Gérant's direct impact including daily & weekly revenue */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="bg-white rounded-xl p-3.5 border border-amber-300 shadow-xs ring-1 ring-amber-200/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Recette Jour Gérant</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-amber-600 font-mono">{formatFCFA(gerantTodayRevenue)}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {gerantTodayPayments.length} règlement{gerantTodayPayments.length > 1 ? 's' : ''} aujourd'hui
            </p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-blue-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Recette Sem. Gérant</span>
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-blue-700 font-mono">{formatFCFA(gerantWeekRevenue)}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {gerantWeekPayments.length} règlement{gerantWeekPayments.length > 1 ? 's' : ''} cette semaine
            </p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Encaissé</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-emerald-700 font-mono">{formatFCFA(gerantPaymentsAmount)}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {gerantPayments.length} encaissement{gerantPayments.length > 1 ? 's' : ''} cumulés
            </p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Commandes Gérant</span>
              <ShoppingCart className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-slate-900">{gerantOrders.length}</span>
              <span className="text-[10px] text-slate-500 ml-1">dossiers</span>
            </div>
            <p className="text-[10px] font-bold text-amber-800 mt-0.5 font-mono">
              {formatFCFA(gerantOrdersAmount)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Devis émis</span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-slate-900">{gerantQuotes.length}</span>
              <span className="text-[10px] text-slate-500 ml-1">émis</span>
            </div>
            <p className="text-[10px] font-bold text-indigo-700 mt-0.5 font-mono">
              {formatFCFA(gerantQuotesAmount)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-purple-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Clients créés</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-slate-900">{gerantClients.length}</span>
              <span className="text-[10px] text-slate-500 ml-1">créés</span>
            </div>
            <p className="text-[10px] text-purple-700 mt-0.5">
              Clients enregistrés
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                Dernières Commandes & Travaux Réalisés
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                {filteredOrders.length} {filteredOrders.length > 1 ? 'dossiers' : 'dossier'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervision unifiée : flux transversal des 5 services intégrant les saisies du Gérant et de la Direction
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Origin filters */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActivityOriginFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activityOriginFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous ({allOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityOriginFilter('GERANT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activityOriginFilter === 'GERANT'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Gérant ({gerantOrders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActivityOriginFilter('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activityOriginFilter === 'ADMIN'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-blue-800 hover:text-blue-950'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Direction ({allOrders.length - gerantOrders.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('commandes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Aucune commande trouvée pour ce filtre</p>
            <p className="text-xs text-slate-400 mt-1">
              {activityOriginFilter === 'GERANT'
                ? "Le gérant n'a pas encore enregistré de commande sous ce profil."
                : "Aucune commande n'est actuellement enregistrée."}
            </p>
            {activityOriginFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setActivityOriginFilter('ALL')}
                className="mt-3 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                Réinitialiser le filtre
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Réf / N°</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Intitulé des travaux</th>
                  <th className="py-2.5 px-3">Enregistré par</th>
                  <th className="py-2.5 px-3 text-right">Montant</th>
                  <th className="py-2.5 px-3 text-right">Reste</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.slice(0, 10).map((ord) => {
                  const isByGerant = isGerantEntity(ord.createdBy, ord.createdByRole);
                  return (
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
                      <td className="py-3 px-3">
                        {isByGerant ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <ShoppingBag className="w-3 h-3 text-amber-600" />
                            <span>Gérant {ord.createdBy ? `(${ord.createdBy.split(' ')[0]})` : ''}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                            <Shield className="w-3 h-3 text-blue-600" />
                            <span>Direction</span>
                          </span>
                        )}
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
                      <td className="py-3 px-3 text-center">
                        <span className="text-blue-600 hover:text-blue-800 font-bold text-[11px]">
                          Voir →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
