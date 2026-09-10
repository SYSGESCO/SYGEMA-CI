export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'AGENT'
  | 'TECHNICIEN'
  | 'GRAPHISTE'
  | 'Administrateur'
  | 'Gérant'
  | 'Technicien'
  | 'Opérateur'
  | 'Graphiste';

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  avatar?: string;
  createdAt: string;
}

export type ClientType = 'Particulier' | 'Entreprise' | 'École' | 'Association' | 'Autre';

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  type: ClientType;
  notes?: string;
  createdAt: string;
}

// 1. Maintenance Informatique
export type MaintenanceStatus = 'Reçu' | 'En diagnostic' | 'En cours' | 'Terminé' | 'Livré';
export type MaintenanceProblemType = string;

export interface MaintenanceIntervention {
  id: string;
  interventionNumber: string; // INT-2026-XXXX
  clientId: string;
  clientName: string;
  phone: string;
  depositDate: string;
  problemType: string;
  diagnostic: string;
  interventionDone: string;
  hardwareConcerned: string; // Ex: Laptop HP Pavilion 15 Core i5
  technician: string;
  cost: number;
  paidAmount: number;
  remainingAmount: number;
  status: MaintenanceStatus;
  deliveryDate?: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Imprimerie & Bureautique
export type PrintStatus = 'En attente' | 'En cours' | 'Terminé' | 'Livré';
export type OrderStatus = PrintStatus;
export type PrintServiceType = string;
export type PaperFormat = 'A4' | 'A3' | 'A5' | 'Autre';
export type ColorType = 'Noir & blanc' | 'Couleur';
export type PrintingSide = 'Recto' | 'Recto-verso';

export interface PrintOrder {
  id: string;
  orderNumber: string; // IMP-2026-XXXX
  clientId: string;
  clientName: string;
  phone: string;
  serviceType: string; // Impression N&B, Impression couleur, Photocopie, Scan, Saisie, Mise en page, Reliure, Plastification, Conception doc pro
  documentName: string;
  paperFormat: 'A4' | 'A3' | 'A5' | 'Autre';
  pageCount: number;
  copyCount: number;
  colorType: 'Noir & blanc' | 'Couleur';
  printingSide: 'Recto' | 'Recto-verso';
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: PrintStatus;
  paymentMethod: string;
  paidAmount: number;
  remainingAmount: number;
  observations: string;
  consumedProducts?: Array<{ productId: string; quantity: number; productName: string }>;
  createdAt: string;
  updatedAt: string;
}

// 3. Graphisme & Communication
export type GraphicStatus = 'Nouvelle demande' | 'En conception' | 'En modification' | 'Validé' | 'Terminé' | 'Livré';
export type GraphicProjectStatus = GraphicStatus;
export type GraphicCreationType = string;

export interface GraphicProject {
  id: string;
  projectNumber: string; // GRP-2026-XXXX
  clientId: string;
  clientName: string;
  phone: string;
  creationType: string; // Logo, Affiche, Flyer, Carte de visite, Invitation, Bannière pub, Visuel WhatsApp, Visuel Facebook, Visuel réseaux sociaux, Support com
  description: string;
  dimensions: string; // Ex: 1080x1080px, A5, 2x1m
  fileFormat: string; // PNG, JPG, PDF, PSD, AI
  graphicDesigner: string;
  price: number;
  advance: number;
  remainingAmount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  previewUrl?: string;
  modificationCount: number;
  status: GraphicStatus;
  attachedFiles?: string[];
  createdAt: string;
  updatedAt: string;
}

// 4. Solutions Numériques
export type DigitalStatus = 'Demande' | 'Étude' | 'En développement' | 'Installation' | 'Tests' | 'Terminé' | 'Livré';
export type DigitalProjectStatus = DigitalStatus;
export type DigitalSolutionType = string;

export interface DigitalProject {
  id: string;
  projectNumber: string; // NUM-2026-XXXX
  clientId: string;
  clientName: string;
  phone: string;
  solutionType: string; // Création de sites web, Applications, Logiciels de gestion, Installation de réseaux, Configuration Wi-Fi & réseaux, E-mails pro, Assistance & accompagnement
  description: string;
  projectManager: string;
  budget: number;
  advance: number;
  remainingAmount: number;
  startDate: string;
  expectedDeliveryDate: string;
  status: DigitalStatus;
  notes: string;
  attachedFiles?: string[];
  createdAt: string;
  updatedAt: string;
}

// 5. Impression Tee-shirt
export type TshirtStatus = 'Nouvelle commande' | 'Design' | 'Validation' | 'Impression' | 'Terminé' | 'Livré';
export type TshirtPrintType = string;

export interface TshirtOrder {
  id: string;
  orderNumber: string; // TSH-2026-XXXX
  clientId: string;
  clientName: string;
  phone: string;
  designName: string;
  tshirtColor: string;
  size: string; // S, M, L, XL, XXL, Mixte
  quantity: number;
  printType: string; // DTF, Sérigraphie, Flocage, Sublimation, Broderie
  unitPrice: number;
  totalAmount: number;
  advance: number;
  remainingAmount: number;
  orderDate: string;
  expectedDate: string;
  status: TshirtStatus;
  observations: string;
  consumedProducts?: Array<{ productId: string; quantity: number; productName: string }>;
  createdAt: string;
  updatedAt: string;
}

// Global Order view
export type ServiceCategory = 'imprimerie' | 'maintenance' | 'graphisme' | 'solutions_numeriques' | 'teeshirt';
export type BranchType =
  | 'Imprimerie & Bureautique'
  | 'Maintenance Informatique'
  | 'Graphisme & Communication'
  | 'Solutions Numériques'
  | 'Impression Tee-shirt';

export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  category: ServiceCategory;
  categoryLabel: string;
  categoryIcon: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  date: string;
  deliveryDate: string;
  createdAt: string;
}

// Devis (Quotes)
export type QuoteStatus = 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Transformé en commande';

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string; // DEV-2026-XXXX
  clientId: string;
  clientName: string;
  clientPhone: string;
  category: ServiceCategory;
  title: string;
  items: QuoteItem[];
  totalAmount: number;
  status: QuoteStatus;
  validUntil: string;
  notes: string;
  convertedOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

// Facturation
export type InvoiceStatus = 'Non payé' | 'Partiellement payé' | 'Payé';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // FAC-2026-XXXX
  orderId?: string;
  category?: ServiceCategory;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes: string;
  createdAt: string;
}

// Paiements
export type PaymentMethod = 'Espèces' | 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Virement' | 'Chèque';

export interface Payment {
  id: string;
  paymentNumber: string; // PAY-2026-XXXX
  invoiceId?: string;
  orderId?: string;
  category?: ServiceCategory;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  reference: string;
  notes: string;
  receivedBy: string;
  createdAt: string;
}

// Dépenses
export type ExpenseCategory =
  | 'Achat de matériel'
  | 'Achat de consommables'
  | 'Consommables & Fournitures'
  | 'Fournitures de bureau'
  | 'Électricité'
  | 'Électricité (CIE)'
  | 'Internet'
  | 'Connexion Internet'
  | 'Transport'
  | 'Transport & Logistique'
  | 'Maintenance'
  | 'Maintenance Matériel'
  | 'Communication'
  | 'Salaires'
  | 'Salaires & Rémunérations'
  | 'Loyer'
  | 'Loyer & Local'
  | 'Autres charges'
  | 'Imprévus'
  | 'Imprévus & Urgences'
  | 'Autre';

export interface Expense {
  id: string;
  expenseNumber: string; // DEP-2026-XXXX
  date: string;
  category: ExpenseCategory;
  label: string;
  description: string;
  beneficiary: string;
  amount: number;
  paymentMethod: PaymentMethod;
  proofName?: string;
  observations: string;
  registeredBy: string;
  purchaseOrderId?: string;
  createdAt: string;
}

// Charges
export type ChargeType = 'FIXE' | 'VARIABLE';
export type ChargeFrequency = 'unique' | 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'annuelle';
export type ChargeStatus = 'Payée' | 'À payer' | 'En retard';

export interface Charge {
  id: string;
  label: string;
  chargeType: ChargeType;
  category: string;
  amount: number;
  frequency: ChargeFrequency;
  dueDate: string;
  status: ChargeStatus;
  responsible: string;
  observations: string;
  paidExpenseId?: string;
  createdAt: string;
}

// Imprévus
export interface Contingency {
  id: string;
  date: string;
  reason: string;
  description: string;
  category: string;
  amount: number;
  concernedParty: string;
  paymentMethod: PaymentMethod;
  proof?: string;
  responsible: string;
  observations: string;
  expenseId?: string;
  createdAt: string;
}

// Fournisseurs
export interface Supplier {
  id: string;
  name: string;
  company?: string;
  category?: string;
  contactPerson?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  type?: string; // Papeterie, Matériel informatique, Textiles, Encres & consommables, etc.
  suppliedProducts?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
}

export type StockCategory =
  | 'Papeterie'
  | 'Encre & Toner'
  | 'Reliure & Plastification'
  | 'Textile'
  | 'Pièces Informatiques'
  | 'Consommables';

// Produits & Consommables
export interface Product {
  id: string;
  code?: string; // Ex: PAP-A4-80G
  name: string;
  category: string; // Papier, Papier photo, Encre, Toner, Cartouches, Spirales, Plastiques, Reliure, Tee-shirts, Autre
  description?: string;
  unit: string; // Ramette, Pièce, Flacon, Boîte, Paquet
  purchasePrice: number;
  costPrice?: number;
  sellingPrice: number;
  supplierId?: string;
  supplierName?: string;
  supplier?: string;
  currentStock: number;
  minStock?: number;
  minStockAlert?: number;
  maxStock?: number;
  location?: string; // Étagère A1, Rayon Papier, Réserve
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mouvements de stock
export type StockMovementType = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
export type StockMovementReason =
  | 'Achat fournisseur'
  | 'Retour'
  | 'Ajustement positif'
  | 'Utilisation pour une commande'
  | 'Produit utilisé pour impression'
  | 'Produit utilisé pour tee-shirt'
  | 'Produit utilisé pour prestation'
  | 'Perte'
  | 'Produit endommagé'
  | 'Ajustement négatif';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  movementType: StockMovementType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  date: string;
  reason: StockMovementReason;
  responsible: string;
  supplierOrOrder?: string;
  observations: string;
  createdAt: string;
}

// Achats Fournisseurs
export type PurchaseStatus = 'Brouillon' | 'Commandé' | 'Partiellement reçu' | 'Reçu' | 'Annulé';

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  purchaseNumber: string; // ACH-2026-XXXX
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  expectedDeliveryDate: string;
  status: PurchaseStatus;
  notes: string;
  receivedDate?: string;
  createdAt: string;
}

// Caisse
export interface CashRegisterClose {
  id: string;
  date: string;
  closedAt: string;
  responsible: string;
  initialBalance: number;
  totalInflows: number;
  totalOutflows: number;
  theoreticalBalance: number;
  actualBalance: number;
  difference: number;
  observations: string;
  createdAt: string;
}

export interface CashMovement {
  id: string;
  date: string;
  type: 'ENTREE' | 'SORTIE';
  source: 'PAIEMENT_CLIENT' | 'DEPENSE' | 'CHARGE' | 'IMPREVU' | 'ACHAT_FOURNISSEUR' | 'AJUSTEMENT_CAISSE';
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  label: string;
  responsible: string;
  createdAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName: string;
  action: string;
  module?: string;
  entityType?: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

// Notifications
export interface AppNotification {
  id: string;
  type: 'order' | 'payment' | 'stock' | 'charge' | 'maintenance' | 'graphisme' | 'quote';
  title: string;
  message: string;
  read: boolean;
  date: string;
  targetView?: string;
}

// Company Info
export interface CompanyInfo {
  name: string;
  activity: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  rccm: string;
  cc: string;
}
