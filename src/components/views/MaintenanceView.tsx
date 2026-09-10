import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Printer,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Laptop,
  HardDrive,
  Cpu,
  ShieldAlert,
  Phone,
  User,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { MaintenanceIntervention, MaintenanceProblemType, MaintenanceStatus } from '../../types';
import { PrintableDocType } from '../PrintableDocumentModal';

interface MaintenanceViewProps {
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ onOpenPrint }) => {
  const {
    maintenance,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    clients,
    addClient,
    currentUser,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintenanceIntervention | null>(null);

  // Form
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    depositDate: new Date().toISOString().split('T')[0],
    problemType: 'Diagnostic complet' as MaintenanceProblemType,
    diagnostic: '',
    interventionDone: '',
    hardwareConcerned: 'Ordinateur portable HP',
    technician: 'Patrick N’Guessan',
    cost: 15000,
    paidAmount: 5000,
    status: 'Reçu' as MaintenanceStatus,
    deliveryDate: '',
    observations: 'Câble d\'alimentation fourni avec la machine.',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    const defaultClient = clients[0];
    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      depositDate: new Date().toISOString().split('T')[0],
      problemType: 'Diagnostic complet',
      diagnostic: 'Diagnostic en cours en atelier',
      interventionDone: 'En attente des pièces ou de l\'accord client',
      hardwareConcerned: 'Ordinateur portable HP Pavilion',
      technician: 'Patrick N’Guessan',
      cost: 15000,
      paidAmount: 5000,
      status: 'Reçu',
      deliveryDate: '',
      observations: 'Chargeur fourni.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MaintenanceIntervention) => {
    setEditingItem(item);
    setFormData({
      clientId: item.clientId,
      clientName: item.clientName,
      phone: item.phone,
      depositDate: item.depositDate,
      problemType: item.problemType,
      diagnostic: item.diagnostic || '',
      interventionDone: item.interventionDone || '',
      hardwareConcerned: item.hardwareConcerned,
      technician: item.technician,
      cost: item.cost,
      paidAmount: item.paidAmount,
      status: item.status,
      deliveryDate: item.deliveryDate || '',
      observations: item.observations || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.hardwareConcerned) return;

    if (editingItem) {
      updateMaintenance(editingItem.id, formData);
    } else {
      addMaintenance(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = maintenance.filter((m) => {
    const matchesSearch =
      m.interventionNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.clientName.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.hardwareConcerned.toLowerCase().includes(search.toLowerCase()) ||
      m.problemType.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'TOUS' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const servicesList: MaintenanceProblemType[] = [
    'Diagnostic complet',
    'Installation de système Windows',
    'Formatage et réinstallation propre',
    'Suppression de virus et logiciels malveillants',
    'Récupération de données perdues ou supprimées',
    'Réparation et maintenance d\'imprimantes',
    'Nettoyage physique et optimisation matérielle',
    'Dépannage réseau et configuration Wi-Fi',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Maintenance Informatique
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prise en charge matériel, diagnostic, fiches d'intervention et suivi atelier à Daloa
          </p>
        </div>

        <button
          id="btn-add-intervention"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Fiche d'Intervention</span>
        </button>
      </div>

      {/* Services Badges Grid (Strictly as requested) */}
      <div className="bg-purple-950 text-white rounded-2xl p-5 shadow-xs border border-purple-900">
        <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-purple-200 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Prestations Disponibles à l'Atelier SYGEMA CI</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {servicesList.map((srv) => (
            <div
              key={srv}
              className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-800/80 text-purple-100 flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <span className="font-medium text-[11px] leading-snug">{srv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° intervention, client, matériel, panne..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['TOUS', 'Reçu', 'En diagnostic', 'En cours', 'Terminé', 'Livré'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interventions Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">N° Fiche</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Matériel & Panne</th>
                <th className="py-3 px-4">Technicien</th>
                <th className="py-3 px-4 text-right">Coût Prestation</th>
                <th className="py-3 px-4 text-right">Reste</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Aucune fiche d'intervention trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-900">
                      {item.interventionNumber}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        Dépôt : {formatDateFr(item.depositDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{item.clientName}</div>
                      <div className="text-[11px] text-slate-500">{item.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.hardwareConcerned}</span>
                      </div>
                      <div className="text-[11px] text-purple-700 font-medium mt-0.5">
                        {item.problemType}
                      </div>
                      {item.diagnostic && (
                        <div className="text-[10px] text-slate-400 italic truncate max-w-xs mt-0.5">
                          Diag: {item.diagnostic}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.technician}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatFCFA(item.cost)}
                      {item.paidAmount > 0 && (
                        <span className="block text-[10px] text-emerald-600 font-normal">
                          Acompte : {formatFCFA(item.paidAmount)}
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
                          updateMaintenance(item.id, {
                            status: e.target.value as MaintenanceStatus,
                          })
                        }
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer ${
                          item.status === 'Livré'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.status === 'Terminé'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : item.status === 'En cours'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : item.status === 'En diagnostic'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="Reçu">Reçu</option>
                        <option value="En diagnostic">En diagnostic</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Livré">Livré</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenPrint({ type: 'maintenanceSheet', data: item })
                          }
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-50 transition"
                          title="Imprimer Fiche (Volet client & Volet atelier)"
                        >
                          <Printer className="w-4 h-4" />
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
                            if (window.confirm('Supprimer cette fiche ?')) {
                              deleteMaintenance(item.id);
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT INTERVENTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingItem
                  ? `Modifier Fiche ${editingItem.interventionNumber}`
                  : 'Nouvelle Fiche d\'Intervention Atelier SYGEMA CI'}
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de Dépôt *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.depositDate}
                    onChange={(e) =>
                      setFormData({ ...formData, depositDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hardware & Problem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Matériel concerné (Marque, Modèle, N° série) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hardwareConcerned}
                    onChange={(e) =>
                      setFormData({ ...formData, hardwareConcerned: e.target.value })
                    }
                    placeholder="Ex: PC Portable Dell Inspiron 15"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Type de Panne / Service *
                  </label>
                  <select
                    value={formData.problemType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problemType: e.target.value as MaintenanceProblemType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diagnostic & Intervention */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Diagnostic atelier
                  </label>
                  <textarea
                    rows={2}
                    value={formData.diagnostic}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnostic: e.target.value })
                    }
                    placeholder="Symptômes constatés, état du disque, batterie..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intervention réalisée / Travaux effectués
                  </label>
                  <textarea
                    rows={2}
                    value={formData.interventionDone}
                    onChange={(e) =>
                      setFormData({ ...formData, interventionDone: e.target.value })
                    }
                    placeholder="Remplacement disque SSD, installation Windows 11..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Financials & Technician */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Coût Total Prestation (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Acompte versé (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Technicien assigné
                  </label>
                  <select
                    value={formData.technician}
                    onChange={(e) =>
                      setFormData({ ...formData, technician: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  >
                    <option value="Patrick N’Guessan">Patrick N’Guessan</option>
                    <option value="Koffi Dorgeles">Koffi Dorgeles</option>
                    <option value="Autre technicien">Autre technicien</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Statut actuel
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as MaintenanceStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  >
                    <option value="Reçu">Reçu</option>
                    <option value="En diagnostic">En diagnostic</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Livré">Livré</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de restitution / livraison
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Accessoires remis & Remarques (Chargeur, sacoche, souris...)
                </label>
                <input
                  type="text"
                  value={formData.observations}
                  onChange={(e) =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                  placeholder="Ex: Câble d'alimentation, sacoche noire..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
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
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-sm"
                >
                  {editingItem ? 'Mettre à jour la Fiche' : 'Enregistrer et Imprimer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
