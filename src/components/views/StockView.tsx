import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  ShoppingCart,
  Package,
  History,
  Building2,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  Product,
  StockCategory,
  StockMovementType,
  StockMovementReason,
  PurchaseOrder,
  PurchaseItem,
  PurchaseStatus,
} from '../../types';

interface StockViewProps {
  initialTab?: 'stocks' | 'produits' | 'achats' | 'mouvements';
}

export const StockView: React.FC<StockViewProps> = ({ initialTab = 'stocks' }) => {
  const {
    products,
    stockMovements,
    purchaseOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockMovement,
    addPurchaseOrder,
    receivePurchaseOrder,
    deletePurchaseOrder,
    resetStocksAndPurchases,
    suppliers,
    currentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'stocks' | 'produits' | 'achats' | 'mouvements'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<string>('TOUS');

  // Modal: Reset Stocks & Purchases
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetOption, setResetOption] = useState<'zero_quantities' | 'clear_catalog'>('zero_quantities');

  // Modal: Add/Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    code: '',
    name: '',
    category: 'Papeterie' as StockCategory,
    unit: 'Unité',
    currentStock: 0,
    minStockAlert: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: '',
    location: '',
    description: '',
  });

  // Modal: Stock In / Stock Out
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: '',
    type: 'ENTREE' as StockMovementType,
    quantity: 1,
    reason: 'Achat fournisseur' as StockMovementReason,
    observations: '',
  });

  // Modal: Add Purchase Order
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: '',
    supplierName: '',
    date: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date().toISOString().split('T')[0],
    paidAmount: 0,
    status: 'Commandé' as PurchaseStatus,
    notes: '',
    items: [] as PurchaseItem[],
  });

  // Purchase item line builder
  const [currentPurchaseItem, setCurrentPurchaseItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
  });

  const categories: StockCategory[] = [
    'Papeterie',
    'Encre & Toner',
    'Reliure & Plastification',
    'Textile',
    'Pièces Informatiques',
    'Consommables',
  ];

  // Calculations
  const totalPhysicalUnits = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0);
  const totalStockPurchaseValue = products.reduce(
    (sum, p) => sum + (Number(p.currentStock) || 0) * (Number(p.purchasePrice) || 0),
    0
  );
  const totalStockSellingValue = products.reduce(
    (sum, p) => sum + (Number(p.currentStock) || 0) * (Number(p.sellingPrice) || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => (Number(p.minStockAlert) || 0) > 0 && (Number(p.currentStock) || 0) <= (Number(p.minStockAlert) || 0)
  ).length;

  const totalPurchasesAmount = purchaseOrders.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalPurchasesPaid = purchaseOrders.reduce((sum, po) => sum + (Number(po.paidAmount) || 0), 0);
  const totalPurchasesDebts = purchaseOrders.reduce((sum, po) => sum + (Number(po.remainingAmount) || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const match =
      p.name.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      (p.supplier && p.supplier.toLowerCase().includes(q));
    const matchCat = filterCategory === 'TOUS' || p.category === filterCategory;
    const matchLow = !showLowStockOnly || (Number(p.currentStock) || 0) <= (Number(p.minStockAlert) || 0);
    return match && matchCat && matchLow;
  });

  // Filtered Purchases
  const filteredPurchases = purchaseOrders.filter((po) => {
    const q = search.toLowerCase();
    const match =
      po.purchaseNumber.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      (po.notes && po.notes.toLowerCase().includes(q));
    const matchStatus = purchaseStatusFilter === 'TOUS' || po.status === purchaseStatusFilter;
    return match && matchStatus;
  });

  // Product actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      code: `FOURN-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Papeterie',
      unit: 'Unité',
      currentStock: 0,
      minStockAlert: 5,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: suppliers[0]?.name || '',
      location: '',
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      code: prod.code || '',
      name: prod.name,
      category: (prod.category as StockCategory) || 'Papeterie',
      unit: prod.unit,
      currentStock: prod.currentStock,
      minStockAlert: prod.minStockAlert || 0,
      purchasePrice: prod.purchasePrice,
      sellingPrice: prod.sellingPrice,
      supplier: prod.supplier || '',
      location: prod.location || '',
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  // Movement actions
  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.productId || movementForm.quantity <= 0) return;

    const prod = products.find((p) => p.id === movementForm.productId);
    if (!prod) return;

    addStockMovement({
      productId: prod.id,
      productName: prod.name,
      movementType: movementForm.type,
      quantity: Number(movementForm.quantity),
      date: new Date().toLocaleDateString('fr-FR'),
      reason: movementForm.reason,
      responsible: currentUser.name,
      observations: movementForm.observations || `Mouvement manuel (${movementForm.type})`,
      supplierOrOrder: prod.supplier || 'Interne',
    });

    setIsMovementModalOpen(false);
  };

  // Purchase actions
  const handleOpenAddPurchase = () => {
    const firstSupplier = suppliers[0];
    const firstProduct = products[0];
    setPurchaseForm({
      supplierId: firstSupplier?.id || '',
      supplierName: firstSupplier?.name || 'Fournisseur externe',
      date: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date().toISOString().split('T')[0],
      paidAmount: 0,
      status: 'Commandé',
      notes: '',
      items: [],
    });
    setCurrentPurchaseItem({
      productId: firstProduct?.id || '',
      productName: firstProduct?.name || '',
      quantity: 1,
      unitPrice: firstProduct?.purchasePrice || 0,
    });
    setIsPurchaseModalOpen(true);
  };

  const handleAddPurchaseItem = () => {
    if (!currentPurchaseItem.productName.trim() || currentPurchaseItem.quantity <= 0) return;
    const total = Number(currentPurchaseItem.quantity) * Number(currentPurchaseItem.unitPrice);
    const newItem: PurchaseItem = {
      productId: currentPurchaseItem.productId,
      productName: currentPurchaseItem.productName,
      quantity: Number(currentPurchaseItem.quantity),
      unitPrice: Number(currentPurchaseItem.unitPrice),
      total,
    };
    setPurchaseForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemovePurchaseItem = (index: number) => {
    setPurchaseForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseForm.items.length === 0) {
      alert('Veuillez ajouter au moins un article à la commande.');
      return;
    }

    const totalAmount = purchaseForm.items.reduce((sum, item) => sum + item.total, 0);

    addPurchaseOrder({
      supplierId: purchaseForm.supplierId,
      supplierName: purchaseForm.supplierName,
      date: purchaseForm.date,
      items: purchaseForm.items,
      totalAmount,
      paidAmount: Number(purchaseForm.paidAmount) || 0,
      expectedDeliveryDate: purchaseForm.expectedDeliveryDate,
      status: purchaseForm.status,
      notes: purchaseForm.notes,
    });

    setIsPurchaseModalOpen(false);
  };

  // Reset confirmation
  const handleConfirmReset = () => {
    resetStocksAndPurchases({
      clearAllProducts: resetOption === 'clear_catalog',
      resetStockOnly: resetOption === 'zero_quantities',
    });
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Gestion des Stocks & Achats
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Inventaire papeterie, consommables informatiques, bons de commande fournisseurs et mouvements
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reset to Zero Button */}
          <button
            id="btn-reset-stocks"
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm transition shadow-xs"
            title="Remettre à zéro toutes les données des stocks et achats"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Remettre à zéro</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const firstProd = products[0];
              setMovementForm({
                productId: firstProd?.id || '',
                type: 'ENTREE',
                quantity: 5,
                reason: 'Achat fournisseur',
                observations: '',
              });
              setIsMovementModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition shadow-xs"
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            <span>Mouvement Stock</span>
          </button>

          <button
            id="btn-add-purchase-top"
            type="button"
            onClick={handleOpenAddPurchase}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Nouvel Achat</span>
          </button>

          <button
            id="btn-add-product"
            type="button"
            onClick={handleOpenAddProduct}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Article</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('stocks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'stocks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stocks & Inventaire</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'stocks' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalPhysicalUnits} u.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('produits')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'produits'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Articles & Catalogue</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'produits' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('achats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'achats'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Achats Fournisseurs</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'achats' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {purchaseOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mouvements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'mouvements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique Mouvements</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'mouvements' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {stockMovements.length}
          </span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Quantités en Stock
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalPhysicalUnits} <span className="text-sm font-semibold text-slate-500">unités</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Réparties sur {products.length} références
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Valeur Marchande (Achat)
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {formatFCFA(totalStockPurchaseValue)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Coût total d'acquisition immobilisé
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Valeur Potentielle (Vente)
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {formatFCFA(totalStockSellingValue)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Revenu potentiel au comptoir
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
              Alertes Stock Minimum
            </span>
            <span
              className={`text-2xl font-black mt-1 block ${
                lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {lowStockCount} <span className="text-sm font-semibold text-slate-500">article(s)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {lowStockCount > 0 ? 'Sous le seuil de réapprovisionnement' : 'Aucune rupture critique'}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs ${
              lowStockCount > 0
                ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: STOCKS & INVENTAIRE */}
      {activeTab === 'stocks' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par article, code, fournisseur..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  showLowStockOnly
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Stocks Faibles ({lowStockCount})</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setFilterCategory('TOUS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterCategory === 'TOUS'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tous
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilterCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      filterCategory === c
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stocks Inventory Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Article & Spécifications</th>
                    <th className="py-3.5 px-4">Catégorie</th>
                    <th className="py-3.5 px-4 text-center">Niveau de Stock</th>
                    <th className="py-3.5 px-4 text-center">Seuil Alerte</th>
                    <th className="py-3.5 px-4 text-right">Prix d'Achat</th>
                    <th className="py-3.5 px-4 text-right">Prix de Vente</th>
                    <th className="py-3.5 px-4 text-right">Valeur Totale</th>
                    <th className="py-3.5 px-4 text-center">Actions Rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Boxes className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                        <p className="font-medium text-slate-600">Aucun article trouvé dans l'inventaire.</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Ajoutez un nouvel article ou enregistrez une entrée de stock.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isLow = (prod.minStockAlert || 0) > 0 && prod.currentStock <= (prod.minStockAlert || 0);
                      const isZero = prod.currentStock === 0;
                      const lineValue = prod.currentStock * prod.purchasePrice;

                      return (
                        <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm">{prod.name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              {prod.code && (
                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                  {prod.code}
                                </span>
                              )}
                              <span>{prod.location || 'Atelier'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                                isZero
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isZero && <AlertCircle className="w-3 h-3 text-rose-600" />}
                              {!isZero && isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                              {!isZero && !isLow && <Check className="w-3 h-3 text-emerald-600" />}
                              {prod.currentStock} {prod.unit}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-500">
                            {prod.minStockAlert || 0} {prod.unit}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-slate-600">
                            {formatFCFA(prod.purchasePrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">
                            {formatFCFA(prod.sellingPrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-800">
                            {formatFCFA(lineValue)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setMovementForm({
                                    productId: prod.id,
                                    type: 'ENTREE',
                                    quantity: 5,
                                    reason: 'Achat fournisseur',
                                    observations: '',
                                  });
                                  setIsMovementModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                                title="Entrée en stock (+)"
                              >
                                <ArrowDownRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMovementForm({
                                    productId: prod.id,
                                    type: 'SORTIE',
                                    quantity: 1,
                                    reason: 'Vente client',
                                    observations: '',
                                  });
                                  setIsMovementModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition"
                                title="Sortie de stock (-)"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
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
      )}

      {/* TAB 2: ARTICLES & CATALOGUE */}
      {activeTab === 'produits' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, code, catégorie..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Article</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-500" />
                <p className="font-semibold text-slate-700">Aucun produit dans le catalogue</p>
                <p className="text-xs text-slate-400 mt-1">Créez vos articles pour alimenter vos stocks et achats.</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const margin = p.sellingPrice - p.purchasePrice;
                const marginRate = p.purchasePrice > 0 ? Math.round((margin / p.purchasePrice) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {p.code || 'ART-STANDARD'}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-sm mt-1.5 leading-snug">
                            {p.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          {p.category}
                        </span>
                      </div>

                      {p.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Prix d'Achat</span>
                          <span className="font-bold text-slate-700">{formatFCFA(p.purchasePrice)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Prix de Vente</span>
                          <span className="font-black text-slate-900">{formatFCFA(p.sellingPrice)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Marge Brute</span>
                          <span className="font-bold text-emerald-600">
                            +{formatFCFA(margin)} ({marginRate}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Stock Actuel</span>
                          <span
                            className={`font-black ${
                              p.currentStock === 0 ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {p.currentStock} {p.unit}
                          </span>
                        </div>
                      </div>

                      {p.supplier && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{p.supplier}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                        title="Modifier l'article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Supprimer l'article ${p.name} ?`)) {
                            deleteProduct?.(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACHATS FOURNISSEURS */}
      {activeTab === 'achats' && (
        <div className="space-y-4">
          {/* Top Bar Achats */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="N° bon, fournisseur..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <select
                value={purchaseStatusFilter}
                onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="TOUS">Tous les statuts</option>
                <option value="Commandé">Commandé</option>
                <option value="Reçu">Reçu (En stock)</option>
                <option value="Partiellement reçu">Partiellement reçu</option>
                <option value="Brouillon">Brouillon</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-add-purchase"
                type="button"
                onClick={handleOpenAddPurchase}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Nouveau Bon de Commande / Achat</span>
              </button>
            </div>
          </div>

          {/* Achats Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-500">Total Achats Engagés :</span>
              <span className="font-black text-slate-900">{formatFCFA(totalPurchasesAmount)}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-500">Montant Déjà Réglé :</span>
              <span className="font-black text-emerald-600">{formatFCFA(totalPurchasesPaid)}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-500">Dettes Fournisseurs Restantes :</span>
              <span className={`font-black ${totalPurchasesDebts > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {formatFCFA(totalPurchasesDebts)}
              </span>
            </div>
          </div>

          {/* Table Purchases */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">N° Commande</th>
                    <th className="py-3.5 px-4">Fournisseur</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Articles & Quantités</th>
                    <th className="py-3.5 px-4 text-right">Montant Total</th>
                    <th className="py-3.5 px-4 text-right">Payé</th>
                    <th className="py-3.5 px-4 text-right">Reste</th>
                    <th className="py-3.5 px-4 text-center">Statut</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                        <p className="font-medium text-slate-600">Aucun bon d'achat fournisseur enregistré.</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Enregistrez vos approvisionnements pour suivre les réceptions et les dettes fournisseurs.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPurchases.map((po) => {
                      const isReceived = po.status === 'Reçu';
                      return (
                        <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {po.purchaseNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {po.supplierName}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-medium">
                            {formatDateFr(po.date)}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div className="max-w-xs truncate">
                              {po.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">
                            {formatFCFA(po.totalAmount)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-600">
                            {formatFCFA(po.paidAmount)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-rose-600">
                            {formatFCFA(po.remainingAmount)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isReceived
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : po.status === 'Commandé'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {!isReceived && (
                                <button
                                  type="button"
                                  onClick={() => receivePurchaseOrder(po.id)}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition"
                                  title="Réceptionner la marchandise et créditer les stocks"
                                >
                                  <PackageCheck className="w-3.5 h-3.5" />
                                  <span>Réceptionner</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Supprimer le bon d'achat ${po.purchaseNumber} ?`)) {
                                    deletePurchaseOrder?.(po.id);
                                  }
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-50 transition"
                                title="Supprimer le bon d'achat"
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
        </div>
      )}

      {/* TAB 4: HISTORIQUE DES MOUVEMENTS */}
      {activeTab === 'mouvements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Date & Heure</th>
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4 text-center">Type Mouvement</th>
                    <th className="py-3.5 px-4 text-center">Quantité</th>
                    <th className="py-3.5 px-4 text-center">Évolution Stock</th>
                    <th className="py-3.5 px-4">Motif & Justification</th>
                    <th className="py-3.5 px-4">Responsable</th>
                    <th className="py-3.5 px-4">Réf / Bon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockMovements.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <History className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                        <p className="font-medium text-slate-600">Aucun mouvement de stock enregistré.</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Toutes les entrées, sorties et ajustements seront tracés ici en temps réel.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    stockMovements.map((mvt) => (
                      <tr key={mvt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {mvt.date}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {mvt.productName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              mvt.movementType === 'ENTREE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mvt.movementType === 'SORTIE'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {mvt.movementType === 'ENTREE' && <ArrowDownRight className="w-3 h-3" />}
                            {mvt.movementType === 'SORTIE' && <ArrowUpRight className="w-3 h-3" />}
                            {mvt.movementType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-black text-slate-900">
                          {mvt.movementType === 'SORTIE' ? `-${mvt.quantity}` : `+${mvt.quantity}`}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                          {mvt.stockBefore} ➔ <span className="font-bold text-slate-800">{mvt.stockAfter}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-semibold">{mvt.reason}</div>
                          {mvt.observations && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{mvt.observations}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {mvt.responsible}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {mvt.supplierOrOrder || '-'}
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

      {/* MODAL: RESET STOCKS & PURCHASES */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Remise à zéro des Stocks & Achats
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Réinitialiser les quantités en stock et effacer les historiques
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Choisissez comment vous souhaitez effectuer la remise à zéro :
              </p>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="radio"
                  name="resetOption"
                  checked={resetOption === 'zero_quantities'}
                  onChange={() => setResetOption('zero_quantities')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Mettre toutes les quantités à zéro (0 unité)
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Conserve les fiches articles du catalogue avec leurs prix, mais remet tous les stocks à 0 et efface tous les bons d'achat et mouvements passés.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="radio"
                  name="resetOption"
                  checked={resetOption === 'clear_catalog'}
                  onChange={() => setResetOption('clear_catalog')}
                  className="mt-0.5 text-rose-600"
                />
                <div>
                  <div className="font-bold text-rose-700 text-sm">
                    Vider entièrement le catalogue & les stocks
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Supprime également tous les articles du catalogue pour repartir d'une page complètement vierge.
                  </div>
                </div>
              </label>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-[11px] font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Cette action prendra effet immédiatement sur l'application et la base locale.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-sm transition"
              >
                Confirmer la remise à zéro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">
                {editingProduct ? 'Modifier l\'article de Stock' : 'Nouvel Article en Stock'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Désignation de l'article *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ex: Rames Papier A4 80g Double A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code / Réf</label>
                  <input
                    type="text"
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    placeholder="PAP-A4-80G"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-700"
                  />
                </div>
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
                  <label className="block font-bold text-slate-700 mb-1">Unité de Mesure</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="Rame, Pièce, Bouteille, Paquet..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Initial (unités)</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Seuil Alerte Minimum</label>
                  <input
                    type="number"
                    min={0}
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fournisseur Habituel</label>
                  <select
                    value={productForm.supplier}
                    onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="">Sélectionner un fournisseur...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emplacement dans l'Atelier</label>
                  <input
                    type="text"
                    value={productForm.location}
                    onChange={(e) =>
                      setProductForm({ ...productForm, location: e.target.value })
                    }
                    placeholder="Étagère A1, Rayon Papier, Réserve..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-sm transition"
                >
                  {editingProduct ? 'Enregistrer les Modifications' : 'Créer l\'Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK MOVEMENT (Entrée / Sortie) */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">
                Enregistrer un Mouvement de Stock
              </h3>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="">Sélectionner l'article...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actuel: {p.currentStock} {p.unit})
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
                        type: e.target.value as StockMovementType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black"
                  >
                    <option value="ENTREE">Entrée (Approvisionnement)</option>
                    <option value="SORTIE">Sortie (Utilisation / Vente)</option>
                    <option value="AJUSTEMENT">Ajustement inventaire</option>
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif *</label>
                <select
                  value={movementForm.reason}
                  onChange={(e) =>
                    setMovementForm({
                      ...movementForm,
                      reason: e.target.value as StockMovementReason,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="Achat fournisseur">Achat fournisseur</option>
                  <option value="Vente client">Vente client</option>
                  <option value="Produit utilisé pour impression">Produit utilisé pour impression</option>
                  <option value="Produit utilisé pour prestation">Produit utilisé pour prestation</option>
                  <option value="Retour">Retour marchandise</option>
                  <option value="Ajustement positif">Ajustement positif (Inventaire)</option>
                  <option value="Ajustement négatif">Ajustement négatif (Inventaire)</option>
                  <option value="Perte">Perte ou casse</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observations / Réf Bon</label>
                <input
                  type="text"
                  value={movementForm.observations}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, observations: e.target.value })
                  }
                  placeholder="Ex: Facture N° 124 ou Commande client CMD-004"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-sm transition"
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PURCHASE ORDER (Nouveau Bon de Commande Fournisseur) */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-900">
                  Nouveau Bon de Commande Fournisseur (Achat)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fournisseur *</label>
                  <select
                    required
                    value={purchaseForm.supplierId}
                    onChange={(e) => {
                      const sup = suppliers.find((s) => s.id === e.target.value);
                      setPurchaseForm({
                        ...purchaseForm,
                        supplierId: e.target.value,
                        supplierName: sup?.name || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    <option value="">Sélectionner un fournisseur...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category || 'Fournisseur'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date d'émission</label>
                  <input
                    type="date"
                    required
                    value={purchaseForm.date}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* Purchase Items Builder */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="font-black text-slate-800 text-xs block uppercase tracking-wider">
                  Articles à commander
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Sélectionner Produit</label>
                    <select
                      value={currentPurchaseItem.productId}
                      onChange={(e) => {
                        const prod = products.find((p) => p.id === e.target.value);
                        setCurrentPurchaseItem({
                          productId: e.target.value,
                          productName: prod?.name || '',
                          quantity: currentPurchaseItem.quantity,
                          unitPrice: prod?.purchasePrice || 0,
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-xs"
                    >
                      <option value="">Choisir parmi le catalogue...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Quantité</label>
                    <input
                      type="number"
                      min={1}
                      value={currentPurchaseItem.quantity}
                      onChange={(e) =>
                        setCurrentPurchaseItem({ ...currentPurchaseItem, quantity: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Prix Unitaire (FCFA)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={currentPurchaseItem.unitPrice}
                        onChange={(e) =>
                          setCurrentPurchaseItem({ ...currentPurchaseItem, unitPrice: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddPurchaseItem}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0 shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                {purchaseForm.items.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-500 font-bold text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Désignation</th>
                          <th className="py-2 px-3 text-center">Quantité</th>
                          <th className="py-2 px-3 text-right">P.U.</th>
                          <th className="py-2 px-3 text-right">Total</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {purchaseForm.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-medium text-slate-800">{it.productName}</td>
                            <td className="py-2 px-3 text-center font-bold">{it.quantity}</td>
                            <td className="py-2 px-3 text-right">{formatFCFA(it.unitPrice)}</td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900">{formatFCFA(it.total)}</td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePurchaseItem(idx)}
                                className="text-rose-600 hover:text-rose-700 font-bold"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-2 text-[11px]">
                    Aucun article ajouté. Sélectionnez un article et cliquez sur '+'.
                  </p>
                )}
              </div>

              {/* Totals & Payments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant Acompte Payé (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    value={purchaseForm.paidAmount}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date estimée de livraison</label>
                  <input
                    type="date"
                    value={purchaseForm.expectedDeliveryDate}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions fournisseur</label>
                <input
                  type="text"
                  value={purchaseForm.notes}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
                  placeholder="Conditions de livraison, références devis, etc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">Total Commande : </span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatFCFA(purchaseForm.items.reduce((sum, i) => sum + i.total, 0))}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPurchaseModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-sm transition"
                  >
                    Enregistrer le Bon de Commande
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
