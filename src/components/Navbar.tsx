import React, { useState } from 'react';
import { useAppStore } from '../data/store';
import {
  Search,
  Bell,
  UserCheck,
  Menu,
  X,
  Phone,
  MessageSquare,
  Shield,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ShoppingBag,
  RefreshCw,
  Database,
  CloudCheck,
} from 'lucide-react';
import { UserRole } from '../types';
import { LiveClock } from './LiveClock';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenSearch: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onToggleMobileSidebar,
  onOpenSearch,
  onNavigate,
}) => {
  const handleOpenMenu = onOpenMobileMenu || onToggleMobileSidebar || (() => {});
  const {
    company,
    currentUser,
    setCurrentUser,
    users,
    notifications,
    markNotificationRead,
    clearNotifications,
    logout,
    syncStatus,
    lastSyncTime,
    forceSyncWithServer,
  } = useAppStore();

  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await forceSyncWithServer();
    setTimeout(() => setIsManualSyncing(false), 800);
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isGerant = currentUser?.role === 'Gérant';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleColors: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-amber-100 text-amber-900 border-amber-300',
    ADMIN: 'bg-blue-100 text-blue-900 border-blue-300',
    AGENT: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    TECHNICIEN: 'bg-purple-100 text-purple-900 border-purple-300',
    GRAPHISTE: 'bg-pink-100 text-pink-900 border-pink-300',
    Administrateur: 'bg-blue-100 text-blue-900 border-blue-300',
    Gérant: 'bg-amber-100 text-amber-900 border-amber-300',
    Technicien: 'bg-purple-100 text-purple-900 border-purple-300',
    Opérateur: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Graphiste: 'bg-pink-100 text-pink-900 border-pink-300',
  };

  const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Administrateur',
    AGENT: 'Agent Caisse',
    TECHNICIEN: 'Technicien Info',
    GRAPHISTE: 'Graphiste Pro',
    Administrateur: 'Administrateur',
    Gérant: 'Gérant',
    Technicien: 'Technicien Info',
    Opérateur: 'Opérateur Imprimerie',
    Graphiste: 'Graphiste Pro',
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left Section: Mobile Menu + Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-menu"
            type="button"
            onClick={handleOpenMenu}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#0f2048] border-2 border-amber-400/80 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo.svg"
                alt="Logo SYGEMA CI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">
                  SYGEMA CI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ERP PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
                Imprimerie & Services Informatiques • Daloa
              </p>
            </div>
          </div>
        </div>

        {/* Center Section: Quick Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            id="btn-search-trigger"
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Rechercher client, N° commande, facture, téléphone...</span>
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-slate-700 text-slate-300 rounded font-mono border border-slate-600">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Section: Contacts, Clock, Sync, Notifications & User Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Platform Clock with Date */}
          <LiveClock variant="navbar" />

          {/* Compact Clock for Mobile */}
          <LiveClock variant="compact" className="flex md:hidden" />

          {/* Server Sync Indicator & Manual Sync Button */}
          <button
            id="btn-server-sync"
            type="button"
            onClick={handleManualSync}
            disabled={isManualSyncing}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${
              syncStatus === 'synced'
                ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/80'
                : syncStatus === 'syncing' || isManualSyncing
                ? 'bg-blue-950/70 border-blue-500/60 text-blue-300 animate-pulse'
                : 'bg-amber-950/70 border-amber-600/60 text-amber-300 hover:bg-amber-900/80'
            }`}
            title={`Base de données SYGEMA CI sauvegardée. ${
              lastSyncTime ? `Dernière synchro : ${lastSyncTime}` : ''
            }. Cliquez pour forcer la synchronisation.`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncStatus === 'syncing' || isManualSyncing ? 'animate-spin text-blue-400' : 'text-emerald-400'
              }`}
            />
            <span className="hidden lg:inline text-[11px]">
              {syncStatus === 'syncing' || isManualSyncing
                ? 'Synchro...'
                : syncStatus === 'synced'
                ? 'Serveur OK'
                : 'Hors ligne'}
            </span>
          </button>

          {/* Mobile search button */}
          <button
            id="btn-search-mobile"
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick WhatsApp / Phone contact pill */}
          <a
            href={`https://wa.me/225${company.whatsapp.replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 rounded-lg text-xs font-medium transition"
            title="Assistance WhatsApp SYGEMA CI"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>05 66 59 45 49</span>
          </a>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications"
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-white">Notifications internes</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      Aucune notification pour le moment.
                    </p>
                  ) : (
                    notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.targetView) {
                            onNavigate(notif.targetView);
                            setShowNotifications(false);
                          }
                        }}
                        className={`pt-2 pb-2 px-2 rounded-lg cursor-pointer transition ${
                          notif.read ? 'opacity-70 hover:bg-slate-800/40' : 'bg-slate-800/80 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-xs text-white">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {notif.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              id="btn-user-menu"
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-400 font-medium leading-tight">
                  {roleLabels[currentUser.role]}
                </div>
              </div>
            </button>

            {/* Direct Logout Button */}
            <button
              id="btn-navbar-logout"
              type="button"
              onClick={logout}
              title="Déconnexion"
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Quitter</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50">
                <div className="pb-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
                  <div className="mt-1">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                        roleColors[currentUser.role]
                      }`}
                    >
                      {roleLabels[currentUser.role]}
                    </span>
                  </div>
                </div>

                {/* Quick Role Switcher */}
                <div className="mt-3">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Changer de compte
                  </p>
                  <div className="space-y-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                          currentUser.id === u.id
                            ? 'bg-blue-600/30 text-white font-semibold border border-blue-500/40'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-xs">
                  {!isGerant && (
                    <div className="flex justify-between items-center pb-1">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('utilisateurs');
                          setShowUserMenu(false);
                        }}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Gérer les accès</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('parametres');
                          setShowUserMenu(false);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        Paramètres
                      </button>
                    </div>
                  )}

                  {isGerant && (
                    <p className="text-[11px] text-amber-400/90 italic pb-1">
                      Mode Gérant : ventes, commandes, devis & facturation.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50 hover:text-white transition font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
