import React from 'react';
import { useAppStore } from '../data/store';
import {
  LayoutDashboard,
  Users,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  ClipboardList,
  FileText,
  CreditCard,
  Receipt,
  Tag,
  AlertOctagon,
  Building2,
  ShoppingCart,
  Package,
  Boxes,
  Coins,
  BarChart3,
  UserCog,
  Settings,
  X,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { products, charges, maintenance } = useAppStore();
  const isMobile = isOpenMobile ?? isMobileOpen ?? false;

  const lowStockCount = products.filter(
    (p) => p.currentStock <= (p.minStockAlert ?? p.minStock ?? 5)
  ).length;

  const pendingChargesCount = (charges || []).filter(
    (c) => c.status === 'À payer' || c.status === 'En retard'
  ).length;

  const ongoingMaintenanceCount = (maintenance || []).filter(
    (m) => m.status === 'Reçu' || m.status === 'En diagnostic' || m.status === 'En cours'
  ).length;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, category: 'Général' },
    { id: 'clients', label: 'Clients', icon: Users, category: 'Général' },

    // The 5 Core Services of SYGEMA CI
    { id: 'imprimerie', label: 'Imprimerie & Bureautique', icon: Printer, category: 'Services SYGEMA CI' },
    { id: 'maintenance', label: 'Maintenance informatique', icon: Wrench, category: 'Services SYGEMA CI', badge: ongoingMaintenanceCount > 0 ? ongoingMaintenanceCount : undefined },
    { id: 'graphisme', label: 'Graphisme & Communication', icon: Palette, category: 'Services SYGEMA CI' },
    { id: 'solutions_numeriques', label: 'Solutions numériques', icon: Laptop, category: 'Services SYGEMA CI' },
    { id: 'teeshirt', label: 'Impression Tee-shirt', icon: Shirt, category: 'Services SYGEMA CI' },

    // Commercial & Facturation
    { id: 'commandes', label: 'Commandes', icon: ClipboardList, category: 'Commercial' },
    { id: 'devis', label: 'Devis', icon: FileText, category: 'Commercial' },
    { id: 'facturation', label: 'Facturation & Paiements', icon: CreditCard, category: 'Commercial' },

    // Finances & Dépenses
    { id: 'depenses', label: 'Dépenses', icon: Receipt, category: 'Finances' },
    { id: 'charges', label: 'Charges', icon: Tag, category: 'Finances', badge: pendingChargesCount > 0 ? pendingChargesCount : undefined },
    { id: 'imprevus', label: 'Imprévus', icon: AlertOctagon, category: 'Finances' },
    { id: 'caisse', label: 'Caisse', icon: Coins, category: 'Finances' },

    // Stocks & Achats
    { id: 'fournisseurs', label: 'Fournisseurs', icon: Building2, category: 'Stocks & Achats' },
    { id: 'achats', label: 'Achats', icon: ShoppingCart, category: 'Stocks & Achats' },
    { id: 'produits', label: 'Produits', icon: Package, category: 'Stocks & Achats' },
    { id: 'stocks', label: 'Stocks', icon: Boxes, category: 'Stocks & Achats', alert: lowStockCount > 0 ? lowStockCount : undefined },

    // Gestion & Paramètres
    { id: 'rapports', label: 'Rapports', icon: BarChart3, category: 'Pilotage' },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: UserCog, category: 'Pilotage' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, category: 'Pilotage' },
  ];

  // Group by category
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-950 via-[#0d1c3f] to-slate-950 text-slate-200 border-r border-slate-800/80 shadow-xl flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0f2048] border-2 border-amber-400 p-0.5 shadow-md flex items-center justify-center">
              <img src="/logo.svg" alt="SYGEMA CI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wider">
                SYGEMA CI
              </h2>
              <p className="text-[11px] text-amber-400/90 font-medium">
                Daloa • Côte d'Ivoire
              </p>
            </div>
          </div>
          <button
            id="btn-close-sidebar"
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs select-none custom-scrollbar">
          {categories.map((category) => (
            <div key={category} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                {category}
              </div>
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md font-semibold border-l-4 border-amber-400'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Badges */}
                      {item.alert !== undefined && item.alert > 0 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse shadow-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {item.alert}
                        </span>
                      )}

                      {item.badge !== undefined && item.badge > 0 && !item.alert && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Bottom Slogan & Phone Box */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px]">
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
            <p className="text-slate-400 font-medium italic text-[10px] leading-tight">
              « Votre partenaire pour tous vos besoins numériques et d'impression »
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-slate-300">
              <span className="text-[10px] text-slate-400">Soleil 2, Daloa</span>
              <span className="text-[10px] font-bold text-amber-400">05 66 59 45 49</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
