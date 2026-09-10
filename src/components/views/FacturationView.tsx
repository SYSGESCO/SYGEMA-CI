import React, { useState } from 'react';
import { useAppStore } from '../../data/store';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  FileText,
  Plus,
  Search,
  Printer,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Download,
  Filter,
  CreditCard,
} from 'lucide-react';
import {
  Invoice,
  Quote,
  Payment,
  PaymentMethod,
  BranchType,
  InvoiceStatus,
  QuoteStatus,
} from '../../types';
import { PrintableDocType } from '../PrintableDocumentModal';

interface FacturationViewProps {
  onOpenPrint: (doc: PrintableDocType) => void;
  initialTab?: 'factures' | 'devis' | 'paiements';
}

export const FacturationView: React.FC<FacturationViewProps> = ({
  onOpenPrint,
  initialTab = 'factures',
}) => {
  const {
    invoices,
    quotes,
    payments,
    clients,
    addInvoice,
    addQuote,
    convertQuoteToInvoice,
    addPayment,
    currentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'factures' | 'devis' | 'paiements'>(
    initialTab
  );
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  // Modal: Create Invoice
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    branch: 'Imprimerie & Bureautique' as BranchType,
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: 'Espèces' as PaymentMethod,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Modal: Create Quote
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    branch: 'Maintenance Informatique' as BranchType,
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    totalAmount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  // Modal: Record Payment
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Espèces');
  const [paymentRef, setPaymentRef] = useState<string>('');

  const handleOpenPaymentModal = (inv: Invoice) => {
    setPaymentModalInvoice(inv);
    setPaymentAmount(inv.remainingAmount);
    setPaymentMethod('Espèces');
    setPaymentRef('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;

    addPayment({
      invoiceId: paymentModalInvoice.id,
      invoiceNumber: paymentModalInvoice.invoiceNumber,
      clientId: paymentModalInvoice.clientId,
      clientName: paymentModalInvoice.clientName,
      amount: paymentAmount,
      method: paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      reference: paymentRef || `REGL-${Date.now().toString().slice(-4)}`,
      receivedBy: currentUser.name,
    });

    setPaymentModalInvoice(null);
  };

  // Submit Invoice Form
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.clientName || invoiceForm.items.length === 0) return;

    addInvoice({
      ...invoiceForm,
      discount: 0,
      remainingAmount: invoiceForm.totalAmount - invoiceForm.paidAmount,
      status:
        invoiceForm.paidAmount >= invoiceForm.totalAmount
          ? 'Payée'
          : invoiceForm.paidAmount > 0
          ? 'Partielle'
          : 'Impayée',
    });
    setIsInvoiceModalOpen(false);
  };

  // Submit Quote Form
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.clientName || quoteForm.items.length === 0) return;

    addQuote({
      ...quoteForm,
      status: 'En attente',
    });
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-900" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Facturation, Devis & Règlements
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Génération de factures normalisées, devis estimatifs, reçus et suivi des encaissements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const def = clients[0];
              setQuoteForm({
                clientId: def ? def.id : '',
                clientName: def ? def.name : '',
                clientPhone: def ? def.phone : '',
                branch: 'Maintenance Informatique',
                items: [
                  {
                    description: 'Prestation technique / Devis',
                    quantity: 1,
                    unitPrice: 25000,
                    total: 25000,
                  },
                ],
                totalAmount: 25000,
                issueDate: new Date().toISOString().split('T')[0],
                validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                notes: 'Devis valable 30 jours.',
              });
              setIsQuoteModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Nouveau Devis</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const def = clients[0];
              setInvoiceForm({
                clientId: def ? def.id : '',
                clientName: def ? def.name : '',
                clientPhone: def ? def.phone : '',
                branch: 'Imprimerie & Bureautique',
                items: [
                  {
                    description: 'Tirage et impression documents',
                    quantity: 1,
                    unitPrice: 10000,
                    total: 10000,
                  },
                ],
                totalAmount: 10000,
                paidAmount: 10000,
                paymentMethod: 'Espèces',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                notes: '',
              });
              setIsInvoiceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Facture</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('factures');
            setFilterStatus('TOUS');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'factures'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Factures ({invoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('devis');
            setFilterStatus('TOUS');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'devis'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Devis ({quotes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('paiements');
            setFilterStatus('TOUS');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'paiements'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Paiements Encaissés ({payments.length})</span>
        </button>
      </div>

      {/* TAB 1: FACTURES */}
      {activeTab === 'factures' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par N° facture, nom client, prestation..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['TOUS', 'Payée', 'Partielle', 'Impayée'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">N° Facture</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Pôle / Service</th>
                    <th className="py-3 px-4 text-right">Montant Total</th>
                    <th className="py-3 px-4 text-right">Payé</th>
                    <th className="py-3 px-4 text-right">Reste</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices
                    .filter((inv) => {
                      const match =
                        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                        inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
                        inv.branch.toLowerCase().includes(search.toLowerCase());
                      const matchSt =
                        filterStatus === 'TOUS' || inv.status === filterStatus;
                      return match && matchSt;
                    })
                    .map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {inv.invoiceNumber}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            Émise le {formatDateFr(inv.issueDate)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {inv.clientName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {inv.clientPhone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                            {inv.branch}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          {formatFCFA(inv.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                          {formatFCFA(inv.paidAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold">
                          {inv.remainingAmount > 0 ? (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {formatFCFA(inv.remainingAmount)}
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              0 FCFA
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'Payée'
                                ? 'bg-emerald-100 text-emerald-900'
                                : inv.status === 'Partielle'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenPrint({ type: 'invoice', data: inv })}
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition"
                              title="Imprimer Facture"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {inv.remainingAmount > 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenPaymentModal(inv)}
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                                title="Encaisser règlement"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>Régler</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVIS */}
      {activeTab === 'devis' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par N° devis, nom client..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['TOUS', 'En attente', 'Accepté', 'Converti', 'Refusé'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">N° Devis</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Pôle & Échéance</th>
                    <th className="py-3 px-4 text-right">Montant Estimé</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes
                    .filter((q) => {
                      const match =
                        q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
                        q.clientName.toLowerCase().includes(search.toLowerCase());
                      const matchSt = filterStatus === 'TOUS' || q.status === filterStatus;
                      return match && matchSt;
                    })
                    .map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {q.quoteNumber}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            Émis le {formatDateFr(q.issueDate)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{q.clientName}</div>
                          <div className="text-[11px] text-slate-500">{q.clientPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{q.branch}</div>
                          <div className="text-[10px] text-slate-400">
                            Valable jusqu'au {formatDateFr(q.validUntil)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          {formatFCFA(q.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.status === 'Converti'
                                ? 'bg-purple-100 text-purple-900'
                                : q.status === 'Accepté'
                                ? 'bg-emerald-100 text-emerald-900'
                                : q.status === 'Refusé'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenPrint({ type: 'quote', data: q })}
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition"
                              title="Imprimer Devis"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {q.status !== 'Converti' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Convertir le devis ${q.quoteNumber} en facture définitive ?`
                                    )
                                  ) {
                                    convertQuoteToInvoice(q.id);
                                    setActiveTab('factures');
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                                title="Transformer en Facture"
                              >
                                <ArrowRight className="w-3 h-3" />
                                <span>En Facture</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAIEMENTS ENCAISSÉS */}
      {activeTab === 'paiements' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Historique des Encaissements Clients
            </h3>
            <span className="text-xs font-bold text-slate-600">
              Total Encaissé :{' '}
              <strong className="text-emerald-700 font-black">
                {formatFCFA(payments.reduce((s, p) => s + p.amount, 0))}
              </strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Date & Réf</th>
                  <th className="py-3 px-4">Facture Liée</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Moyen de Paiement</th>
                  <th className="py-3 px-4 text-right">Montant Encaissé</th>
                  <th className="py-3 px-4">Encaissé par</th>
                  <th className="py-3 px-4 text-center">Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900">{p.reference}</span>
                      <span className="block text-[10px] text-slate-400">
                        {formatDateFr(p.paymentDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-900 font-bold">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{p.clientName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                      {formatFCFA(p.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.receivedBy}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenPrint({ type: 'receipt', data: p })}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                        title="Imprimer Reçu de Caisse"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Encaisser Règlement
                </h3>
                <p className="text-xs text-slate-500">
                  Facture {paymentModalInvoice.invoiceNumber} ({paymentModalInvoice.clientName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Montant Total Facture :</span>
                  <span className="font-bold">{formatFCFA(paymentModalInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Déjà Réglé :</span>
                  <span className="font-bold">{formatFCFA(paymentModalInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-black pt-1 border-t border-slate-200">
                  <span>Reste à Payer :</span>
                  <span>{formatFCFA(paymentModalInvoice.remainingAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Montant Encaissé (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentModalInvoice.remainingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-emerald-700 text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Moyen de Paiement *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  <option value="Espèces">Espèces (Caisse locale)</option>
                  <option value="Wave">Wave (05 66 59 45 49)</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Moov Money">Moov Money</option>
                  <option value="Virement">Virement bancaire</option>
                  <option value="Chèque">Chèque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Référence transaction / Numéro reçu (optionnel)
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Ex: WAVE-TX-98473"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                >
                  Enregistrer et Générer Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INVOICE */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Créer une Facture SYGEMA CI
              </h3>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvoiceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sélectionner un Client
                  </label>
                  <select
                    value={invoiceForm.clientId}
                    onChange={(e) => {
                      const c = clients.find((x) => x.id === e.target.value);
                      if (c) {
                        setInvoiceForm({
                          ...invoiceForm,
                          clientId: c.id,
                          clientName: c.name,
                          clientPhone: c.phone,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="">-- Choisir dans la liste --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.clientName}
                    onChange={(e) =>
                      setInvoiceForm({ ...invoiceForm, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pôle d'activité SYGEMA CI *
                  </label>
                  <select
                    value={invoiceForm.branch}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        branch: e.target.value as BranchType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="Imprimerie & Bureautique">Imprimerie & Bureautique</option>
                    <option value="Maintenance Informatique">Maintenance Informatique</option>
                    <option value="Graphisme & Communication">Graphisme & Communication</option>
                    <option value="Solutions Numériques">Solutions Numériques</option>
                    <option value="Impression Tee-shirt">Impression Tee-shirt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Téléphone client
                  </label>
                  <input
                    type="tel"
                    value={invoiceForm.clientPhone}
                    onChange={(e) =>
                      setInvoiceForm({ ...invoiceForm, clientPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Invoice Item */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Désignation de la prestation ou marchandise *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceForm.items[0]?.description || ''}
                  onChange={(e) => {
                    const desc = e.target.value;
                    const items = [...invoiceForm.items];
                    items[0] = { ...items[0], description: desc };
                    setInvoiceForm({ ...invoiceForm, items });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Total Facture (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={invoiceForm.totalAmount}
                    onChange={(e) => {
                      const tot = Number(e.target.value);
                      const items = [...invoiceForm.items];
                      items[0] = { ...items[0], total: tot, unitPrice: tot, quantity: 1 };
                      setInvoiceForm({
                        ...invoiceForm,
                        totalAmount: tot,
                        items,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Acompte ou Total Encaissé (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={invoiceForm.paidAmount}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        paidAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Moyen de Paiement
                  </label>
                  <select
                    value={invoiceForm.paymentMethod}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        paymentMethod: e.target.value as PaymentMethod,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Wave">Wave</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) =>
                      setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-sm"
                >
                  Créer et Enregistrer la Facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE QUOTE */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Nouveau Devis Estimatif
              </h3>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sélectionner un Client
                  </label>
                  <select
                    value={quoteForm.clientId}
                    onChange={(e) => {
                      const c = clients.find((x) => x.id === e.target.value);
                      if (c) {
                        setQuoteForm({
                          ...quoteForm,
                          clientId: c.id,
                          clientName: c.name,
                          clientPhone: c.phone,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="">-- Choisir dans la liste --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.clientName}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pôle d'activité *
                  </label>
                  <select
                    value={quoteForm.branch}
                    onChange={(e) =>
                      setQuoteForm({
                        ...quoteForm,
                        branch: e.target.value as BranchType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="Imprimerie & Bureautique">Imprimerie & Bureautique</option>
                    <option value="Maintenance Informatique">Maintenance Informatique</option>
                    <option value="Graphisme & Communication">Graphisme & Communication</option>
                    <option value="Solutions Numériques">Solutions Numériques</option>
                    <option value="Impression Tee-shirt">Impression Tee-shirt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Valable jusqu'au
                  </label>
                  <input
                    type="date"
                    value={quoteForm.validUntil}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, validUntil: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Désignation des prestations / Matériel *
                </label>
                <input
                  type="text"
                  required
                  value={quoteForm.items[0]?.description || ''}
                  onChange={(e) => {
                    const desc = e.target.value;
                    const items = [...quoteForm.items];
                    items[0] = { ...items[0], description: desc };
                    setQuoteForm({ ...quoteForm, items });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Montant Estimé Total (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={quoteForm.totalAmount}
                  onChange={(e) => {
                    const tot = Number(e.target.value);
                    const items = [...quoteForm.items];
                    items[0] = { ...items[0], total: tot, unitPrice: tot, quantity: 1 };
                    setQuoteForm({
                      ...quoteForm,
                      totalAmount: tot,
                      items,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-sm text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-sm"
                >
                  Générer le Devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
