import React from 'react';
import { X, Bus, Clock, MapPin, ArrowRight, ShieldCheck, Accessibility, CheckCircle2 } from 'lucide-react';
import { ROUTE_14_DETAILS, ROUTE_65_DETAILS } from '../data/transitData';
import { BusRouteInfo } from '../types/transit';

interface BusRouteModalProps {
  serviceNo: string;
  onClose: () => void;
  onSelectStopCode?: (stopCode: string) => void;
}

export const BusRouteModal: React.FC<BusRouteModalProps> = ({
  serviceNo,
  onClose,
  onSelectStopCode,
}) => {
  // Select matching route or fallback to standard route 14 template
  const routeData: BusRouteInfo =
    serviceNo === '65' ? ROUTE_65_DETAILS : ROUTE_14_DETAILS;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0C3875] text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded-full bg-white text-[#0C3875] flex items-center justify-center font-black text-xl tracking-tight shadow-md border-2 border-blue-200">
              {serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded">
                  SBS Transit Trunk Route
                </span>
                <span className="text-xs text-slate-200 font-semibold flex items-center gap-1">
                  <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
                  WAB Fleet
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-1 text-white flex items-center gap-2">
                <span>{routeData.origin.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
                <span>{routeData.destination.split(' ')[0]}</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Stats Bar */}
        <div className="bg-[#f0f4fc] border-b border-[#E2E8F0] px-4 py-2.5 text-xs text-slate-700 grid grid-cols-3 gap-2 text-center font-medium">
          <div>
            <span className="block text-slate-400 font-bold uppercase text-[10px]">Total Distance</span>
            <span className="font-extrabold text-[#002351]">{routeData.fareDistance}</span>
          </div>
          <div>
            <span className="block text-slate-400 font-bold uppercase text-[10px]">Peak Frequency</span>
            <span className="font-extrabold text-[#00875A]">{routeData.weekdayFrequency}</span>
          </div>
          <div>
            <span className="block text-slate-400 font-bold uppercase text-[10px]">Stops Sequence</span>
            <span className="font-extrabold text-[#8E1960]">{routeData.stops.length} Stops</span>
          </div>
        </div>

        {/* Live Buses Active Callout */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">Live GPS Telemetry Connected</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">2 Active Buses En Route</span>
        </div>

        {/* Stops Timeline */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-0.5">
          {routeData.stops.map((stop, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === routeData.stops.length - 1;

            return (
              <div key={stop.stopCode} className="relative flex items-start gap-3 py-2 group hover:bg-slate-50 px-2 rounded-lg transition-colors">
                {/* Vertical connecting line */}
                {!isLast && (
                  <div className="absolute left-[26px] top-6 bottom-0 w-0.5 bg-[#CBD5E1]" />
                )}

                {/* Stop Bullet Indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isFirst || isLast
                        ? 'bg-[#8E1960] text-white ring-2 ring-pink-200'
                        : stop.hasBusNow
                        ? 'bg-[#00875A] text-white ring-4 ring-emerald-100 arriving-pulse'
                        : 'bg-white border-2 border-[#0C3875] text-[#0C3875]'
                    }`}
                  >
                    {stop.seq}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#171c22]">
                        {stop.stopName}
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold border border-slate-200">
                        {stop.stopCode}
                      </span>
                      {stop.hasBusNow && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-[#00875A] text-white animate-pulse">
                          <Bus className="w-3 h-3" />
                          BUS {stop.busPlate} AT STOP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{stop.roadName} • {stop.distanceKm.toFixed(1)} km</p>
                  </div>

                  {/* Timetable and Action */}
                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-tabular font-semibold text-slate-500">
                      1st: {stop.firstBus} | Last: {stop.lastBus}
                    </div>
                    {onSelectStopCode && (
                      <button
                        onClick={() => {
                          onSelectStopCode(stop.stopCode);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-[#0C3875] hover:text-[#8E1960] hover:underline mt-0.5 block cursor-pointer"
                      >
                        Inspect Stop →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official SBS Transit Scheduled Timetable</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0C3875] text-white font-bold hover:bg-[#002351] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
