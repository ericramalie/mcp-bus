import React from 'react';
import { Bookmark, MapPin, Trash2, Bus, ExternalLink, Plus, ChevronRight } from 'lucide-react';
import { BUS_STOPS, getArrivalsForStop } from '../data/transitData';
import { BusStop } from '../types/transit';

interface SavedStopsViewProps {
  savedStops: string[];
  onToggleSaveStop: (code: string) => void;
  onSelectStopCode: (code: string) => void;
  onViewServiceRoute: (serviceNo: string) => void;
}

export const SavedStopsView: React.FC<SavedStopsViewProps> = ({
  savedStops,
  onToggleSaveStop,
  onSelectStopCode,
  onViewServiceRoute,
}) => {
  const stops = BUS_STOPS.filter((s) => savedStops.includes(s.code));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#8E1960]" />
            <h2 className="text-xl font-black text-[#002351]">
              My Bookmarked Bus Stops ({savedStops.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pin frequent daily stops (Home, Office, MRT interchanges) for instant live departure access.
          </p>
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">
              No Saved Bus Stops Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tap the bookmark icon on any bus stop to pin it here for quick everyday commutes.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Add Popular Singapore Commuter Hubs:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {BUS_STOPS.slice(0, 4).map((s) => (
                <button
                  key={s.code}
                  onClick={() => onToggleSaveStop(s.code)}
                  className="px-3 py-1.5 rounded-full border border-slate-300 text-xs font-bold text-[#0C3875] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{s.name} ({s.code})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stops.map((stop) => {
            const arrivals = getArrivalsForStop(stop.code).slice(0, 3);

            return (
              <div
                key={stop.code}
                className="bg-white rounded-xl border border-[#CBD5E1] p-4 sm:p-5 shadow-[0_2px_4px_rgba(12,56,117,0.04)] hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs px-2 py-1 rounded bg-[#0C3875] text-white">
                        {stop.code}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-base text-[#171c22]">
                          {stop.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">{stop.roadName}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSaveStop(stop.code)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Micro Arrivals List */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    {arrivals.map((svc) => (
                      <div
                        key={svc.serviceNo}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => onViewServiceRoute(svc.serviceNo)}
                            className="font-black px-2 py-0.5 rounded-full bg-[#0C3875] text-white text-[11px] cursor-pointer hover:bg-[#8E1960]"
                          >
                            {svc.serviceNo}
                          </span>
                          <span className="text-slate-600 font-medium truncate max-w-[130px]">
                            To {svc.destinationName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-tabular font-extrabold">
                          <span className={svc.nextBuses[0].arrivalTime === 'Arr' ? 'text-[#00875A] font-black' : 'text-slate-900'}>
                            {svc.nextBuses[0].arrivalTime}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 text-[11px]">
                            {svc.nextBuses[1].arrivalTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onSelectStopCode(stop.code)}
                    className="text-xs font-bold text-[#0C3875] hover:text-[#8E1960] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Live Board</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
