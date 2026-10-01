import React, { useState } from 'react';
import {
  ROUTE_65_DIR1_STOPS,
  ROUTE_65_DIR2_STOPS,
  SBS_LOGO_URL,
  MAP_PREVIEW_URL,
  BUS_SERVICES_AT_STOP,
} from '../data/transitData';
import { RouteTimelineStop } from '../types/transit';

interface RouteDetailsScreenProps {
  serviceNo: string;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenCorridorMap: () => void;
  isStarred: boolean;
  onToggleStar: (serviceNo: string) => void;
}

export const RouteDetailsScreen: React.FC<RouteDetailsScreenProps> = ({
  serviceNo = '65',
  onBack,
  onOpenProfile,
  onOpenCorridorMap,
  isStarred,
  onToggleStar,
}) => {
  const [direction, setDirection] = useState<1 | 2>(1);
  const [isAlightingAlarmActive, setIsAlightingAlarmActive] = useState(false);
  const [targetAlarmStop, setTargetAlarmStop] = useState<string>('Newton Stn Exit B');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const stops: RouteTimelineStop[] =
    direction === 1 ? ROUTE_65_DIR1_STOPS : ROUTE_65_DIR2_STOPS;

  const service = BUS_SERVICES_AT_STOP[serviceNo] || BUS_SERVICES_AT_STOP['65'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleToggleAlarm = () => {
    setIsAlightingAlarmActive(!isAlightingAlarmActive);
  };

  const handleSetStopAlarm = (stopName: string) => {
    setTargetAlarmStop(stopName);
    setIsAlightingAlarmActive(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff]">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0]">
        <div className="h-16 px-4 max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <button
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#0b1c30] hover:text-[#550053] hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              src={SBS_LOGO_URL}
              alt="SBS Transit Arrival Logo"
              className="h-7 w-auto object-contain flex-shrink-0 ml-1"
            />
            <div className="flex flex-col min-w-0 ml-1.5">
              <span className="font-heading text-[17px] font-bold text-[#4A0E48] truncate">
                Service Route Details
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              aria-label="Route info"
              onClick={() => setShowInfoModal(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#51424d] hover:text-[#550053] hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">info</span>
            </button>
            <button
              aria-label="Profile"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-[#550053] flex items-center justify-center shadow-xs text-white"
            >
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 max-w-2xl mx-auto">
        {/* Interactive Direction Banner & Quick Meta Header */}
        <section className="bg-[#eff4ff] px-4 pt-4 pb-5 flex flex-col gap-3.5 border-b border-[#dce9ff]">
          {/* Primary Service Specs */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-12 bg-[#550053] rounded-xl flex items-center justify-center shadow-sm text-white font-heading text-[22px] font-extrabold">
                {serviceNo}
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-[17px] font-bold text-[#4A0E48]">
                  HarbourFront ⇄ Tampines
                </span>
                <p className="text-[12px] text-[#51424d] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#741870]">
                    schedule
                  </span>
                  <span>{service.operatingHours}</span>
                </p>
              </div>
            </div>

            <button
              aria-label={`Bookmark Bus ${serviceNo}`}
              onClick={() => onToggleStar(serviceNo)}
              className={`w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all ${
                isStarred ? 'text-[#a43e00]' : 'text-[#741870]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 bg-[#e5eeff] rounded-full text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px] text-[#0284C7]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                accessible
              </span>
              WAB Trunk
            </span>
            <span className="px-2.5 py-1 bg-[#e5eeff] rounded-full text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#741870]">
                ac_unit
              </span>
              Air-Conditioned
            </span>
            <span className="px-2.5 py-1 bg-[#F7EEF6] rounded-full text-[11px] text-[#741870] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              6-10 min peak
            </span>
          </div>

          {/* Direction Segment Switcher */}
          <div className="bg-[#e5eeff] p-1 rounded-xl flex items-center gap-1 shadow-xs border border-[#dce9ff]">
            <button
              onClick={() => setDirection(1)}
              className={`flex-1 py-2 px-3 rounded-lg text-left flex flex-col transition-all ${
                direction === 1
                  ? 'bg-white shadow-xs'
                  : 'text-[#51424d] hover:text-[#0b1c30]'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  direction === 1 ? 'text-[#741870]' : 'opacity-70'
                }`}
              >
                Direction 1
              </span>
              <span
                className={`font-heading text-[13px] truncate ${
                  direction === 1 ? 'font-bold text-[#0b1c30]' : 'font-medium'
                }`}
              >
                To Tampines Int
              </span>
            </button>

            <button
              onClick={() => setDirection(2)}
              className={`flex-1 py-2 px-3 rounded-lg text-left flex flex-col transition-all ${
                direction === 2
                  ? 'bg-white shadow-xs'
                  : 'text-[#51424d] hover:text-[#0b1c30]'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  direction === 2 ? 'text-[#741870]' : 'opacity-70'
                }`}
              >
                Direction 2
              </span>
              <span
                className={`font-heading text-[13px] truncate ${
                  direction === 2 ? 'font-bold text-[#0b1c30]' : 'font-medium'
                }`}
              >
                To HarbourFront Int
              </span>
            </button>
          </div>
        </section>

        {/* Live Status Bar */}
        <section className="bg-white px-4 py-2.5 flex items-center justify-between shadow-xs border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]"></span>
            </span>
            <span className="text-[12px] text-[#51424d] font-medium">
              3 buses active along current corridor
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-[#741870] hover:opacity-80 active:scale-95 transition-transform"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span className="text-[11px] font-bold tracking-wider">LIVE</span>
          </button>
        </section>

        {/* Route Visualizer & Sequence Timeline */}
        <section className="px-4 py-4 flex flex-col gap-0 relative">
          {stops.map((stop, idx) => {
            const isLast = idx === stops.length - 1;
            const isHere = stop.isCurrentLocation;
            const isPassed = stop.status === 'passed';
            const hasActiveBus = !!stop.activeBus;

            return (
              <div key={stop.id} className="relative flex gap-3.5 pb-6">
                {/* Track Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[19px] top-6 bottom-0 w-[3px] ${
                      isPassed
                        ? 'bg-[#d5c1ce]/50'
                        : isHere
                        ? 'bg-[#741870]'
                        : 'bg-[#dce9ff]'
                    }`}
                  />
                )}

                {/* Node Indicator */}
                <div className="relative z-10 flex-shrink-0 w-10 flex flex-col items-center pt-1">
                  {isHere ? (
                    <div className="w-9 h-9 rounded-full bg-[#550053] flex items-center justify-center shadow-md animate-bounce ring-4 ring-[#F7EEF6]">
                      <span className="material-symbols-outlined text-[20px] text-white">
                        directions_bus
                      </span>
                    </div>
                  ) : isPassed ? (
                    <div className="w-4 h-4 rounded-full bg-[#d5c1ce] flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#f8f9ff]" />
                    </div>
                  ) : hasActiveBus ? (
                    <div className="w-6 h-6 rounded-full bg-[#d3e4fe] flex items-center justify-center shadow-xs">
                      <div className="w-3 h-3 rounded-full bg-[#00266f]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs border border-[#83727e] mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#83727e]" />
                    </div>
                  )}
                </div>

                {/* Stop Card */}
                {isHere ? (
                  /* Highlighted "YOU ARE HERE" Stop Card (Orchard Plaza) */
                  <div className="flex-1 bg-white p-3.5 rounded-2xl shadow-md border-2 border-[#741870]/20 flex flex-col gap-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#ff7a39] text-white text-[10px] font-bold uppercase tracking-wider">
                            📍 You Are Here
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[11px] font-bold text-[#51424d]">
                            {stop.id}
                          </span>
                        </div>
                        <h3 className="font-heading text-[18px] font-bold text-[#0b1c30] mt-1">
                          {stop.name}
                        </h3>
                        <p className="text-[12px] text-[#51424d]">{stop.road}</p>
                      </div>

                      <button
                        onClick={() => handleSetStopAlarm(stop.name)}
                        className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#741870] hover:bg-[#F7EEF6] transition-colors"
                        title="Set Stop Alert"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          notifications_active
                        </span>
                      </button>
                    </div>

                    {/* Live Approaching Bus Pill */}
                    <div className="p-2.5 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#dce9ff]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
                          <span className="material-symbols-outlined text-[20px]">
                            bus_alert
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-[26px] font-extrabold text-[#a43e00] leading-none">
                              Arr
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-white text-[10px] font-bold text-[#0284C7] border border-[#0284C7]/20">
                              {stop.activeBus?.deck || 'DD'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#059669] font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#059669] inline-block"></span>
                            Seats Available
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#51424d] font-bold uppercase">Plate</span>
                        <span className="text-[13px] font-bold text-[#0b1c30]">
                          {stop.activeBus?.plate || 'SBS3128T'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : isPassed ? (
                  /* Passed Stop */
                  <div className="flex-1 bg-white/70 p-3 rounded-xl flex items-center justify-between opacity-60 border border-[#E2E8F0]">
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-[14px] font-bold text-[#0b1c30] truncate line-through">
                          {stop.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[10px] font-bold text-[#51424d]">
                          {stop.id}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#51424d] truncate">{stop.road}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[11px] text-[#51424d] font-medium">Passed</span>
                      <span className="material-symbols-outlined text-[18px] text-[#83727e]">
                        done
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Upcoming Stop */
                  <div
                    onClick={() => handleSetStopAlarm(stop.name)}
                    className="flex-1 bg-white p-3 rounded-2xl shadow-xs border border-[#E2E8F0] flex flex-col gap-2 hover:border-[#741870]/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading text-[15px] font-bold text-[#0b1c30] truncate">
                            {stop.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[10px] font-bold text-[#51424d]">
                            {stop.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#51424d] truncate">{stop.road}</p>
                      </div>

                      {stop.etaMinutes ? (
                        <div className="flex items-center gap-1 text-[#741870]">
                          <span className="font-heading text-[22px] font-extrabold leading-none">
                            {stop.etaMinutes}
                          </span>
                          <span className="text-[11px] text-[#51424d] font-semibold">min</span>
                        </div>
                      ) : null}
                    </div>

                    {stop.activeBus && (
                      <div className="flex items-center justify-between text-[#51424d] bg-[#eff4ff] px-2.5 py-1.5 rounded-lg border border-[#dce9ff]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#0284C7]">
                            accessible
                          </span>
                          <span className="text-[11px] font-semibold text-[#0b1c30]">
                            {stop.activeBus.isDoubleDecker ? 'Double Decker' : 'Single Deck'} (
                            {stop.activeBus.busNoLabel})
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold flex items-center gap-1 ${
                            stop.activeBus.crowd === 'seats'
                              ? 'text-[#059669]'
                              : stop.activeBus.crowd === 'standing'
                              ? 'text-[#D97706]'
                              : 'text-[#DC2626]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              stop.activeBus.crowd === 'seats'
                                ? 'bg-[#059669]'
                                : stop.activeBus.crowd === 'standing'
                                ? 'bg-[#D97706]'
                                : 'bg-[#DC2626]'
                            }`}
                          />
                          {stop.activeBus.crowd === 'seats'
                            ? 'Seats Avail'
                            : stop.activeBus.crowd === 'standing'
                            ? 'Standing Avail'
                            : 'Limited'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Interactive Map Context Preview */}
        <section className="px-4 pb-20 pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[17px] font-bold text-[#4A0E48]">
              Live Corridor Map
            </span>
            <button
              onClick={onOpenCorridorMap}
              className="text-[13px] text-[#741870] font-bold flex items-center gap-0.5 hover:underline"
            >
              Full Map
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div
            onClick={onOpenCorridorMap}
            className="w-full h-44 rounded-2xl overflow-hidden shadow-xs relative cursor-pointer group border border-[#E2E8F0]"
          >
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `url(${MAP_PREVIEW_URL})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#213145]/90 via-transparent to-transparent flex items-end p-3">
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#550053] flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">near_me</span>
                  </span>
                  <span className="text-[12px] font-semibold">
                    Viewing Orchard Corridor Segment
                  </span>
                </div>
                <span className="px-2 py-1 rounded bg-[#213145]/80 backdrop-blur-xs text-[10px] font-bold">
                  Updated 10s ago
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Alighting Assistant & Notification Bar */}
        <div className="fixed bottom-4 left-0 right-0 px-4 z-40 max-w-md mx-auto pointer-events-none">
          <div className="pointer-events-auto bg-[#4A0E48] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between gap-2 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#741870] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px] text-[#ffd7f4]">
                  {isAlightingAlarmActive ? 'notifications_active' : 'alarm_on'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold truncate">Alighting Alarm</span>
                <span className="text-[11px] text-[#ffabf1] truncate">
                  {isAlightingAlarmActive
                    ? `Alert set for ${targetAlarmStop} (1 stop before)`
                    : 'Notify 1 stop before drop-off'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleAlarm}
              className={`px-3.5 py-2 rounded-xl font-heading text-[12px] font-bold flex-shrink-0 shadow-xs active:scale-95 transition-transform ${
                isAlightingAlarmActive
                  ? 'bg-[#059669] text-white ring-2 ring-white/30'
                  : 'bg-[#a43e00] text-white'
              }`}
            >
              {isAlightingAlarmActive ? 'Active' : 'Set Alert'}
            </button>
          </div>
        </div>
      </main>

      {/* Service Route Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#550053] text-white font-bold flex items-center justify-center">
                  {serviceNo}
                </span>
                <h4 className="font-heading font-bold text-[#0b1c30]">
                  Service {serviceNo} Specifications
                </h4>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-[12px] text-[#51424d]">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Operator</span>
                <strong className="text-[#0b1c30]">SBS Transit (SBST)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Route Length</span>
                <strong className="text-[#0b1c30]">28.4 km (42 Stops)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Operating Depots</span>
                <strong className="text-[#0b1c30]">Bedok North & Bt Merah</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Fleet Composition</span>
                <strong className="text-[#0b1c30]">Volvo B9TL & MAN A95 (WAB)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>First / Last Bus</span>
                <strong className="text-[#0b1c30]">05:30 / 23:45</strong>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-[#550053] text-white text-[13px] font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
