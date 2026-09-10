export const formatFCFA = (amount: number | string | undefined | null): string => {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(val) + ' FCFA';
};

export const formatDateFr = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTimeFr = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const formatDateLongFr = (dateInput: Date | string | undefined | null): string => {
  if (!dateInput) return '-';
  try {
    const d = typeof dateInput === 'string' ? parseToLocalDate(dateInput) : dateInput;
    if (!d || isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(dateInput);
  }
};

/**
 * Parse une chaîne de date de façon sûre (gère YYYY-MM-DD sans décalage de fuseau)
 */
export const parseToLocalDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      const [year, month, day] = dateStr.trim().split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

/**
 * Détermine si une date correspond à aujourd'hui (même année, mois et jour)
 */
export const isDateToday = (dateStr?: string | null, fallbackDateStr?: string | null): boolean => {
  const d = parseToLocalDate(dateStr) || parseToLocalDate(fallbackDateStr);
  if (!d) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

/**
 * Calcule l'intervalle de la semaine courante (Lundi 00:00:00 au Dimanche 23:59:59)
 */
export const getCurrentWeekRange = (baseDate = new Date()): { start: Date; end: Date; label: string } => {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 = Dimanche, 1 = Lundi ...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const startStr = monday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  const endStr = sunday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return {
    start: monday,
    end: sunday,
    label: `Semaine du ${startStr} au ${endStr}`,
  };
};

/**
 * Détermine si une date se situe dans la semaine courante
 */
export const isDateInThisWeek = (dateStr?: string | null, fallbackDateStr?: string | null): boolean => {
  const d = parseToLocalDate(dateStr) || parseToLocalDate(fallbackDateStr);
  if (!d) return false;
  const { start, end } = getCurrentWeekRange();
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
};

/**
 * Retourne la liste des 7 jours de la semaine courante (Lundi à Dimanche)
 */
export const getWeekDays = (baseDate = new Date()) => {
  const { start } = getCurrentWeekRange(baseDate);
  const now = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);
    dayDate.setHours(12, 0, 0, 0);

    const isToday =
      dayDate.getFullYear() === now.getFullYear() &&
      dayDate.getMonth() === now.getMonth() &&
      dayDate.getDate() === now.getDate();

    const dayName = dayDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    const dayNumber = dayDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

    return {
      date: dayDate,
      dateISO: dayDate.toISOString().split('T')[0],
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dayNumber,
      isToday,
    };
  });
};
