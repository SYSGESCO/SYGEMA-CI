import React from 'react';
import { useAppStore } from '../data/store';
import { formatFCFA, formatDateFr, formatDateTimeFr } from '../utils/formatters';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Invoice, Quote, Payment, MaintenanceIntervention, PhotoMinuteOrder, SchoolRegistration } from '../types';

export type PrintableDocType =
  | { type: 'invoice'; data: Invoice }
  | { type: 'quote'; data: Quote }
  | { type: 'paymentReceipt'; data: Payment }
  | { type: 'maintenanceSheet'; data: MaintenanceIntervention }
  | { type: 'photoReceipt'; data: PhotoMinuteOrder }
  | { type: 'schoolRegistrationReceipt'; data: SchoolRegistration };

interface PrintableDocumentModalProps {
  doc: PrintableDocType | null;
  onClose: () => void;
}

export const PrintableDocumentModal: React.FC<PrintableDocumentModalProps> = ({
  doc,
  onClose,
}) => {
  const { company } = useAppStore();

  if (!doc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Aperçu pour Impression & Export</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-action"
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Sauvegarder PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content Container */}
        <div className="p-8 sm:p-12 text-slate-900 font-sans print:p-6" id="printable-area">
          {/* Header Brand */}
          <div className="flex items-start justify-between border-b-2 border-blue-950 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm bg-[#0f2048] flex items-center justify-center p-0.5">
                <img src="/logo.svg" alt="SYGEMA CI" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-blue-950 tracking-wide">
                  {company.name}
                </h1>
                <p className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                  {company.activity}
                </p>
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  « {company.slogan} »
                </p>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">
                  {company.address} • Tél / WhatsApp : <strong className="text-blue-900">{company.phone}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              {doc.type === 'invoice' && (
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-blue-950 text-white font-extrabold text-sm tracking-wider">
                    FACTURE
                  </span>
                  <p className="text-base font-black text-blue-950 mt-1.5">
                    {doc.data.invoiceNumber}
                  </p>
                  <p className="text-xs text-slate-600">Date : {formatDateFr(doc.data.date)}</p>
                  <p className="text-xs text-slate-600">Échéance : {formatDateFr(doc.data.dueDate)}</p>
                </div>
              )}

              {doc.type === 'quote' && (
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-amber-600 text-white font-extrabold text-sm tracking-wider">
                    DEVIS ESTIMATIF
                  </span>
                  <p className="text-base font-black text-amber-900 mt-1.5">
                    {doc.data.quoteNumber}
                  </p>
                  <p className="text-xs text-slate-600">Émis le : {formatDateFr(doc.data.createdAt)}</p>
                  <p className="text-xs text-slate-600">Valable jusqu'au : {formatDateFr(doc.data.validUntil)}</p>
                </div>
              )}

              {doc.type === 'paymentReceipt' && (
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-emerald-700 text-white font-extrabold text-sm tracking-wider">
                    REÇU DE CAISSE
                  </span>
                  <p className="text-base font-black text-emerald-900 mt-1.5">
                    {doc.data.paymentNumber}
                  </p>
                  <p className="text-xs text-slate-600">Date : {formatDateFr(doc.data.date)}</p>
                </div>
              )}

              {doc.type === 'maintenanceSheet' && (
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-purple-950 text-white font-extrabold text-xs tracking-wider">
                    FICHE D'INTERVENTION
                  </span>
                  <p className="text-base font-black text-purple-950 mt-1.5">
                    {doc.data.interventionNumber}
                  </p>
                  <p className="text-xs text-slate-600">Dépôt : {formatDateFr(doc.data.depositDate)}</p>
                  <p className="text-xs text-slate-600 font-semibold text-purple-800">
                    Statut : {doc.data.status}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DOCUMENT BODY ACCORDING TO TYPE */}

          {/* 1. INVOICE */}
          {doc.type === 'invoice' && (
            <div className="mt-6 space-y-6">
              {/* Client Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Facturé à :
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {doc.data.clientName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Téléphone : <strong className="text-slate-800">{doc.data.clientPhone}</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Adresse : {doc.data.clientAddress}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Statut de règlement :
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black ${
                      doc.data.status === 'Payé'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : doc.data.status === 'Partiellement payé'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {doc.data.status.toUpperCase()}
                  </span>
                  {doc.data.paymentMethod && (
                    <p className="text-xs text-slate-500 mt-1">
                      Mode : {doc.data.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="py-2.5 px-3 rounded-l-lg">Désignation des prestations / articles</th>
                    <th className="py-2.5 px-3 text-center">Quantité</th>
                    <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Montant Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.data.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700">
                        {formatFCFA(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatFCFA(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Recap */}
              <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                <div className="max-w-xs text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Notes & Conditions :</p>
                  <p className="text-[11px] leading-relaxed">
                    {doc.data.notes || 'Paiement attendu à la livraison des travaux. Merci de votre confiance !'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Moyens acceptés : Espèces, Wave (05 66 59 45 49), Orange Money, Virement.
                  </p>
                </div>

                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Total Prestations :</span>
                    <span className="font-bold text-slate-800">{formatFCFA(doc.data.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-semibold">
                    <span>Montant déjà réglé :</span>
                    <span>- {formatFCFA(doc.data.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-blue-50 px-3 rounded-lg border border-blue-200 text-sm">
                    <span className="font-extrabold text-blue-950">RESTE À PAYER :</span>
                    <span className="font-extrabold text-blue-950">{formatFCFA(doc.data.remainingAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Le Client</p>
                  <p className="text-[10px] italic mt-0.5">« Bon pour accord »</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
                </div>
                <div>
                  <p className="font-bold text-blue-950">Pour SYGEMA CI</p>
                  <p className="text-[10px] italic mt-0.5">La Direction & Cachet</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest border border-blue-900/40 px-3 py-1 rounded">
                      [ CACHET ÉLECTRONIQUE SYGEMA CI ]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. QUOTE (DEVIS) */}
          {doc.type === 'quote' && (
            <div className="mt-6 space-y-6">
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                    Destinataire du devis :
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {doc.data.clientName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Contact : <strong className="text-slate-800">{doc.data.clientPhone}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                    Objet du devis :
                  </p>
                  <p className="font-bold text-slate-900 text-sm">{doc.data.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Validité : jusqu'au {formatDateFr(doc.data.validUntil)}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-700 text-white">
                    <th className="py-2.5 px-3 rounded-l-lg">Désignation / Spécifications techniques</th>
                    <th className="py-2.5 px-3 text-center">Quantité</th>
                    <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Montant Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.data.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700">
                        {formatFCFA(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatFCFA(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Recap */}
              <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                <div className="max-w-xs text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Conditions de réalisation :</p>
                  <p className="text-[11px] leading-relaxed">
                    {doc.data.notes || 'Un acompte de 50% est exigé au démarrage des travaux. Le solde est payable à la livraison.'}
                  </p>
                </div>

                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between py-2 bg-amber-50 px-3 rounded-lg border border-amber-200 text-base">
                    <span className="font-extrabold text-amber-950">TOTAL ESTIMATIF :</span>
                    <span className="font-extrabold text-amber-950">{formatFCFA(doc.data.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Mention manuscrite « Bon pour accord » & Signature</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
                </div>
                <div>
                  <p className="font-bold text-amber-900">Pour SYGEMA CI</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest border border-amber-800/40 px-3 py-1 rounded">
                      [ DIRECTION COMMERCIALE ]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. PAYMENT RECEIPT (REÇU) */}
          {doc.type === 'paymentReceipt' && (
            <div className="mt-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    Reçu de :
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {doc.data.clientName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Mode de versement : <strong className="text-slate-800">{doc.data.paymentMethod}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-800 font-semibold block">SOMME VERSÉE :</span>
                  <span className="text-xl font-black text-emerald-900">
                    {formatFCFA(doc.data.amount)}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-2 bg-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-500">Motif du versement :</span>
                  <span className="font-semibold text-slate-800">{doc.data.notes || 'Règlement de prestation'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Référence transaction :</span>
                  <span className="font-mono text-slate-800">{doc.data.reference || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Encaissé par :</span>
                  <span className="font-semibold text-slate-800">{doc.data.receivedBy}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Signature Client</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Caisse SYGEMA CI</p>
                  <div className="h-16 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest border border-emerald-800/40 px-3 py-1 rounded">
                      [ CAISSE ACQUITTÉE ]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. MAINTENANCE SHEET (WITH DUAL COUPON: VOLET CLIENT & VOLET ATELIER) */}
          {doc.type === 'maintenanceSheet' && (
            <div className="mt-6 space-y-6">
              {/* VOLET ATELIER */}
              <div className="border-2 border-purple-900/30 rounded-xl p-4 bg-purple-50/20 relative">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                    VOLET ATELIER & DIAGNOSTIC (SYGEMA CI)
                  </span>
                  <span className="text-xs font-bold text-purple-950 font-mono">
                    {doc.data.interventionNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-3">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Client</span>
                    <span className="font-bold text-slate-900">{doc.data.clientName}</span>
                    <span className="block text-slate-600">{doc.data.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Matériel & Modèle</span>
                    <span className="font-bold text-slate-900">{doc.data.hardwareConcerned}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Technicien assigné</span>
                    <span className="font-bold text-purple-800">{doc.data.technician}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-white border border-purple-200 rounded-lg text-xs space-y-1">
                  <p>
                    <strong className="text-purple-950">Panne déclarée :</strong> {doc.data.problemType}
                  </p>
                  <p>
                    <strong className="text-purple-950">Diagnostic atelier :</strong> {doc.data.diagnostic || 'En cours d\'expertise'}
                  </p>
                  <p>
                    <strong className="text-purple-950">Travaux effectués :</strong> {doc.data.interventionDone || 'À réaliser'}
                  </p>
                </div>
              </div>

              {/* SEPARATOR CUTTING LINE */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-b-2 border-dashed border-slate-300"></div>
                <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  ✂ Découper ici (Volet Client à remettre au dépôt)
                </span>
              </div>

              {/* VOLET CLIENT */}
              <div className="border-2 border-blue-900/30 rounded-xl p-4 bg-blue-50/20">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    VOLET CLIENT — TICKET DE DÉPÔT MATÉRIEL
                  </span>
                  <span className="text-xs font-bold text-blue-950 font-mono">
                    {doc.data.interventionNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-3">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Client</span>
                    <span className="font-bold text-slate-900">{doc.data.clientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Matériel pris en charge</span>
                    <span className="font-bold text-slate-900">{doc.data.hardwareConcerned}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Date de dépôt</span>
                    <span className="font-bold text-slate-900">{formatDateFr(doc.data.depositDate)}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-white border border-blue-200 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <p className="text-slate-700">
                      Coût total estimé : <strong className="text-slate-900">{formatFCFA(doc.data.cost)}</strong>
                    </p>
                    <p className="text-emerald-700">
                      Acompte versé : <strong>{formatFCFA(doc.data.paidAmount)}</strong>
                    </p>
                    <p className="text-rose-700 font-bold">
                      Reste à régler : {formatFCFA(doc.data.remainingAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact atelier</span>
                    <span className="font-bold text-blue-900">{company.phone}</span>
                  </div>
                </div>

                <div className="mt-2 text-[9px] text-slate-500 leading-tight italic">
                  * Conditions : Présentez obligatoirement ce ticket lors du retrait. SYGEMA CI garantit les réparations matérielles pendant 30 jours (hors chocs et surtensions). Tout appareil non réclamé sous 90 jours sera liquidé pour couvrir les frais.
                </div>
              </div>
            </div>
          )}

          {/* 5. TICKET DE RETRAIT PHOTO MINUTE */}
          {doc.type === 'photoReceipt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                    Studio Photo Express • Tirage Immédiat
                  </span>
                  <h2 className="text-xl font-black text-blue-950">
                    TICKET DE RETRAIT PHOTO MINUTE
                  </h2>
                  <p className="text-xs text-slate-500">
                    N° Commande : <strong className="font-mono text-blue-900">{doc.data.orderNumber}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Date & Heure</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {formatDateFr(doc.data.date)}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                    Statut : {doc.data.status}
                  </span>
                </div>
              </div>

              {/* Client & Photo Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Client / Bénéficiaire</span>
                  <span className="font-black text-slate-900 text-sm">{doc.data.clientName}</span>
                  <span className="text-slate-600 block mt-0.5">Contact : {doc.data.phone || 'Non renseigné'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Destination / Usage</span>
                  <span className="font-bold text-slate-900">{doc.data.purpose}</span>
                  <span className="text-slate-600 block mt-0.5 font-medium">Fond : {doc.data.background}</span>
                </div>
              </div>

              {/* Package Summary */}
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white font-bold uppercase text-[10px]">
                    <th className="p-3 text-left">Formule / Tirage</th>
                    <th className="p-3 text-center">Quantité</th>
                    <th className="p-3 text-center">Option Numérique</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">
                      {doc.data.formatLabel}
                      {doc.data.observations && (
                        <span className="block text-[10px] text-slate-500 font-normal italic">
                          Note : {doc.data.observations}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {doc.data.photoCount} photo{doc.data.photoCount > 1 ? 's' : ''} HD
                    </td>
                    <td className="p-3 text-center">
                      {doc.data.sendDigital ? (
                        <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          WhatsApp HD : {doc.data.whatsappOrEmail || doc.data.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Non</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-black text-slate-900">
                      {formatFCFA(doc.data.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Box */}
              <div className="flex justify-end">
                <div className="w-64 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Montant Total :</span>
                    <span className="text-slate-950 font-black">{formatFCFA(doc.data.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Payé ({doc.data.paymentMethod}) :</span>
                    <span>{formatFCFA(doc.data.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-1.5 border-t border-slate-200">
                    <span className="text-slate-900">Reste à Régler :</span>
                    <span className={doc.data.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {formatFCFA(doc.data.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-950 space-y-1">
                <p className="font-bold uppercase tracking-wider">Instructions de retrait :</p>
                <p>• Veuillez présenter obligatoirement ce ticket au guichet du studio pour récupérer vos photos imprimées.</p>
                <p>• Si vous avez souscrit à l'option numérique, vos photos HD vous seront transmises sur WhatsApp dès la validation du tirage.</p>
                <p>• Studio SYGEMA CI : Daloa, Quartier Soleil 2 • Tél / WhatsApp : 05 66 59 45 49</p>
              </div>
            </div>
          )}

          {/* 6. RÉCÉPISSÉ D'INSCRIPTION EN LIGNE SCOLAIRE & UNIVERSITAIRE */}
          {doc.type === 'schoolRegistrationReceipt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Guichet Agréé Cyber & Inscriptions Officielles
                  </span>
                  <h2 className="text-xl font-black text-blue-950">
                    RÉCÉPISSÉ D'ENRÔLEMENT & INSCRIPTION EN LIGNE
                  </h2>
                  <p className="text-xs text-slate-500">
                    N° Dossier : <strong className="font-mono text-emerald-900">{doc.data.registrationNumber}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Date de traitement</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {formatDateFr(doc.data.date)}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {doc.data.status}
                  </span>
                </div>
              </div>

              {/* Student identification */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3 text-xs">
                <h3 className="font-black text-emerald-950 uppercase text-[11px] tracking-wider border-b border-emerald-200/60 pb-1.5">
                  Identification de l'Élève / Candidat
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Nom et Prénoms</span>
                    <span className="font-black text-slate-900 text-sm">{doc.data.studentName}</span>
                    {doc.data.studentGender && (
                      <span className="text-[10px] text-slate-500">Genre : {doc.data.studentGender === 'M' ? 'Masculin' : 'Féminin'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Matricule MENA / N° Candidat</span>
                    <span className="font-mono font-black text-emerald-900 text-sm">{doc.data.matriculeMENA || 'NON ASSIGNÉ'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Année Académique</span>
                    <span className="font-bold text-slate-800">{doc.data.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Établissement / Université</span>
                    <span className="font-bold text-slate-800">{doc.data.schoolName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Classe / Niveau</span>
                    <span className="font-bold text-slate-800">{doc.data.classLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Parent / Tuteur</span>
                    <span className="font-bold text-slate-800">{doc.data.clientName} ({doc.data.phone})</span>
                  </div>
                </div>
              </div>

              {/* Transaction & Fees */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-900 text-white p-3 font-bold flex justify-between items-center text-[11px] uppercase">
                  <span>Prestation & Détail Financier</span>
                  <span>Opérateur : {doc.data.paymentOperator}</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">Type d'opération :</span>
                    <span className="font-bold text-slate-900">{doc.data.registrationType}</span>
                  </div>
                  {doc.data.transactionReference && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">Référence quittance TrésorPay / Opérateur :</span>
                      <span className="font-mono font-bold text-blue-900">{doc.data.transactionReference}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">Frais officiels de l'État reversés :</span>
                    <span className="font-bold text-slate-900">{formatFCFA(doc.data.officialFee)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">Frais de traitement & impression SYGEMA CI :</span>
                    <span className="font-bold text-emerald-800">{formatFCFA(doc.data.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-black">
                    <span className="text-slate-900 uppercase">Montant Total Réglé :</span>
                    <span className="text-emerald-900 text-base">{formatFCFA(doc.data.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Certification stamp box */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Opérateur de Guichet</span>
                  <span className="font-bold text-slate-800">Cyber SYGEMA CI - Daloa</span>
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    Dossier vérifié et validé sur la plateforme officielle.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cachet & Signature SYGEMA CI</span>
                  <div className="py-4 text-[11px] font-black text-blue-900 tracking-wider">
                    [ CACHET ÉLECTRONIQUE SYGEMA CI ]
                  </div>
                  <span className="text-[9px] text-slate-400">Certifié conforme</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            SYGEMA CI • Imprimerie & Services Informatiques • Daloa, Quartier Soleil 2 • Tél / WhatsApp : 05 66 59 45 49
          </div>
        </div>
      </div>
    </div>
  );
};
