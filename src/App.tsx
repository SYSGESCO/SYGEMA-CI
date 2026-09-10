import React, { useState } from 'react';
import { AppProvider } from './data/store';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import {
  PrintableDocumentModal,
  PrintableDocType,
} from './components/PrintableDocumentModal';

// Views
import { DashboardView } from './components/views/DashboardView';
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

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [printDoc, setPrintDoc] = useState<PrintableDocType | null>(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenPrint={setPrintDoc}
          />
        );
      case 'imprimerie':
        return <PrintOrdersView onOpenPrint={setPrintDoc} />;
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
      case 'produits':
      case 'achats':
        return <StockView />;
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
        return (
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
