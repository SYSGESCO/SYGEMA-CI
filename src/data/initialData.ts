import {
  User,
  Client,
  MaintenanceIntervention,
  PrintOrder,
  GraphicProject,
  DigitalProject,
  TshirtOrder,
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
} from '../types';

export const initialCompanyInfo: CompanyInfo = {
  name: 'SYGEMA CI',
  activity: 'Imprimerie & Services Informatiques',
  slogan: "Votre partenaire pour tous vos besoins numériques et d'impression",
  phone: '05 66 59 45 49',
  whatsapp: '05 66 59 45 49',
  address: 'Daloa, Quartier Soleil 2, Côte d’Ivoire',
  email: 'contact@sygema.ci',
  rccm: 'CI-DAL-2023-B-4812',
  cc: '2309814 A',
};

export const initialUsers: User[] = [
  {
    id: 'usr_admin',
    name: 'Administrateur SYGEMA CI',
    username: 'admin',
    password: 'Voyage2026@',
    email: 'admin@sygema.ci',
    phone: '05 66 59 45 49',
    role: 'ADMIN',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_gerant',
    name: 'Gérant Vente des Services',
    username: 'gerant',
    password: '1234',
    email: 'gerant@sygema.ci',
    phone: '05 66 59 45 49',
    role: 'Gérant',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Toutes les données initialisées strictement à zéro
export const initialClients: Client[] = [];
export const initialMaintenance: MaintenanceIntervention[] = [];
export const initialPrintOrders: PrintOrder[] = [];
export const initialGraphicProjects: GraphicProject[] = [];
export const initialDigitalProjects: DigitalProject[] = [];
export const initialTshirtOrders: TshirtOrder[] = [];
export const initialQuotes: Quote[] = [];
export const initialInvoices: Invoice[] = [];
export const initialPayments: Payment[] = [];
export const initialExpenses: Expense[] = [];
export const initialCharges: Charge[] = [];
export const initialContingencies: Contingency[] = [];
export const initialSuppliers: Supplier[] = [];
export const initialProducts: Product[] = [];
export const initialStockMovements: StockMovement[] = [];
export const initialPurchaseOrders: PurchaseOrder[] = [];
export const initialCashMovements: CashMovement[] = [];
export const initialCashRegisterCloses: CashRegisterClose[] = [];
export const initialNotifications: AppNotification[] = [];
export const initialAuditLogs: AuditLog[] = [];
