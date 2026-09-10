import React, { useState } from 'react';
import { useAppStore } from '../data/store';
import {
  Lock,
  User as UserIcon,
  Shield,
  ShoppingBag,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Phone,
  MapPin,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, company } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Identifiant ou mot de passe incorrect');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#060e20] via-[#0b1b3d] to-[#081329] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0d1f47] border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg">
            <img src="/logo.svg" alt="SYGEMA CI" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-sm tracking-wider text-white">SYGEMA CI</span>
            <p className="text-[11px] text-amber-400 font-medium">Daloa, Côte d’Ivoire</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{company.phone || '05 66 59 45 49'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Quartier Soleil 2</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-4xl mx-auto my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Système ERP & Commercial Sécurisé</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Espace de Connexion & Vente des Services
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Plateforme de gestion opérationnelle SYGEMA CI : vente des 5 pôles de services (Imprimerie, Maintenance, Graphisme, Solutions Numériques, Tee-shirts), facturation et encaissement.
              </p>
            </div>

            {/* Quick Access Badges / Hints */}
            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase font-bold tracking-wider text-amber-400/90">
                Sélectionnez votre profil ou saisissez vos identifiants :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Gérant Card */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('gerant', '1234')}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    username === 'gerant'
                      ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Profil Gérant
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      Ventes
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Login : <strong className="text-white">gerant</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Passe : <strong className="text-white">1234</strong>
                  </p>
                  <p className="text-[10px] text-amber-300/80 mt-1.5">
                    Accès vente des 5 services, devis & factures
                  </p>
                </button>

                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', '')}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    username === 'admin'
                      ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Profil Administrateur
                    </span>
                    <span className="text-[10px] bg-blue-400/20 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                      Direction
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Login : <strong className="text-white">admin</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>Mot de passe :</span>
                    <span className="text-blue-300 font-semibold italic text-[11px]">•••••••• (Confidentiel)</span>
                  </p>
                  <p className="text-[10px] text-blue-300/80 mt-1.5">
                    Accès total direction, paramètres & utilisateurs
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Form Box */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6">
                <h2 className="text-xl font-black text-white">Connexion Utilisateur</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Veuillez renseigner vos identifiants pour accéder à votre espace de travail.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Échec de connexion</p>
                    <p className="text-[11px] text-rose-300 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Identifiant de connexion (Login) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="input-login-username"
                      type="text"
                      required
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ex: gerant ou admin"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Connexion en cours...</span>
                  ) : (
                    <>
                      <span>Accéder à l'application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security notice */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Authentification locale sécurisée conforme au cahier des charges SYGEMA CI.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-3 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 SYGEMA CI — Société Yoman & Gbogbouo Entreprise Moderne d’Afrique</span>
        <span>Système de Gestion Commerciale des 5 Services • Daloa</span>
      </footer>
    </div>
  );
};
