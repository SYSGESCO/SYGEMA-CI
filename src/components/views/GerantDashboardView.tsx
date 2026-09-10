import React from 'react';
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
  ShoppingBag,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  ClipboardList,
  FileText,
  CreditCard,
  Users,
  Coins,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  CalendarDays,
  Sun,
  Wallet,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { PrintableDocType } from '../PrintableDocumentModal';

interface GerantDashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenPrint?: (doc: PrintableDocType) => void;
}

export const GerantDashboardView: React.FC<GerantDashboardViewProps> = ({
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
    getCashBalance,
    currentUser,
  } = useAppStore();

  const allOrders = getAllOrders();
  const cashInfo = getCashBalance();

  // Total sales revenue collected
  const totalSalesRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // 1. Recette Journalière (Aujourd'hui)
  const todayPayments = payments.filter((p) => isDateToday(p.date, p.createdAt));
  const todayRevenue = todayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const todayOrders = allOrders.filter((o) => isDateToday(o.date, o.createdAt));
  const todayOrdersAmount = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Ventilation des règlements du jour pour l'arrêté de caisse
  const todayCashAmount = todayPayments
    .filter((p) => p.paymentMethod === 'Espèces')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const todayMobileAmount = todayPayments
    .filter((p) => p.paymentMethod === 'Wave' || p.paymentMethod === 'Orange Money' || p.paymentMethod === 'MTN MoMo' || p.paymentMethod === 'Moov Money')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const todayOtherAmount = Math.max(0, todayRevenue - todayCashAmount - todayMobileAmount);

  // 2. Recette Gagnée en Semaine (Semaine en cours)
  const currentWeekInfo = getCurrentWeekRange();
  const weekPayments = payments.filter((p) => isDateInThisWeek(p.date, p.createdAt));
  const weekRevenue = weekPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const weekOrders = allOrders.filter((o) => isDateInThisWeek(o.date, o.createdAt));
  const weekOrdersAmount = weekOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

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

  // In-progress sales/orders
  const activeOrdersCount = allOrders.filter(
    (o) =>
      o.status !== 'Terminé' &&
      o.status !== 'Livré' &&
      o.status !== 'Validé' &&
      o.status !== 'Annulé'
  ).length;

  // Quotes pending validation
  const pendingQuotesCount = quotes.filter((q) => q.status === 'En attente' || q.status === 'Envoyé').length;

  // Unpaid or partially paid invoices (créances clients à encaisser)
  const pendingInvoices = invoices.filter((inv) => inv.status !== 'Payée' && inv.status !== 'Annulée');
  const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);

  // Breakdown per service
  const serviceStats = [
    {
      id: 'imprimerie',
      name: 'Imprimerie & Bureautique',
      icon: Printer,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-900 border-blue-200',
      count: printOrders.length,
      revenue: printOrders.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
      desc: 'Impressions, reliures, photocopies, tirages A4/A3',
    },
    {
      id: 'maintenance',
      name: 'Maintenance Informatique',
      icon: Wrench,
      color: 'from-purple-600 to-indigo-600',
      bgColor: 'bg-purple-50 text-purple-900 border-purple-200',
      count: maintenance.length,
      revenue: maintenance.reduce((sum, m) => sum + (m.paidAmount || 0), 0),
      desc: 'Diagnostics, réparations PC, installation systèmes',
    },
    {
      id: 'graphisme',
      name: 'Graphisme & Communication',
      icon: Palette,
      color: 'from-pink-600 to-rose-600',
      bgColor: 'bg-pink-50 text-pink-900 border-pink-200',
      count: graphicProjects.length,
      revenue: graphicProjects.reduce((sum, g) => sum + (g.paidAmount || 0), 0),
      desc: 'Création logos, chartes, affiches, flyers',
    },
    {
      id: 'solutions_numeriques',
      name: 'Solutions Numériques',
      icon: Laptop,
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-50 text-cyan-900 border-cyan-200',
      count: digitalProjects.length,
      revenue: digitalProjects.reduce((sum, d) => sum + (d.paidAmount || 0), 0),
      desc: 'Sites web, logiciels, hébergement, formation',
    },
    {
      id: 'teeshirt',
      name: 'Impression Tee-shirt',
      icon: Shirt,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-900 border-amber-200',
      count: tshirtOrders.length,
      revenue: tshirtOrders.reduce((sum, t) => sum + (t.paidAmount || 0), 0),
      desc: 'Impression DTF, flocage, polos & tee-shirts',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Gérant Space */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1f47] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Espace Gérant • Vente & Commercialisation des Services</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tableau de Bord Ventes & Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bienvenue, <strong>{currentUser.name}</strong>. Enregistrez les commandes clients, gérez les devis et suivez les encaissements sur les 5 services de SYGEMA CI Daloa.
            </p>
          </div>

          {/* Manager Access Badge */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Rôle Actif :</span>
              <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                Gérant des Ventes
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Périmètre :</span>
              <span className="text-slate-200 font-semibold">5 Services & Caisse</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Encaissements Caisse :</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatFCFA(cashInfo.theoretical)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Sale Actions Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Actions Rapides de Vente :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('imprimerie')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>+ Imprimerie</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('maintenance')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Maintenance</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('graphisme')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Palette className="w-4 h-4" />
              <span>+ Graphisme</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('solutions_numeriques')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-sm transition"
            >
              <Laptop className="w-4 h-4" />
              <span>+ Numérique</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('teeshirt')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Shirt className="w-4 h-4" />
              <span>+ Tee-shirt</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('devis')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs transition"
            >
              <FileText className="w-4 h-4" />
              <span>+ Devis</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('facturation')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ Facture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Focus Recettes : Recette Journalière & Recette Gagnée en Semaine */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0d1e42] to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-blue-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Point des Recettes du Comptoir & Ventes
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wider">
                  Temps Réel
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Suivi direct pour l'arrêté de caisse : {formatDateLongFr(new Date())} et {currentWeekInfo.label.toLowerCase()}
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
              <span>Ma Caisse</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('facturation')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Nouveau Règlement</span>
            </button>
          </div>
        </div>

        {/* 2 Big Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* CARTE 1: RECETTE JOURNALIÈRE */}
          <div className="bg-slate-950/70 rounded-2xl p-5 border border-amber-400/30 hover:border-amber-400/60 transition flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Recette Journalière (Aujourd'hui)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {formatDateFr(new Date().toISOString())}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                  {formatFCFA(todayRevenue)}
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    <strong>{todayPayments.length}</strong> encaissement{todayPayments.length > 1 ? 's' : ''} effectué{todayPayments.length > 1 ? 's' : ''} aujourd'hui
                  </span>
                </p>
              </div>
            </div>

            {/* Ventilation par mode de règlement (Espèces, Mobile Money) */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800/90 text-xs">
              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Espèces en caisse</span>
                <span className="font-bold text-amber-200 block mt-0.5 font-mono">
                  {formatFCFA(todayCashAmount)}
                </span>
                <span className="text-[10px] text-slate-500">Comptant</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Mobile Money</span>
                <span className="font-bold text-teal-300 block mt-0.5 font-mono">
                  {formatFCFA(todayMobileAmount)}
                </span>
                <span className="text-[10px] text-slate-500">Wave / OM / MoMo</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Commandes du jour</span>
                <span className="font-bold text-blue-300 block mt-0.5 font-mono">
                  {todayOrders.length}
                </span>
                <span className="text-[10px] text-slate-500">{formatFCFA(todayOrdersAmount)}</span>
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

              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-black text-blue-300 font-mono tracking-tight">
                  {formatFCFA(weekRevenue)}
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    <strong>{weekPayments.length}</strong> encaissement{weekPayments.length > 1 ? 's' : ''} sur la semaine en cours
                  </span>
                </p>
              </div>
            </div>

            {/* Mini Bar Chart: 7 Jours de la semaine courante (Lun - Dim) */}
            <div className="pt-3 mt-3 border-t border-slate-800/90">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Dynamique hebdomadaire (Lun - Dim)</span>
                <span className="text-slate-300 font-mono">Dossiers : <strong>{weekOrders.length}</strong> ({formatFCFA(weekOrdersAmount)})</span>
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
                              ? 'bg-gradient-to-t from-amber-400 to-amber-300 shadow-xs'
                              : dayStat.amount > 0
                              ? 'bg-blue-500 group-hover:bg-blue-400'
                              : 'bg-slate-700/50'
                          }`}
                        />
                      </div>
                      <span className={`text-[9px] mt-1 font-bold ${dayStat.isToday ? 'text-amber-400' : 'text-slate-400'}`}>
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

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ventes Encaissées */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Ventes Encaissées
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {formatFCFA(totalSalesRevenue)}
            </h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{payments.length} règlements reçus</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Commandes en cours */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Commandes Actives
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {activeOrdersCount}
            </h3>
            <p className="text-[11px] text-blue-700 font-bold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Sur les 5 pôles de services</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Devis en attente */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Devis en Négociation
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {pendingQuotesCount}
            </h3>
            <p className="text-[11px] text-amber-700 font-bold mt-1">
              À relancer auprès des clients
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Créances à encaisser */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Règlements à Encaisser
            </p>
            <h3 className="text-2xl font-black text-rose-700 mt-1 font-mono">
              {formatFCFA(pendingInvoicesAmount)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {pendingInvoices.length} factures avec solde dû
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* The 5 Services Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-900" />
            <span>Commercialisation des 5 Services SYGEMA CI</span>
          </h2>
          <span className="text-xs text-slate-500">Cliquez pour accéder directement au service</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {serviceStats.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => onNavigate(srv.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${srv.color} text-white shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 group-hover:bg-amber-100 group-hover:text-amber-900 transition">
                      {srv.count} vente{srv.count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 group-hover:text-blue-900 transition">
                    {srv.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Encaissé :</span>
                  <span className="font-mono font-black text-slate-900">
                    {formatFCFA(srv.revenue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: Recent Orders & Recent Invoices/Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-900" />
              <span>Dernières Commandes Clients des Services</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('commandes')}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {allOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Aucune commande enregistrée pour le moment</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Utilisez les boutons ci-dessus pour saisir votre première vente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {allOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {order.clientName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {order.service} • {order.details}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatDateFr(order.date)}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono font-black text-slate-900">
                      {formatFCFA(order.totalAmount)}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        order.status === 'Terminé' || order.status === 'Livré'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Factures & Paiements récents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Règlements & Facturation Ventes</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('facturation')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Gérer les factures</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Aucune facture émise</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Créez une facture client pour officialiser une vente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">
                      {inv.invoiceNumber} — {inv.clientName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {inv.branch} • Émise le {formatDateFr(inv.issueDate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-black text-slate-900">
                      {formatFCFA(inv.totalAmount)}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        inv.status === 'Payée'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security notice footer for Gerant */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-extrabold">Rappel des prérogatives du Gérant :</strong>
          <p className="text-[11px] mt-0.5 text-amber-800">
            Votre profil est dédié à l'activité commerciale : accueil des clients, devis, commandes pour les 5 services, facturation et encaissement.
            L'ajout ou modification d'utilisateurs et les réglages de l'entreprise (coordonnées officielles, réinitialisation) sont réservés à l'Administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};
