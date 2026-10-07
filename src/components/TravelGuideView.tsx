import React, { useState } from 'react';
import {
  Compass,
  HeartHandshake,
  CreditCard,
  PhoneCall,
  Search,
  ShieldCheck,
  CheckCircle2,
  Users,
  Accessibility,
  HelpCircle,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_IMAGES } from '../data/transitData';

export const TravelGuideView: React.FC = () => {
  const [commuterType, setCommuterType] = useState<'adult' | 'student' | 'senior' | 'workfare'>('adult');
  const [distanceKm, setDistanceKm] = useState<number>(10);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [serviceFeedbackNo, setServiceFeedbackNo] = useState<string>('14');

  // Realistic Singapore Public Transport Fare Calculation Model (LTA Distance-Based Fares)
  const calculateFare = (dist: number, type: string) => {
    let base = 1.09;
    if (dist <= 3.2) base = 1.09;
    else if (dist <= 7.2) base = 1.25 + (dist - 3.2) * 0.08;
    else if (dist <= 15.2) base = 1.57 + (dist - 7.2) * 0.06;
    else base = 2.05 + (dist - 15.2) * 0.04;

    if (type === 'student') return Math.min(0.68, Math.max(0.48, base * 0.45));
    if (type === 'senior') return Math.min(0.98, Math.max(0.64, base * 0.55));
    if (type === 'workfare') return Math.max(0.74, base * 0.75);
    return Math.min(2.47, base);
  };

  const currentFare = calculateFare(distanceKm, commuterType);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Travel Buddy Hero Banner */}
      <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#002351] text-white">
        <div className="relative">
          <img
            src={OFFICIAL_IMAGES.travelBuddyBanner}
            alt="SBS Transit Travel Buddy Program"
            className="w-full h-48 sm:h-64 object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002351] via-[#002351]/50 to-transparent flex items-end p-5 sm:p-8">
            <div className="max-w-xl">
              <span className="px-2.5 py-1 rounded bg-[#8E1960] text-white text-xs font-black uppercase tracking-wider">
                Inclusivity & Caring Commutes
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                SBS Transit "Travel Buddy" Initiative
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-normal">
                Personalized transit guidance for persons with disabilities, seniors, and neurodivergent passengers across all MRT stations and bus interchanges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Fare Calculator & Go-To Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fare Calculator Card (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#8E1960]" />
                <h3 className="text-lg font-black text-[#002351]">
                  Distance-Based Fare Calculator
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Official LTA distance fare structure for SimplyGo & EZ-Link smart cards.
              </p>
            </div>
          </div>

          {/* Commuter Type Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Passenger Fare Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'adult', label: 'Adult Card', desc: 'Standard contactless' },
                { id: 'student', label: 'Primary/Sec Student', desc: 'Concession card' },
                { id: 'senior', label: 'Senior Citizen', desc: '60+ yrs concession' },
                { id: 'workfare', label: 'Workfare / WTCS', desc: 'Subsidized' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCommuterType(item.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    commuterType === item.id
                      ? 'bg-[#002351] text-white border-[#002351] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-extrabold block text-xs">{item.label}</span>
                  <span className={`text-[10px] block ${commuterType === item.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Journey Travel Distance
              </label>
              <span className="text-base font-black text-[#0C3875] font-tabular">
                {distanceKm.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-[#0C3875] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Short Trip (1 km)</span>
              <span>Regional (15 km)</span>
              <span>Cross-Island (35 km)</span>
            </div>
          </div>

          {/* Fare Result Callout */}
          <div className="bg-[#F0F4FC] rounded-xl p-4 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-xs font-semibold block">
                Estimated One-Way Fare (Card)
              </span>
              <div className="text-3xl font-black text-[#002351] font-tabular">
                ${currentFare.toFixed(2)}{' '}
                <span className="text-xs font-bold text-slate-500 font-sans">SGD</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <span className="font-bold block text-emerald-700">✓ Free Transfer Window</span>
              <span className="text-[11px] text-slate-400">Within 45 min between bus/MRT</span>
            </div>
          </div>
        </div>

        {/* Dementia Go-To Points & Assistance (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#8E1960]" />
            <h3 className="text-lg font-black text-[#002351]">
              Dementia Go-To Points
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            All SBS Transit stations on the North East Line and Downtown Line serve as designated <strong>Go-To Points</strong>. Staff are certified to assist persons who may have lost their way or exhibit signs of dementia.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 text-[#8E1960] flex items-start gap-2.5">
              <Accessibility className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Wheelchair Barrier-Free</span>
                <span className="text-slate-600 text-[11px]">100% of SBS Transit bus fleet & all rail stations are wheelchair accessible.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[#0C3875] flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Passenger Hotline 24/7</span>
                <span className="text-slate-600 text-[11px]">Call <strong>1800-287-2727</strong> for immediate assistance or lost property.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Community Programs
            </span>
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={OFFICIAL_IMAGES.growWithUs}
                alt="SBS Transit Grow With Us"
                className="w-full h-24 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Feedback & Commuter Voice */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-[#0C3875]" />
          <h3 className="text-lg font-black text-[#002351]">
            Commuter Feedback & Station Service Quality
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Help SBS Transit improve your daily commute. Share feedback on bus captains, train cleanliness, or station facilities.
        </p>

        {feedbackSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Thank you! Your commendation/feedback has been logged with SBS Transit Quality Service Management.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Bus Route or MRT Station
                </label>
                <input
                  type="text"
                  value={serviceFeedbackNo}
                  onChange={(e) => setServiceFeedbackNo(e.target.value)}
                  placeholder="e.g. Bus 14 or Dhoby Ghaut NE6"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C3875]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Feedback Category
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3875]">
                  <option>Staff Commendation & Compliment</option>
                  <option>Bus Arrival & Punctuality</option>
                  <option>Air-Conditioning & Cleanliness</option>
                  <option>Accessibility & Wheelchair Ramp</option>
                  <option>Other Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Comments & Feedback
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe your commute experience..."
                className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0C3875]"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#0C3875] text-white text-xs font-bold hover:bg-[#002351] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback to SBS Transit</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
