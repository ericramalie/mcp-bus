import React, { useState } from 'react';
import {
  Train,
  CheckCircle,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Accessibility,
  Bike,
  HeartHandshake,
  Baby,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MRT_LINE_STATUSES, MRT_STATIONS, OFFICIAL_IMAGES } from '../data/transitData';
import { MRTStation } from '../types/transit';

interface RailNetworkViewProps {
  onSelectStationBusStop?: (code: string) => void;
}

export const RailNetworkView: React.FC<RailNetworkViewProps> = ({
  onSelectStationBusStop,
}) => {
  const [selectedLine, setSelectedLine] = useState<'ALL' | 'NEL' | 'DTL'>('ALL');
  const [activeStationCode, setActiveStationCode] = useState<string>('NE4 / DT19'); // Chinatown

  const activeStation =
    MRT_STATIONS.find((s) => s.code === activeStationCode) || MRT_STATIONS[0];

  const filteredStations = MRT_STATIONS.filter((stn) => {
    if (selectedLine === 'ALL') return true;
    return stn.line === selectedLine;
  });

  return (
    <div className="space-y-6">
      {/* Rail Network Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] bg-[#002351] text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={OFFICIAL_IMAGES.trainHero}
            alt="SBS Transit Train Services"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 p-5 sm:p-8 bg-gradient-to-r from-[#002351] via-[#002351]/95 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-pink-200 border border-white/15">
              <Train className="w-3.5 h-3.5 text-pink-300" />
              <span>SBS Transit Rail Operations (NEL & DTL)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              MRT & LRT Network Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Real-time service updates, first/last train timetables, barrier-free accessibility, and interchange connections across North East Line, Downtown Line, and LRT loops.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00875A] arriving-pulse" />
              <div>
                <span className="font-extrabold text-white block">Rail Status</span>
                <span className="text-emerald-300 font-semibold">100% On-Schedule</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MRT_LINE_STATUSES.map((line) => {
          const isPurple = line.id === 'NEL';
          const isBlue = line.id === 'DTL';

          return (
            <div
              key={line.id}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(12,56,117,0.04)] hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Line Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: line.color }}
              />

              <div className="flex items-start justify-between mt-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-xs"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.id}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#171c22]">
                      {line.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {line.totalStations} Stations
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E8F5E9] text-[#00875A]">
                  <CheckCircle className="w-3 h-3" />
                  {line.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 font-normal leading-relaxed">
                {line.statusDescription}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Hours: {line.operatingHours}</span>
                <span className="text-[#0C3875] font-semibold">{line.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Explorer Split View */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        {/* Sub-Header & Line Filter */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-[#002351] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#8E1960]" />
              <span>Station Directory & Timetable Explorer</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select any station along SBS Transit rail lines to view first/last train timings, lift access, and exits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLine('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLine === 'ALL'
                  ? 'bg-[#002351] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Lines
            </button>
            <button
              onClick={() => setSelectedLine('NEL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLine === 'NEL'
                  ? 'bg-[#8E1960] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              North East Line (NEL)
            </button>
            <button
              onClick={() => setSelectedLine('DTL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLine === 'DTL'
                  ? 'bg-[#0055b8] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Downtown Line (DTL)
            </button>
          </div>
        </div>

        {/* 2-Column Split: Stations List (Left) & Station Detail (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Station List */}
          <div className="lg:col-span-5 border-r border-[#E2E8F0] p-3 space-y-1.5 max-h-[520px] overflow-y-auto">
            {filteredStations.map((stn) => {
              const isSelected = stn.code === activeStation.code;
              const isNEL = stn.line === 'NEL';

              return (
                <button
                  key={stn.code}
                  onClick={() => setActiveStationCode(stn.code)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0F4FC] border-2 border-[#0C3875] shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-black text-xs px-2 py-1 rounded text-white ${
                        isNEL ? 'bg-[#8E1960]' : 'bg-[#0055b8]'
                      }`}
                    >
                      {stn.code}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#171c22]">
                        {stn.name}
                      </h4>
                      {stn.interchanges && (
                        <p className="text-[11px] text-slate-500 font-medium">
                          Int: {stn.interchanges.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isSelected ? 'text-[#0C3875]' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Station Full Details Card */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-6 bg-white overflow-y-auto max-h-[520px]">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-black text-xs px-2.5 py-1 rounded text-white ${
                      activeStation.line === 'NEL' ? 'bg-[#8E1960]' : 'bg-[#0055b8]'
                    }`}
                  >
                    {activeStation.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {activeStation.line === 'NEL' ? 'North East Line' : 'Downtown Line'}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#171c22] mt-1">
                  {activeStation.name} MRT Station
                </h3>
                {activeStation.interchanges && (
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 font-semibold">Interchanges:</span>
                    {activeStation.interchanges.map((ic, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {ic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timetable Matrix */}
            <div className="bg-[#F0F4FC] rounded-xl p-4 border border-[#CBD5E1] space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#002351] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8E1960]" />
                <span>First & Last Train Timings (Weekdays)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Direction 1 (Towards Outbound)
                  </span>
                  <div className="font-bold text-slate-800 text-sm">
                    {activeStation.firstTrainWeekday.terminalA}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Last Train: <span className="font-bold text-slate-800">{activeStation.lastTrainWeekday.terminalA}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Direction 2 (Towards Inbound)
                  </span>
                  <div className="font-bold text-slate-800 text-sm">
                    {activeStation.firstTrainWeekday.terminalB}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Last Train: <span className="font-bold text-slate-800">{activeStation.lastTrainWeekday.terminalB}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities Bar */}
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">
                Station Facilities & Accessibility
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Accessibility className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Passenger Lift</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <HeartHandshake className="w-4 h-4 text-[#8E1960]" />
                  <span className="font-semibold text-slate-700">Dementia Go-To Point</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Baby className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-700">
                    {activeStation.facilities.hasNursingRoom ? 'Nursing Room' : 'Baby Care Nearby'}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Bike className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-700">Bicycle Bays</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Tactile Paving</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Barrier-Free Gates</span>
                </div>
              </div>
            </div>

            {/* Exits & Key Landmarks */}
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">
                Station Exits & Landmarks
              </h4>
              <div className="space-y-2">
                {activeStation.exits.map((item) => (
                  <div
                    key={item.exit}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#0C3875] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      Exit {item.exit}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {item.landmarks.join(' • ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
