import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../data/store';
import { formatFCFA, formatDateFr } from '../utils/formatters';
import {
  Search,
  X,
  User,
  Printer,
  Wrench,
  Palette,
  Laptop,
  Shirt,
  FileText,
  CreditCard,
  ChevronRight,
  Phone,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    clients,
    printOrders,
    maintenance,
    graphicProjects,
    digitalProjects,
    tshirtOrders,
    invoices,
    quotes,
  } = useAppStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(''); // Will trigger open from parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchedClients = q
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.whatsapp.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      )
    : [];

  const matchedMaintenance = q
    ? maintenance.filter(
        (m) =>
          m.interventionNumber.toLowerCase().includes(q) ||
          m.clientName.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q) ||
          m.hardwareConcerned.toLowerCase().includes(q) ||
          m.problemType.toLowerCase().includes(q) ||
          m.status.toLowerCase().includes(q) ||
          m.technician.toLowerCase().includes(q)
      )
    : [];

  const matchedPrint = q
    ? printOrders.filter(
        (p) =>
          p.orderNumber.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          p.documentName.toLowerCase().includes(q) ||
          p.serviceType.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      )
    : [];

  const matchedGraphic = q
    ? graphicProjects.filter(
        (g) =>
          g.projectNumber.toLowerCase().includes(q) ||
          g.clientName.toLowerCase().includes(q) ||
          g.phone.toLowerCase().includes(q) ||
          g.creationType.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.status.toLowerCase().includes(q)
      )
    : [];

  const matchedDigital = q
    ? digitalProjects.filter(
        (d) =>
          d.projectNumber.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.solutionType.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      )
    : [];

  const matchedTshirt = q
    ? tshirtOrders.filter(
        (t) =>
          t.orderNumber.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.phone.toLowerCase().includes(q) ||
          t.designName.toLowerCase().includes(q) ||
          t.tshirtColor.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q)
      )
    : [];

  const matchedInvoices = q
    ? invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q) ||
          inv.clientPhone.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q)
      )
    : [];

  const matchedQuotes = q
    ? quotes.filter(
        (dev) =>
          dev.quoteNumber.toLowerCase().includes(q) ||
          dev.clientName.toLowerCase().includes(q) ||
          dev.clientPhone.toLowerCase().includes(q) ||
          dev.title.toLowerCase().includes(q) ||
          dev.status.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedClients.length +
    matchedMaintenance.length +
    matchedPrint.length +
    matchedGraphic.length +
    matchedDigital.length +
    matchedTshirt.length +
    matchedInvoices.length +
    matchedQuotes.length;

  const handleSelect = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher client, téléphone, N° commande, facture, intervention..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-800 focus:outline-none placeholder-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Échap
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!q && (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-600">
                Recherche instantanée dans SYGEMA CI
              </p>
              <p className="text-xs mt-1">
                Tapez un nom de client, un numéro de téléphone (ex: 05 66 59 45 49), un numéro de commande ou un statut.
              </p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p className="font-semibold text-slate-600">Aucun résultat trouvé pour « {query} »</p>
              <p className="text-xs mt-1">Vérifiez l'orthographe ou tentez une autre recherche.</p>
            </div>
          )}

          {/* Matched Clients */}
          {matchedClients.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Clients ({matchedClients.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('clients')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{c.name}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {c.type}
                      </span>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                        <span>•</span>
                        <span>{c.address}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Maintenance */}
          {matchedMaintenance.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-600" />
                <span>Maintenance Informatique ({matchedMaintenance.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedMaintenance.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelect('maintenance')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-700">{m.interventionNumber}</span>
                        <span className="font-semibold text-slate-800">{m.clientName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {m.hardwareConcerned} — {m.problemType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatFCFA(m.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Imprimerie */}
          {matchedPrint.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Imprimerie & Bureautique ({matchedPrint.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedPrint.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('imprimerie')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700">{p.orderNumber}</span>
                        <span className="font-semibold text-slate-800">{p.clientName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {p.serviceType} — {p.documentName} ({p.copyCount} ex.)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatFCFA(p.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tee-shirts */}
          {matchedTshirt.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Impression Tee-shirt ({matchedTshirt.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedTshirt.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect('teeshirt')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">{t.orderNumber}</span>
                        <span className="font-semibold text-slate-800">{t.clientName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {t.quantity} Tee-shirts {t.tshirtColor} — {t.designName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatFCFA(t.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>Factures ({matchedInvoices.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect('facturation')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700">{inv.invoiceNumber}</span>
                        <span className="font-semibold text-slate-800">{inv.clientName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            inv.status === 'Payé'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Émise le {formatDateFr(inv.date)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatFCFA(inv.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Quotes */}
          {matchedQuotes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Devis ({matchedQuotes.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedQuotes.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => handleSelect('devis')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700">{dev.quoteNumber}</span>
                        <span className="font-semibold text-slate-800">{dev.clientName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                          {dev.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{dev.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatFCFA(dev.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
