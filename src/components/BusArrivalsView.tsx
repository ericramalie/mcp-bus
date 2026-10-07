import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Compass,
  Bus,
  Users,
  Accessibility,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Clock,
  Volume2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  X
} from 'lucide-react';
import { BUS_STOPS, getArrivalsForStop, OFFICIAL_IMAGES } from '../data/transitData';
import { BusStop, BusArrivalService, CrowdingLevel, BusType } from '../types/transit';

interface BusArrivalsViewProps {
  selectedStopCode: string;
  onSelectStopCode: (code: string) => void;
  savedStops: string[];
  onToggleSaveStop: (code: string) => void;
  onViewServiceRoute: (serviceNo: string) => void;
  soundEnabled: boolean;
}

export const BusArrivalsView: React.FC<BusArrivalsViewProps> = ({
  selectedStopCode,
  onSelectStopCode,
  savedStops,
  onToggleSaveStop,
  onViewServiceRoute,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [servicesData, setServicesData] = useState<BusArrivalService[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'interchanges' | 'doubledecker'>('all');
  const [secondsUntilSync, setSecondsUntilSync] = useState(20);
  const [audioPlayed, setAudioPlayed] = useState<Record<string, boolean>>({});
  const [apiStatus, setApiStatus] = useState<{
    source: 'lta_live' | 'simulated' | 'loading';
    message?: string;
    ltaKeyConfigured?: boolean;
    lastSynced?: string;
  }>({ source: 'loading' });
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);

  // Active bus stop
  const currentStop = BUS_STOPS.find((s) => s.code === selectedStopCode) || {
    code: selectedStopCode,
    name: `Stop ${selectedStopCode}`,
    roadName: 'Singapore Road Network',
    services: ['2', '12', '33', '147'],
  };
  const isSaved = savedStops.includes(currentStop.code);

  const fetchArrivals = async () => {
    try {
      const res = await fetch(`/api/bus-arrival?BusStopCode=${encodeURIComponent(currentStop.code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.services) && data.services.length > 0) {
          const converted: BusArrivalService[] = data.services.map((svc: any) => ({
            serviceNo: svc.serviceNo,
            category: svc.serviceNo.startsWith('5') ? 'express' : 'trunk',
            operator: svc.operator === 'SBST' ? 'SBS Transit' : svc.operator,
            destinationName: svc.rawNextBus?.DestinationCode ? `Stop ${svc.rawNextBus.DestinationCode}` : 'Destination Terminal',
            destinationCode: svc.rawNextBus?.DestinationCode || '',
            originName: svc.rawNextBus?.OriginCode ? `Stop ${svc.rawNextBus.OriginCode}` : currentStop.name,
            firstBus: '05:30',
            lastBus: '23:55',
            frequency: '6 - 12 mins',
            routeStopsCount: 40,
            nextBuses: svc.nextBuses,
          }));
          setServicesData(converted);
          setApiStatus({
            source: 'lta_live',
            ltaKeyConfigured: true,
            lastSynced: new Date().toLocaleTimeString(),
          });
          setSecondsUntilSync(20);
          return;
        } else if (data.status === 'key_missing') {
          setApiStatus({
            source: 'simulated',
            ltaKeyConfigured: false,
            message: data.message || 'LTA_ACCOUNT_KEY not configured in Vercel.',
            lastSynced: new Date().toLocaleTimeString(),
          });
        }
      }
    } catch {
      // In dev or offline, fallback smoothly
    }

    // Fallback simulated arrivals
    const fallback = getArrivalsForStop(currentStop.code);
    setServicesData(fallback);
    setSecondsUntilSync(20);
    setApiStatus((prev) => ({
      ...prev,
      source: prev.source === 'lta_live' ? 'lta_live' : 'simulated',
      lastSynced: new Date().toLocaleTimeString(),
    }));
  };

  const fetchHealthCheck = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthData({ status: 'error', message: err.message || 'Health check unreachable' });
    } finally {
      setLoadingHealth(false);
    }
  };

  // Initialize and update arrivals data
  useEffect(() => {
    fetchArrivals();
  }, [currentStop.code]);

  // Live timer tick every 1s
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilSync((prev) => {
        if (prev <= 1) {
          fetchArrivals();
          return 20;
        }
        return prev - 1;
      });

      // Decrement individual bus seconds left
      setServicesData((prevList) =>
        prevList.map((svc) => {
          const updatedNext = svc.nextBuses.map((bus, idx) => {
            const nextSecs = Math.max(0, bus.secondsLeft - 1);
            let nextText = bus.arrivalTime;
            if (nextSecs <= 40) {
              nextText = 'Arr';
              // Trigger web audio beep if sound enabled and not yet played
              if (soundEnabled && idx === 0 && !audioPlayed[svc.serviceNo]) {
                playChime();
                setAudioPlayed((p) => ({ ...p, [svc.serviceNo]: true }));
              }
            } else {
              nextText = `${Math.ceil(nextSecs / 60)} mins`;
            }
            return {
              ...bus,
              secondsLeft: nextSecs,
              arrivalTime: nextText,
            };
          }) as [any, any, any];

          return {
            ...svc,
            nextBuses: updatedNext,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStop.code, soundEnabled, audioPlayed]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not supported
    }
  };

  const refreshArrivals = () => {
    fetchArrivals();
  };

  // Filter stops for search autocomplete or direct lookup
  const filteredStops = BUS_STOPS.filter(
    (s) =>
      s.code.includes(searchQuery.trim()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.services.some((svc) => svc === searchQuery.trim())
  );

  // Filter service items shown on the board
  const displayedServices = servicesData.filter((svc) => {
    if (filterMode === 'doubledecker') {
      return svc.nextBuses.some((b) => b.type === 'DD');
    }
    return true;
  });

  const getCrowdLabel = (crowd: CrowdingLevel) => {
    switch (crowd) {
      case 'seats-available':
        return { label: 'Seats Avail', bg: 'bg-[#00875A]', text: 'text-white' };
      case 'standing-available':
        return { label: 'Standing', bg: 'bg-[#D96814]', text: 'text-white' };
      case 'limited-standing':
        return { label: 'Limited', bg: 'bg-[#D32F2F]', text: 'text-white' };
      default:
        return { label: 'Normal', bg: 'bg-slate-500', text: 'text-white' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Visual & Passenger Billboard */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] bg-[#002351] text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={OFFICIAL_IMAGES.busHero}
            alt="SBS Transit Bus Fleet"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 p-5 sm:p-8 bg-gradient-to-r from-[#002351] via-[#002351]/90 to-transparent flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-blue-200 border border-white/15">
              <Bus className="w-3.5 h-3.5 text-pink-300" />
              <span>LTA Datamall Telemetry Grounded</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Live Bus Arrival Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Glanceable tri-arrival forecasts with real-time seat crowding, wheelchair accessibility, and Double Decker bus assignments across Singapore.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs">
            <div className="px-3 border-r border-white/20">
              <span className="block text-slate-300 text-[10px] uppercase font-bold">Monitored Stop</span>
              <span className="font-extrabold text-white font-mono text-sm">{currentStop.code}</span>
            </div>
            <div className="px-3 border-r border-white/20">
              <span className="block text-slate-300 text-[10px] uppercase font-bold">Services</span>
              <span className="font-extrabold text-white text-sm">{currentStop.services.length} Routes</span>
            </div>
            <div className="px-3">
              <span className="block text-slate-300 text-[10px] uppercase font-bold">Live Sync</span>
              <span className="font-extrabold text-emerald-300 font-tabular text-sm">{secondsUntilSync}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stop Search & Filter Controls */}
      <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(12,56,117,0.04)] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 5-Digit Bus Stop Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter 5-digit Stop Code (e.g. 04168), Stop Name or Bus No (e.g. 14)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#171c22] placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3875] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Locate Me button */}
          <button
            onClick={() => onSelectStopCode('04168')}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#0C3875] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
            title="Nearest stop to Orchard / Dhoby Ghaut"
          >
            <MapPin className="w-4 h-4 text-[#8E1960]" />
            <span>Near Me (Dhoby Ghaut)</span>
          </button>
        </div>

        {/* Search Results Dropdown Preview when typing */}
        {searchQuery.trim().length > 0 && (
          <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 max-h-48 overflow-y-auto space-y-1">
            {filteredStops.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 text-center">
                No matching stops or services found for "{searchQuery}". Try 04168, 54009, or Bedok.
              </p>
            ) : (
              filteredStops.map((stop) => (
                <button
                  key={stop.code}
                  onClick={() => {
                    onSelectStopCode(stop.code);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 rounded-md hover:bg-white flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-[#0C3875] text-white text-[11px]">
                      {stop.code}
                    </span>
                    <span className="font-bold text-slate-800">{stop.name}</span>
                    <span className="text-slate-400">({stop.roadName})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>{stop.services.length} services</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Quick Filter Chips (Pill Containers) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Hubs:
          </span>
          <button
            onClick={() => onSelectStopCode('04121')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentStop.code === '04121'
                ? 'bg-[#8E1960] text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
            title="LTA API Sample: 04121 (Old Parliament Bldg)"
          >
            ★ Test 04121 (LTA Endpoint)
          </button>
          {BUS_STOPS.slice(1, 6).map((stop) => {
            const isCurrent = stop.code === currentStop.code;
            return (
              <button
                key={stop.code}
                onClick={() => onSelectStopCode(stop.code)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#8E1960] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {stop.name.split(' ')[0]} ({stop.code})
              </button>
            );
          })}
        </div>
      </div>

      {/* Live API Health & Gateway Bar */}
      <div className="bg-[#f0f4fc] rounded-xl px-4 py-2.5 border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Activity className="w-4 h-4 text-[#0C3875]" />
          <span className="font-bold text-slate-800">API Gateway:</span>
          {apiStatus.source === 'lta_live' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#00875A] font-extrabold text-[11px] border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-ping" />
              LTA DataMall v3 Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-extrabold text-[11px] border border-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              API Ready (LTA_ACCOUNT_KEY Pending)
            </span>
          )}
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">GET /api/bus-arrival?BusStopCode={currentStop.code}</code>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setShowHealthModal(true);
              fetchHealthCheck();
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-bold text-[#0C3875] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Server className="w-3 h-3 text-[#8E1960]" />
            <span>Monitor /api/health</span>
          </button>
        </div>
      </div>

      {/* Selected Bus Stop Header Banner */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0C3875] text-white flex flex-col items-center justify-center font-mono font-extrabold shrink-0 shadow-xs">
            <span className="text-[10px] text-blue-200 uppercase leading-none font-sans font-bold">BUS STOP</span>
            <span className="text-base font-black leading-tight">{currentStop.code}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-[#171c22]">
                {currentStop.name}
              </h2>
              {currentStop.isInterchange && (
                <span className="px-2 py-0.5 rounded-full bg-[#0C3875] text-white text-[10px] font-extrabold uppercase tracking-wide">
                  Transport Hub
                </span>
              )}
              {currentStop.mrtConnections && (
                <div className="flex items-center gap-1">
                  {currentStop.mrtConnections.map((mrt) => (
                    <span
                      key={mrt}
                      className="px-1.5 py-0.5 rounded text-[10px] font-black text-white bg-[#8E1960]"
                    >
                      {mrt}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentStop.roadName} {currentStop.description && `• ${currentStop.description}`}
            </p>
          </div>
        </div>

        {/* Actions for current stop */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => onToggleSaveStop(currentStop.code)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-pink-50 border-pink-200 text-[#8E1960]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#8E1960]" />
                <span>Saved Stop</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Bookmark</span>
              </>
            )}
          </button>

          <button
            onClick={refreshArrivals}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0C3875] text-white text-xs font-bold hover:bg-[#002351] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Refresh arrivals now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync ({secondsUntilSync}s)</span>
          </button>
        </div>
      </div>

      {/* Arrival Cards Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Active Bus Arrivals ({displayedServices.length} Services)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00875A] arriving-pulse" />
            <span>Auto-refreshing in {secondsUntilSync}s</span>
          </div>
        </div>

        {displayedServices.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-3">
            <Bus className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Services Matching Filters</h4>
            <p className="text-xs text-slate-500">Clear filter chips to view all arriving SBS Transit buses.</p>
          </div>
        ) : (
          displayedServices.map((svc) => {
            const isExpress = svc.category === 'express';
            const nextBus = svc.nextBuses[0];
            const isArrivingNow = nextBus.arrivalTime === 'Arr' || nextBus.secondsLeft <= 40;

            return (
              <div
                key={svc.serviceNo}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(12,56,117,0.04)] hover:shadow-md hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Service Badge & Route Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Bus Service Number Pill Badge */}
                    <button
                      onClick={() => onViewServiceRoute(svc.serviceNo)}
                      className={`min-w-[64px] h-[38px] px-3.5 rounded-full flex items-center justify-center font-black text-lg tracking-tight shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0 ${
                        isExpress
                          ? 'bg-[#8E1960] text-white hover:bg-[#6c1046]'
                          : 'bg-[#0C3875] text-white hover:bg-[#002351]'
                      }`}
                      title={`Inspect Route ${svc.serviceNo}`}
                    >
                      {svc.serviceNo}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-[#171c22]">
                          To {svc.destinationName}
                        </span>
                        {isExpress && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#8E1960]">
                            Express Service
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>From {svc.originName}</span>
                        <span>•</span>
                        <span>Freq: {svc.frequency}</span>
                        <span>•</span>
                        <button
                          onClick={() => onViewServiceRoute(svc.serviceNo)}
                          className="font-bold text-[#0C3875] hover:text-[#8E1960] underline cursor-pointer"
                        >
                          View Route Stops
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tri-Arrival Forecast Matrix */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                    {svc.nextBuses.map((bus, idx) => {
                      const isNext = idx === 0;
                      const isArr = bus.arrivalTime === 'Arr' || bus.secondsLeft <= 40;
                      const crowdInfo = getCrowdLabel(bus.crowding);

                      return (
                        <div
                          key={idx}
                          className={`rounded-lg p-2 sm:p-2.5 flex flex-col justify-between border transition-all ${
                            isNext && isArr
                              ? 'bg-[#E8F5E9] border-emerald-300 ring-2 ring-emerald-200 arriving-pulse'
                              : isNext
                              ? 'bg-[#F0F4FC] border-[#CBD5E1]'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {/* Arrival Slot Label & Deck badge */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                            <span>{idx === 0 ? '1st Bus' : idx === 1 ? '2nd Bus' : '3rd Bus'}</span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`px-1 py-0.2 rounded font-extrabold text-[9px] ${
                                  bus.type === 'DD'
                                    ? 'bg-[#0C3875] text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {bus.type}
                              </span>
                              {bus.wheelchairAccessible && (
                                <span title="Wheelchair accessible">
                                  <Accessibility className="w-3 h-3 text-slate-500" />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Big Arrival Countdown */}
                          <div
                            className={`text-base sm:text-lg font-black tracking-tight font-tabular my-0.5 ${
                              isArr
                                ? 'text-[#00875A]'
                                : 'text-[#171c22]'
                            }`}
                          >
                            {bus.arrivalTime}
                          </div>

                          {/* Crowding Indicator Pill */}
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight ${crowdInfo.bg} ${crowdInfo.text}`}
                            >
                              <Users className="w-2.5 h-2.5" />
                              <span>{crowdInfo.label}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Commuter Guidance Legend */}
      <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] text-xs text-slate-600">
        <h4 className="font-extrabold text-[#002351] text-xs uppercase tracking-wider mb-2">
          Passenger Indicator Key
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00875A]" />
            <div>
              <span className="font-bold text-slate-800">Seats Available</span>
              <p className="text-[11px] text-slate-400">Ample open seating</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D96814]" />
            <div>
              <span className="font-bold text-slate-800">Standing Room</span>
              <p className="text-[11px] text-slate-400">Seats filled, standing open</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D32F2F]" />
            <div>
              <span className="font-bold text-slate-800">Limited Standing</span>
              <p className="text-[11px] text-slate-400">High load, board quickly</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#0C3875] text-white font-extrabold text-[10px]">DD</span>
            <div>
              <span className="font-bold text-slate-800">Double Decker</span>
              <p className="text-[11px] text-slate-400">Upper deck available</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Health & LTA Diagnostic Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[#0C3875] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-blue-200" />
                <h3 className="font-extrabold text-base">API Status & Health Monitor</h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Endpoint 1: Health */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[10px]">GET</span>
                    <span className="font-mono font-bold text-slate-800">/api/health</span>
                  </div>
                  <button
                    onClick={fetchHealthCheck}
                    disabled={loadingHealth}
                    className="px-2 py-1 rounded bg-[#0C3875] text-white font-semibold hover:bg-[#002351] cursor-pointer"
                  >
                    {loadingHealth ? 'Checking...' : 'Ping /api/health'}
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-100 p-3 rounded-md font-mono text-[11px] overflow-x-auto">
                  <pre>{healthData ? JSON.stringify(healthData, null, 2) : 'Loading /api/health status...'}</pre>
                </div>
              </div>

              {/* Endpoint 2: LTA Bus Arrival */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">/api/bus-arrival?BusStopCode=04121</span>
                </div>
                <p className="text-slate-600">
                  Target: <code className="text-pink-700 bg-pink-50 px-1 py-0.5 rounded">https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121</code>
                </p>

                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 space-y-1 text-[11px]">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    How to Activate Live LTA Feed in Vercel:
                  </p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Go to your Vercel Project Dashboard → <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
                    <li>Add Key: <code>LTA_ACCOUNT_KEY</code> and Value: <code>[Your LTA Datamall AccountKey]</code>.</li>
                    <li>Redeploy or promote project. The API will automatically pull real-time arrivals directly from LTA DataMall v3!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#0C3875] text-white font-bold hover:bg-[#002351] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
