import React from 'react';
import { Bus, Train, Phone, Mail, Shield, ExternalLink, Heart } from 'lucide-react';
import { OFFICIAL_IMAGES } from '../data/transitData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#002351] text-white mt-12 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-md">
                <img
                  src={OFFICIAL_IMAGES.logo}
                  alt="SBS Transit"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xl font-black tracking-tight">
                SBS <span className="text-pink-400">Transit</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              A leading public transport operator in Singapore and a member of the ComfortDelGro Group. Operating bus services, the North East Line, Downtown Line, and Sengkang-Punggol LRT.
            </p>
            <div className="text-[11px] text-slate-400">
              Singapore Standard Time Telemetry Synced
            </div>
          </div>

          {/* Quick Transit Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-pink-300">
              Passenger Transit Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTab('buses')}
                  className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <Bus className="w-3.5 h-3.5 text-blue-300" />
                  <span>Bus Arrival & Route Schedules</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rail')}
                  className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <Train className="w-3.5 h-3.5 text-pink-300" />
                  <span>North East Line (NEL) Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rail')}
                  className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <Train className="w-3.5 h-3.5 text-blue-300" />
                  <span>Downtown Line (DTL) Timetable</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('planner')}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  Inter-Modal Journey Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Accessibility & Commuter Cares */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-pink-300">
              Commuter Cares & Inclusivity
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  SBS Transit "Travel Buddy" Assistance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  Dementia Friendly Go-To Points
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  Distance-Based Fare Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('advisories')}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  Live Operating Notices & Road Closures
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & 24/7 Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-pink-300">
              24/7 Commuter Helplines
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white">1800-287-2727</span>
                  <p className="text-[10px] text-slate-400">SBS Transit Customer Service</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="font-bold text-white">1800-2255-582</span>
                  <p className="text-[10px] text-slate-400">Land Transport Authority (LTA)</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Operating Headquarters: 205 Braddell Road, Singapore 579701
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SBS Transit Ltd (A member of ComfortDelGro). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.sbstransit.com.sg" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Data Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
