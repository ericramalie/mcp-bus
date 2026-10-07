import React, { useState } from 'react';
import {
  AlertTriangle,
  Info,
  Calendar,
  Bus,
  Train,
  CheckCircle,
  Bell,
  Share2,
  ExternalLink,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { DISRUPTIONS_DATA, OFFICIAL_IMAGES } from '../data/transitData';
import { DisruptionAlert } from '../types/transit';

export const AdvisoriesView: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const alerts = DISRUPTIONS_DATA.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'extensions') return item.category === 'Service Extension';
    if (filter === 'diversions') return item.category === 'Bus Diversion';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner with Formula 1 late night announcement */}
      <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#002351] text-white">
        <div className="relative">
          <img
            src={OFFICIAL_IMAGES.f1Banner}
            alt="Formula 1 Grand Prix Service Extension"
            className="w-full h-44 sm:h-56 object-cover object-center"
            onError={(e) => {
              // Graceful fallback if banner not rendered
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002351] via-[#002351]/60 to-transparent flex items-end p-5 sm:p-6">
            <div>
              <span className="px-2.5 py-1 rounded bg-[#8E1960] text-white text-xs font-black uppercase tracking-wider">
                Event Service Extension Notice
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Singapore Grand Prix: Extended Train & Bus Operations
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-normal">
                Last trains from city interchanges departing past 1:15 AM with feeder bus connections synchronized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disruption Alert Callout adhering to design system */}
      {/* "Full-width banner in #FFF3E0 with 4px solid left border in #D96814" */}
      <div className="bg-[#FFF3E0] border-l-4 border-[#D96814] rounded-r-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#D96814] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm text-[#873800] uppercase tracking-wide">
                Live Operating Advisory
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#D96814] text-white">
                Marina Bay Sector Diversion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#612500] font-medium leading-relaxed">
              SBS Transit buses 10, 70, 100, 130, 131, and 196 will temporarily skip bus stop 03011 (Fullerton Rd) due to civic parade event rehearsals. Commuters may board at Fullerton Sq (03019) or use the Downtown Line at Bayfront Station.
            </p>
            <div className="pt-1 text-[11px] font-bold text-[#873800] flex items-center gap-4">
              <span>Estimated delay: 0 - 5 mins</span>
              <span>Updated 12 mins ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Broadcast Subscription */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#002351] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Notices ({DISRUPTIONS_DATA.length})
          </button>
          <button
            onClick={() => setFilter('extensions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'extensions'
                ? 'bg-[#8E1960] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Service Extensions
          </button>
          <button
            onClick={() => setFilter('diversions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'diversions'
                ? 'bg-[#D96814] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bus Diversions
          </button>
        </div>

        <button
          onClick={() => setSubscribed(!subscribed)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
            subscribed
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-white text-[#0C3875] border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{subscribed ? 'Subscribed to Telegram/SMS' : 'Get Live Disruption Alerts'}</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isHigh = alert.severity === 'high';
          const isExtension = alert.category === 'Service Extension';
          const isDiversion = alert.category === 'Bus Diversion';

          return (
            <div
              key={alert.id}
              className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(12,56,117,0.04)] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide text-white ${
                      isExtension
                        ? 'bg-[#8E1960]'
                        : isDiversion
                        ? 'bg-[#D96814]'
                        : 'bg-[#002351]'
                    }`}
                  >
                    {alert.category}
                  </span>
                  <h3 className="font-extrabold text-base text-[#171c22]">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {alert.message}
              </p>

              {/* Affected Services Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                {alert.linesAffected && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-bold text-[11px]">Rail Lines:</span>
                    {alert.linesAffected.map((line) => (
                      <span
                        key={line}
                        className="px-2 py-0.5 rounded bg-purple-50 text-[#8E1960] font-bold text-[11px] border border-purple-200"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                )}

                {alert.busServicesAffected && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-slate-400 font-bold text-[11px]">Affected Buses:</span>
                    {alert.busServicesAffected.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded bg-blue-50 text-[#0C3875] font-black text-[11px] border border-blue-200"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Alternate advice callout */}
              {alert.alternativeTravelAdvice && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Recommended Alternative: </span>
                    <span>{alert.alternativeTravelAdvice}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
