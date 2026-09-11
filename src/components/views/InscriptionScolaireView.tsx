import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../data/store';
import {
  SchoolRegistration,
  SchoolRegistrationType,
  SchoolRegistrationStatus,
  SchoolRegistrationPaymentOperator,
} from '../../types';
import { formatFCFA, formatDateFr } from '../../utils/formatters';
import {
  GraduationCap,
  Plus,
  Search,
  Printer,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Phone,
  Sparkles,
  School,
  FileText,
  UserCheck,
  CreditCard,
  Building,
  BookOpen,
  Award,
} from 'lucide-react';
import { PrintableDocType } from '../PrintableDocumentModal';

interface InscriptionScolaireViewProps {
  onOpenPrint?: (doc: PrintableDocType) => void;
}

const REGISTRATION_TEMPLATES: Array<{
  type: SchoolRegistrationType;
  label: string;
  defaultOfficialFee: number;
  defaultServiceFee: number;
  badge: string;
  defaultSchool: string;
  defaultClass: string;
  description: string;
}> = [
  {
    type: 'Inscription Scolaire MENA (Collège & Lycée)',
    label: 'Collège & Lycée MENA',
    defaultOfficialFee: 6000,
    defaultServiceFee: 1500,
    badge: 'Ministère MENA',
    defaultSchool: 'Lycée Moderne 1 Daloa',
    defaultClass: '6ème à Terminale',
    description: 'Inscription en ligne officielle TrésorPay / MENA CI',
  },
  {
    type: 'Inscription Primaire / Maternelle',
    label: 'Primaire & Maternelle',
    defaultOfficialFee: 3000,
    defaultServiceFee: 1000,
    badge: 'Primaire Public/Privé',
    defaultSchool: 'EPP Soleil Daloa',
    defaultClass: 'CP1 à CM2',
    description: 'Enrôlement et fiche de scolarité',
  },
  {
    type: 'Examen BEPC',
    label: 'Dossier Examen BEPC',
    defaultOfficialFee: 2000,
    defaultServiceFee: 1500,
    badge: 'DECO / BEPC',
    defaultSchool: 'Collège Moderne Daloa',
    defaultClass: 'Troisième (3ème)',
    description: 'Paiement droit d\'examen et impression fiche de candidature',
  },
  {
    type: 'Examen BAC',
    label: 'Dossier Examen BAC',
    defaultOfficialFee: 5000,
    defaultServiceFee: 2000,
    badge: 'DECO / BAC',
    defaultSchool: 'Lycée Antoine Gauze Daloa',
    defaultClass: 'Terminale (A, C, D)',
    description: 'Enrôlement officiel DECO et validation du dossier',
  },
  {
    type: 'Université UJLoG Daloa / Universités Publiques CI',
    label: 'Université UJLoG Daloa',
    defaultOfficialFee: 30000,
    defaultServiceFee: 3000,
    badge: 'Enseignement Supérieur',
    defaultSchool: 'Université Jean Lorougnon Guédé (UJLoG)',
    defaultClass: 'Licence 1 / Master',
    description: 'Paiement quittance TrésorPay et fiche d\'inscription pédagogique',
  },
  {
    type: 'Concours Pédagogique (CAFOP, ENS...)',
    label: 'Concours CAFOP / ENS',
    defaultOfficialFee: 10000,
    defaultServiceFee: 2500,
    badge: 'Concours Fonction Publique',
    defaultSchool: 'CAFOP Supérieur Daloa',
    defaultClass: 'Candidat Concours',
    description: 'Quittance d\'inscription, prise de rendez-vous et fiche',
  },
];

export const InscriptionScolaireView: React.FC<InscriptionScolaireViewProps> = ({ onOpenPrint }) => {
  const {
    schoolRegistrations,
    addSchoolRegistration,
    updateSchoolRegistration,
    deleteSchoolRegistration,
    clients,
    currentUser,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');
  const [filterType, setFilterType] = useState<string>('TOUS');
  const [filterOperator, setFilterOperator] = useState<string>('TOUS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<SchoolRegistration | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    studentName: '',
    studentBirthDate: '',
    studentGender: 'M' as 'M' | 'F',
    matriculeMENA: '',
    registrationType: 'Inscription Scolaire MENA (Collège & Lycée)' as SchoolRegistrationType,
    schoolName: 'Lycée Moderne 1 Daloa',
    classLevel: '6ème',
    academicYear: '2026-2027',
    officialFee: 6000,
    serviceFee: 1500,
    totalAmount: 7500,
    paidAmount: 7500,
    paymentOperator: 'TrésorMoney' as SchoolRegistrationPaymentOperator,
    transactionReference: '',
    status: 'Inscrit avec succès' as SchoolRegistrationStatus,
    date: new Date().toISOString().split('T')[0],
    observations: '',
  });

  const handleOpenAdd = (template?: typeof REGISTRATION_TEMPLATES[0]) => {
    setEditingRegistration(null);
    const defaultClient = clients[0];
    const tpl = template || REGISTRATION_TEMPLATES[0];
    const official = tpl.defaultOfficialFee;
    const service = tpl.defaultServiceFee;
    const total = official + service;

    setFormData({
      clientId: defaultClient ? defaultClient.id : '',
      clientName: defaultClient ? defaultClient.name : '',
      phone: defaultClient ? defaultClient.phone : '',
      studentName: '',
      studentBirthDate: '2010-05-15',
      studentGender: 'M',
      matriculeMENA: '',
      registrationType: tpl.type,
      schoolName: tpl.defaultSchool,
      classLevel: tpl.defaultClass,
      academicYear: '2026-2027',
      officialFee: official,
      serviceFee: service,
      totalAmount: total,
      paidAmount: total,
      paymentOperator: 'TrésorMoney',
      transactionReference: `TM-${Date.now().toString().slice(-6)}`,
      status: 'Inscrit avec succès',
      date: new Date().toISOString().split('T')[0],
      observations: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reg: SchoolRegistration) => {
    setEditingRegistration(reg);
    setFormData({
      clientId: reg.clientId,
      clientName: reg.clientName,
      phone: reg.phone,
      studentName: reg.studentName,
      studentBirthDate: reg.studentBirthDate || '',
      studentGender: reg.studentGender || 'M',
      matriculeMENA: reg.matriculeMENA,
      registrationType: reg.registrationType,
      schoolName: reg.schoolName,
      classLevel: reg.classLevel,
      academicYear: reg.academicYear,
      officialFee: reg.officialFee,
      serviceFee: reg.serviceFee,
      totalAmount: reg.totalAmount,
      paidAmount: reg.paidAmount,
      paymentOperator: reg.paymentOperator,
      transactionReference: reg.transactionReference || '',
      status: reg.status,
      date: reg.date,
      observations: reg.observations,
    });
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (tpl: typeof REGISTRATION_TEMPLATES[0]) => {
    const total = tpl.defaultOfficialFee + tpl.defaultServiceFee;
    setFormData((prev) => ({
      ...prev,
      registrationType: tpl.type,
      schoolName: tpl.defaultSchool,
      classLevel: tpl.defaultClass,
      officialFee: tpl.defaultOfficialFee,
      serviceFee: tpl.defaultServiceFee,
      totalAmount: total,
      paidAmount: total,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const official = Number(formData.officialFee) || 0;
    const service = Number(formData.serviceFee) || 0;
    const total = official + service;
    const paid = Number(formData.paidAmount) || 0;

    if (editingRegistration) {
      updateSchoolRegistration(editingRegistration.id, {
        clientId: formData.clientId || `client_ins_${Date.now()}`,
        clientName: formData.clientName,
        phone: formData.phone,
        studentName: formData.studentName,
        studentBirthDate: formData.studentBirthDate,
        studentGender: formData.studentGender,
        matriculeMENA: formData.matriculeMENA,
        registrationType: formData.registrationType,
        schoolName: formData.schoolName,
        classLevel: formData.classLevel,
        academicYear: formData.academicYear,
        officialFee: official,
        serviceFee: service,
        totalAmount: total,
        paidAmount: paid,
        paymentOperator: formData.paymentOperator,
        transactionReference: formData.transactionReference,
        status: formData.status,
        date: formData.date,
        observations: formData.observations,
      });
    } else {
      addSchoolRegistration({
        clientId: formData.clientId || `client_ins_${Date.now()}`,
        clientName: formData.clientName,
        phone: formData.phone,
        studentName: formData.studentName,
        studentBirthDate: formData.studentBirthDate,
        studentGender: formData.studentGender,
        matriculeMENA: formData.matriculeMENA,
        registrationType: formData.registrationType,
        schoolName: formData.schoolName,
        classLevel: formData.classLevel,
        academicYear: formData.academicYear,
        officialFee: official,
        serviceFee: service,
        totalAmount: total,
        paidAmount: paid,
        paymentOperator: formData.paymentOperator,
        transactionReference: formData.transactionReference,
        status: formData.status,
        date: formData.date,
        observations: formData.observations,
        createdBy: currentUser.name,
        createdByRole: currentUser.role,
      });
    }

    setIsModalOpen(false);
  };

  // Quick status advance
  const handleQuickStatusChange = (regId: string, nextStatus: SchoolRegistrationStatus) => {
    updateSchoolRegistration(regId, { status: nextStatus });
  };

  // Stats
  const totalRevenue = useMemo(() => {
    return schoolRegistrations.reduce((acc, r) => acc + (Number(r.totalAmount) || 0), 0);
  }, [schoolRegistrations]);

  const totalServiceFees = useMemo(() => {
    return schoolRegistrations.reduce((acc, r) => acc + (Number(r.serviceFee) || 0), 0);
  }, [schoolRegistrations]);

  const totalOfficialFees = useMemo(() => {
    return schoolRegistrations.reduce((acc, r) => acc + (Number(r.officialFee) || 0), 0);
  }, [schoolRegistrations]);

  const printedReceiptsCount = useMemo(() => {
    return schoolRegistrations.filter((r) => r.status === 'Fiche imprimée & Remise').length;
  }, [schoolRegistrations]);

  const filteredRegistrations = useMemo(() => {
    return schoolRegistrations.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.matriculeMENA.toLowerCase().includes(q) ||
        r.schoolName.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.transactionReference && r.transactionReference.toLowerCase().includes(q));

      const matchStatus = filterStatus === 'TOUS' || r.status === filterStatus;
      const matchType = filterType === 'TOUS' || r.registrationType.toLowerCase().includes(filterType.toLowerCase());
      const matchOperator = filterOperator === 'TOUS' || r.paymentOperator === filterOperator;

      return matchSearch && matchStatus && matchType && matchOperator;
    });
  }, [schoolRegistrations, search, filterStatus, filterType, filterOperator]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Guichet MENA & Universités
              </span>
              <span className="text-xs text-emerald-200">TrésorMoney • Wave • Mobile Money • Reçu certifié</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <GraduationCap className="w-8 h-8 text-amber-400" />
              Inscription en Ligne Scolaire & Universitaire
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Paiement des droits officiels, validation des dossiers d'examens (BEPC, BAC, CEPE), réinscription collèges/lycées MENA et Université Jean Lorougnon Guédé (UJLoG Daloa) avec impression immédiate du récépissé.
            </p>
          </div>

          <button
            id="btn-add-school-registration"
            type="button"
            onClick={() => handleOpenAdd()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-5 py-3 rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Nouvelle Inscription</span>
          </button>
        </div>

        {/* Financial Breakdown KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-900/60">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">Inscriptions Effectuées</span>
            <span className="text-2xl font-black text-white">{schoolRegistrations.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">Frais Officiels Reversés</span>
            <span className="text-2xl font-black text-amber-300">{formatFCFA(totalOfficialFees)}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">Bénéfice SYGEMA CI (Prestations)</span>
            <span className="text-2xl font-black text-emerald-400">{formatFCFA(totalServiceFees)}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">Fiches Imprimées & Remises</span>
            <span className="text-2xl font-black text-white">{printedReceiptsCount}</span>
          </div>
        </div>
      </div>

      {/* Fast Registration Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-600" />
            Accès Rapide par Type d'Établissement / Concours
          </h2>
          <span className="text-xs text-slate-500">Sélectionnez une filière pour pré-remplir le formulaire</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGISTRATION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.type}
              onClick={() => handleOpenAdd(tpl)}
              className="bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {tpl.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{tpl.defaultClass}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">
                  {tpl.label}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total tout inclus</span>
                  <span className="text-sm font-black text-emerald-950">
                    {formatFCFA(tpl.defaultOfficialFee + tpl.defaultServiceFee)}
                  </span>
                </div>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° dossier, élève, matricule MENA, parent, établissement..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Statut :</span>
            {['TOUS', 'Dossier reçu', 'Paiement en cours', 'Inscrit avec succès', 'Fiche imprimée & Remise'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Opérateur :</span>
          {['TOUS', 'TrésorMoney', 'Wave', 'Orange Money', 'MTN Mobile Money', 'Moov Money', 'Espèces comptoir'].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setFilterOperator(op)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                filterOperator === op
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {op === 'TOUS' ? 'Tous opérateurs' : op}
            </button>
          ))}

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-3 mr-1">Filière :</span>
          {['TOUS', 'MENA', 'Examen', 'Université', 'CAFOP'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                filterType === cat
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'TOUS' ? 'Toutes filières' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">
              Dossiers d'Inscriptions Scolaires ({filteredRegistrations.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Suivi des paiements officiels et des fiches imprimées
            </p>
          </div>
          {filteredRegistrations.length > 0 && (
            <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Total sélection : {formatFCFA(filteredRegistrations.reduce((a, b) => a + (Number(b.totalAmount) || 0), 0))}
            </span>
          )}
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">Aucun dossier d'inscription scolaire trouvé</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cliquez sur "Nouvelle Inscription" ou sur l'un des accès rapides ci-dessus pour enregistrer le premier élève.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
            >
              <Plus className="w-4 h-4" />
              Enregistrer une inscription
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">N° Dossier</th>
                  <th className="p-3">Élève & Matricule</th>
                  <th className="p-3">Établissement & Classe</th>
                  <th className="p-3">Type & Opérateur</th>
                  <th className="p-3">Détail Frais</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => {
                  const statusColors: Record<SchoolRegistrationStatus, { bg: string; text: string; border: string }> = {
                    'Dossier reçu': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
                    'Paiement en cours': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
                    'Inscrit avec succès': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
                    'Fiche imprimée & Remise': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
                  };

                  return (
                    <tr key={reg.id} className="hover:bg-emerald-50/40 transition">
                      <td className="p-3">
                        <span className="font-mono font-black text-emerald-950 block">
                          {reg.registrationNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateFr(reg.date)}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-black text-slate-900 flex items-center gap-1.5">
                          <span>{reg.studentName}</span>
                          {reg.studentGender && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-600">
                              {reg.studentGender}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                          Matricule : {reg.matriculeMENA || 'Non renseigné'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Parent : {reg.clientName} ({reg.phone})
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{reg.schoolName}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                          Classe : {reg.classLevel} ({reg.academicYear})
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800">{reg.registrationType}</div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                            {reg.paymentOperator}
                          </span>
                          {reg.transactionReference && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Réf: {reg.transactionReference}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-black text-slate-900">{formatFCFA(reg.totalAmount)}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>État : {formatFCFA(reg.officialFee)}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">Cyber : {formatFCFA(reg.serviceFee)}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                              statusColors[reg.status]?.bg || 'bg-slate-100'
                            } ${statusColors[reg.status]?.text || 'text-slate-700'} ${
                              statusColors[reg.status]?.border || 'border-slate-200'
                            }`}
                          >
                            {reg.status}
                          </span>

                          {/* Quick advance status */}
                          {reg.status === 'Dossier reçu' && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(reg.id, 'Paiement en cours')}
                              className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold"
                            >
                              Payer
                            </button>
                          )}
                          {reg.status === 'Paiement en cours' && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(reg.id, 'Inscrit avec succès')}
                              className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold"
                            >
                              Valider
                            </button>
                          )}
                          {reg.status === 'Inscrit avec succès' && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(reg.id, 'Fiche imprimée & Remise')}
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black"
                            >
                              Imprimer & Remettre
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenPrint && (
                            <button
                              title="Imprimer récépissé d'inscription"
                              type="button"
                              onClick={() => onOpenPrint({ type: 'schoolRegistrationReceipt' as any, data: reg as any })}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            title="Modifier le dossier"
                            type="button"
                            onClick={() => handleOpenEdit(reg)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Supprimer le dossier"
                            type="button"
                            onClick={() => {
                              if (confirm(`Confirmez-vous la suppression de l'inscription ${reg.registrationNumber} (${reg.studentName}) ?`)) {
                                deleteSchoolRegistration(reg.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Inscription Scolaire */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 to-teal-950 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingRegistration ? `Modifier Inscription ${editingRegistration.registrationNumber}` : 'Nouvelle Inscription Scolaire en Ligne'}
                  </h2>
                  <p className="text-[11px] text-emerald-200">
                    Enregistrement officiel, quittance et traitement cyber SYGEMA CI
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Type Fast Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Type d'inscription / Examen officiel :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REGISTRATION_TEMPLATES.map((tpl) => {
                    const isSelected = formData.registrationType === tpl.type;
                    return (
                      <button
                        key={tpl.type}
                        type="button"
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`p-2 rounded-xl text-left border transition ${
                          isSelected
                            ? 'bg-emerald-950 text-white border-emerald-900 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-bold text-[11px] leading-tight block">{tpl.label}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 block ${isSelected ? 'text-amber-400' : 'text-emerald-800'}`}>
                          Total : {formatFCFA(tpl.defaultOfficialFee + tpl.defaultServiceFee)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Information */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
                <h3 className="font-black text-emerald-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Informations de l'Élève / Étudiant
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Nom et Prénoms de l'Élève *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="Ex: Konan Koffi Emmanuel"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Genre
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex items-center gap-1 font-bold text-slate-800">
                        <input
                          type="radio"
                          name="gender"
                          checked={formData.studentGender === 'M'}
                          onChange={() => setFormData({ ...formData, studentGender: 'M' })}
                        />
                        Masculin (M)
                      </label>
                      <label className="flex items-center gap-1 font-bold text-slate-800 ml-2">
                        <input
                          type="radio"
                          name="gender"
                          checked={formData.studentGender === 'F'}
                          onChange={() => setFormData({ ...formData, studentGender: 'F' })}
                        />
                        Féminin (F)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Matricule MENA / N° Candidat *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.matriculeMENA}
                      onChange={(e) => setFormData({ ...formData, matriculeMENA: e.target.value.toUpperCase() })}
                      placeholder="Ex: 14285942B"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono font-bold text-emerald-900 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Établissement / Faculté *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="Ex: Lycée Moderne 1 Daloa"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Classe / Niveau *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.classLevel}
                      onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                      placeholder="Ex: 6ème 2, Terminale D, Licence 1"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Parent & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du Parent / Tuteur / Demandeur *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: M. Konan Paul"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Téléphone de contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 07 48 90 12 34"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Payment Operator & Financial Calculation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Opérateur de paiement officiel *
                    </label>
                    <select
                      value={formData.paymentOperator}
                      onChange={(e) => setFormData({ ...formData, paymentOperator: e.target.value as SchoolRegistrationPaymentOperator })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-bold text-slate-800"
                    >
                      <option value="TrésorMoney">TrésorMoney (TrésorPay Officiel)</option>
                      <option value="Wave">Wave Côte d'Ivoire</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Moov Money">Moov Money</option>
                      <option value="Espèces comptoir">Espèces comptoir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      N° Transaction / Quittance TrésorPay
                    </label>
                    <input
                      type="text"
                      value={formData.transactionReference}
                      onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                      placeholder="Ex: TM-2026-981245"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Frais Officiels État (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.officialFee}
                      onChange={(e) => {
                        const off = Number(e.target.value) || 0;
                        const serv = Number(formData.serviceFee) || 0;
                        const total = off + serv;
                        setFormData({ ...formData, officialFee: off, totalAmount: total, paidAmount: total });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Prestation Cyber SYGEMA (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.serviceFee}
                      onChange={(e) => {
                        const serv = Number(e.target.value) || 0;
                        const off = Number(formData.officialFee) || 0;
                        const total = off + serv;
                        setFormData({ ...formData, serviceFee: serv, totalAmount: total, paidAmount: total });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Total Encaissé Client (FCFA)
                    </label>
                    <input
                      type="number"
                      disabled
                      value={Number(formData.officialFee) + Number(formData.serviceFee)}
                      className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg font-black text-emerald-950"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Statut de l'inscription *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SchoolRegistrationStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-bold"
                  >
                    <option value="Dossier reçu">Dossier reçu (En attente de paiement)</option>
                    <option value="Paiement en cours">Paiement en cours</option>
                    <option value="Inscrit avec succès">Inscrit avec succès (Quittance générée)</option>
                    <option value="Fiche imprimée & Remise">Fiche imprimée & Remise au parent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date de traitement
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations / Informations complémentaires
                </label>
                <input
                  type="text"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Ex: Récépissé remis en mains propres avec 2 photocopies conformes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-black shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingRegistration ? 'Enregistrer les modifications' : 'Valider l\'inscription'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
