import React, { useState, useEffect } from 'react';
import { Bus, Train, MapPin, AlertCircle, Compass, Bookmark, Clock, RefreshCw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { OFFICIAL_IMAGES } from '../data/transitData';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedStopsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRefreshAll: () => void;
  lastRefreshTime: Date;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedStopsCount,
  soundEnabled,
  onToggleSound,
  onRefreshAll,
  lastRefreshTime,
}) => {
  const [singaporeTime, setSingaporeTime] = useState<string>('');
  const [showNotice, setShowNotice] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Singapore is UTC+8
      const formatted = new Intl.DateTimeFormat('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setSingaporeTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'buses', label: 'Bus Arrivals', icon: Bus },
    { id: 'rail', label: 'Rail Network', icon: Train },
    { id: 'planner', label: 'Journey Planner', icon: MapPin },
    { id: 'advisories', label: 'Advisories', icon: AlertCircle, badge: '2' },
    { id: 'guide', label: 'Travel Guide & Fares', icon: Compass },
    { id: 'saved', label: 'My Saved Stops', icon: Bookmark, badge: savedStopsCount > 0 ? String(savedStopsCount) : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-[0_2px_4px_rgba(12,56,117,0.05)]">
      {/* Top Corporate & System Status Bar */}
      {showNotice && (
        <div className="bg-[#002351] text-white text-xs px-4 py-1.5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#8E1960] text-white font-bold text-[10px] uppercase tracking-wider">
              Service Notice
            </span>
            <span className="truncate text-slate-200">
              Formula 1 Grand Prix: Late-night train & bus extension across NEL & DTL lines.
            </span>
            <button
              onClick={() => onSelectTab('advisories')}
              className="underline text-blue-200 hover:text-white font-semibold cursor-pointer shrink-0"
            >
              View Schedule
            </button>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-slate-300 hover:text-white ml-2 text-sm leading-none shrink-0"
            title="Dismiss notice"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Operational Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="#buses"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTab('buses');
                }}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="bg-white p-1 rounded-md border border-[#E2E8F0] shadow-xs">
                  <img
                    src={OFFICIAL_IMAGES.logo}
                    alt="SBS Transit Logo"
                    className="h-9 sm:h-10 w-auto object-contain"
                    onError={(e) => {
                      // Fallback branding if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-[#002351] tracking-tight">
                      SBS <span className="text-[#8E1960]">Transit</span>
                    </span>
                    <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      ComfortDelGro Company
                    </span>
                  </div>
                  <p className="text-[11px] text-[#434750] font-medium tracking-wide">
                    SINGAPORE LIVE PASSENGER TRANSIT PORTAL
                  </p>
                </div>
              </a>
            </div>

            {/* Mobile Sound & Refresh buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-lg border text-xs font-semibold ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title={soundEnabled ? 'Arrival chime enabled' : 'Arrival chime muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onRefreshAll}
                className="p-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0C3875] hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
                title="Refresh arrival timers"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time telemetry & Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live Operational Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8F5E9] border border-emerald-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00875A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00875A]"></span>
              </span>
              <span className="text-xs font-bold text-[#00875A]">
                Rail & Bus Ops Normal
              </span>
            </div>

            {/* Singapore Clock */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-tabular font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#0C3875]" />
              <span>SGT {singaporeTime || '--:--:--'}</span>
            </div>

            {/* Audio chime toggle */}
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={soundEnabled ? 'Arrival chime on for next bus' : 'Muted'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Muted</span>
                </>
              )}
            </button>

            {/* Refresh Action */}
            <button
              onClick={onRefreshAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C3875] text-white hover:bg-[#002351] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Live Sync</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0C3875] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#0C3875] hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#8E1960] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
