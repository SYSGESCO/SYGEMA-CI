import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Phone,
  MessageSquare,
  MapPin,
  Mail,
  Edit2,
  Trash2,
  ExternalLink,
  Receipt,
  FileText,
  Clock,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { Client, ClientType } from '../../types';

interface ClientsViewProps {
  onNavigate: (view: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onNavigate }) => {
  const {
    clients,
    addClient,
    updateClient,
    deleteClient,
    printOrders,
    maintenance,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    invoices,
    payments,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: 'Daloa',
    type: 'Particulier' as ClientType,
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: 'Daloa, Quartier ',
      type: 'Particulier',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      whatsapp: client.whatsapp || client.phone,
      email: client.email || '',
      address: client.address || 'Daloa',
      type: client.type,
      notes: client.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'TOUS' || c.type === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate stats for a given client
  const getClientFinancials = (clientId: string) => {
    const clientInvoices = invoices.filter((i) => i.clientId === clientId);
    const totalBilled = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPaid = clientInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const remaining = totalBilled - totalPaid;
    return { totalBilled, totalPaid, remaining, count: clientInvoices.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Gestion des Clients
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fichier centralisé des clients particuliers, entreprises, écoles et associations
          </p>
        </div>

        <button
          id="btn-add-client"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, adresse..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['TOUS', 'Particulier', 'Entreprise', 'École', 'Association'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterType === type
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Téléphone & WhatsApp</th>
                <th className="py-3 px-4">Localisation</th>
                <th className="py-3 px-4 text-right">Facturé</th>
                <th className="py-3 px-4 text-right">Solde Dû</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Aucun client ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const fin = getClientFinancials(client.id);
                  const cleanPhone = client.phone.replace(/\D/g, '');
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {client.name}
                        </div>
                        {client.email && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{client.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {client.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          <span>{client.phone}</span>
                        </div>
                        {client.whatsapp && (
                          <a
                            href={`https://wa.me/225${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp direct</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{client.address}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatFCFA(fin.totalBilled)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">
                        {fin.remaining > 0 ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {formatFCFA(fin.remaining)}
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            À jour
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedClientDetail(client)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Historique complet et profil client"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Supprimer le client ${client.name} ?`)) {
                                deleteClient(client.id);
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

      {/* MODAL: ADD / EDIT CLIENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingClient ? 'Modifier la Fiche Client' : 'Nouveau Client SYGEMA CI'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom complet / Raison sociale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Kouamé Jean ou École Primaire Soleil"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Téléphone principal *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 05 66 59 45 49"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Ex: 05 66 59 45 49"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Type de Client
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as ClientType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="École">École / Établissement</option>
                    <option value="Association">Association / ONG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Adresse / Quartier
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Daloa, Quartier..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  E-mail (optionnel)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@exemple.ci"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes / Préférences client
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Préfère être contacté par WhatsApp, client fidèle..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
                  {editingClient ? 'Enregistrer les modifications' : 'Créer le Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: COMPLETE CLIENT PROFILE & UNIFIED HISTORY */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-extrabold uppercase">
                    {selectedClientDetail.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    Client depuis le {formatDateFr(selectedClientDetail.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedClientDetail.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {selectedClientDetail.phone}
                  </span>
                  <a
                    href={`https://wa.me/225${selectedClientDetail.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedClientDetail.address}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Financial Summary */}
            {(() => {
              const fin = getClientFinancials(selectedClientDetail.id);
              return (
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Facturé</span>
                    <span className="text-base font-black text-slate-900">{formatFCFA(fin.totalBilled)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Encaissé</span>
                    <span className="text-base font-black text-emerald-700">{formatFCFA(fin.totalPaid)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Reste à Recouvrer</span>
                    <span className={`text-base font-black ${fin.remaining > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatFCFA(fin.remaining)}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Complete Unified History Across the 5 branches */}
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Historique des Prestations & Travaux (5 Pôles)
              </h3>

              {/* Imprimerie */}
              {printOrders.filter((p) => p.clientId === selectedClientDetail.id).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimerie & Bureautique</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1">
                    {printOrders
                      .filter((p) => p.clientId === selectedClientDetail.id)
                      .map((p) => (
                        <div key={p.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <div>
                            <span className="font-mono font-bold text-blue-900">{p.orderNumber}</span> — {p.documentName} ({p.copyCount} ex.)
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatFCFA(p.totalAmount)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800">{p.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Maintenance */}
              {maintenance.filter((m) => m.clientId === selectedClientDetail.id).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Maintenance Informatique</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1">
                    {maintenance
                      .filter((m) => m.clientId === selectedClientDetail.id)
                      .map((m) => (
                        <div key={m.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <div>
                            <span className="font-mono font-bold text-purple-900">{m.interventionNumber}</span> — {m.hardwareConcerned} ({m.problemType})
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatFCFA(m.cost)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800">{m.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Graphisme */}
              {graphicProjects.filter((g) => g.clientId === selectedClientDetail.id).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-pink-700 font-bold">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Graphisme & Communication</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1">
                    {graphicProjects
                      .filter((g) => g.clientId === selectedClientDetail.id)
                      .map((g) => (
                        <div key={g.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <div>
                            <span className="font-mono font-bold text-pink-900">{g.projectNumber}</span> — {g.creationType}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatFCFA(g.price)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-100 text-pink-800">{g.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tee-shirts */}
              {tshirtOrders.filter((t) => t.clientId === selectedClientDetail.id).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Impression Tee-shirt</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1">
                    {tshirtOrders
                      .filter((t) => t.clientId === selectedClientDetail.id)
                      .map((t) => (
                        <div key={t.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <div>
                            <span className="font-mono font-bold text-amber-900">{t.orderNumber}</span> — {t.quantity} Tee-shirts {t.tshirtColor}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatFCFA(t.totalAmount)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">{t.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Solutions Numériques */}
              {digitalProjects.filter((d) => d.clientId === selectedClientDetail.id).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-700 font-bold">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Solutions Numériques</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1">
                    {digitalProjects
                      .filter((d) => d.clientId === selectedClientDetail.id)
                      .map((d) => (
                        <div key={d.id} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <div>
                            <span className="font-mono font-bold text-cyan-900">{d.projectNumber}</span> — {d.solutionType}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatFCFA(d.budget)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">{d.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedClientDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
