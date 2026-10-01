/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ArrivalScreen } from './components/ArrivalScreen';
import { RouteDetailsScreen } from './components/RouteDetailsScreen';
import { NearbyScreen } from './components/NearbyScreen';
import { RoutesScreen } from './components/RoutesScreen';
import { SavedScreen } from './components/SavedScreen';
import { WalkDirectionsModal } from './components/WalkDirectionsModal';
import { AllServicesModal } from './components/AllServicesModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { CorridorMapModal } from './components/CorridorMapModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CURRENT_STOP } from './data/transitData';
import { BusStopDetail } from './types/transit';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('arrival');
  const [viewMode, setViewMode] = useState<'arrival' | 'route-details'>('arrival');
  const [queriedBus, setQueriedBus] = useState<string>('65');
  const [selectedRouteForDetails, setSelectedRouteForDetails] = useState<string>('65');

  // Interactive state
  const [starredBuses, setStarredBuses] = useState<Set<string>>(new Set(['65']));
  const [starredStops, setStarredStops] = useState<Set<string>>(new Set(['08137']));
  const [alarmActiveBuses, setAlarmActiveBuses] = useState<Set<string>>(new Set());

  // Modals state
  const [isWalkModalOpen, setIsWalkModalOpen] = useState(false);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [isVoiceSearchModalOpen, setIsVoiceSearchModalOpen] = useState(false);
  const [isCorridorMapModalOpen, setIsCorridorMapModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto countdown simulation
  const [countdown, setCountdown] = useState<number>(12);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setCountdown(15);
    showToast('Arrival times refreshed with SBS Transit telemetry');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleToggleStarBus = (busNo: string) => {
    setStarredBuses((prev) => {
      const next = new Set(prev);
      if (next.has(busNo)) {
        next.delete(busNo);
        showToast(`Removed Bus ${busNo} from bookmarks`);
      } else {
        next.add(busNo);
        showToast(`Bookmarked Bus ${busNo}`);
      }
      return next;
    });
  };

  const handleToggleStarStop = (stopId: string = '08137') => {
    setStarredStops((prev) => {
      const next = new Set(prev);
      if (next.has(stopId)) {
        next.delete(stopId);
        showToast('Removed stop from favorites');
      } else {
        next.add(stopId);
        showToast('Added stop to favorites');
      }
      return next;
    });
  };

  const handleToggleAlarm = (busNo: string) => {
    setAlarmActiveBuses((prev) => {
      const next = new Set(prev);
      if (next.has(busNo)) {
        next.delete(busNo);
        showToast(`Alighting alert cancelled for Bus ${busNo}`);
      } else {
        next.add(busNo);
        showToast(`🔔 Arrival Alert Set! We'll chime when Bus ${busNo} is 1 stop away`);
      }
      return next;
    });
  };

  const handleOpenRouteDetails = (busNo: string) => {
    setSelectedRouteForDetails(busNo);
    setViewMode('route-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArrival = () => {
    setViewMode('arrival');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNearbyStop = (_stop: BusStopDetail) => {
    setActiveTab('arrival');
    setViewMode('arrival');
    showToast(`Viewing arrivals for ${_stop.name} (${_stop.id})`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#ffd7f4]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#213145] text-white px-4 py-2.5 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90vw]">
          <span className="material-symbols-outlined text-[18px] text-[#059669]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen 2: Dedicated Service Route Details */}
      {viewMode === 'route-details' ? (
        <RouteDetailsScreen
          serviceNo={selectedRouteForDetails}
          onBack={handleBackToArrival}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenCorridorMap={() => setIsCorridorMapModalOpen(true)}
          isStarred={starredBuses.has(selectedRouteForDetails)}
          onToggleStar={handleToggleStarBus}
        />
      ) : (
        /* Screen 1 / Tab Container */
        <>
          <Header
            onRefresh={handleManualRefresh}
            secondsLeft={countdown}
            isRefreshing={isRefreshing}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />

          <main className="flex-1 flex flex-col relative w-full pt-16 md:pt-20 pb-20 max-w-2xl mx-auto">
            {activeTab === 'arrival' && (
              <ArrivalScreen
                queriedBus={queriedBus}
                onSelectBus={(bus) => setQueriedBus(bus)}
                onOpenRouteDetails={handleOpenRouteDetails}
                onOpenWalkDirections={() => setIsWalkModalOpen(true)}
                onOpenAllServices={() => setIsAllServicesModalOpen(true)}
                onOpenVoiceSearch={() => setIsVoiceSearchModalOpen(true)}
                onOpenCorridorMap={() => setIsCorridorMapModalOpen(true)}
                countdown={countdown}
                onManualRefresh={handleManualRefresh}
                starredBuses={starredBuses}
                onToggleStarBus={handleToggleStarBus}
                isStopStarred={starredStops.has('08137')}
                onToggleStarStop={() => handleToggleStarStop('08137')}
                alarmActiveBuses={alarmActiveBuses}
                onToggleAlarm={handleToggleAlarm}
              />
            )}

            {activeTab === 'nearby' && (
              <NearbyScreen
                onSelectStop={handleSelectNearbyStop}
                onSelectBus={(bus) => {
                  setQueriedBus(bus);
                  setActiveTab('arrival');
                }}
                onOpenWalkDirections={() => setIsWalkModalOpen(true)}
                onOpenCorridorMap={() => setIsCorridorMapModalOpen(true)}
                starredStops={starredStops}
                onToggleStarStop={handleToggleStarStop}
              />
            )}

            {activeTab === 'routes' && (
              <RoutesScreen
                onSelectRoute={(bus) => {
                  handleOpenRouteDetails(bus);
                }}
              />
            )}

            {activeTab === 'saved' && (
              <SavedScreen
                starredBuses={starredBuses}
                starredStops={starredStops}
                alarmActiveBuses={alarmActiveBuses}
                onSelectBus={(bus) => {
                  setQueriedBus(bus);
                  setActiveTab('arrival');
                }}
                onOpenRouteDetails={handleOpenRouteDetails}
                onToggleStarBus={handleToggleStarBus}
                onToggleStarStop={handleToggleStarStop}
                onToggleAlarm={handleToggleAlarm}
              />
            )}
          </main>

          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setViewMode('arrival');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedCount={starredBuses.size + alarmActiveBuses.size}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      {isWalkModalOpen && (
        <WalkDirectionsModal
          stop={CURRENT_STOP}
          onClose={() => setIsWalkModalOpen(false)}
          onViewCorridorMap={() => {
            setIsWalkModalOpen(false);
            setIsCorridorMapModalOpen(true);
          }}
        />
      )}

      {isAllServicesModalOpen && (
        <AllServicesModal
          onClose={() => setIsAllServicesModalOpen(false)}
          onSelectService={(svc) => {
            setQueriedBus(svc);
            setActiveTab('arrival');
            setViewMode('arrival');
          }}
          onViewRoute={(svc) => {
            handleOpenRouteDetails(svc);
          }}
        />
      )}

      {isVoiceSearchModalOpen && (
        <VoiceSearchModal
          onClose={() => setIsVoiceSearchModalOpen(false)}
          onSelectBus={(bus) => {
            setQueriedBus(bus);
            setActiveTab('arrival');
            setViewMode('arrival');
          }}
        />
      )}

      {isCorridorMapModalOpen && (
        <CorridorMapModal
          serviceNo={queriedBus}
          onClose={() => setIsCorridorMapModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
}
