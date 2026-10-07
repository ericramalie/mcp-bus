/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BusArrivalsView } from './components/BusArrivalsView';
import { RailNetworkView } from './components/RailNetworkView';
import { JourneyPlannerView } from './components/JourneyPlannerView';
import { AdvisoriesView } from './components/AdvisoriesView';
import { TravelGuideView } from './components/TravelGuideView';
import { SavedStopsView } from './components/SavedStopsView';
import { BusRouteModal } from './components/BusRouteModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('buses');
  const [selectedStopCode, setSelectedStopCode] = useState<string>('04168'); // Dhoby Ghaut
  const [savedStops, setSavedStops] = useState<string[]>(['04168', '05019']);
  const [activeInspectService, setActiveInspectService] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Handle saving / bookmarking stops
  const handleToggleSaveStop = (code: string) => {
    setSavedStops((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleRefreshAll = () => {
    setLastRefreshTime(new Date());
  };

  const handleSelectStop = (code: string) => {
    setSelectedStopCode(code);
    setActiveTab('buses');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#171c22] flex flex-col font-sans selection:bg-[#8E1960] selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedStopsCount={savedStops.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onRefreshAll={handleRefreshAll}
        lastRefreshTime={lastRefreshTime}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'buses' && (
          <BusArrivalsView
            selectedStopCode={selectedStopCode}
            onSelectStopCode={setSelectedStopCode}
            savedStops={savedStops}
            onToggleSaveStop={handleToggleSaveStop}
            onViewServiceRoute={(svc) => setActiveInspectService(svc)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'rail' && (
          <RailNetworkView
            onSelectStationBusStop={handleSelectStop}
          />
        )}

        {activeTab === 'planner' && (
          <JourneyPlannerView
            onInspectBusRoute={(svc) => setActiveInspectService(svc)}
          />
        )}

        {activeTab === 'advisories' && (
          <AdvisoriesView />
        )}

        {activeTab === 'guide' && (
          <TravelGuideView />
        )}

        {activeTab === 'saved' && (
          <SavedStopsView
            savedStops={savedStops}
            onToggleSaveStop={handleToggleSaveStop}
            onSelectStopCode={handleSelectStop}
            onViewServiceRoute={(svc) => setActiveInspectService(svc)}
          />
        )}
      </main>

      {/* Modal Inspector for Full Bus Route */}
      {activeInspectService && (
        <BusRouteModal
          serviceNo={activeInspectService}
          onClose={() => setActiveInspectService(null)}
          onSelectStopCode={handleSelectStop}
        />
      )}

      {/* Official Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
