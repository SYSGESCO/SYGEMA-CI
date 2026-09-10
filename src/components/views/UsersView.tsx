import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import {
  UserCheck,
  Plus,
  Shield,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { User, UserRole } from '../../types';

export const UsersView: React.FC = () => {
  const { users, currentUser, setCurrentUser, addUser, updateUser } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Opérateur' as UserRole,
    phone: '',
    active: true,
  });

  const rolesList: UserRole[] = [
    'Administrateur',
    'Gérant',
    'Technicien',
    'Opérateur',
    'Graphiste',
  ];

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Opérateur',
      phone: '05 66 59 45 49',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone || '',
      active: u.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  if (currentUser.role === 'Gérant') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">Accès Réservé à l'Administrateur</h2>
        <p className="text-xs text-slate-600 mt-2">
          Le profil Gérant ne dispose pas des droits pour ajouter, modifier ou supprimer des comptes utilisateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Utilisateurs & Rôles
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestion du personnel de SYGEMA CI : Administrateur, Gérant, Technicien, Opérateur, Graphiste
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => {
          const isCurrent = u.id === currentUser.id;
          return (
            <div
              key={u.id}
              className={`bg-white rounded-2xl p-5 shadow-xs border transition flex flex-col justify-between ${
                isCurrent ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'Administrateur'
                        ? 'bg-blue-900 text-white'
                        : u.role === 'Gérant'
                        ? 'bg-purple-100 text-purple-900'
                        : u.role === 'Technicien'
                        ? 'bg-amber-100 text-amber-900'
                        : u.role === 'Graphiste'
                        ? 'bg-pink-100 text-pink-900'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {u.role}
                  </span>

                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Session Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-base text-slate-700">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{u.name}</h3>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  {u.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Statut : {u.active ? 'Compte actif' : 'Désactivé'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {!isCurrent ? (
                  <button
                    type="button"
                    onClick={() => setCurrentUser(u)}
                    className="text-xs font-bold text-blue-900 hover:underline"
                  >
                    Basculer sur ce profil
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Connecté</span>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenEdit(u)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur SYGEMA CI'}
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom et Prénoms *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Kouamé Patrick"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nom@sygema.ci"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle dans l'entreprise</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-sm"
                >
                  {editingUser ? 'Enregistrer' : 'Créer l\'Utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
