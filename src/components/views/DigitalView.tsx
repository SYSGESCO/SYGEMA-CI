import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Laptop,
  Plus,
  Search,
  CheckCircle,
  Globe,
  Database,
  Network,
  Wifi,
  Mail,
  HelpCircle,
  Edit2,
  Trash2,
  Code2,
  Calendar,
} from 'lucide-react';
import { DigitalProject, DigitalSolutionType, DigitalProjectStatus } from '../../types';

export const DigitalView: React.FC = () => {
  const {
    digitalProjects,
    addDigitalProject,
    updateDigitalProject,
    deleteDigitalProject,
    clients,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DigitalProject | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    solutionType: 'Création de sites web' as DigitalSolutionType,
    description: '',
    projectManager: 'Koffi Dorgeles',
    budget: 0,
    advance: 0,
    startDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date().toISOString().split('T')[0],
    status: 'Demande' as DigitalProjectStatus,
    notes: '',
  });

  const solutionTypes: DigitalSolutionType[] = [
    'Création de sites web',
    'Développement d\'applications et logiciels de gestion',
    'Installation et configuration de réseaux informatiques',
    'Configuration de réseaux Wi-Fi professionnels',
    'Mise en place d\'adresses e-mail professionnelles',
    'Assistance, conseil et accompagnement numérique',
    'Solutions numériques sur mesure',
  ];

  const handleOpenAdd = () => {
    setEditingProject(null);
    const defaultClient = clients[0];
    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      solutionType: 'Création de sites web',
      description: '',
      projectManager: 'Koffi Dorgeles',
      budget: 0,
      advance: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date().toISOString().split('T')[0],
      status: 'Demande',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: DigitalProject) => {
    setEditingProject(proj);
    setFormData({
      clientId: proj.clientId,
      clientName: proj.clientName,
      phone: proj.phone,
      solutionType: proj.solutionType,
      description: proj.description,
      projectManager: proj.projectManager,
      budget: proj.budget,
      advance: proj.advance,
      startDate: proj.startDate,
      expectedDeliveryDate: proj.expectedDeliveryDate,
      status: proj.status,
      notes: proj.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.description) return;

    if (editingProject) {
      updateDigitalProject(editingProject.id, formData);
    } else {
      addDigitalProject(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = digitalProjects.filter((d) => {
    const matchesSearch =
      d.projectNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.solutionType.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'TOUS' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="w-6 h-6 text-cyan-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Solutions Numériques
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sites web, logiciels de gestion, réseaux informatiques, Wi-Fi pro, e-mails et accompagnement digital
          </p>
        </div>

        <button
          id="btn-add-digital-project"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet Numérique</span>
        </button>
      </div>

      {/* Services List Badges */}
      <div className="bg-cyan-950 text-white rounded-2xl p-5 shadow-xs border border-cyan-900">
        <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-200 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Expertises Numériques & Réseaux SYGEMA CI</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {solutionTypes.map((srv) => (
            <div
              key={srv}
              className="p-2.5 rounded-xl bg-cyan-900/50 border border-cyan-800/80 text-cyan-100 flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-medium text-[11px] leading-snug">{srv}</span>
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
            placeholder="Rechercher projet numérique, client, solution..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['TOUS', 'Demande', 'Étude', 'En développement', 'Installation', 'Tests', 'Terminé', 'Livré'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-cyan-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Aucun projet numérique trouvé.
          </div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-cyan-400 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-cyan-900">
                    {proj.projectNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
                    {proj.solutionType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={proj.status}
                    onChange={(e) =>
                      updateDigitalProject(proj.id, {
                        status: e.target.value as DigitalProjectStatus,
                      })
                    }
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                      proj.status === 'Livré' || proj.status === 'Terminé'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : proj.status === 'En développement' || proj.status === 'Installation'
                        ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    <option value="Demande">Demande</option>
                    <option value="Étude">Étude</option>
                    <option value="En développement">En développement</option>
                    <option value="Installation">Installation</option>
                    <option value="Tests">Tests</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Livré">Livré</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Supprimer ce projet numérique ?')) {
                        deleteDigitalProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Client & Détails</span>
                  <p className="font-bold text-slate-900 text-sm">{proj.clientName}</p>
                  <p className="text-slate-500">{proj.phone}</p>
                  <p className="text-slate-700 font-medium mt-1">{proj.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Planning & Responsable</span>
                  <p className="text-slate-700">
                    Chef de projet : <strong className="text-cyan-900">{proj.projectManager}</strong>
                  </p>
                  <p className="text-slate-500">
                    Début : {formatDateFr(proj.startDate)}
                  </p>
                  <p className="text-slate-500">
                    Livraison prévue : {formatDateFr(proj.expectedDeliveryDate)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget total :</span>
                    <span className="font-black text-slate-900">{formatFCFA(proj.budget)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Acompte encaissé :</span>
                    <span className="font-bold">{formatFCFA(proj.advance)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-600 font-black">
                    <span>Reste à payer :</span>
                    <span>{formatFCFA(proj.remainingAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD / EDIT DIGITAL PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProject
                  ? `Modifier Projet ${editingProject.projectNumber}`
                  : 'Nouveau Projet Solutions Numériques SYGEMA CI'}
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
                    Type de Solution Numérique *
                  </label>
                  <select
                    value={formData.solutionType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        solutionType: e.target.value as DigitalSolutionType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    {solutionTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Chef de Projet assigné
                  </label>
                  <input
                    type="text"
                    value={formData.projectManager}
                    onChange={(e) =>
                      setFormData({ ...formData, projectManager: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description du projet / Périmètre technique *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Cahier des charges, nombre de postes, modules du logiciel..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Budget Global Estimé (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Acompte de Démarrage (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.advance}
                    onChange={(e) =>
                      setFormData({ ...formData, advance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date prévisionnelle de livraison
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDeliveryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Statut du projet
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as DigitalProjectStatus,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Demande">Demande</option>
                  <option value="Étude">Étude</option>
                  <option value="En développement">En développement</option>
                  <option value="Installation">Installation</option>
                  <option value="Tests">Tests</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Livré">Livré</option>
                </select>
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
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-sm"
                >
                  {editingProject ? 'Enregistrer les modifications' : 'Créer le Projet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
