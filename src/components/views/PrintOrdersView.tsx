import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Printer,
  Plus,
  Search,
  FileText,
  Boxes,
  CheckCircle,
  Copy,
  Scan,
  Edit2,
  Trash2,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  PrintOrder,
  PrintServiceType,
  PaperFormat,
  ColorType,
  PrintingSide,
  OrderStatus,
  PaymentMethod,
} from '../../types';
import { PrintableDocType } from '../PrintableDocumentModal';

interface PrintOrdersViewProps {
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const PrintOrdersView: React.FC<PrintOrdersViewProps> = ({ onOpenPrint }) => {
  const {
    printOrders,
    addPrintOrder,
    updatePrintOrder,
    deletePrintOrder,
    consumeStockForPrint,
    clients,
    products,
    invoices,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PrintOrder | null>(null);

  // Stock deduction modal
  const [stockModalOrder, setStockModalOrder] = useState<PrintOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [consumeQuantity, setConsumeQuantity] = useState<number>(1);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('TOUS');

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    serviceType: 'Impression noir et blanc' as PrintServiceType,
    documentName: '',
    paperFormat: 'A4' as PaperFormat,
    pageCount: 1,
    copyCount: 1,
    colorType: 'Noir & Blanc' as ColorType,
    printingSide: 'Recto' as PrintingSide,
    unitPrice: 0,
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: 'Espèces' as PaymentMethod,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'En attente' as OrderStatus,
    observations: '',
  });

  const servicesList: PrintServiceType[] = [
    'Photo minute (Planche 4/8/12 photos, Fond blanc/bleu, CNI/Passeport/Concours)',
    'Inscription en ligne scolaire (MENA, Primaire, BEPC, BAC, Université)',
    'Inscription en ligne (Concours, Examens, Bourses, Universités)',
    'Rédaction & Saisie d\'exposé (Scolaire & Universitaire)',
    'Confection de carnets (Reçus, Factures, Bons à souche)',
    'Reliure de documents & rapports (Spirale, Thermique, Baguette)',
    'Impression noir et blanc',
    'Impression couleur',
    'Photocopie N&B et couleur',
    'Scan et numérisation de documents',
    'Saisie de documents & Traitement de texte',
    'Mise en page et traitement de texte',
    'Plastification de documents (Badges, A4, A3)',
    'Conception et impression de documents professionnels',
  ];

  // Auto-calculate total in form
  const handleCalculateTotal = (pages: number, copies: number, unit: number) => {
    return (pages || 0) * (copies || 0) * (unit || 0);
  };

  const handleOpenAdd = () => {
    setEditingOrder(null);
    const defaultClient = clients[0];

    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      serviceType: 'Impression noir et blanc',
      documentName: '',
      paperFormat: 'A4',
      pageCount: 1,
      copyCount: 1,
      colorType: 'Noir & Blanc',
      printingSide: 'Recto',
      unitPrice: 0,
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: 'Espèces',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      status: 'En attente',
      observations: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: PrintOrder) => {
    setEditingOrder(order);
    setFormData({
      clientId: order.clientId,
      clientName: order.clientName,
      phone: order.phone,
      serviceType: order.serviceType,
      documentName: order.documentName,
      paperFormat: order.paperFormat,
      pageCount: order.pageCount,
      copyCount: order.copyCount,
      colorType: order.colorType,
      printingSide: order.printingSide,
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      paymentMethod: (order.paymentMethod as PaymentMethod) || 'Espèces',
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      status: order.status,
      observations: order.observations || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.documentName) return;

    if (editingOrder) {
      updatePrintOrder(editingOrder.id, formData);
    } else {
      addPrintOrder(formData);
    }
    setIsModalOpen(false);
  };

  const handleStockConsumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalOrder || !selectedProduct || consumeQuantity <= 0) return;

    consumeStockForPrint(stockModalOrder.id, [
      { productId: selectedProduct, quantity: consumeQuantity },
    ]);
    setStockModalOrder(null);
  };

  const filtered = printOrders.filter((p) => {
    const matchesSearch =
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.documentName.toLowerCase().includes(search.toLowerCase()) ||
      p.serviceType.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'TOUS' || p.status === filterStatus;
    const matchesService =
      selectedServiceFilter === 'TOUS' ||
      p.serviceType.toLowerCase().includes(selectedServiceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Imprimerie & Bureautique
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inscriptions en ligne, exposés scolaires & universitaires, carnets, reliures, tirages et plastifications
          </p>
        </div>

        <button
          id="btn-add-print-order"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Commande Impression</span>
        </button>
      </div>

      {/* Services Badges Grid (Interactive & Filterable) */}
      <div className="bg-blue-950 text-white rounded-2xl p-5 shadow-xs border border-blue-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-blue-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Catalogue des Services de Tirage & Bureautique SYGEMA CI</span>
          </h2>
          {selectedServiceFilter !== 'TOUS' && (
            <button
              type="button"
              onClick={() => setSelectedServiceFilter('TOUS')}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 self-start sm:self-auto"
            >
              Afficher tous les services ({printOrders.length})
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {servicesList.map((srv) => {
            const isSelected = selectedServiceFilter !== 'TOUS' && srv.toLowerCase().includes(selectedServiceFilter.toLowerCase());
            return (
              <button
                key={srv}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedServiceFilter('TOUS');
                  } else {
                    // Filter by key term
                    if (srv.includes('Photo minute')) setSelectedServiceFilter('Photo minute');
                    else if (srv.includes('scolaire')) setSelectedServiceFilter('scolaire');
                    else if (srv.includes('Inscription')) setSelectedServiceFilter('Inscription');
                    else if (srv.includes('exposé')) setSelectedServiceFilter('exposé');
                    else if (srv.includes('carnet')) setSelectedServiceFilter('carnet');
                    else if (srv.includes('Reliure')) setSelectedServiceFilter('Reliure');
                    else setSelectedServiceFilter(srv);
                  }
                }}
                className={`p-2.5 rounded-xl text-left border transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-sm'
                    : 'bg-blue-900/50 hover:bg-blue-800/80 border-blue-800/80 text-blue-100'
                }`}
              >
                <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="text-[11px] leading-snug">{srv}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Service Chips & Search Filters */}
      <div className="space-y-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        {/* Rapid service filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Filtre Service :
          </span>
          {[
            { label: 'Tous', filter: 'TOUS' },
            { label: '📸 Photo minute', filter: 'Photo minute' },
            { label: '🎓 Inscriptions scolaires', filter: 'scolaire' },
            { label: '📝 Inscriptions concours', filter: 'Inscription' },
            { label: '📚 Exposés', filter: 'exposé' },
            { label: '🧾 Carnets', filter: 'carnet' },
            { label: '📑 Reliures', filter: 'Reliure' },
            { label: '🖨️ Impressions', filter: 'Impression' },
            { label: '📄 Photocopies & Scans', filter: 'Photocopie' },
          ].map((item) => (
            <button
              key={item.filter}
              type="button"
              onClick={() => setSelectedServiceFilter(item.filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedServiceFilter === item.filter
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° commande, client, document, prestation..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['TOUS', 'En attente', 'En cours', 'Terminé', 'Livré'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
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
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Document & Spécifications</th>
                <th className="py-3 px-4">Volume & Copies</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Reste</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Aucune commande d'impression trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const linkedInvoice = invoices.find((inv) => inv.orderId === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                        {item.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          {formatDateFr(item.orderDate)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.clientName}</div>
                        <div className="text-[11px] text-slate-500">{item.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.documentName}</div>
                        <div className="text-[11px] text-blue-700 font-medium">
                          {item.serviceType}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Format {item.paperFormat} • {item.colorType} • {item.printingSide}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-bold">{item.copyCount}</span> exemplaire(s)
                        <span className="block text-[10px] text-slate-400">
                          {item.pageCount} page(s) / ex.
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatFCFA(item.totalAmount)}
                        {item.paidAmount > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-normal">
                            Payé : {formatFCFA(item.paidAmount)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">
                        {item.remainingAmount > 0 ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {formatFCFA(item.remainingAmount)}
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Soldé
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updatePrintOrder(item.id, {
                              status: e.target.value as OrderStatus,
                            })
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer ${
                            item.status === 'Livré'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : item.status === 'Terminé'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : item.status === 'En cours'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Livré">Livré</option>
                          <option value="Annulé">Annulé</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {linkedInvoice && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenPrint({ type: 'invoice', data: linkedInvoice })
                              }
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition"
                              title="Imprimer Facture / Reçu"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setStockModalOrder(item);
                              setSelectedProduct(products[0]?.id || '');
                              setConsumeQuantity(1);
                            }}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                            title="Consommer du stock pour cette commande"
                          >
                            <Boxes className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Supprimer cette commande d\'impression ?')) {
                                deletePrintOrder(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* MODAL: ADD / EDIT PRINT ORDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingOrder
                  ? `Modifier Commande ${editingOrder.orderNumber}`
                  : 'Nouvelle Commande Impression & Bureautique'}
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
              {/* Client Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sélectionner un Client existant
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => {
                      const c = clients.find((x) => x.id === e.target.value);
                      if (c) {
                        setFormData({
                          ...formData,
                          clientId: c.id,
                          clientName: c.name,
                          phone: c.phone,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="">-- Choisir dans la liste --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Nom du client"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Téléphone contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05 66 59 45 49"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Service demandée *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceType: e.target.value as PrintServiceType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intitulé du document / Fichier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.documentName}
                  onChange={(e) =>
                    setFormData({ ...formData, documentName: e.target.value })
                  }
                  placeholder="Ex: Mémoire de soutenance, Reçus de paiement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Format papier
                  </label>
                  <select
                    value={formData.paperFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paperFormat: e.target.value as PaperFormat,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="A4">A4 (Standard)</option>
                    <option value="A3">A3 (Grand format)</option>
                    <option value="A5">A5</option>
                    <option value="Autre">Autre format</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Type de tirage
                  </label>
                  <select
                    value={formData.colorType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorType: e.target.value as ColorType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Noir & Blanc">Noir & Blanc</option>
                    <option value="Couleur">Couleur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Orientation face
                  </label>
                  <select
                    value={formData.printingSide}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printingSide: e.target.value as PrintingSide,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Recto">Recto simple</option>
                    <option value="Recto-verso">Recto-verso</option>
                  </select>
                </div>
              </div>

              {/* Volumes & Auto calculation */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                <div>
                  <label className="block font-bold text-blue-950 mb-1">
                    Nombre de pages / doc
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.pageCount}
                    onChange={(e) => {
                      const pages = Number(e.target.value);
                      const total = handleCalculateTotal(
                        pages,
                        formData.copyCount,
                        formData.unitPrice
                      );
                      setFormData({
                        ...formData,
                        pageCount: pages,
                        totalAmount: total,
                        paidAmount: total,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-blue-950 mb-1">
                    Nombre d'exemplaires
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.copyCount}
                    onChange={(e) => {
                      const copies = Number(e.target.value);
                      const total = handleCalculateTotal(
                        formData.pageCount,
                        copies,
                        formData.unitPrice
                      );
                      setFormData({
                        ...formData,
                        copyCount: copies,
                        totalAmount: total,
                        paidAmount: total,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-blue-950 mb-1">
                    Prix unitaire / page (FCFA)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.unitPrice}
                    onChange={(e) => {
                      const unit = Number(e.target.value);
                      const total = handleCalculateTotal(
                        formData.pageCount,
                        formData.copyCount,
                        unit
                      );
                      setFormData({
                        ...formData,
                        unitPrice: unit,
                        totalAmount: total,
                        paidAmount: total,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* Total & Paid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Total Calculé (FCFA)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, totalAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-sm text-blue-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Encaissé (Acompte ou Total)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-sm text-emerald-700 focus:outline-none"
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
                    <option value="Espèces">Espèces</option>
                    <option value="Wave">Wave (05 66 59 45 49)</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Moov Money">Moov Money</option>
                    <option value="Virement">Virement bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de livraison souhaitée
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations / Finitions (Reliure spirale, type de papier, plastification...)
                </label>
                <input
                  type="text"
                  value={formData.observations}
                  onChange={(e) =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                  placeholder="Ex: Reliure spirale bleue, couverture transparente..."
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
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm"
                >
                  {editingOrder ? 'Enregistrer les modifications' : 'Créer la Commande & Facture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONSUME STOCK FOR PRINT ORDER */}
      {stockModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Consommer du Stock
                </h3>
                <p className="text-xs text-slate-500">
                  Commande {stockModalOrder.orderNumber} ({stockModalOrder.clientName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStockModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStockConsumeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Article / Consommable utilisé *
                </label>
                <select
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.currentStock} {p.unit} en stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantité consommée pour ce tirage *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={consumeQuantity}
                  onChange={(e) => setConsumeQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStockModalOrder(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-sm"
                >
                  Valider la sortie de stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
