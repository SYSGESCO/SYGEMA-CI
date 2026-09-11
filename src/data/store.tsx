import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Client,
  MaintenanceIntervention,
  PrintOrder,
  GraphicProject,
  DigitalProject,
  TshirtOrder,
  UnifiedOrder,
  Quote,
  Invoice,
  Payment,
  Expense,
  Charge,
  Contingency,
  Supplier,
  Product,
  StockMovement,
  PurchaseOrder,
  CashMovement,
  CashRegisterClose,
  AuditLog,
  AppNotification,
  CompanyInfo,
  PaymentMethod,
  ServiceCategory,
  SupplySale,
  SupplySaleItem,
} from '../types';

import {
  initialCompanyInfo,
  initialUsers,
  initialClients,
  initialMaintenance,
  initialPrintOrders,
  initialGraphicProjects,
  initialDigitalProjects,
  initialTshirtOrders,
  initialQuotes,
  initialInvoices,
  initialPayments,
  initialExpenses,
  initialCharges,
  initialContingencies,
  initialSuppliers,
  initialProducts,
  initialSupplySales,
  initialStockMovements,
  initialPurchaseOrders,
  initialCashMovements,
  initialCashRegisterCloses,
  initialNotifications,
  initialAuditLogs,
} from './initialData';

interface AppContextType {
  company: CompanyInfo;
  updateCompany: (info: Partial<CompanyInfo>) => void;
  companyInfo?: CompanyInfo;
  updateCompanyInfo?: (info: Partial<CompanyInfo>) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser?: (id: string, updates: Partial<User>) => void;
  deleteUser?: (id: string) => void;
  toggleUserActive: (id: string) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // 5 Services
  maintenance: MaintenanceIntervention[];
  addMaintenance: (item: Omit<MaintenanceIntervention, 'id' | 'interventionNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateMaintenance: (id: string, updates: Partial<MaintenanceIntervention>) => void;
  deleteMaintenance: (id: string) => void;

  printOrders: PrintOrder[];
  addPrintOrder: (item: Omit<PrintOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updatePrintOrder: (id: string, updates: Partial<PrintOrder>) => void;
  deletePrintOrder: (id: string) => void;
  consumeStockForPrint: (orderId: string, items: Array<{ productId: string; quantity: number }>) => void;

  graphicProjects: GraphicProject[];
  addGraphicProject: (item: Omit<GraphicProject, 'id' | 'projectNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateGraphicProject: (id: string, updates: Partial<GraphicProject>) => void;
  deleteGraphicProject: (id: string) => void;

  digitalProjects: DigitalProject[];
  addDigitalProject: (item: Omit<DigitalProject, 'id' | 'projectNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateDigitalProject: (id: string, updates: Partial<DigitalProject>) => void;
  deleteDigitalProject: (id: string) => void;

  tshirtOrders: TshirtOrder[];
  addTshirtOrder: (item: Omit<TshirtOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => void;
  updateTshirtOrder: (id: string, updates: Partial<TshirtOrder>) => void;
  deleteTshirtOrder: (id: string) => void;
  consumeStockForTshirt: (orderId: string, items: Array<{ productId: string; quantity: number }>) => void;

  // Unified Orders
  getAllOrders: () => UnifiedOrder[];

  // Quotes (Devis)
  quotes: Quote[];
  addQuote: (item: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  convertQuoteToOrder: (quoteId: string) => void;

  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (item: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'remainingAmount'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'paymentNumber' | 'createdAt'>) => void;

  // Expenses & Charges & Contingencies
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNumber' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  resetExpenses: () => void;

  charges: Charge[];
  addCharge: (charge: Omit<Charge, 'id' | 'createdAt'>) => void;
  updateCharge: (id: string, updates: Partial<Charge>) => void;
  payCharge: (chargeId: string, method: PaymentMethod) => void;

  contingencies: Contingency[];
  addContingency: (item: Omit<Contingency, 'id' | 'createdAt'>) => void;

  // Suppliers, Products, Stocks & Purchases
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier?: (id: string) => void;

  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct?: (id: string) => void;

  stockMovements: StockMovement[];
  addStockMovement: (mvt: Omit<StockMovement, 'id' | 'createdAt' | 'stockBefore' | 'stockAfter'>) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'purchaseNumber' | 'createdAt' | 'remainingAmount'>) => void;
  receivePurchaseOrder: (poId: string) => void;

  // Vente de Fournitures Informatiques & Consommables
  supplySales: SupplySale[];
  addSupplySale: (sale: {
    clientId?: string;
    clientName: string;
    clientPhone?: string;
    items: SupplySaleItem[];
    totalAmount: number;
    paidAmount: number;
    changeGiven: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => SupplySale;
  cancelSupplySale: (saleId: string) => void;

  // Caisse & Finances
  cashMovements: CashMovement[];
  cashRegisterCloses: CashRegisterClose[];
  closeCashRegister: (actualBalance: number, notes: string) => void;
  getCashBalance: () => { theoretical: number; inflows: number; outflows: number };
  totalIncome?: number;
  totalExpenses?: number;
  netProfit?: number;
  cashBalance?: number;
  branchRevenues?: Record<string, number>;

  // Notifications & Logs
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, details: string, oldValue?: string, newValue?: string) => void;

  // Reset demo data
  resetAllData: () => void;

  // Real-time server sync
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime: string | null;
  forceSyncWithServer: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'sygema_ci_erp_v4_strict_zero';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  const [company, setCompany] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_company`);
    return saved ? JSON.parse(saved) : initialCompanyInfo;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const hasAdmin = parsed.some((u) => u.username === 'admin');
        const hasGerant = parsed.some((u) => u.username === 'gerant');
        if (!hasAdmin || !hasGerant) {
          return initialUsers;
        }
        return parsed;
      } catch (e) {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localStorage.getItem(`${STORAGE_KEY}_auth_session`);
    return !!session;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const session = localStorage.getItem(`${STORAGE_KEY}_auth_session`);
    if (session) {
      const found = initialUsers.find((u) => u.username === session) || users.find((u) => u.username === session);
      if (found) return found;
    }
    return initialUsers[0];
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceIntervention[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_maintenance`);
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [printOrders, setPrintOrders] = useState<PrintOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_printOrders`);
    return saved ? JSON.parse(saved) : initialPrintOrders;
  });

  const [graphicProjects, setGraphicProjects] = useState<GraphicProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_graphicProjects`);
    return saved ? JSON.parse(saved) : initialGraphicProjects;
  });

  const [digitalProjects, setDigitalProjects] = useState<DigitalProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_digitalProjects`);
    return saved ? JSON.parse(saved) : initialDigitalProjects;
  });

  const [tshirtOrders, setTshirtOrders] = useState<TshirtOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tshirtOrders`);
    return saved ? JSON.parse(saved) : initialTshirtOrders;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quotes`);
    return saved ? JSON.parse(saved) : initialQuotes;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (!localStorage.getItem('sygema_ci_expenses_zero_v1')) {
      return [];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : [];
  });

  const [charges, setCharges] = useState<Charge[]>(() => {
    if (!localStorage.getItem('sygema_ci_expenses_zero_v1')) {
      return [];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_charges`);
    return saved ? JSON.parse(saved) : [];
  });

  const [contingencies, setContingencies] = useState<Contingency[]>(() => {
    if (!localStorage.getItem('sygema_ci_expenses_zero_v1')) {
      return [];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_contingencies`);
    return saved ? JSON.parse(saved) : [];
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`);
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return initialProducts;
  });

  const [supplySales, setSupplySales] = useState<SupplySale[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supplySales`);
    return saved ? JSON.parse(saved) : initialSupplySales;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stockMovements`);
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_purchaseOrders`);
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cashMovements`);
    const initialList: CashMovement[] = saved ? JSON.parse(saved) : initialCashMovements;
    // Si la remise à zéro des dépenses n'a pas encore été appliquée, filtrer les anciennes sorties dépenses
    if (!localStorage.getItem('sygema_ci_expenses_zero_v1')) {
      return initialList.filter(
        (m) => m.source !== 'DEPENSE' && m.source !== 'CHARGE' && m.source !== 'IMPREVU'
      );
    }
    return initialList;
  });

  const [cashRegisterCloses, setCashRegisterCloses] = useState<CashRegisterClose[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cashRegisterCloses`);
    return saved ? JSON.parse(saved) : initialCashRegisterCloses;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Server sync states
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Helper to build full data snapshot
  const buildCurrentSnapshot = () => ({
    company,
    users,
    clients,
    maintenance,
    printOrders,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    quotes,
    invoices,
    payments,
    expenses,
    charges,
    contingencies,
    suppliers,
    products,
    supplySales,
    stockMovements,
    purchaseOrders,
    cashMovements,
    cashRegisterCloses,
    notifications,
    auditLogs,
  });

  // Hydrate store from server data
  const applyServerData = (d: any) => {
    if (!d) return;
    if (d.company) setCompany(d.company);
    if (Array.isArray(d.users)) setUsers(d.users);
    if (Array.isArray(d.clients)) setClients(d.clients);
    if (Array.isArray(d.maintenance)) setMaintenance(d.maintenance);
    if (Array.isArray(d.printOrders)) setPrintOrders(d.printOrders);
    if (Array.isArray(d.graphicProjects)) setGraphicProjects(d.graphicProjects);
    if (Array.isArray(d.digitalProjects)) setDigitalProjects(d.digitalProjects);
    if (Array.isArray(d.tshirtOrders)) setTshirtOrders(d.tshirtOrders);
    if (Array.isArray(d.quotes)) setQuotes(d.quotes);
    if (Array.isArray(d.invoices)) setInvoices(d.invoices);
    if (Array.isArray(d.payments)) setPayments(d.payments);
    if (Array.isArray(d.expenses)) setExpenses(d.expenses);
    if (Array.isArray(d.charges)) setCharges(d.charges);
    if (Array.isArray(d.contingencies)) setContingencies(d.contingencies);
    if (Array.isArray(d.suppliers)) setSuppliers(d.suppliers);
    if (Array.isArray(d.products)) setProducts(d.products);
    if (Array.isArray(d.supplySales)) setSupplySales(d.supplySales);
    if (Array.isArray(d.stockMovements)) setStockMovements(d.stockMovements);
    if (Array.isArray(d.purchaseOrders)) setPurchaseOrders(d.purchaseOrders);
    if (Array.isArray(d.cashMovements)) setCashMovements(d.cashMovements);
    if (Array.isArray(d.cashRegisterCloses)) setCashRegisterCloses(d.cashRegisterCloses);
    if (Array.isArray(d.notifications)) setNotifications(d.notifications);
    if (Array.isArray(d.auditLogs)) setAuditLogs(d.auditLogs);
  };

  // Push snapshot to server
  const pushToServer = async (snapshotData: any) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: snapshotData }),
      });
      if (res.ok) {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      console.warn('Erreur de synchronisation serveur:', e);
      setSyncStatus('offline');
    }
  };

  // Manual or automatic pull from server
  const forceSyncWithServer = async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          applyServerData(json.data);
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
        } else {
          // If server empty, initialize it with current state
          await pushToServer(buildCurrentSnapshot());
        }
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      setSyncStatus('offline');
    }
  };

  // Initial Load & Server Connection
  useEffect(() => {
    const initData = async () => {
      try {
        setSyncStatus('syncing');
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            applyServerData(json.data);
            setSyncStatus('synced');
            setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
          } else {
            // First time running, push local data to server
            await pushToServer(buildCurrentSnapshot());
          }
        } else {
          setSyncStatus('offline');
        }
      } catch (err) {
        setSyncStatus('offline');
      } finally {
        setLoaded(true);
      }
    };

    initData();

    // Background polling every 4 seconds to sync any edits from other users (e.g. Gérant)
    const pollInterval = setInterval(() => {
      fetch('/api/data')
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (json && json.success && json.data) {
            applyServerData(json.data);
            setSyncStatus('synced');
            setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
          }
        })
        .catch(() => {
          setSyncStatus('offline');
        });
    }, 4000);

    // Also sync on window focus
    const onFocus = () => {
      forceSyncWithServer();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Save to localStorage & sync to server on state updates
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}_company`, JSON.stringify(company));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
      localStorage.setItem(`${STORAGE_KEY}_maintenance`, JSON.stringify(maintenance));
      localStorage.setItem(`${STORAGE_KEY}_printOrders`, JSON.stringify(printOrders));
      localStorage.setItem(`${STORAGE_KEY}_graphicProjects`, JSON.stringify(graphicProjects));
      localStorage.setItem(`${STORAGE_KEY}_digitalProjects`, JSON.stringify(digitalProjects));
      localStorage.setItem(`${STORAGE_KEY}_tshirtOrders`, JSON.stringify(tshirtOrders));
      localStorage.setItem(`${STORAGE_KEY}_quotes`, JSON.stringify(quotes));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}_charges`, JSON.stringify(charges));
      localStorage.setItem(`${STORAGE_KEY}_contingencies`, JSON.stringify(contingencies));
      localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_stockMovements`, JSON.stringify(stockMovements));
      localStorage.setItem(`${STORAGE_KEY}_purchaseOrders`, JSON.stringify(purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY}_cashMovements`, JSON.stringify(cashMovements));
      localStorage.setItem(`${STORAGE_KEY}_cashRegisterCloses`, JSON.stringify(cashRegisterCloses));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_supplySales`, JSON.stringify(supplySales));

      // Push to server (debounced)
      const timer = setTimeout(() => {
        pushToServer(buildCurrentSnapshot());
      }, 500);

      return () => clearTimeout(timer);
    } catch (e) {
      console.warn('Erreur de sauvegarde locale', e);
    }
  }, [
    loaded,
    company,
    users,
    clients,
    maintenance,
    printOrders,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    quotes,
    invoices,
    payments,
    expenses,
    charges,
    contingencies,
    suppliers,
    products,
    supplySales,
    stockMovements,
    purchaseOrders,
    cashMovements,
    cashRegisterCloses,
    notifications,
    auditLogs,
  ]);

  const addAuditLog = (action: string, module: string, details: string, oldValue?: string, newValue?: string) => {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      module,
      details,
      oldValue,
      newValue,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const triggerNotification = (
    type: AppNotification['type'],
    title: string,
    message: string,
    targetView?: string
  ) => {
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      read: false,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      targetView,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Check product stock levels & notify
  const checkStockAlerts = (prod: Product) => {
    if (prod.currentStock <= 0) {
      triggerNotification(
        'stock',
        '🔴 RUPTURE DE STOCK',
        `Le produit "${prod.name}" est en rupture de stock totale (0 ${prod.unit}) !`,
        'stocks'
      );
    } else if (prod.currentStock <= prod.minStock) {
      triggerNotification(
        'stock',
        '⚠️ STOCK FAIBLE',
        `Le produit "${prod.name}" a atteint son seuil d'alerte (${prod.currentStock} / min ${prod.minStock} ${prod.unit}).`,
        'stocks'
      );
    }
  };

  // CLIENTS
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}`,
      createdBy: clientData.createdBy || currentUser.name,
      createdByRole: clientData.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    addAuditLog('CREATION_CLIENT', 'CLIENTS', `Nouveau client enregistré : ${newClient.name} (${newClient.phone})`);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addAuditLog('MODIFICATION_CLIENT', 'CLIENTS', `Mise à jour fiche client ID: ${id}`);
  };

  const deleteClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('SUPPRESSION_CLIENT', 'CLIENTS', `Suppression du client ${target?.name || id}`);
  };

  // MAINTENANCE
  const addMaintenance = (item: Omit<MaintenanceIntervention, 'id' | 'interventionNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => {
    const num = `INT-2026-${String(maintenance.length + 45).padStart(4, '0')}`;
    const cost = Number(item.cost) || 0;
    const paid = Number(item.paidAmount) || 0;
    const remaining = Math.max(0, cost - paid);

    const newMaint: MaintenanceIntervention = {
      ...item,
      id: `maint_${Date.now()}`,
      interventionNumber: num,
      cost,
      paidAmount: paid,
      remainingAmount: remaining,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMaintenance((prev) => [newMaint, ...prev]);
    addAuditLog('NOUVELLE_INTERVENTION', 'MAINTENANCE', `Intervention ${num} créée pour ${item.clientName} (${item.hardwareConcerned})`);
    triggerNotification('maintenance', 'Nouvelle intervention reçue', `${num} - ${item.clientName} (${item.problemType})`, 'maintenance');

    // If paidAmount > 0, record in payments & caisse
    if (paid > 0) {
      addPayment({
        category: 'maintenance',
        clientId: item.clientId,
        clientName: item.clientName,
        amount: paid,
        date: item.depositDate,
        paymentMethod: 'Espèces',
        reference: `PAY-${num}`,
        notes: `Acompte intervention ${num}`,
        receivedBy: currentUser.name,
      });
    }
  };

  const updateMaintenance = (id: string, updates: Partial<MaintenanceIntervention>) => {
    setMaintenance((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const cost = updates.cost !== undefined ? Number(updates.cost) : m.cost;
          const paid = updates.paidAmount !== undefined ? Number(updates.paidAmount) : m.paidAmount;
          const updated = {
            ...m,
            ...updates,
            cost,
            paidAmount: paid,
            remainingAmount: Math.max(0, cost - paid),
            updatedAt: new Date().toISOString(),
          };
          if (updates.status === 'Terminé' && m.status !== 'Terminé') {
            triggerNotification('maintenance', 'Intervention terminée', `L'intervention ${m.interventionNumber} (${m.clientName}) est prête pour livraison.`, 'maintenance');
          }
          return updated;
        }
        return m;
      })
    );
    addAuditLog('MAJ_INTERVENTION', 'MAINTENANCE', `Mise à jour intervention ID: ${id}`);
  };

  const deleteMaintenance = (id: string) => {
    setMaintenance((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('SUPPRESSION_INTERVENTION', 'MAINTENANCE', `Intervention supprimée ID: ${id}`);
  };

  // IMPRIMERIE
  const addPrintOrder = (item: Omit<PrintOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => {
    const num = `IMP-2026-${String(printOrders.length + 121).padStart(4, '0')}`;
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    const newOrder: PrintOrder = {
      ...item,
      id: `prt_${Date.now()}`,
      orderNumber: num,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: remaining,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPrintOrders((prev) => [newOrder, ...prev]);
    addAuditLog('NOUVELLE_COMMANDE_PRINT', 'IMPRIMERIE', `Commande ${num} enregistrée pour ${item.clientName} (${item.documentName})`);
    triggerNotification('order', 'Nouvelle commande impression', `${num} - ${item.clientName} : ${total.toLocaleString('fr-FR')} FCFA`, 'imprimerie');

    // Create Invoice automatically
    const invNum = `FAC-2026-${String(invoices.length + 94).padStart(4, '0')}`;
    const client = clients.find((c) => c.id === item.clientId);
    const invoice: Invoice = {
      id: `fac_${Date.now()}`,
      invoiceNumber: invNum,
      orderId: newOrder.id,
      category: 'imprimerie',
      clientId: item.clientId,
      clientName: item.clientName,
      clientPhone: item.phone,
      clientAddress: client?.address || 'Daloa',
      date: item.orderDate,
      dueDate: item.deliveryDate,
      items: [
        {
          id: `item_${Date.now()}`,
          description: `${item.serviceType} - ${item.documentName} (${item.pageCount} p. x ${item.copyCount} ex.)`,
          quantity: item.copyCount,
          unitPrice: Math.round(total / (item.copyCount || 1)),
          total,
        },
      ],
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: remaining,
      status: paid >= total ? 'Payé' : paid > 0 ? 'Partiellement payé' : 'Non payé',
      paymentMethod: item.paymentMethod,
      notes: item.observations || 'Facture générée automatiquement.',
      createdBy: currentUser.name,
      createdByRole: currentUser.role,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [invoice, ...prev]);

    if (paid > 0) {
      addPayment({
        invoiceId: invoice.id,
        orderId: newOrder.id,
        category: 'imprimerie',
        clientId: item.clientId,
        clientName: item.clientName,
        amount: paid,
        date: item.orderDate,
        paymentMethod: (item.paymentMethod as PaymentMethod) || 'Espèces',
        reference: `PAY-${num}`,
        notes: `Paiement / Acompte commande ${num}`,
        receivedBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }
  };

  const updatePrintOrder = (id: string, updates: Partial<PrintOrder>) => {
    setPrintOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const total = updates.totalAmount !== undefined ? Number(updates.totalAmount) : o.totalAmount;
          const paid = updates.paidAmount !== undefined ? Number(updates.paidAmount) : o.paidAmount;
          const updated = {
            ...o,
            ...updates,
            totalAmount: total,
            paidAmount: paid,
            remainingAmount: Math.max(0, total - paid),
            updatedAt: new Date().toISOString(),
          };
          if (updates.status === 'Terminé' && o.status !== 'Terminé') {
            triggerNotification('order', 'Impression terminée', `La commande ${o.orderNumber} (${o.clientName}) est prête.`, 'imprimerie');
          }
          return updated;
        }
        return o;
      })
    );
    addAuditLog('MAJ_COMMANDE_PRINT', 'IMPRIMERIE', `Mise à jour commande print ID: ${id}`);
  };

  const deletePrintOrder = (id: string) => {
    setPrintOrders((prev) => prev.filter((o) => o.id !== id));
    addAuditLog('SUPPRESSION_PRINT', 'IMPRIMERIE', `Suppression commande print ID: ${id}`);
  };

  // Consommation de stock pour commande d'impression
  const consumeStockForPrint = (orderId: string, items: Array<{ productId: string; quantity: number }>) => {
    const order = printOrders.find((o) => o.id === orderId);
    if (!order) return;

    items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || item.quantity <= 0) return;

      const before = prod.currentStock;
      const after = Math.max(0, before - item.quantity);

      // Update product
      setProducts((prev) =>
        prev.map((p) => (p.id === item.productId ? { ...p, currentStock: after } : p))
      );

      // Add Stock Movement
      const mvt: StockMovement = {
        id: `mvt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: prod.id,
        productName: prod.name,
        movementType: 'SORTIE',
        quantity: item.quantity,
        stockBefore: before,
        stockAfter: after,
        date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
        reason: 'Produit utilisé pour impression',
        responsible: currentUser.name,
        supplierOrOrder: `Commande ${order.orderNumber} (${order.clientName})`,
        observations: `Consommation validée pour ${order.documentName}`,
        createdAt: new Date().toISOString(),
      };
      setStockMovements((prev) => [mvt, ...prev]);

      // Check alerts
      checkStockAlerts({ ...prod, currentStock: after });
    });

    addAuditLog('CONSOMMATION_STOCK_PRINT', 'STOCKS', `Sortie de stock enregistrée pour la commande ${order.orderNumber}`);
  };

  // GRAPHISME
  const addGraphicProject = (item: Omit<GraphicProject, 'id' | 'projectNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => {
    const num = `GRP-2026-${String(graphicProjects.length + 70).padStart(4, '0')}`;
    const price = Number(item.price) || 0;
    const advance = Number(item.advance) || 0;
    const remaining = Math.max(0, price - advance);

    const newProject: GraphicProject = {
      ...item,
      id: `grp_${Date.now()}`,
      projectNumber: num,
      price,
      advance,
      remainingAmount: remaining,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGraphicProjects((prev) => [newProject, ...prev]);
    addAuditLog('NOUVEAU_PROJET_GRAPHISME', 'GRAPHISME', `Projet ${num} enregistré pour ${item.clientName} (${item.creationType})`);
    triggerNotification('graphisme', 'Nouveau projet graphisme', `${num} - ${item.clientName} (${item.creationType})`, 'graphisme');

    if (advance > 0) {
      addPayment({
        category: 'graphisme',
        clientId: item.clientId,
        clientName: item.clientName,
        amount: advance,
        date: item.orderDate,
        paymentMethod: 'Espèces',
        reference: `PAY-${num}`,
        notes: `Acompte projet graphique ${num}`,
        receivedBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }
  };

  const updateGraphicProject = (id: string, updates: Partial<GraphicProject>) => {
    setGraphicProjects((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const price = updates.price !== undefined ? Number(updates.price) : g.price;
          const advance = updates.advance !== undefined ? Number(updates.advance) : g.advance;
          const updated = {
            ...g,
            ...updates,
            price,
            advance,
            remainingAmount: Math.max(0, price - advance),
            updatedAt: new Date().toISOString(),
          };
          if (updates.status === 'Validé' && g.status !== 'Validé') {
            triggerNotification('graphisme', 'Visuel Validé !', `Le projet ${g.projectNumber} (${g.clientName}) a été validé par le client.`, 'graphisme');
          }
          return updated;
        }
        return g;
      })
    );
    addAuditLog('MAJ_PROJET_GRAPHISME', 'GRAPHISME', `Mise à jour projet graphique ID: ${id}`);
  };

  const deleteGraphicProject = (id: string) => {
    setGraphicProjects((prev) => prev.filter((g) => g.id !== id));
    addAuditLog('SUPPRESSION_GRAPHISME', 'GRAPHISME', `Suppression projet graphisme ID: ${id}`);
  };

  // SOLUTIONS NUMÉRIQUES
  const addDigitalProject = (item: Omit<DigitalProject, 'id' | 'projectNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => {
    const num = `NUM-2026-${String(digitalProjects.length + 18).padStart(4, '0')}`;
    const budget = Number(item.budget) || 0;
    const advance = Number(item.advance) || 0;
    const remaining = Math.max(0, budget - advance);

    const newProject: DigitalProject = {
      ...item,
      id: `dig_${Date.now()}`,
      projectNumber: num,
      budget,
      advance,
      remainingAmount: remaining,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDigitalProjects((prev) => [newProject, ...prev]);
    addAuditLog('NOUVEAU_PROJET_NUMERIQUE', 'NUMERIQUE', `Projet numérique ${num} créé pour ${item.clientName} (${item.solutionType})`);
    triggerNotification('order', 'Nouveau projet numérique', `${num} - ${item.clientName} (${item.solutionType}) : ${budget.toLocaleString('fr-FR')} FCFA`, 'solutions_numeriques');

    if (advance > 0) {
      addPayment({
        category: 'solutions_numeriques',
        clientId: item.clientId,
        clientName: item.clientName,
        amount: advance,
        date: item.startDate,
        paymentMethod: 'Virement',
        reference: `PAY-${num}`,
        notes: `Acompte projet numérique ${num}`,
        receivedBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }
  };

  const updateDigitalProject = (id: string, updates: Partial<DigitalProject>) => {
    setDigitalProjects((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const budget = updates.budget !== undefined ? Number(updates.budget) : d.budget;
          const advance = updates.advance !== undefined ? Number(updates.advance) : d.advance;
          return {
            ...d,
            ...updates,
            budget,
            advance,
            remainingAmount: Math.max(0, budget - advance),
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );
    addAuditLog('MAJ_PROJET_NUMERIQUE', 'NUMERIQUE', `Mise à jour projet numérique ID: ${id}`);
  };

  const deleteDigitalProject = (id: string) => {
    setDigitalProjects((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('SUPPRESSION_NUMERIQUE', 'NUMERIQUE', `Suppression projet numérique ID: ${id}`);
  };

  // TEE-SHIRT
  const addTshirtOrder = (item: Omit<TshirtOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount'>) => {
    const num = `TSH-2026-${String(tshirtOrders.length + 40).padStart(4, '0')}`;
    const total = Number(item.totalAmount) || 0;
    const advance = Number(item.advance) || 0;
    const remaining = Math.max(0, total - advance);

    const newOrder: TshirtOrder = {
      ...item,
      id: `tsh_${Date.now()}`,
      orderNumber: num,
      totalAmount: total,
      advance,
      remainingAmount: remaining,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTshirtOrders((prev) => [newOrder, ...prev]);
    addAuditLog('NOUVELLE_COMMANDE_TSHIRT', 'TEESHIRT', `Commande tee-shirts ${num} créée pour ${item.clientName} (${item.quantity} pièces)`);
    triggerNotification('order', 'Nouvelle commande Tee-shirts', `${num} - ${item.clientName} (${item.quantity} pcs)`, 'teeshirt');

    // Create Invoice
    const invNum = `FAC-2026-${String(invoices.length + 94).padStart(4, '0')}`;
    const client = clients.find((c) => c.id === item.clientId);
    const invoice: Invoice = {
      id: `fac_${Date.now()}`,
      invoiceNumber: invNum,
      orderId: newOrder.id,
      category: 'teeshirt',
      clientId: item.clientId,
      clientName: item.clientName,
      clientPhone: item.phone,
      clientAddress: client?.address || 'Daloa',
      date: item.orderDate,
      dueDate: item.expectedDate,
      items: [
        {
          id: `item_${Date.now()}`,
          description: `Tee-shirts ${item.tshirtColor} (${item.size}) - Impression ${item.printType} "${item.designName}"`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total,
        },
      ],
      totalAmount: total,
      paidAmount: advance,
      remainingAmount: remaining,
      status: advance >= total ? 'Payé' : advance > 0 ? 'Partiellement payé' : 'Non payé',
      paymentMethod: 'Espèces',
      notes: item.observations || 'Facture commande tee-shirts.',
      createdBy: currentUser.name,
      createdByRole: currentUser.role,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [invoice, ...prev]);

    if (advance > 0) {
      addPayment({
        invoiceId: invoice.id,
        orderId: newOrder.id,
        category: 'teeshirt',
        clientId: item.clientId,
        clientName: item.clientName,
        amount: advance,
        date: item.orderDate,
        paymentMethod: 'Orange Money',
        reference: `PAY-${num}`,
        notes: `Acompte commande tee-shirts ${num}`,
        receivedBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }
  };

  const updateTshirtOrder = (id: string, updates: Partial<TshirtOrder>) => {
    setTshirtOrders((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const total = updates.totalAmount !== undefined ? Number(updates.totalAmount) : t.totalAmount;
          const advance = updates.advance !== undefined ? Number(updates.advance) : t.advance;
          return {
            ...t,
            ...updates,
            totalAmount: total,
            advance,
            remainingAmount: Math.max(0, total - advance),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    addAuditLog('MAJ_COMMANDE_TSHIRT', 'TEESHIRT', `Mise à jour commande tee-shirts ID: ${id}`);
  };

  const deleteTshirtOrder = (id: string) => {
    setTshirtOrders((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('SUPPRESSION_TSHIRT', 'TEESHIRT', `Suppression commande tee-shirts ID: ${id}`);
  };

  // Consommation de stock pour tee-shirts
  const consumeStockForTshirt = (orderId: string, items: Array<{ productId: string; quantity: number }>) => {
    const order = tshirtOrders.find((t) => t.id === orderId);
    if (!order) return;

    items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || item.quantity <= 0) return;

      const before = prod.currentStock;
      const after = Math.max(0, before - item.quantity);

      setProducts((prev) =>
        prev.map((p) => (p.id === item.productId ? { ...p, currentStock: after } : p))
      );

      const mvt: StockMovement = {
        id: `mvt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: prod.id,
        productName: prod.name,
        movementType: 'SORTIE',
        quantity: item.quantity,
        stockBefore: before,
        stockAfter: after,
        date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
        reason: 'Produit utilisé pour tee-shirt',
        responsible: currentUser.name,
        supplierOrOrder: `Commande ${order.orderNumber} (${order.clientName})`,
        observations: `Prélèvement textiles pour impression DTF/sérigraphie`,
        createdAt: new Date().toISOString(),
      };
      setStockMovements((prev) => [mvt, ...prev]);

      checkStockAlerts({ ...prod, currentStock: after });
    });

    addAuditLog('CONSOMMATION_STOCK_TSHIRT', 'STOCKS', `Sortie de stock validée pour tee-shirts commande ${order.orderNumber}`);
  };

  // UNIFIED ORDERS
  const getAllOrders = (): UnifiedOrder[] => {
    const list: UnifiedOrder[] = [];

    // Print
    printOrders.forEach((p) => {
      list.push({
        id: p.id,
        orderNumber: p.orderNumber,
        category: 'imprimerie',
        categoryLabel: 'Imprimerie & Bureautique',
        categoryIcon: 'Printer',
        clientId: p.clientId,
        clientName: p.clientName,
        clientPhone: p.phone,
        title: `${p.serviceType} - ${p.documentName}`,
        totalAmount: p.totalAmount,
        paidAmount: p.paidAmount,
        remainingAmount: p.remainingAmount,
        status: p.status,
        date: p.orderDate,
        deliveryDate: p.deliveryDate,
        createdBy: p.createdBy,
        createdByRole: p.createdByRole,
        createdAt: p.createdAt,
      });
    });

    // Maintenance
    maintenance.forEach((m) => {
      list.push({
        id: m.id,
        orderNumber: m.interventionNumber,
        category: 'maintenance',
        categoryLabel: 'Maintenance Informatique',
        categoryIcon: 'Wrench',
        clientId: m.clientId,
        clientName: m.clientName,
        clientPhone: m.phone,
        title: `${m.hardwareConcerned} - ${m.problemType}`,
        totalAmount: m.cost,
        paidAmount: m.paidAmount,
        remainingAmount: m.remainingAmount,
        status: m.status,
        date: m.depositDate,
        deliveryDate: m.deliveryDate || 'Non spécifié',
        createdBy: m.createdBy,
        createdByRole: m.createdByRole,
        createdAt: m.createdAt,
      });
    });

    // Graphic
    graphicProjects.forEach((g) => {
      list.push({
        id: g.id,
        orderNumber: g.projectNumber,
        category: 'graphisme',
        categoryLabel: 'Graphisme & Communication',
        categoryIcon: 'Palette',
        clientId: g.clientId,
        clientName: g.clientName,
        clientPhone: g.phone,
        title: `${g.creationType} - ${g.description}`,
        totalAmount: g.price,
        paidAmount: g.advance,
        remainingAmount: g.remainingAmount,
        status: g.status,
        date: g.orderDate,
        deliveryDate: g.expectedDeliveryDate,
        createdBy: g.createdBy,
        createdByRole: g.createdByRole,
        createdAt: g.createdAt,
      });
    });

    // Digital
    digitalProjects.forEach((d) => {
      list.push({
        id: d.id,
        orderNumber: d.projectNumber,
        category: 'solutions_numeriques',
        categoryLabel: 'Solutions Numériques',
        categoryIcon: 'Laptop',
        clientId: d.clientId,
        clientName: d.clientName,
        clientPhone: d.phone,
        title: `${d.solutionType} - ${d.description}`,
        totalAmount: d.budget,
        paidAmount: d.advance,
        remainingAmount: d.remainingAmount,
        status: d.status,
        date: d.startDate,
        deliveryDate: d.expectedDeliveryDate,
        createdBy: d.createdBy,
        createdByRole: d.createdByRole,
        createdAt: d.createdAt,
      });
    });

    // Tshirt
    tshirtOrders.forEach((t) => {
      list.push({
        id: t.id,
        orderNumber: t.orderNumber,
        category: 'teeshirt',
        categoryLabel: 'Impression Tee-shirt',
        categoryIcon: 'Shirt',
        clientId: t.clientId,
        clientName: t.clientName,
        clientPhone: t.phone,
        title: `${t.quantity} Tee-shirts ${t.tshirtColor} (${t.designName})`,
        totalAmount: t.totalAmount,
        paidAmount: t.advance,
        remainingAmount: t.remainingAmount,
        status: t.status,
        date: t.orderDate,
        deliveryDate: t.expectedDate,
        createdBy: t.createdBy,
        createdByRole: t.createdByRole,
        createdAt: t.createdAt,
      });
    });

    // Vente de Fournitures Informatiques
    supplySales.forEach((s) => {
      const summaryItems = s.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ');
      list.push({
        id: s.id,
        orderNumber: s.saleNumber,
        category: 'fournitures',
        categoryLabel: 'Vente Fournitures Informatiques',
        categoryIcon: 'ShoppingBag',
        clientId: s.clientId,
        clientName: s.clientName,
        clientPhone: s.clientPhone,
        title: summaryItems || 'Fournitures de bureau & informatique',
        totalAmount: s.totalAmount,
        paidAmount: s.paidAmount,
        remainingAmount: 0,
        status: s.status === 'Payé' ? 'Livré' : 'Annulé',
        date: s.date.split('T')[0],
        deliveryDate: s.date.split('T')[0],
        createdBy: s.sellerName,
        createdByRole: s.sellerRole,
        createdAt: s.createdAt,
      });
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // QUOTES
  const addQuote = (item: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>) => {
    const num = `DEV-2026-${String(quotes.length + 53).padStart(4, '0')}`;
    const newQuote: Quote = {
      ...item,
      id: `dev_${Date.now()}`,
      quoteNumber: num,
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);
    addAuditLog('CREATION_DEVIS', 'DEVIS', `Création devis ${num} pour ${item.clientName} (${item.totalAmount} FCFA)`);
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q))
    );
    addAuditLog('MAJ_DEVIS', 'DEVIS', `Mise à jour devis ID: ${id}`);
  };

  const convertQuoteToOrder = (quoteId: string) => {
    const q = quotes.find((x) => x.id === quoteId);
    if (!q) return;

    // Convert according to category
    if (q.category === 'teeshirt') {
      addTshirtOrder({
        clientId: q.clientId,
        clientName: q.clientName,
        phone: q.clientPhone,
        designName: q.title,
        tshirtColor: 'Blanc / Selon devis',
        size: 'Mixte',
        quantity: q.items.reduce((sum, it) => sum + it.quantity, 0) || 50,
        printType: 'DTF / Sérigraphie',
        unitPrice: Math.round(q.totalAmount / (q.items[0]?.quantity || 1)),
        totalAmount: q.totalAmount,
        advance: 0,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDate: q.validUntil,
        status: 'Nouvelle commande',
        observations: `Transformé depuis devis ${q.quoteNumber}`,
      });
    } else if (q.category === 'imprimerie') {
      addPrintOrder({
        clientId: q.clientId,
        clientName: q.clientName,
        phone: q.clientPhone,
        serviceType: 'Conception et impression de documents professionnels',
        documentName: q.title,
        paperFormat: 'A4',
        pageCount: 1,
        copyCount: q.items[0]?.quantity || 100,
        colorType: 'Couleur',
        printingSide: 'Recto',
        unitPrice: q.items[0]?.unitPrice || 100,
        totalAmount: q.totalAmount,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: q.validUntil,
        status: 'En attente',
        paymentMethod: 'Espèces',
        paidAmount: 0,
        observations: `Transformé depuis devis ${q.quoteNumber}`,
      });
    } else if (q.category === 'maintenance') {
      addMaintenance({
        clientId: q.clientId,
        clientName: q.clientName,
        phone: q.clientPhone,
        depositDate: new Date().toISOString().split('T')[0],
        problemType: q.title,
        diagnostic: q.notes,
        interventionDone: 'En attente',
        hardwareConcerned: q.items[0]?.description || 'Matériel client',
        technician: 'Patrick N’Guessan',
        cost: q.totalAmount,
        paidAmount: 0,
        status: 'Reçu',
        observations: `Transformé depuis devis ${q.quoteNumber}`,
      });
    } else if (q.category === 'graphisme') {
      addGraphicProject({
        clientId: q.clientId,
        clientName: q.clientName,
        phone: q.clientPhone,
        creationType: 'Conception de supports de communication',
        description: q.title,
        dimensions: 'Standard',
        fileFormat: 'PDF, PNG',
        graphicDesigner: 'Ange Koffi',
        price: q.totalAmount,
        advance: 0,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: q.validUntil,
        modificationCount: 0,
        status: 'Nouvelle demande',
      });
    } else {
      addDigitalProject({
        clientId: q.clientId,
        clientName: q.clientName,
        phone: q.clientPhone,
        solutionType: 'Création de sites web',
        description: q.title,
        projectManager: 'Koffi Dorgeles',
        budget: q.totalAmount,
        advance: 0,
        startDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: q.validUntil,
        status: 'Demande',
        notes: `Transformé depuis devis ${q.quoteNumber}`,
      });
    }

    updateQuote(quoteId, { status: 'Transformé en commande' });
    triggerNotification('quote', 'Devis converti en commande', `Le devis ${q.quoteNumber} a été validé et converti avec succès.`, 'commandes');
  };

  // INVOICES & PAYMENTS
  const addInvoice = (item: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'remainingAmount'>) => {
    const num = `FAC-2026-${String(invoices.length + 95).padStart(4, '0')}`;
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    const newInv: Invoice = {
      ...item,
      id: `fac_${Date.now()}`,
      invoiceNumber: num,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: remaining,
      status: paid >= total ? 'Payé' : paid > 0 ? 'Partiellement payé' : 'Non payé',
      createdBy: item.createdBy || currentUser.name,
      createdByRole: item.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    addAuditLog('CREATION_FACTURE', 'FACTURATION', `Facture ${num} générée pour ${item.clientName} (${total} FCFA)`);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'paymentNumber' | 'createdAt'>) => {
    const num = `PAY-2026-${String(payments.length + 155).padStart(4, '0')}`;
    const amount = Number(paymentData.amount) || 0;

    const newPay: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      paymentNumber: num,
      amount,
      receivedBy: paymentData.receivedBy || currentUser.name,
      createdByRole: paymentData.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPay, ...prev]);

    // Update invoice if linked
    if (paymentData.invoiceId) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === paymentData.invoiceId) {
            const newPaid = inv.paidAmount + amount;
            const newRem = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              remainingAmount: newRem,
              status: newPaid >= inv.totalAmount ? 'Payé' : 'Partiellement payé',
            };
          }
          return inv;
        })
      );
    }

    // Record in Caisse as Inflow
    const cashMvt: CashMovement = {
      id: `csh_${Date.now()}`,
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      type: 'ENTREE',
      source: 'PAIEMENT_CLIENT',
      amount,
      paymentMethod: paymentData.paymentMethod,
      reference: newPay.paymentNumber,
      label: `Encaissement ${paymentData.clientName} - ${paymentData.notes || 'Paiement'}`,
      responsible: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    setCashMovements((prev) => [cashMvt, ...prev]);

    addAuditLog('ENCAISSEMENT_CLIENT', 'FINANCES', `Paiement ${num} de ${amount.toLocaleString('fr-FR')} FCFA reçu par ${paymentData.paymentMethod}`);
    triggerNotification('payment', 'Paiement reçu', `${amount.toLocaleString('fr-FR')} FCFA reçus de ${paymentData.clientName} (${paymentData.paymentMethod})`, 'facturation');
  };

  // EXPENSES
  const addExpense = (expenseData: Omit<Expense, 'id' | 'expenseNumber' | 'createdAt'>) => {
    const num = `DEP-2026-${String(expenses.length + 34).padStart(4, '0')}`;
    const amount = Number(expenseData.amount) || 0;

    const newExp: Expense = {
      ...expenseData,
      id: `dep_${Date.now()}`,
      expenseNumber: num,
      amount,
      registeredBy: expenseData.registeredBy || currentUser.name,
      createdByRole: expenseData.createdByRole || currentUser.role,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExp, ...prev]);

    // Add to Caisse as Outflow
    const cashMvt: CashMovement = {
      id: `csh_${Date.now()}`,
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      type: 'SORTIE',
      source: 'DEPENSE',
      amount,
      paymentMethod: expenseData.paymentMethod,
      reference: num,
      label: `Dépense: ${expenseData.label} (${expenseData.beneficiary})`,
      responsible: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    setCashMovements((prev) => [cashMvt, ...prev]);

    addAuditLog('CREATION_DEPENSE', 'DEPENSES', `Dépense ${num} enregistrée : ${amount.toLocaleString('fr-FR')} FCFA (${expenseData.label})`);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('SUPPRESSION_DEPENSE', 'DEPENSES', `Suppression dépense ID: ${id}`);
  };

  const resetExpenses = () => {
    setExpenses([]);
    setCharges([]);
    setContingencies([]);
    setCashMovements((prev) =>
      prev.filter(
        (m) => m.source !== 'DEPENSE' && m.source !== 'CHARGE' && m.source !== 'IMPREVU'
      )
    );
    localStorage.removeItem(`${STORAGE_KEY}_expenses`);
    localStorage.removeItem(`${STORAGE_KEY}_charges`);
    localStorage.removeItem(`${STORAGE_KEY}_contingencies`);
    localStorage.setItem('sygema_ci_expenses_zero_applied_v1', 'true');
    addAuditLog('REMISE_A_ZERO', 'DEPENSES', 'Remise à zéro complète du registre des dépenses et décaissements');
  };

  // CHARGES
  const addCharge = (chargeData: Omit<Charge, 'id' | 'createdAt'>) => {
    const newCharge: Charge = {
      ...chargeData,
      id: `chg_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCharges((prev) => [newCharge, ...prev]);
    addAuditLog('CREATION_CHARGE', 'CHARGES', `Nouvelle charge ${newCharge.chargeType} : ${newCharge.label} (${newCharge.amount} FCFA)`);
  };

  const updateCharge = (id: string, updates: Partial<Charge>) => {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const payCharge = (chargeId: string, method: PaymentMethod) => {
    const charge = charges.find((c) => c.id === chargeId);
    if (!charge) return;

    // Create an Expense
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: charge.chargeType === 'FIXE' ? (charge.category as any) : 'Autres charges',
      label: `Règlement charge: ${charge.label}`,
      description: `Paiement échéance ${charge.dueDate}`,
      beneficiary: charge.label,
      amount: charge.amount,
      paymentMethod: method,
      observations: `Charge payée par ${currentUser.name}`,
      registeredBy: currentUser.name,
    });

    // Mark as Payée
    setCharges((prev) =>
      prev.map((c) => (c.id === chargeId ? { ...c, status: 'Payée' } : c))
    );

    triggerNotification('charge', 'Charge réglée', `La charge "${charge.label}" (${charge.amount.toLocaleString('fr-FR')} FCFA) a été acquittée.`, 'charges');
  };

  // IMPRÉVUS
  const addContingency = (item: Omit<Contingency, 'id' | 'createdAt'>) => {
    const newCont: Contingency = {
      ...item,
      id: `imp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setContingencies((prev) => [newCont, ...prev]);

    // Automatically create Expense & cash outflow
    addExpense({
      date: item.date,
      category: 'Imprévus',
      label: `[IMPRÉVU] ${item.reason}`,
      description: item.description,
      beneficiary: item.concernedParty,
      amount: item.amount,
      paymentMethod: item.paymentMethod,
      observations: item.observations,
      registeredBy: currentUser.name,
    });

    addAuditLog('CREATION_IMPREVU', 'IMPREVUS', `Dépense imprévue : ${item.reason} (${item.amount.toLocaleString('fr-FR')} FCFA)`);
  };

  // FOURNISSEURS & PRODUITS
  const addSupplier = (sData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const sup: Supplier = {
      ...sData,
      id: `sup_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [sup, ...prev]);
    addAuditLog('CREATION_FOURNISSEUR', 'FOURNISSEURS', `Nouveau fournisseur : ${sup.name}`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addProduct = (pData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const prod: Product = {
      ...pData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [prod, ...prev]);
    addAuditLog('CREATION_PRODUIT', 'PRODUITS', `Nouveau produit : ${prod.name} (${prod.code})`);
    checkStockAlerts(prod);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          checkStockAlerts(updated);
          return updated;
        }
        return p;
      })
    );
  };

  // STOCKS
  const addStockMovement = (mvtData: Omit<StockMovement, 'id' | 'createdAt' | 'stockBefore' | 'stockAfter'>) => {
    const prod = products.find((p) => p.id === mvtData.productId);
    if (!prod) return;

    const before = prod.currentStock;
    let after = before;
    if (mvtData.movementType === 'ENTREE') {
      after = before + mvtData.quantity;
    } else if (mvtData.movementType === 'SORTIE') {
      after = Math.max(0, before - mvtData.quantity);
    } else {
      after = mvtData.quantity; // Ajustement direct
    }

    const mvt: StockMovement = {
      ...mvtData,
      id: `mvt_${Date.now()}`,
      stockBefore: before,
      stockAfter: after,
      createdAt: new Date().toISOString(),
    };

    setStockMovements((prev) => [mvt, ...prev]);
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, currentStock: after } : p))
    );

    checkStockAlerts({ ...prod, currentStock: after });
    addAuditLog('MOUVEMENT_STOCK', 'STOCKS', `${mvtData.movementType} de ${mvtData.quantity} pour ${prod.name} (${mvtData.reason})`);
  };

  // VENTE FOURNITURES INFORMATIQUES & BUREAUTIQUES
  const addSupplySale = (saleData: {
    clientId?: string;
    clientName: string;
    clientPhone?: string;
    items: SupplySaleItem[];
    totalAmount: number;
    paidAmount: number;
    changeGiven: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): SupplySale => {
    const saleNum = `VNT-2026-${String(supplySales.length + 101).padStart(4, '0')}`;
    const newSale: SupplySale = {
      id: `sale_${Date.now()}`,
      saleNumber: saleNum,
      clientId: saleData.clientId || '',
      clientName: saleData.clientName || 'Client de passage (Comptoir)',
      clientPhone: saleData.clientPhone || '',
      items: saleData.items,
      totalAmount: saleData.totalAmount,
      paidAmount: saleData.paidAmount,
      changeGiven: saleData.changeGiven || 0,
      paymentMethod: saleData.paymentMethod,
      date: new Date().toISOString(),
      sellerName: currentUser.name,
      sellerRole: currentUser.role,
      notes: saleData.notes || '',
      status: 'Payé',
      createdAt: new Date().toISOString(),
    };

    setSupplySales((prev) => [newSale, ...prev]);

    // Automatically deduct stock for every sold supply
    saleData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
      if (prod) {
        addStockMovement({
          productId: prod.id,
          productName: prod.name,
          movementType: 'SORTIE',
          quantity: item.quantity,
          date: new Date().toISOString().split('T')[0],
          reason: 'Vente client',
          responsible: currentUser.name,
          supplierOrOrder: saleNum,
          observations: `Vente au comptoir ${saleNum} - ${newSale.clientName}`,
        });
      }
    });

    // Automatically record payment in caisse and revenue calculations
    addPayment({
      category: 'fournitures',
      clientId: newSale.clientId,
      clientName: newSale.clientName,
      amount: newSale.paidAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newSale.paymentMethod,
      reference: saleNum,
      notes: `Vente fournitures informatiques (${newSale.items.map((i) => `${i.productName} x${i.quantity}`).join(', ')})`,
      receivedBy: currentUser.name,
      createdByRole: currentUser.role,
    });

    addAuditLog(
      'VENTE_FOURNITURES',
      'FOURNITURES',
      `Vente ${saleNum} de ${newSale.totalAmount.toLocaleString('fr-FR')} FCFA effectuée par ${currentUser.name} (${newSale.items.length} article(s))`
    );

    triggerNotification(
      'payment',
      'Nouvelle vente de fournitures',
      `${saleNum} - ${newSale.clientName} : ${newSale.totalAmount.toLocaleString('fr-FR')} FCFA (${newSale.paymentMethod})`,
      'fournitures'
    );

    return newSale;
  };

  const cancelSupplySale = (saleId: string) => {
    setSupplySales((prev) =>
      prev.map((s) => {
        if (s.id === saleId) {
          // Re-credit stock
          s.items.forEach((item) => {
            const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
            if (prod) {
              addStockMovement({
                productId: prod.id,
                productName: prod.name,
                movementType: 'ENTREE',
                quantity: item.quantity,
                date: new Date().toISOString().split('T')[0],
                reason: 'Retour',
                responsible: currentUser.name,
                supplierOrOrder: s.saleNumber,
                observations: `Annulation de la vente ${s.saleNumber}`,
              });
            }
          });
          return { ...s, status: 'Annulé' as const };
        }
        return s;
      })
    );
    addAuditLog('ANNULATION_VENTE', 'FOURNITURES', `Vente ${saleId} annulée et stock réintégré`);
  };

  // ACHATS FOURNISSEURS
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'purchaseNumber' | 'createdAt' | 'remainingAmount'>) => {
    const num = `ACH-2026-${String(purchaseOrders.length + 14).padStart(4, '0')}`;
    const total = Number(poData.totalAmount) || 0;
    const paid = Number(poData.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    const po: PurchaseOrder = {
      ...poData,
      id: `ach_${Date.now()}`,
      purchaseNumber: num,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: remaining,
      createdAt: new Date().toISOString(),
    };
    setPurchaseOrders((prev) => [po, ...prev]);
    addAuditLog('CREATION_ACHAT', 'ACHATS', `Commande fournisseur ${num} créée pour ${poData.supplierName} (${total} FCFA)`);

    // If initial payment was made
    if (paid > 0) {
      addExpense({
        date: poData.date,
        category: 'Achat de consommables',
        label: `Acompte achat ${num} (${poData.supplierName})`,
        description: `Règlement partiel commande fournisseur`,
        beneficiary: poData.supplierName,
        amount: paid,
        paymentMethod: 'Wave',
        purchaseOrderId: po.id,
        observations: `Bon d'achat ${num}`,
        registeredBy: currentUser.name,
      });
    }
  };

  const receivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po || po.status === 'Reçu') return;

    // 1. Update purchase order status
    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'Reçu',
              receivedDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    // 2. Increment stock for all items & create stock movements
    po.items.forEach((item) => {
      const prod = products.find((pr) => pr.id === item.productId);
      if (!prod) return;

      const before = prod.currentStock;
      const after = before + item.quantity;

      setProducts((prev) =>
        prev.map((pr) => (pr.id === item.productId ? { ...pr, currentStock: after } : pr))
      );

      const mvt: StockMovement = {
        id: `mvt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: prod.id,
        productName: prod.name,
        movementType: 'ENTREE',
        quantity: item.quantity,
        stockBefore: before,
        stockAfter: after,
        date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
        reason: 'Achat fournisseur',
        responsible: currentUser.name,
        supplierOrOrder: `Bon d'achat ${po.purchaseNumber} (${po.supplierName})`,
        observations: `Réception conforme et entrée en stock`,
        createdAt: new Date().toISOString(),
      };
      setStockMovements((prev) => [mvt, ...prev]);
    });

    // 3. If remainingAmount > 0, create expense for the remaining balance or update debt
    if (po.remainingAmount > 0) {
      addExpense({
        date: new Date().toISOString().split('T')[0],
        category: 'Achat de consommables',
        label: `Solde réception achat ${po.purchaseNumber} (${po.supplierName})`,
        description: `Règlement du solde à la réception des produits`,
        beneficiary: po.supplierName,
        amount: po.remainingAmount,
        paymentMethod: 'Espèces',
        purchaseOrderId: po.id,
        observations: `Solde bon ${po.purchaseNumber}`,
        registeredBy: currentUser.name,
      });

      setPurchaseOrders((prev) =>
        prev.map((p) =>
          p.id === poId
            ? { ...p, paidAmount: p.totalAmount, remainingAmount: 0 }
            : p
        )
      );
    }

    addAuditLog('RECEPTION_ACHAT', 'ACHATS', `Réception confirmée bon ${po.purchaseNumber} - Entrée en stock effectuée`);
    triggerNotification('stock', 'Réception commande fournisseur', `Le bon ${po.purchaseNumber} a été réceptionné. Les stocks ont été incrémentés.`, 'stocks');
  };

  // CAISSE
  const getCashBalance = () => {
    let inflows = 0;
    let outflows = 0;

    cashMovements.forEach((m) => {
      if (m.type === 'ENTREE') inflows += m.amount;
      else if (m.type === 'SORTIE') outflows += m.amount;
    });

    const initial = cashRegisterCloses[0]?.actualBalance || 0;
    const theoretical = initial + inflows - outflows;

    return { theoretical, inflows, outflows };
  };

  const closeCashRegister = (actualBalance: number, notes: string) => {
    const { theoretical, inflows, outflows } = getCashBalance();
    const diff = actualBalance - theoretical;

    const closeRec: CashRegisterClose = {
      id: `clt_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      closedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      responsible: currentUser.name,
      initialBalance: cashRegisterCloses[0]?.actualBalance || 0,
      totalInflows: inflows,
      totalOutflows: outflows,
      theoreticalBalance: theoretical,
      actualBalance,
      difference: diff,
      observations: notes,
      createdAt: new Date().toISOString(),
    };

    setCashRegisterCloses((prev) => [closeRec, ...prev]);
    addAuditLog('CLOTURE_CAISSE', 'CAISSE', `Clôture de caisse du ${closeRec.date}. Réel: ${actualBalance} FCFA, Écart: ${diff} FCFA`);
    triggerNotification('payment', 'Clôture de Caisse effectuée', `Caisse clôturée par ${currentUser.name}. Solde: ${actualBalance.toLocaleString('fr-FR')} FCFA.`, 'caisse');
  };

  // USERS
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, user]);
    addAuditLog('CREATION_UTILISATEUR', 'UTILISATEURS', `Création compte utilisateur : ${user.name} (${user.role})`);
  };

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const updateCompany = (info: Partial<CompanyInfo>) => {
    setCompany((prev) => ({ ...prev, ...info }));
    addAuditLog('MAJ_PARAMETRES', 'PARAMETRES', `Mise à jour des informations de l'entreprise`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCompany(initialCompanyInfo);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setClients(initialClients);
    setMaintenance(initialMaintenance);
    setPrintOrders(initialPrintOrders);
    setGraphicProjects(initialGraphicProjects);
    setDigitalProjects(initialDigitalProjects);
    setTshirtOrders(initialTshirtOrders);
    setQuotes(initialQuotes);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setCharges(initialCharges);
    setContingencies(initialContingencies);
    setSuppliers(initialSuppliers);
    setProducts(initialProducts);
    setSupplySales(initialSupplySales);
    setStockMovements(initialStockMovements);
    setPurchaseOrders(initialPurchaseOrders);
    setCashMovements(initialCashMovements);
    setCashRegisterCloses(initialCashRegisterCloses);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    addAuditLog('REINITIALISATION_DONNEES', 'SYSTÈME', 'Réinitialisation complète des données aux valeurs de démonstration');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('SUPPRESSION_PRODUIT', 'STOCKS', `Suppression produit ID: ${id}`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('SUPPRESSION_FOURNISSEUR', 'FOURNISSEURS', `Suppression fournisseur ID: ${id}`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    addAuditLog('MODIFICATION_UTILISATEUR', 'UTILISATEURS', `Mise à jour utilisateur ID: ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('SUPPRESSION_UTILISATEUR', 'UTILISATEURS', `Suppression utilisateur ID: ${id}`);
  };

  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Authentification Gérant : login gerant, mot de passe 1234
    if (cleanUser === 'gerant' && cleanPass === '1234') {
      let gUser = users.find((u) => u.username === 'gerant');
      if (!gUser) {
        gUser = initialUsers.find((u) => u.username === 'gerant') || {
          id: 'usr_gerant',
          name: 'Gérant Vente des Services',
          username: 'gerant',
          password: '1234',
          role: 'Gérant',
          active: true,
          createdAt: new Date().toISOString(),
        };
      }
      setCurrentUser(gUser);
      setIsAuthenticated(true);
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, 'gerant');
      addAuditLog('CONNEXION', 'AUTHENTIFICATION', `Connexion réussie du Gérant : ${gUser.name}`);
      return { success: true };
    }

    // Authentification Administrateur : login admin, mot de passe Voyage2026@
    if (cleanUser === 'admin' && cleanPass === 'Voyage2026@') {
      let aUser = users.find((u) => u.username === 'admin');
      if (!aUser) {
        aUser = initialUsers.find((u) => u.username === 'admin') || {
          id: 'usr_admin',
          name: 'Administrateur SYGEMA CI',
          username: 'admin',
          password: 'Voyage2026@',
          role: 'ADMIN',
          active: true,
          createdAt: new Date().toISOString(),
        };
      }
      setCurrentUser(aUser);
      setIsAuthenticated(true);
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, 'admin');
      addAuditLog('CONNEXION', 'AUTHENTIFICATION', `Connexion réussie de l'Administrateur : ${aUser.name}`);
      return { success: true };
    }

    // Vérification éventuelle d'autres comptes utilisateurs créés
    const found = users.find(
      (u) =>
        (u.username?.toLowerCase() === cleanUser || u.email?.toLowerCase() === cleanUser) &&
        (u.password === cleanPass || (!u.password && cleanPass === '1234'))
    );

    if (found) {
      if (!found.active) {
        return { success: false, message: 'Ce compte utilisateur est actuellement désactivé.' };
      }
      setCurrentUser(found);
      setIsAuthenticated(true);
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, found.username || found.id);
      addAuditLog('CONNEXION', 'AUTHENTIFICATION', `Connexion de ${found.name} (${found.role})`);
      return { success: true };
    }

    return {
      success: false,
      message: "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations de connexion.",
    };
  };

  const logout = () => {
    localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    setIsAuthenticated(false);
    addAuditLog('DECONNEXION', 'AUTHENTIFICATION', `Déconnexion de l'utilisateur ${currentUser.name}`);
  };

  const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const cashBalance = getCashBalance().theoretical;

  const branchRevenues: Record<string, number> = {
    'Imprimerie & Bureautique': printOrders.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
    'Vente Fournitures Informatiques': supplySales.reduce((sum, s) => sum + (s.paidAmount || 0), 0),
    'Maintenance Informatique': maintenance.reduce((sum, m) => sum + (m.paidAmount || 0), 0),
    'Graphisme & Communication': graphicProjects.reduce((sum, g) => sum + (g.paidAmount || 0), 0),
    'Solutions Numériques': digitalProjects.reduce((sum, d) => sum + (d.paidAmount || 0), 0),
    'Impression Tee-shirt': tshirtOrders.reduce((sum, t) => sum + (t.paidAmount || 0), 0),
  };

  return (
    <AppContext.Provider
      value={{
        company,
        updateCompany,
        companyInfo: company,
        updateCompanyInfo: updateCompany,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserActive,
        clients,
        addClient,
        updateClient,
        deleteClient,
        maintenance,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
        printOrders,
        addPrintOrder,
        updatePrintOrder,
        deletePrintOrder,
        consumeStockForPrint,
        graphicProjects,
        addGraphicProject,
        updateGraphicProject,
        deleteGraphicProject,
        digitalProjects,
        addDigitalProject,
        updateDigitalProject,
        deleteDigitalProject,
        tshirtOrders,
        addTshirtOrder,
        updateTshirtOrder,
        deleteTshirtOrder,
        consumeStockForTshirt,
        getAllOrders,
        quotes,
        addQuote,
        updateQuote,
        convertQuoteToOrder,
        invoices,
        addInvoice,
        updateInvoice,
        payments,
        addPayment,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        resetExpenses,
        charges,
        addCharge,
        updateCharge,
        payCharge,
        contingencies,
        addContingency,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        supplySales,
        addSupplySale,
        cancelSupplySale,
        stockMovements,
        addStockMovement,
        purchaseOrders,
        addPurchaseOrder,
        receivePurchaseOrder,
        cashMovements,
        cashRegisterCloses,
        closeCashRegister,
        getCashBalance,
        totalIncome,
        totalExpenses,
        netProfit,
        cashBalance,
        branchRevenues,
        notifications,
        markNotificationRead,
        clearNotifications,
        auditLogs,
        addAuditLog,
        resetAllData,
        syncStatus,
        lastSyncTime,
        forceSyncWithServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
