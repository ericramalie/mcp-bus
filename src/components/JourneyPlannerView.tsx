import React, { useState } from 'react';
import {
  MapPin,
  ArrowRightLeft,
  Navigation,
  Clock,
  Footprints,
  CreditCard,
  Users,
  Bus,
  Train,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SAMPLE_JOURNEYS } from '../data/transitData';
import { JourneyOption, CrowdingLevel } from '../types/transit';

interface JourneyPlannerViewProps {
  onInspectBusRoute?: (serviceNo: string) => void;
}

const PRESET_PLACES = [
  'Dhoby Ghaut Stn (NE6/NS24)',
  'Chinatown Point (NE4/DT19)',
  'HarbourFront Int / VivoCity',
  'Bedok Interchange Mall',
  'Clementi Town Centre',
  'Ang Mo Kio Hub',
  'Tampines Central',
  'Punggol Waterway Point',
  'Marina Bay Financial Centre',
];

export const JourneyPlannerView: React.FC<JourneyPlannerViewProps> = ({
  onInspectBusRoute,
}) => {
  const [origin, setOrigin] = useState<string>('Dhoby Ghaut Stn (NE6/NS24)');
  const [destination, setDestination] = useState<string>('Bedok Interchange Mall');
  const [selectedPreference, setSelectedPreference] = useState<'fastest' | 'least-walking' | 'fewer-transfers'>('fastest');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-1');

  const journeyOptions: JourneyOption[] = SAMPLE_JOURNEYS.default;
  const activeOption = journeyOptions.find((o) => o.id === selectedOptionId) || journeyOptions[0];

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const getCrowdBadge = (crowd: CrowdingLevel) => {
    switch (crowd) {
      case 'seats-available':
        return { label: 'Seats Available', bg: 'bg-[#00875A]', text: 'text-white' };
      case 'standing-available':
        return { label: 'Standing Only', bg: 'bg-[#D96814]', text: 'text-white' };
      case 'limited-standing':
        return { label: 'Crowded', bg: 'bg-[#D32F2F]', text: 'text-white' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Planner Header Box */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-[0_2px_4px_rgba(12,56,117,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-[#8E1960]" />
          <h2 className="text-xl font-black text-[#002351]">
            Singapore Inter-Modal Journey Planner
          </h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Origin
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Where are you starting from?"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#171c22] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3875]"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center pt-4 md:pt-4">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors shadow-xs cursor-pointer active:rotate-180"
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#0C3875]" />
            </button>
          </div>

          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8E1960] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#171c22] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3875]"
              />
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Popular:</span>
          {PRESET_PLACES.slice(0, 5).map((place, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx % 2 === 0) setOrigin(place);
                else setDestination(place);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer"
            >
              {place.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Itineraries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Options List (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Available Routes ({journeyOptions.length})
          </h3>

          {journeyOptions.map((opt) => {
            const isSelected = opt.id === selectedOptionId;
            const crowd = getCrowdBadge(opt.crowding);

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#0C3875] shadow-md ring-2 ring-blue-100'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#002351]">
                    {opt.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${crowd.bg} ${crowd.text}`}>
                    {crowd.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-3">
                  <span className="flex items-center gap-1 text-slate-900 font-extrabold text-base font-tabular">
                    <Clock className="w-4 h-4 text-[#0C3875]" />
                    {opt.durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-slate-400" />
                    {opt.walkingMinutes} min walk
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CreditCard className="w-3.5 h-3.5" />
                    ${opt.estimatedFare.toFixed(2)}
                  </span>
                </div>

                {/* Micro legs visual */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {opt.legs.map((leg, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {leg.type === 'walk' && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center gap-1">
                          <Footprints className="w-3 h-3" />
                        </span>
                      )}
                      {leg.type === 'mrt' && (
                        <span
                          className="px-2 py-0.5 rounded text-white text-[10px] font-black"
                          style={{ backgroundColor: leg.color || '#8E1960' }}
                        >
                          {leg.serviceOrLine}
                        </span>
                      )}
                      {leg.type === 'bus' && (
                        <span className="px-2 py-0.5 rounded bg-[#0C3875] text-white text-[10px] font-black">
                          Bus {leg.serviceOrLine}
                        </span>
                      )}
                      {lIdx < opt.legs.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Itinerary Step-by-Step Directions (Right) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#8E1960] tracking-wider">
                Step-by-Step Direction Itinerary
              </span>
              <h3 className="text-xl font-black text-[#171c22] mt-0.5">
                {activeOption.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#002351] font-tabular">
                {activeOption.durationMinutes} min
              </span>
              <p className="text-xs text-emerald-600 font-bold">
                Adult Fare: ${activeOption.estimatedFare.toFixed(2)} (SimplyGo)
              </p>
            </div>
          </div>

          {/* Detailed Legs Timeline */}
          <div className="space-y-4">
            {activeOption.legs.map((leg, idx) => {
              const isLast = idx === activeOption.legs.length - 1;

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-slate-200" />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
                      leg.type === 'walk'
                        ? 'bg-slate-400'
                        : leg.type === 'mrt'
                        ? 'bg-[#8E1960]'
                        : 'bg-[#0C3875]'
                    }`}
                  >
                    {leg.type === 'walk' ? (
                      <Footprints className="w-4 h-4" />
                    ) : leg.type === 'mrt' ? (
                      <Train className="w-4 h-4" />
                    ) : (
                      <Bus className="w-4 h-4" />
                    )}
                  </div>

                  {/* Detail */}
                  <div className="flex-1 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                        {leg.type === 'walk'
                          ? 'Walking Leg'
                          : leg.type === 'mrt'
                          ? `MRT Rail (${leg.serviceOrLine})`
                          : `SBS Transit Bus (${leg.serviceOrLine})`}
                      </span>
                      <span className="text-xs font-bold text-slate-700 font-tabular">
                        {leg.durationMins} mins
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {leg.instruction}
                    </p>

                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                      <span>From: <strong>{leg.from}</strong></span>
                      <span>To: <strong>{leg.to}</strong></span>
                      {leg.stopsCount && (
                        <span>({leg.stopsCount} stops)</span>
                      )}
                    </div>

                    {leg.type === 'bus' && leg.serviceOrLine && onInspectBusRoute && (
                      <button
                        onClick={() => onInspectBusRoute(leg.serviceOrLine!)}
                        className="mt-2 text-xs font-bold text-[#0C3875] hover:text-[#8E1960] underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Bus {leg.serviceOrLine} Live Status & Schedule →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Distance-based through-ticketing applied (LTA fare matrix)</span>
            </div>
            <span className="font-bold">No transfer penalty</span>
          </div>
        </div>
      </div>
    </div>
  );
};
