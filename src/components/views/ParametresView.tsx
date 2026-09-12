import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import {
  Settings,
  Building,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  Printer,
  Shield,
  Palette,
  Lock,
} from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

export const ParametresView: React.FC = () => {
  const { companyInfo, updateCompanyInfo, resetAllData, currentUser } = useAppStore();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: companyInfo?.name || 'SYGEMA CI',
    activity: companyInfo?.activity || 'Imprimerie & Services Informatiques',
    slogan: companyInfo?.slogan || "Votre partenaire pour tous vos besoins numériques et d'impression",
    phone: companyInfo?.phone || '05 66 59 45 49',
    whatsapp: companyInfo?.whatsapp || '05 66 59 45 49',
    address: companyInfo?.address || 'Daloa, Quartier Soleil 2, Côte d’Ivoire',
    email: companyInfo?.email || 'contact@sygema.ci',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (currentUser?.role === 'Gérant') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">Accès Réservé à l'Administrateur</h2>
        <p className="text-xs text-slate-600 mt-2">
          Le profil Gérant ne dispose pas des droits pour modifier les coordonnées officielles de l'entreprise ou réinitialiser les données système.
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
            <Settings className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Paramètres de l'Entreprise
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configuration de l'identité officielle SYGEMA CI, coordonnées Daloa et mentions légales des documents
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Paramètres enregistrés avec succès</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-900" />
            <span>Identité de l'Entreprise (Conforme aux Factures & Documents)</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Raison Sociale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Activité Principale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.activity}
                  onChange={(e) =>
                    setFormData({ ...formData, activity: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Slogan Officiel *
              </label>
              <input
                type="text"
                required
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Numéro de Téléphone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Numéro WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adresse Physique *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adresse E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Informations</span>
              </button>
            </div>
          </form>
        </div>

        {/* Visual Identity & Company Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs border border-slate-800 text-xs space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="SYGEMA CI Logo"
                className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm"
              />
              <div>
                <h3 className="text-base font-black text-white">{companyInfo.name}</h3>
                <p className="text-[11px] text-amber-400 font-bold">{companyInfo.activity}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-slate-300 space-y-2">
              <p className="italic text-[11px] text-slate-400">"{companyInfo.slogan}"</p>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{companyInfo.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 text-xs space-y-2">
            <h4 className="font-extrabold text-slate-900">Charte Graphique & Respect du Périmètre</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              L'application SYGEMA CI est strictement dédiée aux 5 branches d'activité :
              Imprimerie & Bureautique, Maintenance Informatique, Graphisme & Communication,
              Solutions Numériques, et Impression Tee-shirts.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] pt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Conforme au cahier des charges SYGEMA CI</span>
            </div>
          </div>

          {/* PWA Mobile & Desktop Installation Card */}
          <PWAInstallButton variant="card" />

          {/* Reset All Data to Zero Section */}
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 text-xs space-y-3">
            <h4 className="font-extrabold text-rose-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Réinitialisation Générale des Données</span>
            </h4>
            <p className="text-rose-700 text-[11px] leading-relaxed">
              Remettre toutes les données (clients, commandes des 5 services, factures, devis, stocks, dépenses, caisse) à zéro.
            </p>

            {resetSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Toutes les données ont été remises à zéro avec succès !</span>
              </div>
            )}

            {!resetConfirmOpen ? (
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs"
              >
                Mettre toutes les données à zéro
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-white rounded-xl border border-rose-300">
                <p className="font-bold text-rose-900 text-xs">
                  Confirmez-vous la remise à zéro de toute l'application ?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetAllData();
                      setResetConfirmOpen(false);
                      setResetSuccess(true);
                      setTimeout(() => setResetSuccess(false), 4000);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Oui, tout effacer
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirmOpen(false)}
                    className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
