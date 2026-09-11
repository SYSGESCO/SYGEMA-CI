import React, { useState } from 'react';
import { AppProvider, useAppStore } from './data/store';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginView } from './components/LoginView';
import {
  PrintableDocumentModal,
  PrintableDocType,
} from './components/PrintableDocumentModal';
import { Lock, AlertCircle } from 'lucide-react';

// Views
import { DashboardView } from './components/views/DashboardView';
import { GerantDashboardView } from './components/views/GerantDashboardView';
import { PrintOrdersView } from './components/views/PrintOrdersView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { GraphicView } from './components/views/GraphicView';
import { DigitalView } from './components/views/DigitalView';
import { TshirtView } from './components/views/TshirtView';
import { ClientsView } from './components/views/ClientsView';
import { FacturationView } from './components/views/FacturationView';
import { StockView } from './components/views/StockView';
import { DepensesView } from './components/views/DepensesView';
import { FournisseursView } from './components/views/FournisseursView';
import { RapportsView } from './components/views/RapportsView';
import { UsersView } from './components/views/UsersView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { ParametresView } from './components/views/ParametresView';
import { CommandesView } from './components/views/CommandesView';
import { PhotoMinuteView } from './components/views/PhotoMinuteView';
import { InscriptionScolaireView } from './components/views/InscriptionScolaireView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentUser } = useAppStore();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [printDoc, setPrintDoc] = useState<PrintableDocType | null>(null);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const isGerant = currentUser?.role === 'Gérant';

  const renderCurrentView = () => {
    // Restrictions pour le Gérant : pas d'utilisateurs ni de paramètres
    if (isGerant && (currentView === 'utilisateurs' || currentView === 'parametres')) {
      return (
        <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center max-w-md mx-auto my-12 shadow-md">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Accès Restreint au Gérant</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Votre profil <strong>Gérant</strong> est spécialement configuré pour la commercialisation des 5 services (devis, commandes, factures, encaissements).
            L'administration des utilisateurs et la modification des paramètres relèvent de la direction.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition"
          >
            Retourner au Tableau de Bord des Ventes
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return isGerant ? (
          <GerantDashboardView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        ) : (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        );
      case 'imprimerie':
        return <PrintOrdersView onOpenPrint={setPrintDoc} />;
      case 'photo_minute':
      case 'photo-minute':
        return <PhotoMinuteView onOpenPrint={setPrintDoc} />;
      case 'inscription_scolaire':
      case 'inscriptions_scolaires':
      case 'inscription-scolaire':
        return <InscriptionScolaireView onOpenPrint={setPrintDoc} />;
      case 'maintenance':
        return <MaintenanceView onOpenPrint={setPrintDoc} />;
      case 'graphisme':
        return <GraphicView />;
      case 'solutions_numeriques':
      case 'solutions-numeriques':
        return <DigitalView />;
      case 'teeshirt':
      case 'tee-shirts':
        return <TshirtView onOpenPrint={setPrintDoc} />;
      case 'commandes':
        return (
          <CommandesView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        );
      case 'clients':
        return <ClientsView onNavigate={setCurrentView} />;
      case 'facturation':
      case 'factures':
        return <FacturationView onOpenPrint={setPrintDoc} initialTab="factures" />;
      case 'devis':
        return <FacturationView onOpenPrint={setPrintDoc} initialTab="devis" />;
      case 'paiements':
        return <FacturationView onOpenPrint={setPrintDoc} initialTab="paiements" />;
      case 'stocks':
        return <StockView initialTab="stocks" />;
      case 'produits':
        return <StockView initialTab="produits" />;
      case 'achats':
        return <StockView initialTab="achats" />;
      case 'depenses':
      case 'charges':
      case 'imprevus':
        return <DepensesView initialTab="depenses" />;
      case 'caisse':
        return <DepensesView initialTab="caisse" />;
      case 'fournisseurs':
        return <FournisseursView />;
      case 'rapports':
        return <RapportsView />;
      case 'utilisateurs':
        return <UsersView />;
      case 'audit':
        return <AuditLogsView />;
      case 'parametres':
        return <ParametresView />;
      default:
        return isGerant ? (
          <GerantDashboardView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        ) : (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={setCurrentView}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentView}
        onOpenPrint={setPrintDoc}
      />

      {/* Printable Document Modal (A4 print preview & download) */}
      {printDoc && (
        <PrintableDocumentModal
          doc={printDoc}
          onClose={() => setPrintDoc(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
