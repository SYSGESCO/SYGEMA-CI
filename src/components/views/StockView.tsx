import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  PackageCheck,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';
import { Product, StockCategory } from '../../types';

export const StockView: React.FC = () => {
  const {
    products,
    stockMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockMovement,
    suppliers,
    currentUser,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modal: Add/Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Papeterie' as StockCategory,
    unit: 'Rame',
    currentStock: 10,
    minStockAlert: 5,
    purchasePrice: 2800,
    sellingPrice: 4000,
    supplier: 'Papeterie Moderne Daloa',
    location: 'Étagère A1',
  });

  // Modal: Stock In / Stock Out
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: '',
    type: 'Entrée' as 'Entrée' | 'Sortie' | 'Ajustement',
    quantity: 5,
    reason: 'Réapprovisionnement fournisseur',
  });

  const categories: StockCategory[] = [
    'Papeterie',
    'Encre & Toner',
    'Reliure & Plastification',
    'Textile',
    'Pièces Informatiques',
    'Consommables',
  ];

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Papeterie',
      unit: 'Unité',
      currentStock: 10,
      minStockAlert: 3,
      purchasePrice: 2000,
      sellingPrice: 3500,
      supplier: suppliers[0]?.name || 'Fournisseur Daloa',
      location: 'Atelier',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      unit: prod.unit,
      currentStock: prod.currentStock,
      minStockAlert: prod.minStockAlert,
      purchasePrice: prod.purchasePrice,
      sellingPrice: prod.sellingPrice,
      supplier: prod.supplier || '',
      location: prod.location || '',
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.productId || movementForm.quantity <= 0) return;

    addStockMovement({
      productId: movementForm.productId,
      type: movementForm.type,
      quantity: movementForm.quantity,
      reason: movementForm.reason,
      performedBy: currentUser.name,
    });
    setIsMovementModalOpen(false);
  };

  const filtered = products.filter((p) => {
    const match =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'TOUS' || p.category === filterCategory;
    const matchLow = !showLowStockOnly || p.currentStock <= p.minStockAlert;
    return match && matchCat && matchLow;
  });

  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockAlert).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Gestion des Stocks & Consommables
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Papier, encres, toners, reliures, tee-shirts vierges, pièces détachées et alertes réapprovisionnement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMovementForm({
                productId: products[0]?.id || '',
                type: 'Entrée',
                quantity: 5,
                reason: 'Réapprovisionnement atelier',
              });
              setIsMovementModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-xs transition"
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            <span>Mouvement de Stock</span>
          </button>

          <button
            id="btn-add-product"
            type="button"
            onClick={handleOpenAddProduct}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Article</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Articles en Stock</span>
            <span className="text-2xl font-black text-slate-900">{products.length} références</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Valeur Marchande (Achat)</span>
            <span className="text-2xl font-black text-slate-900">{formatFCFA(totalStockValue)}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`rounded-2xl p-4 shadow-xs border cursor-pointer transition flex items-center justify-between ${
            showLowStockOnly
              ? 'bg-rose-900 text-white border-rose-950 ring-2 ring-rose-500'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div>
            <span
              className={`text-[10px] uppercase font-bold block ${
                showLowStockOnly ? 'text-rose-200' : 'text-slate-400'
              }`}
            >
              Alertes Rupture / Stock Bas
            </span>
            <span
              className={`text-2xl font-black ${
                lowStockCount > 0 ? (showLowStockOnly ? 'text-white' : 'text-rose-600') : 'text-slate-900'
              }`}
            >
              {lowStockCount} article(s) critique(s)
            </span>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              showLowStockOnly ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par désignation d'article, catégorie..."
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
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Désignation Article</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4 text-center">Stock Actuel</th>
                <th className="py-3 px-4 text-center">Seuil Alerte</th>
                <th className="py-3 px-4 text-right">Prix d'Achat</th>
                <th className="py-3 px-4 text-right">Prix de Vente</th>
                <th className="py-3 px-4">Fournisseur & Emplacement</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const isLow = prod.currentStock <= prod.minStockAlert;
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isLow ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {prod.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                            isLow
                              ? 'bg-rose-100 text-rose-800 font-black'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          {prod.currentStock} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                        {prod.minStockAlert} {prod.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-700">
                        {formatFCFA(prod.purchasePrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatFCFA(prod.sellingPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-semibold text-slate-800">{prod.supplier}</div>
                        <div className="text-[10px] text-slate-400">{prod.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setMovementForm({
                                productId: prod.id,
                                type: 'Entrée',
                                quantity: 5,
                                reason: 'Approvisionnement',
                              });
                              setIsMovementModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                            title="Entrée/Sortie directe"
                          >
                            <ArrowDownRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Supprimer l'article ${prod.name} ?`)) {
                                deleteProduct(prod.id);
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

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? 'Modifier l\'article de Stock' : 'Nouvel Article en Stock'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Désignation de l'article *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Rames Papier A4 80g Double A"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as StockCategory,
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
                  <label className="block font-bold text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="Rame, Pièce, Bouteille..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Initial</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={productForm.currentStock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, currentStock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seuil Alerte Min</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={productForm.minStockAlert}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        minStockAlert: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix d'Achat (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={productForm.purchasePrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        purchasePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix de Vente (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={productForm.sellingPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fournisseur Habituel</label>
                  <input
                    type="text"
                    value={productForm.supplier}
                    onChange={(e) =>
                      setProductForm({ ...productForm, supplier: e.target.value })
                    }
                    placeholder="Nom du fournisseur"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emplacement dans l'Atelier</label>
                  <input
                    type="text"
                    value={productForm.location}
                    onChange={(e) =>
                      setProductForm({ ...productForm, location: e.target.value })
                    }
                    placeholder="Étagère A1, Tiroir 2..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm"
                >
                  {editingProduct ? 'Enregistrer' : 'Créer l\'Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK MOVEMENT */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Enregistrer un Mouvement de Stock
              </h3>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMovementSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article concerné *</label>
                <select
                  required
                  value={movementForm.productId}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, productId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Actuel: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type de Mouvement</label>
                  <select
                    value={movementForm.type}
                    onChange={(e) =>
                      setMovementForm({
                        ...movementForm,
                        type: e.target.value as 'Entrée' | 'Sortie' | 'Ajustement',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="Entrée">Entrée (Approvisionnement)</option>
                    <option value="Sortie">Sortie (Utilisation / Perte)</option>
                    <option value="Ajustement">Ajustement inventaire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantité *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={movementForm.quantity}
                    onChange={(e) =>
                      setMovementForm({
                        ...movementForm,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif / Justification *</label>
                <input
                  type="text"
                  required
                  value={movementForm.reason}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, reason: e.target.value })
                  }
                  placeholder="Ex: Facture Fournisseur N°142 ou Tirage commande"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
