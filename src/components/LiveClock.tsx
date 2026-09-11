import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'compact';
}

export const LiveClock: React.FC<LiveClockProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date in French
  const dayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const dayNumber = currentDate.toLocaleDateString('fr-FR', { day: 'numeric' });
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long' });
  const year = currentDate.getFullYear();

  // Format time HH:mm:ss
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  if (variant === 'banner') {
    return (
      <div
        id="live-clock-banner"
        className={`flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/40 text-white shadow-lg ${className}`}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
          <Clock className="w-5 h-5 animate-pulse text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{capitalizedDay} {dayNumber} {monthName} {year}</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest leading-none mt-0.5">
            <span>{hours}:{minutes}</span>
            <span className="text-amber-400 text-base sm:text-lg">:{seconds}</span>
            <span className="text-[10px] font-sans font-bold text-slate-400 ml-2 tracking-normal uppercase">
              Heure Locale
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        id="live-clock-compact"
        className={`flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 rounded-lg border border-slate-700 text-xs font-mono text-amber-300 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-bold">{hours}:{minutes}:{seconds}</span>
      </div>
    );
  }

  // Default navbar variant
  return (
    <div
      id="live-clock-navbar"
      className={`hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/95 hover:bg-slate-800 border border-slate-700/90 rounded-xl shadow-xs transition group ${className}`}
      title={`Date & Heure actuelles : ${capitalizedDay} ${dayNumber} ${monthName} ${year}`}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400/15 text-amber-400">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-300 capitalize leading-none">
          <Calendar className="w-2.5 h-2.5 text-amber-400/80" />
          <span>{capitalizedDay.slice(0, 3)}. {dayNumber} {monthName.slice(0, 4)}. {year}</span>
        </div>
        <div className="font-mono text-xs font-black text-amber-300 tracking-wider leading-tight mt-0.5">
          <span>{hours}:{minutes}</span>
          <span className="text-amber-400/80 text-[11px]">:{seconds}</span>
        </div>
      </div>
    </div>
  );
};
