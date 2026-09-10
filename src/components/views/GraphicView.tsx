import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  Palette,
  Plus,
  Search,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { GraphicProject, GraphicCreationType, GraphicProjectStatus } from '../../types';

export const GraphicView: React.FC = () => {
  const {
    graphicProjects,
    addGraphicProject,
    updateGraphicProject,
    deleteGraphicProject,
    clients,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<GraphicProject | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    creationType: 'Création de logos' as GraphicCreationType,
    description: '',
    dimensions: '',
    fileFormat: 'PNG, JPEG, PDF, SVG',
    graphicDesigner: 'Ange Koffi',
    price: 0,
    advance: 0,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date().toISOString().split('T')[0],
    modificationCount: 0,
    status: 'Nouvelle demande' as GraphicProjectStatus,
  });

  const creationTypes: GraphicCreationType[] = [
    'Création de logos',
    'Conception d\'affiches publicitaires',
    'Flyers et dépliants',
    'Cartes de visite professionnelles',
    'Faire-part et invitations',
    'Bannières et roll-up',
    'Visuels pour réseaux sociaux',
    'Conception de supports de communication',
  ];

  const handleOpenAdd = () => {
    setEditingProject(null);
    const defaultClient = clients[0];
    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      creationType: 'Création de logos',
      description: '',
      dimensions: '',
      fileFormat: 'PDF, PNG, SVG',
      graphicDesigner: 'Ange Koffi',
      price: 0,
      advance: 0,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date().toISOString().split('T')[0],
      modificationCount: 0,
      status: 'Nouvelle demande',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: GraphicProject) => {
    setEditingProject(proj);
    setFormData({
      clientId: proj.clientId,
      clientName: proj.clientName,
      phone: proj.phone,
      creationType: proj.creationType,
      description: proj.description,
      dimensions: proj.dimensions,
      fileFormat: proj.fileFormat,
      graphicDesigner: proj.graphicDesigner,
      price: proj.price,
      advance: proj.advance,
      orderDate: proj.orderDate,
      expectedDeliveryDate: proj.expectedDeliveryDate,
      modificationCount: proj.modificationCount,
      status: proj.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.description) return;

    if (editingProject) {
      updateGraphicProject(editingProject.id, formData);
    } else {
      addGraphicProject(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = graphicProjects.filter((g) => {
    const matchesSearch =
      g.projectNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.clientName.toLowerCase().includes(search.toLowerCase()) ||
      g.creationType.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'TOUS' || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-pink-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Graphisme & Communication
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Création de logos, affiches publicitaires, flyers, cartes de visite, bannières et visuels réseaux sociaux
          </p>
        </div>

        <button
          id="btn-add-graphic-project"
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet Graphique</span>
        </button>
      </div>

      {/* Services List Badges */}
      <div className="bg-pink-950 text-white rounded-2xl p-5 shadow-xs border border-pink-900">
        <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-pink-200 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Services de Création Graphique & Communication SYGEMA CI</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {creationTypes.map((srv) => (
            <div
              key={srv}
              className="p-2.5 rounded-xl bg-pink-900/50 border border-pink-800/80 text-pink-100 flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-pink-400 shrink-0" />
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
            placeholder="Rechercher par N° projet, client, type de création..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['TOUS', 'Nouvelle demande', 'En conception', 'En modification', 'Validé', 'Terminé', 'Livré'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-pink-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Aucun projet graphique trouvé.
          </div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between hover:border-pink-300 transition group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono font-bold text-xs text-pink-800">
                    {proj.projectNumber}
                  </span>
                  <select
                    value={proj.status}
                    onChange={(e) =>
                      updateGraphicProject(proj.id, {
                        status: e.target.value as GraphicProjectStatus,
                      })
                    }
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                      proj.status === 'Validé' || proj.status === 'Livré'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : proj.status === 'En modification'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : proj.status === 'En conception'
                        ? 'bg-pink-100 text-pink-900 border-pink-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="Nouvelle demande">Nouvelle demande</option>
                    <option value="En conception">En conception</option>
                    <option value="En modification">En modification</option>
                    <option value="Validé">Validé</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Livré">Livré</option>
                  </select>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                  {proj.creationType}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {proj.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client :</span>
                    <span className="font-bold text-slate-800">{proj.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Graphiste :</span>
                    <span className="font-medium text-pink-700">{proj.graphicDesigner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Formats :</span>
                    <span className="text-slate-700 font-mono text-[10px] truncate max-w-[140px]">
                      {proj.fileFormat}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modifications :</span>
                    <span className="font-semibold text-slate-700">{proj.modificationCount} retours</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Tarif Prestation</span>
                  <span className="font-black text-sm text-slate-900">
                    {formatFCFA(proj.price)}
                  </span>
                  {proj.remainingAmount > 0 && (
                    <span className="block text-[10px] font-bold text-rose-600">
                      Reste : {formatFCFA(proj.remainingAmount)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
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
                      if (window.confirm('Supprimer ce projet graphique ?')) {
                        deleteGraphicProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD / EDIT GRAPHIC PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProject
                  ? `Modifier Projet ${editingProject.projectNumber}`
                  : 'Nouveau Projet Graphique SYGEMA CI'}
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
                    Type de Création *
                  </label>
                  <select
                    value={formData.creationType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creationType: e.target.value as GraphicCreationType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    {creationTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Graphiste assigné
                  </label>
                  <input
                    type="text"
                    value={formData.graphicDesigner}
                    onChange={(e) =>
                      setFormData({ ...formData, graphicDesigner: e.target.value })
                    }
                    placeholder="Ex: Ange Koffi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description détaillée du besoin client *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Couleurs souhaitées, slogan, dimensions, références visuelles..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dimensions / Support
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                    placeholder="Ex: 1080x1080, A3, Bâche 2x1m..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Formats de livraison
                  </label>
                  <input
                    type="text"
                    value={formData.fileFormat}
                    onChange={(e) =>
                      setFormData({ ...formData, fileFormat: e.target.value })
                    }
                    placeholder="Ex: PDF HD, PNG transparent, SVG, JPEG"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prix Total Création (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Acompte versé (FCFA)
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
                    Statut du projet
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as GraphicProjectStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Nouvelle demande">Nouvelle demande</option>
                    <option value="En conception">En conception</option>
                    <option value="En modification">En modification</option>
                    <option value="Validé">Validé</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Livré">Livré</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de livraison souhaitée
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
                  className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-sm"
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
