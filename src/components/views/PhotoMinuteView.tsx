import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../data/store';
import { PhotoMinuteOrder, PhotoMinuteFormat, PhotoMinutePurpose, PhotoMinuteBackground, PhotoMinuteStatus } from '../../types';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Camera,
  Plus,
  Search,
  Filter,
  Printer,
  CheckCircle,
  Clock,
  Send,
  Edit2,
  Trash2,
  Phone,
  Sparkles,
  UserCheck,
  AlertCircle,
  FileCheck,
  Smartphone,
  Share2,
} from 'lucide-react';
import { PrintableDocType } from '../PrintableDocumentModal';

interface PhotoMinuteViewProps {
  onOpenPrint?: (doc: PrintableDocType) => void;
}

const TARIFF_PACKAGES: Array<{
  format: PhotoMinuteFormat;
  label: string;
  count: number;
  price: number;
  badge: string;
  description: string;
  defaultSendDigital?: boolean;
}> = [
  {
    format: '4_photos',
    label: 'Planche 4 Photos',
    count: 4,
    price: 1000,
    badge: 'Classique',
    description: 'Format standard 3.5 x 4.5 cm découpé',
  },
  {
    format: '8_photos',
    label: 'Planche 8 Photos',
    count: 8,
    price: 1500,
    badge: 'Le plus demandé',
    description: 'Idéal CNI, Passeport & dossiers scolaires',
  },
  {
    format: '12_photos',
    label: 'Planche 12 Photos',
    count: 12,
    price: 2000,
    badge: 'Grand volume',
    description: 'Parfait pour concours administratifs & inscriptions',
  },
  {
    format: 'numerique_seul',
    label: 'Fichier Numérique HD',
    count: 1,
    price: 500,
    badge: 'Envoi WhatsApp / Email',
    description: 'Fichier retouché et recadré pour plateformes web',
    defaultSendDigital: true,
  },
  {
    format: 'pack_complet',
    label: 'Pack Élite (8 Photos + WhatsApp HD)',
    count: 8,
    price: 2000,
    badge: 'Offre Duo Promo',
    description: '8 photos imprimées + fichier numérique transmis immédiatement',
    defaultSendDigital: true,
  },
];

export const PhotoMinuteView: React.FC<PhotoMinuteViewProps> = ({ onOpenPrint }) => {
  const {
    photoMinuteOrders,
    addPhotoMinuteOrder,
    updatePhotoMinuteOrder,
    deletePhotoMinuteOrder,
    clients,
    currentUser,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');
  const [filterBackground, setFilterBackground] = useState<string>('TOUS');
  const [filterPurpose, setFilterPurpose] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PhotoMinuteOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    format: '8_photos' as PhotoMinuteFormat,
    formatLabel: 'Planche 8 Photos',
    purpose: 'Carte Nationale d\'Identité (CNI)' as PhotoMinutePurpose,
    background: 'Fond Blanc (Réglementaire)' as PhotoMinuteBackground,
    photoCount: 8,
    sendDigital: false,
    whatsappOrEmail: '',
    unitPrice: 1500,
    totalAmount: 1500,
    paidAmount: 1500,
    paymentMethod: 'Espèces',
    status: 'Prêt' as PhotoMinuteStatus,
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    observations: '',
  });

  const handleOpenAdd = (preset?: typeof TARIFF_PACKAGES[0]) => {
    setEditingOrder(null);
    const defaultClient = clients[0];
    const initialFormat = preset?.format || '8_photos';
    const initialLabel = preset?.label || 'Planche 8 Photos';
    const initialPrice = preset?.price || 1500;
    const initialCount = preset?.count || 8;
    const initialSendDigital = preset?.defaultSendDigital || false;

    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      format: initialFormat,
      formatLabel: initialLabel,
      purpose: 'Carte Nationale d\'Identité (CNI)',
      background: 'Fond Blanc (Réglementaire)',
      photoCount: initialCount,
      sendDigital: initialSendDigital,
      whatsappOrEmail: defaultClient ? defaultClient.phone : '',
      unitPrice: initialPrice,
      totalAmount: initialPrice,
      paidAmount: initialPrice,
      paymentMethod: 'Espèces',
      status: 'Prêt',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      observations: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: PhotoMinuteOrder) => {
    setEditingOrder(order);
    setFormData({
      clientId: order.clientId,
      clientName: order.clientName,
      phone: order.phone,
      format: order.format,
      formatLabel: order.formatLabel,
      purpose: order.purpose,
      background: order.background,
      photoCount: order.photoCount,
      sendDigital: order.sendDigital,
      whatsappOrEmail: order.whatsappOrEmail || '',
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      date: order.date,
      deliveryDate: order.deliveryDate,
      observations: order.observations,
    });
    setIsModalOpen(true);
  };

  const handleSelectPackage = (pkg: typeof TARIFF_PACKAGES[0]) => {
    setFormData((prev) => ({
      ...prev,
      format: pkg.format,
      formatLabel: pkg.label,
      photoCount: pkg.count,
      unitPrice: pkg.price,
      totalAmount: pkg.price,
      paidAmount: pkg.price,
      sendDigital: pkg.defaultSendDigital ?? prev.sendDigital,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOrder) {
      updatePhotoMinuteOrder(editingOrder.id, {
        clientId: formData.clientId || `client_pho_${Date.now()}`,
        clientName: formData.clientName,
        phone: formData.phone,
        format: formData.format,
        formatLabel: formData.formatLabel,
        purpose: formData.purpose,
        background: formData.background,
        photoCount: Number(formData.photoCount) || 1,
        sendDigital: formData.sendDigital,
        whatsappOrEmail: formData.whatsappOrEmail,
        unitPrice: Number(formData.unitPrice) || 0,
        totalAmount: Number(formData.totalAmount) || 0,
        paidAmount: Number(formData.paidAmount) || 0,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        observations: formData.observations,
      });
    } else {
      addPhotoMinuteOrder({
        clientId: formData.clientId || `client_pho_${Date.now()}`,
        clientName: formData.clientName,
        phone: formData.phone,
        format: formData.format,
        formatLabel: formData.formatLabel,
        purpose: formData.purpose,
        background: formData.background,
        photoCount: Number(formData.photoCount) || 1,
        sendDigital: formData.sendDigital,
        whatsappOrEmail: formData.whatsappOrEmail,
        unitPrice: Number(formData.unitPrice) || 0,
        totalAmount: Number(formData.totalAmount) || 0,
        paidAmount: Number(formData.paidAmount) || 0,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        observations: formData.observations,
        createdBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }

    setIsModalOpen(false);
  };

  // Quick status toggle
  const handleQuickStatusChange = (orderId: string, nextStatus: PhotoMinuteStatus) => {
    updatePhotoMinuteOrder(orderId, { status: nextStatus });
  };

  // Stats
  const totalRevenue = useMemo(() => {
    return photoMinuteOrders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  }, [photoMinuteOrders]);

  const totalPhotosDelivered = useMemo(() => {
    return photoMinuteOrders.filter((o) => o.status === 'Livré').length;
  }, [photoMinuteOrders]);

  const inProgressCount = useMemo(() => {
    return photoMinuteOrders.filter((o) => o.status === 'Prise de vue' || o.status === 'En tirage').length;
  }, [photoMinuteOrders]);

  const filteredOrders = useMemo(() => {
    return photoMinuteOrders.filter((o) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.purpose.toLowerCase().includes(q) ||
        o.formatLabel.toLowerCase().includes(q);

      const matchStatus = filterStatus === 'TOUS' || o.status === filterStatus;
      const matchBg = filterBackground === 'TOUS' || o.background.includes(filterBackground);
      const matchPurpose = filterPurpose === 'TOUS' || o.purpose.toLowerCase().includes(filterPurpose.toLowerCase());

      return matchSearch && matchStatus && matchBg && matchPurpose;
    });
  }, [photoMinuteOrders, search, filterStatus, filterBackground, filterPurpose]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <Camera className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Service Express
              </span>
              <span className="text-xs text-blue-200">Prise de vue immédiate & Tirage en 5 min</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Camera className="w-8 h-8 text-amber-400" />
              Photo Minute & Studio Express
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Photos d'identité réglementaires (CNI, Passeport, Visa, Examens & Concours CAFOP/ENS), avec tirage immédiat sur papier photo glacé haute définition et transmission numérique WhatsApp.
            </p>
          </div>

          <button
            id="btn-add-photo-minute"
            type="button"
            onClick={() => handleOpenAdd()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-5 py-3 rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Nouvelle Prise de Vue</span>
          </button>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-900/60">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">Total Commandes</span>
            <span className="text-2xl font-black text-white">{photoMinuteOrders.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">En studio / Tirage</span>
            <span className="text-2xl font-black text-amber-400">{inProgressCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">Photos Livrées</span>
            <span className="text-2xl font-black text-emerald-400">{totalPhotosDelivered}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">Recettes Totales</span>
            <span className="text-2xl font-black text-amber-300">{formatFCFA(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Tarif Presets Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tarifs Rapides & Enregistrement Express
          </h2>
          <span className="text-xs text-slate-500">Cliquez sur un forfait pour enregistrer directement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TARIFF_PACKAGES.map((pkg) => (
            <div
              key={pkg.format}
              onClick={() => handleOpenAdd(pkg)}
              className="bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-xl p-4 cursor-pointer transition shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{pkg.count} {pkg.count > 1 ? 'photos' : 'photo'}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                  {pkg.label}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-base font-black text-blue-950">
                  {formatFCFA(pkg.price)}
                </span>
                <span className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-amber-400 text-blue-900 group-hover:text-slate-950 flex items-center justify-center transition">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° commande, client, téléphone, usage..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Statut :</span>
            {['TOUS', 'Prise de vue', 'En tirage', 'Prêt', 'Livré'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
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

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Fond photo :</span>
          {['TOUS', 'Blanc', 'Bleu', 'Rouge'].map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setFilterBackground(bg)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                filterBackground === bg
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bg === 'TOUS' ? 'Tous les fonds' : `Fond ${bg}`}
            </button>
          ))}

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-3 mr-1">Destination :</span>
          {['TOUS', 'CNI', 'Passeport', 'Concours', 'Scolaire'].map((purp) => (
            <button
              key={purp}
              type="button"
              onClick={() => setFilterPurpose(purp)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                filterPurpose === purp
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {purp === 'TOUS' ? 'Toutes destinations' : purp}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">
              Commandes Photo Minute ({filteredOrders.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Historique des prises de vue et tirages immédiats
            </p>
          </div>
          {filteredOrders.length > 0 && (
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Total sélection : {formatFCFA(filteredOrders.reduce((a, b) => a + (Number(b.totalAmount) || 0), 0))}
            </span>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">Aucune photo minute trouvée</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cliquez sur "Nouvelle Prise de Vue" ou sur un des tarifs rapides ci-dessus pour enregistrer la première commande.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="mt-4 inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:bg-blue-800 transition"
            >
              <Plus className="w-4 h-4" />
              Enregistrer une prise de vue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">N° Commande</th>
                  <th className="p-3">Client & Contact</th>
                  <th className="p-3">Format & Quantité</th>
                  <th className="p-3">Destination & Fond</th>
                  <th className="p-3">Numérique</th>
                  <th className="p-3">Montant / Reste</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const statusColors: Record<PhotoMinuteStatus, { bg: string; text: string; border: string }> = {
                    'Prise de vue': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
                    'En tirage': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
                    'Prêt': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
                    'Livré': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
                  };

                  return (
                    <tr key={order.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3">
                        <span className="font-mono font-black text-blue-950 block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateFr(order.date)}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900">{order.clientName}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{order.phone || 'Non renseigné'}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-800 block">
                          {order.formatLabel}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.photoCount} tirage{order.photoCount > 1 ? 's' : ''} HD
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-slate-800 font-medium">{order.purpose}</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full inline-block ${
                              order.background.includes('Blanc')
                                ? 'bg-slate-300 border border-slate-400'
                                : order.background.includes('Bleu')
                                ? 'bg-blue-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span className="text-[10px] text-slate-500 font-semibold">{order.background}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        {order.sendDigital ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                            <Smartphone className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp HD</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Papier seul</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-black text-slate-900">{formatFCFA(order.totalAmount)}</div>
                        {order.remainingAmount > 0 ? (
                          <span className="text-[10px] text-rose-600 font-bold">
                            Reste : {formatFCFA(order.remainingAmount)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" /> Réglé
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                              statusColors[order.status]?.bg || 'bg-slate-100'
                            } ${statusColors[order.status]?.text || 'text-slate-700'} ${
                              statusColors[order.status]?.border || 'border-slate-200'
                            }`}
                          >
                            {order.status}
                          </span>

                          {/* Quick advance status button */}
                          {order.status === 'Prise de vue' && (
                            <button
                              title="Passer en tirage"
                              type="button"
                              onClick={() => handleQuickStatusChange(order.id, 'En tirage')}
                              className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition text-[10px]"
                            >
                              Tirer
                            </button>
                          )}
                          {order.status === 'En tirage' && (
                            <button
                              title="Marquer comme Prêt"
                              type="button"
                              onClick={() => handleQuickStatusChange(order.id, 'Prêt')}
                              className="p-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 transition text-[10px]"
                            >
                              Prêt
                            </button>
                          )}
                          {order.status === 'Prêt' && (
                            <button
                              title="Marquer comme Livré"
                              type="button"
                              onClick={() => handleQuickStatusChange(order.id, 'Livré')}
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition text-[10px]"
                            >
                              Livrer
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenPrint && (
                            <button
                              title="Imprimer ticket de retrait"
                              type="button"
                              onClick={() => onOpenPrint({ type: 'photoReceipt' as any, data: order as any })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-900 transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            title="Modifier la commande"
                            type="button"
                            onClick={() => handleOpenEdit(order)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Supprimer la commande"
                            type="button"
                            onClick={() => {
                              if (confirm(`Confirmez-vous la suppression de la photo minute ${order.orderNumber} ?`)) {
                                deletePhotoMinuteOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Photo Minute */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingOrder ? `Modifier Photo Minute ${editingOrder.orderNumber}` : 'Nouvelle Prise de Vue Photo Minute'}
                  </h2>
                  <p className="text-[11px] text-blue-200">
                    Enregistrement de commande express et tirage immédiat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom & Prénoms du Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: Kouamé Jean-Marc"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsappOrEmail: e.target.value })}
                    placeholder="Ex: 07 08 09 10 11"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Choisir une formule tarifaire rapide :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TARIFF_PACKAGES.map((pkg) => {
                    const isSelected = formData.format === pkg.format;
                    return (
                      <button
                        key={pkg.format}
                        type="button"
                        onClick={() => handleSelectPackage(pkg)}
                        className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-950 text-white border-blue-900 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-bold text-[11px] leading-tight block">{pkg.label}</span>
                        <span className={`text-[11px] font-black mt-1 ${isSelected ? 'text-amber-400' : 'text-blue-900'}`}>
                          {formatFCFA(pkg.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specifications: Purpose & Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Destination / Usage de la photo *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as PhotoMinutePurpose })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  >
                    <option value="Carte Nationale d'Identité (CNI)">Carte Nationale d'Identité (CNI)</option>
                    <option value="Passeport / Visa">Passeport / Visa</option>
                    <option value="Concours administratifs (CAFOP, ENS, INFAS, Police)">Concours administratifs (CAFOP, ENS, INFAS...)</option>
                    <option value="Carte Scolaire / Étudiant">Carte Scolaire / Étudiant</option>
                    <option value="Dossier d'embauche / Badge">Dossier d'embauche / Badge</option>
                    <option value="Autre">Autre destination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Couleur de fond réglementaire *
                  </label>
                  <select
                    value={formData.background}
                    onChange={(e) => setFormData({ ...formData, background: e.target.value as PhotoMinuteBackground })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  >
                    <option value="Fond Blanc (Réglementaire)">Fond Blanc (Réglementaire CNI / Passeport)</option>
                    <option value="Fond Bleu ciel">Fond Bleu ciel</option>
                    <option value="Fond Rouge">Fond Rouge</option>
                    <option value="Autre">Autre fond personnalisé</option>
                  </select>
                </div>
              </div>

              {/* Digital WhatsApp Option */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-emerald-950 text-xs">
                      Envoi du fichier numérique haute définition
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendDigital}
                      onChange={(e) => setFormData({ ...formData, sendDigital: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {formData.sendDigital && (
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                      Numéro WhatsApp ou Email pour envoi :
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappOrEmail}
                      onChange={(e) => setFormData({ ...formData, whatsappOrEmail: e.target.value })}
                      placeholder="Ex: 05 66 59 45 49 ou email@client.com"
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Financial & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prix Total (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.totalAmount}
                    onChange={(e) => {
                      const tot = Number(e.target.value) || 0;
                      setFormData({ ...formData, totalAmount: tot, paidAmount: tot });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-black text-blue-950 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Payé (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={formData.totalAmount}
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-emerald-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mode de Règlement
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
                  >
                    <option value="Espèces">Espèces comptoir</option>
                    <option value="Wave">Wave</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Moov Money">Moov Money</option>
                  </select>
                </div>
              </div>

              {/* Status & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Statut actuel *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PhotoMinuteStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold"
                  >
                    <option value="Prise de vue">Prise de vue</option>
                    <option value="En tirage">En tirage</option>
                    <option value="Prêt">Prêt pour retrait</option>
                    <option value="Livré">Livré au client</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations / Précisions
                </label>
                <input
                  type="text"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Ex: Retouche cravate, tirage express sous 10 minutes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-amber-400 font-black shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingOrder ? 'Enregistrer les modifications' : 'Valider & Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
