import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Shirt,
  Plus,
  Search,
  CheckCircle,
  Boxes,
  Edit2,
  Trash2,
  Printer,
  Sparkles,
  Phone,
  Tag,
} from 'lucide-react';
import {
  TshirtOrder,
  TshirtPrintType,
  TshirtStatus,
} from '../../types';
import { PrintableDocType } from '../PrintableDocumentModal';

interface TshirtViewProps {
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const TshirtView: React.FC<TshirtViewProps> = ({ onOpenPrint }) => {
  const {
    tshirtOrders,
    addTshirtOrder,
    updateTshirtOrder,
    deleteTshirtOrder,
    consumeStockForTshirt,
    clients,
    products,
    invoices,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<TshirtOrder | null>(null);

  // Stock deduction modal
  const [stockModalOrder, setStockModalOrder] = useState<TshirtOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [consumeQuantity, setConsumeQuantity] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    designName: 'Logo Entreprise Cœur & Dos',
    tshirtColor: 'Blanc',
    size: 'M, L, XL',
    quantity: 25,
    printType: 'DTF' as TshirtPrintType,
    unitPrice: 3500,
    totalAmount: 87500,
    advance: 50000,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: new Date().toISOString().split('T')[0],
    status: 'Nouvelle commande' as TshirtStatus,
    observations: 'Col rond, 100% coton.',
  });

  const printTypes: TshirtPrintType[] = [
    'DTF',
    'Sérigraphie',
    'Flocage',
    'Sublimation',
    'Broderie',
    'Transfert direct',
  ];

  const handleCalculateTotal = (qty: number, unit: number) => {
    return (qty || 1) * (unit || 0);
  };

  const handleOpenAdd = () => {
    setEditingOrder(null);
    const defaultClient = clients[0];
    const initialQty = 25;
    const initialUnit = 3500;
    const initialTotal = handleCalculateTotal(initialQty, initialUnit);

    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      designName: 'Logo poitrine + Inscription dos',
      tshirtColor: 'Noir',
      size: 'S: 5, M: 10, L: 10',
      quantity: initialQty,
      printType: 'DTF',
      unitPrice: initialUnit,
      totalAmount: initialTotal,
      advance: 45000,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: new Date().toISOString().split('T')[0],
      status: 'Nouvelle commande',
      observations: 'Coton de qualité supérieure.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: TshirtOrder) => {
    setEditingOrder(order);
    setFormData({
      clientId: order.clientId,
      clientName: order.clientName,
      phone: order.phone,
      designName: order.designName,
      tshirtColor: order.tshirtColor,
      size: order.size,
      quantity: order.quantity,
      printType: order.printType,
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      advance: order.advance,
      orderDate: order.orderDate,
      expectedDate: order.expectedDate,
      status: order.status,
      observations: order.observations || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.designName) return;

    if (editingOrder) {
      updateTshirtOrder(editingOrder.id, formData);
    } else {
      addTshirtOrder(formData);
    }
    setIsModalOpen(false);
  };

  const handleStockConsumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalOrder || !selectedProduct || consumeQuantity <= 0) return;

    consumeStockForTshirt(stockModalOrder.id, [
      { productId: selectedProduct, quantity: consumeQuantity },
    ]);
    setStockModalOrder(null);
  };

  const filtered = tshirtOrders.filter((t) => {
    const matchesSearch =
      t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.designName.toLowerCase().includes(search.toLowerCase()) ||
      t.tshirtColor.toLowerCase().includes(search.toLowerCase()) ||
      t.printType.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'TOUS' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Impression Tee-shirt & Textiles
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personnalisation textile, entreprises, événements, écoles & assos : DTF, sérigraphie, flocage, sublimation
          </p>
        </div>

        <button
          id="btn-add-tshirt-order"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Commande Tee-shirts</span>
        </button>
      </div>

      {/* Techniques Badges */}
      <div className="bg-amber-950 text-white rounded-2xl p-5 shadow-xs border border-amber-900">
        <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Techniques de Marquage Textile SYGEMA CI</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {printTypes.map((tech) => (
            <div
              key={tech}
              className="p-2.5 rounded-xl bg-amber-900/50 border border-amber-800/80 text-amber-100 flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-[11px]">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° commande, client, motif, couleur..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['TOUS', 'Nouvelle commande', 'Visuel en cours', 'Impression en cours', 'Prêt', 'Livré'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
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
                <th className="py-3 px-4">Motif & Technique</th>
                <th className="py-3 px-4">Couleur & Tailles</th>
                <th className="py-3 px-4 text-center">Quantité</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Reste</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Aucune commande de tee-shirts trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const linkedInvoice = invoices.find((inv) => inv.orderId === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
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
                        <div className="font-semibold text-slate-800">{item.designName}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {item.printType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-900">{item.tshirtColor}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.size}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                        {item.quantity} pcs
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatFCFA(item.totalAmount)}
                        {item.advance > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-normal">
                            Acompte : {formatFCFA(item.advance)}
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
                            updateTshirtOrder(item.id, {
                              status: e.target.value as TshirtStatus,
                            })
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer ${
                            item.status === 'Livré'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : item.status === 'Prêt'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : item.status === 'Impression en cours'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="Nouvelle commande">Nouvelle commande</option>
                          <option value="Visuel en cours">Visuel en cours</option>
                          <option value="Impression en cours">Impression en cours</option>
                          <option value="Prêt">Prêt</option>
                          <option value="Livré">Livré</option>
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
                              title="Imprimer Facture"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setStockModalOrder(item);
                              setSelectedProduct(
                                products.find((p) => p.category === 'Textile')?.id ||
                                  products[0]?.id ||
                                  ''
                              );
                              setConsumeQuantity(item.quantity);
                            }}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                            title="Consommer tee-shirts vierges du stock"
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
                              if (window.confirm('Supprimer cette commande tee-shirts ?')) {
                                deleteTshirtOrder(item.id);
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

      {/* MODAL: ADD / EDIT TSHIRT ORDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingOrder
                  ? `Modifier Commande ${editingOrder.orderNumber}`
                  : 'Nouvelle Commande Impression Tee-shirt'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sélectionner un Client
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Technique de marquage *
                  </label>
                  <select
                    value={formData.printType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printType: e.target.value as TshirtPrintType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    {printTypes.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intitulé du visuel / Logo à imprimer *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designName}
                  onChange={(e) =>
                    setFormData({ ...formData, designName: e.target.value })
                  }
                  placeholder="Ex: Logo Promotion 2026 + Texte au dos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Couleur du textile
                  </label>
                  <input
                    type="text"
                    value={formData.tshirtColor}
                    onChange={(e) =>
                      setFormData({ ...formData, tshirtColor: e.target.value })
                    }
                    placeholder="Ex: Blanc, Noir, Bleu Marine, Jaune..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Répartition des tailles
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="Ex: 5 S, 10 M, 10 L..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Quantité & Calcul prix */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1">
                    Quantité totale (pièces) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      const tot = handleCalculateTotal(qty, formData.unitPrice);
                      setFormData({
                        ...formData,
                        quantity: qty,
                        totalAmount: tot,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-950 mb-1">
                    Prix unitaire / pièce (FCFA) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.unitPrice}
                    onChange={(e) => {
                      const unit = Number(e.target.value);
                      const tot = handleCalculateTotal(formData.quantity, unit);
                      setFormData({
                        ...formData,
                        unitPrice: unit,
                        totalAmount: tot,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg font-bold"
                  />
                </div>
              </div>

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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Acompte versé à la commande (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.advance}
                    onChange={(e) =>
                      setFormData({ ...formData, advance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-sm text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date prévisionnelle de livraison
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Statut de la commande
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as TshirtStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Nouvelle commande">Nouvelle commande</option>
                    <option value="Visuel en cours">Visuel en cours</option>
                    <option value="Impression en cours">Impression en cours</option>
                    <option value="Prêt">Prêt</option>
                    <option value="Livré">Livré</option>
                  </select>
                </div>
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
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm"
                >
                  {editingOrder ? 'Enregistrer les modifications' : 'Créer la Commande & Facture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONSUME TEXTILE STOCK */}
      {stockModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Prélèvement Textiles du Stock
                </h3>
                <p className="text-xs text-slate-500">
                  Commande {stockModalOrder.orderNumber} ({stockModalOrder.quantity} tee-shirts demandés)
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
                  Article Textile vierge en stock *
                </label>
                <select
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.currentStock} {p.unit} disponibles)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantité de tee-shirts prélevés *
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
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm"
                >
                  Valider le prélèvement stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
