import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  ClipboardList,
  Search,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { PrintableDocType } from '../PrintableDocumentModal';
import { ServiceCategory } from '../../types';

interface CommandesViewProps {
  onNavigate: (view: string) => void;
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const CommandesView: React.FC<CommandesViewProps> = ({
  onNavigate,
  onOpenPrint,
}) => {
  const { getAllOrders, company } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const allOrders = getAllOrders();

  const categories: Array<{ id: string; label: string; icon: React.ElementType }> = [
    { id: 'TOUS', label: 'Toutes les commandes', icon: ClipboardList },
    { id: 'imprimerie', label: 'Imprimerie & Bureautique', icon: Printer },
    { id: 'maintenance', label: 'Maintenance informatique', icon: Wrench },
    { id: 'graphisme', label: 'Graphisme & Communication', icon: Palette },
    { id: 'solutions_numeriques', label: 'Solutions numériques', icon: Laptop },
    { id: 'teeshirt', label: 'Impression Tee-shirt', icon: Shirt },
  ];

  const filteredOrders = allOrders.filter((order) => {
    const matchSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.clientName.toLowerCase().includes(search.toLowerCase()) ||
      order.clientPhone.includes(search) ||
      order.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      filterCategory === 'TOUS' || order.category === filterCategory;

    const matchStatus =
      filterStatus === 'TOUS' ||
      (filterStatus === 'EN_COURS' &&
        order.status !== 'Terminé' &&
        order.status !== 'Livré') ||
      (filterStatus === 'TERMINE' &&
        (order.status === 'Terminé' || order.status === 'Livré'));

    return matchSearch && matchCategory && matchStatus;
  });

  const totalAmount = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPaid = filteredOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalRemaining = filteredOrders.reduce((sum, o) => sum + o.remainingAmount, 0);

  const getServiceRoute = (cat: ServiceCategory) => {
    switch (cat) {
      case 'imprimerie':
        return 'imprimerie';
      case 'maintenance':
        return 'maintenance';
      case 'graphisme':
        return 'graphisme';
      case 'solutions_numeriques':
        return 'solutions_numeriques';
      case 'teeshirt':
        return 'teeshirt';
      default:
        return 'dashboard';
    }
  };

  const handlePrintOrder = (order: typeof allOrders[0]) => {
    onOpenPrint({
      type: 'bon_commande',
      title: `Bon de Commande ${order.orderNumber}`,
      number: order.orderNumber,
      date: order.date,
      clientName: order.clientName,
      clientPhone: order.clientPhone,
      company: {
        name: company.name,
        activity: company.activity,
        slogan: company.slogan,
        phone: company.phone,
        address: company.address,
      },
      items: [
        {
          description: `[${order.categoryLabel}] ${order.title}`,
          quantity: 1,
          unitPrice: order.totalAmount,
          totalPrice: order.totalAmount,
        },
      ],
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      remainingAmount: order.remainingAmount,
      paymentMethod: 'Espèces / Mobile Money',
      notes: `Service SYGEMA CI: ${order.categoryLabel} • Statut: ${order.status}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Gestion Centralisée des Commandes
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Suivi unifié de l'ensemble des commandes des 5 services de SYGEMA CI (Imprimerie, Maintenance, Graphisme, IT, Tee-shirts)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('imprimerie')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Imprimerie</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('maintenance')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Maintenance</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('teeshirt')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tee-shirt</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Commandes Filtrées</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {filteredOrders.length} commande(s)
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Volume : {formatFCFA(totalAmount)}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Montant Encaissé (Acomptes & Soldes)</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {formatFCFA(totalPaid)}
          </span>
          <span className="text-xs text-emerald-600 mt-1 block">
            Encaissé en caisse SYGEMA
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Reste à Recouvrer</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {formatFCFA(totalRemaining)}
          </span>
          <span className="text-xs text-amber-600 mt-1 block">
            À percevoir à la livraison
          </span>
        </div>
      </div>

      {/* Filters & Categories */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        {/* Service Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° commande, client, téléphone, prestation..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('TOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'TOUS'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous statuts
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('EN_COURS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'EN_COURS'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              En cours
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('TERMINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'TERMINE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Terminé / Livré
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">N° Commande</th>
                <th className="py-3 px-4">Service SYGEMA</th>
                <th className="py-3 px-4">Client & Contact</th>
                <th className="py-3 px-4">Prestation / Description</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Payé</th>
                <th className="py-3 px-4 text-right">Reste</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-600">Aucune commande trouvée</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Toutes les données sont actuellement à zéro. Utilisez les boutons ci-dessus pour enregistrer une commande.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isFinished = order.status === 'Terminé' || order.status === 'Livré';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                        {order.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {formatDateFr(order.date)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                          {order.categoryLabel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.clientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{order.clientPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {order.title}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isFinished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isFinished ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatFCFA(order.totalAmount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                        {formatFCFA(order.paidAmount)}
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          order.remainingAmount > 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      >
                        {formatFCFA(order.remainingAmount)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePrintOrder(order)}
                            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                            title="Imprimer le bon de commande"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigate(getServiceRoute(order.category))}
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition"
                            title="Ouvrir dans le service"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
