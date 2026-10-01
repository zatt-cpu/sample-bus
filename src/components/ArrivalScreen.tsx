import React, { useState } from 'react';
import { BUS_SERVICES_AT_STOP, CURRENT_STOP, MAP_PREVIEW_URL } from '../data/transitData';
import { BusServiceSummary } from '../types/transit';

interface ArrivalScreenProps {
  queriedBus: string;
  onSelectBus: (busNo: string) => void;
  onOpenRouteDetails: (busNo: string) => void;
  onOpenWalkDirections: () => void;
  onOpenAllServices: () => void;
  onOpenVoiceSearch: () => void;
  onOpenCorridorMap: () => void;
  countdown: number;
  onManualRefresh: () => void;
  starredBuses: Set<string>;
  onToggleStarBus: (busNo: string) => void;
  isStopStarred: boolean;
  onToggleStarStop: () => void;
  alarmActiveBuses: Set<string>;
  onToggleAlarm: (busNo: string) => void;
}

export const ArrivalScreen: React.FC<ArrivalScreenProps> = ({
  queriedBus,
  onSelectBus,
  onOpenRouteDetails,
  onOpenWalkDirections,
  onOpenAllServices,
  onOpenVoiceSearch,
  onOpenCorridorMap,
  countdown,
  onManualRefresh,
  starredBuses,
  onToggleStarBus,
  isStopStarred,
  onToggleStarStop,
  alarmActiveBuses,
  onToggleAlarm,
}) => {
  const [searchInput, setSearchInput] = useState(queriedBus);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  // Active queried service data
  const currentService: BusServiceSummary =
    BUS_SERVICES_AT_STOP[queriedBus] || BUS_SERVICES_AT_STOP['65'];

  const otherBusesKeys = ['14', '106', '175', '123', '7', '147'].filter(
    (b) => b !== queriedBus
  );

  const quickPills = ['65', '15', '147', '14', '7', '106'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim().toUpperCase();
    if (trimmed && BUS_SERVICES_AT_STOP[trimmed]) {
      onSelectBus(trimmed);
    } else if (trimmed) {
      // Find closest matching
      const found = Object.keys(BUS_SERVICES_AT_STOP).find((s) =>
        s.startsWith(trimmed)
      );
      if (found) onSelectBus(found);
    }
  };

  const getCrowdLabel = (crowd: string) => {
    switch (crowd) {
      case 'seats':
        return { text: 'Seats Avail', dot: 'bg-[#059669]', bg: 'bg-[#059669]/15', textCol: 'text-[#059669]' };
      case 'standing':
        return { text: 'Standing', dot: 'bg-[#D97706]', bg: 'bg-[#D97706]/15', textCol: 'text-[#D97706]' };
      case 'limited':
        return { text: 'Limited', dot: 'bg-[#DC2626]', bg: 'bg-[#DC2626]/15', textCol: 'text-[#DC2626]' };
      default:
        return { text: 'Seats Avail', dot: 'bg-[#059669]', bg: 'bg-[#059669]/15', textCol: 'text-[#059669]' };
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Search & Quick Navigation Module */}
      <div className="px-4 pt-2 flex flex-col gap-2">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#E2E8F0] p-1.5 focus-within:border-[#741870] transition-colors">
          <div className="w-10 h-10 flex items-center justify-center text-[#741870] flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">directions_bus</span>
          </div>
          <input
            className="w-full bg-transparent px-2 py-2 font-heading text-[18px] md:text-[20px] font-extrabold text-[#0b1c30] focus:outline-none placeholder:text-[#51424d]/40 placeholder:font-normal"
            id="bus-search-input"
            inputMode="text"
            placeholder="Enter bus no. (e.g. 65, 147)"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="flex items-center gap-1 pr-1 flex-shrink-0">
            {searchInput && (
              <button
                type="button"
                aria-label="Clear Search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#51424d] hover:text-[#550053] transition-colors"
                onClick={() => {
                  setSearchInput('');
                }}
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
            <button
              type="button"
              aria-label="Scan or Voice Search"
              onClick={onOpenVoiceSearch}
              className="w-9 h-9 rounded-xl bg-[#F7EEF6] flex items-center justify-center text-[#741870] hover:bg-[#ffd7f4] transition-colors active:scale-95"
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
        </form>

        {/* Quick Pill Suggestion Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {quickPills.map((pill) => {
            const isSelected = queriedBus === pill;
            const isStarred = starredBuses.has(pill);
            return (
              <button
                key={pill}
                type="button"
                onClick={() => {
                  onSelectBus(pill);
                  setSearchInput(pill);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-heading text-[14px] flex-shrink-0 shadow-xs transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#741870] text-white font-bold ring-2 ring-[#741870]/20'
                    : 'bg-[#e5eeff] text-[#51424d] hover:bg-[#dce9ff]'
                }`}
              >
                {isStarred && (
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                )}
                <span>{pill}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenAllServices}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#e5eeff] text-[#51424d] text-[11px] font-bold flex-shrink-0 hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span>Recent</span>
          </button>
        </div>
      </div>

      {/* Detected Nearest Bus Stop Card */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl shadow-xs border border-[#E2E8F0] p-4 flex flex-col gap-3 relative overflow-hidden">
          {/* Ambient GPS Indicator Band */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span className="text-[11px] font-bold text-[#51424d] uppercase tracking-wider">
                Nearest stop detected ({CURRENT_STOP.distanceMeters}m away)
              </span>
            </div>
            <button
              aria-label="Bookmark Stop"
              onClick={onToggleStarStop}
              className={`transition-colors ${
                isStopStarred ? 'text-[#a43e00]' : 'text-[#51424d] hover:text-[#550053]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isStopStarred ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          </div>

          {/* Stop Details & Mini Visual Viewport */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <h2 className="font-heading text-[20px] font-bold text-[#4A0E48] leading-snug">
                {CURRENT_STOP.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[11px] font-bold text-[#0b1c30]">
                  ID: {CURRENT_STOP.id}
                </span>
                <span className="text-[12px] text-[#51424d] truncate">
                  {CURRENT_STOP.road}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 self-start px-2 py-1 rounded-full bg-[#eff4ff] text-[#0b1c30]">
                <span className="material-symbols-outlined text-[15px] text-[#741870]">
                  directions_walk
                </span>
                <span className="text-[12px] font-semibold">2 mins walk</span>
                <span className="text-[12px] text-[#51424d]">({CURRENT_STOP.distanceMeters}m)</span>
              </div>
            </div>

            {/* Static Mini-map / Nav Tile */}
            <div
              onClick={onOpenCorridorMap}
              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0 group cursor-pointer border border-[#E2E8F0]"
              style={{
                backgroundImage: `url('${MAP_PREVIEW_URL}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              title="Click to view interactive map"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E48]/75 via-transparent to-transparent flex items-end justify-center pb-1">
                <span className="text-[11px] font-bold text-white flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">map</span>
                  Map
                </span>
              </div>
            </div>
          </div>

          {/* Directions & View Stop Services Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenWalkDirections}
              className="flex-1 py-2 px-3 rounded-lg bg-[#e5eeff] text-[#741870] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#dce9ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Walk Directions</span>
            </button>
            <button
              onClick={onOpenAllServices}
              className="flex-1 py-2 px-3 rounded-lg bg-[#741870] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">departure_board</span>
              <span>All 11 Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Queried Bus: Hero Live Timing Card (Service 65 / active) */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#741870]">timer</span>
            <span className="font-heading text-[18px] font-bold text-[#0b1c30]">
              Queried Service {currentService.serviceNo}
            </span>
          </div>
          {/* Live Sync / Auto Refresh Counter */}
          <button
            onClick={onManualRefresh}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#51424d] hover:text-[#0b1c30] transition-colors cursor-pointer"
            id="manual-refresh-btn"
          >
            <svg
              className="w-3.5 h-3.5 text-[#741870] animate-spin"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span className="text-[11px] font-bold">{countdown}s</span>
          </button>
        </div>

        {/* Active Hero Card for Queried Service */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 flex flex-col gap-3 relative overflow-hidden">
          {/* Top Service Row: Pill, Destination, Bookmark */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onOpenRouteDetails(currentService.serviceNo)}
            >
              <div className="w-14 h-11 rounded-lg bg-[#741870] text-white flex items-center justify-center font-heading text-[24px] font-extrabold tracking-tight shadow-xs">
                {currentService.serviceNo}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#51424d] font-bold uppercase tracking-wider">
                  Towards
                </span>
                <span className="font-heading text-[17px] font-bold text-[#0b1c30] truncate hover:text-[#741870] transition-colors">
                  {currentService.destination}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                aria-label="Set Bus Arrival Alarm"
                onClick={() => onToggleAlarm(currentService.serviceNo)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  alarmActiveBuses.has(currentService.serviceNo)
                    ? 'text-[#a43e00] bg-[#ffdbcd]'
                    : 'text-[#51424d] hover:text-[#550053] hover:bg-[#eff4ff]'
                }`}
                title="Notify me before bus reaches stop"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {alarmActiveBuses.has(currentService.serviceNo) ? 'notifications_active' : 'add_alert'}
                </span>
              </button>
              <button
                aria-label={`Favorite Service ${currentService.serviceNo}`}
                onClick={() => onToggleStarBus(currentService.serviceNo)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  starredBuses.has(currentService.serviceNo)
                    ? 'text-[#741870]'
                    : 'text-[#51424d] hover:text-[#741870]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: starredBuses.has(currentService.serviceNo)
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                >
                  star
                </span>
              </button>
            </div>
          </div>

          {/* Sequential Arrival Blocks (1st, 2nd, 3rd) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* 1st Arrival (Imminent / Arriving) */}
            {(() => {
              const arr = currentService.arrivals[0];
              const crowd = getCrowdLabel(arr.crowd);
              return (
                <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col items-center justify-between text-center relative overflow-hidden border border-[#dce9ff]">
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[11px] text-[#51424d] font-bold">NEXT</span>
                    <div className="flex items-center gap-0.5">
                      <span
                        className="material-symbols-outlined text-[13px] text-[#0284C7]"
                        title="Wheelchair Accessible"
                      >
                        accessible
                      </span>
                      <span className="px-1 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-bold">
                        {arr.deck}
                      </span>
                    </div>
                  </div>
                  <div className="py-1.5 flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      {arr.isArr && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]"></span>
                        </span>
                      )}
                      <span className="font-heading text-[26px] font-extrabold text-[#741870] tracking-tight">
                        {arr.time}
                      </span>
                    </div>
                  </div>
                  <div className={`w-full py-0.5 px-1 rounded-full ${crowd.bg} flex items-center justify-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`}></span>
                    <span className={`text-[10px] font-bold ${crowd.textCol}`}>{crowd.text}</span>
                  </div>
                </div>
              );
            })()}

            {/* 2nd Arrival */}
            {(() => {
              const arr = currentService.arrivals[1];
              const crowd = getCrowdLabel(arr.crowd);
              return (
                <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col items-center justify-between text-center border border-[#dce9ff]">
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[11px] text-[#51424d] font-bold">2ND</span>
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px] text-[#0284C7]">
                        accessible
                      </span>
                      <span className="px-1 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-bold">
                        {arr.deck}
                      </span>
                    </div>
                  </div>
                  <div className="py-1.5 flex flex-col items-center">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-heading text-[26px] font-extrabold text-[#0b1c30] tracking-tight">
                        {arr.time}
                      </span>
                      <span className="text-[12px] text-[#51424d] font-medium">min</span>
                    </div>
                  </div>
                  <div className={`w-full py-0.5 px-1 rounded-full ${crowd.bg} flex items-center justify-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`}></span>
                    <span className={`text-[10px] font-bold ${crowd.textCol}`}>{crowd.text}</span>
                  </div>
                </div>
              );
            })()}

            {/* 3rd Arrival */}
            {(() => {
              const arr = currentService.arrivals[2];
              const crowd = getCrowdLabel(arr.crowd);
              return (
                <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col items-center justify-between text-center border border-[#dce9ff]">
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[11px] text-[#51424d] font-bold">3RD</span>
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px] text-[#0284C7]">
                        accessible
                      </span>
                      <span className="px-1 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-bold">
                        {arr.deck}
                      </span>
                    </div>
                  </div>
                  <div className="py-1.5 flex flex-col items-center">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-heading text-[26px] font-extrabold text-[#51424d] tracking-tight">
                        {arr.time}
                      </span>
                      <span className="text-[12px] text-[#51424d] font-medium">min</span>
                    </div>
                  </div>
                  <div className={`w-full py-0.5 px-1 rounded-full ${crowd.bg} flex items-center justify-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`}></span>
                    <span className={`text-[10px] font-bold ${crowd.textCol}`}>{crowd.text}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Expandable Route Timeline Preview Button */}
          <button
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="w-full pt-2 flex items-center justify-between text-[#51424d] hover:text-[#550053] transition-colors border-t border-[#E2E8F0]/60 mt-1"
          >
            <div className="flex items-center gap-1.5 text-[13px] font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#741870]">route</span>
              <span>View 42 stops live route timeline</span>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                isTimelineExpanded ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Live Route Mini Timeline Drawer (Toggled) */}
          {isTimelineExpanded && (
            <div className="flex flex-col gap-2 pt-2 animate-in fade-in">
              <div className="bg-[#e5eeff] rounded-lg p-3 flex flex-col gap-2">
                {/* Passed Stop */}
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#83727e] flex-shrink-0"></div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] line-through text-[#0b1c30]">
                      National Youth Council
                    </span>
                    <span className="text-[11px] font-bold text-[#51424d]">Passed</span>
                  </div>
                </div>

                {/* Current Active Stop */}
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#741870] flex items-center justify-center flex-shrink-0 ring-4 ring-[#741870]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#741870]">
                        Orchard Plaza (Here)
                      </span>
                      <span className="text-[11px] text-[#059669] font-bold">
                        Bus {currentService.serviceNo} approaching
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#741870] text-white text-[10px] font-bold">
                      Arr
                    </span>
                  </div>
                </div>

                {/* Next Stop */}
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#51424d] flex-shrink-0"></div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] text-[#0b1c30]">Winsland Hse</span>
                    <span className="text-[11px] text-[#51424d] font-bold">2 min</span>
                  </div>
                </div>

                {/* 2nd Next Stop */}
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#51424d] flex-shrink-0"></div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] text-[#0b1c30]">Dhoby Ghaut Stn</span>
                    <span className="text-[11px] text-[#51424d] font-bold">4 min</span>
                  </div>
                </div>
              </div>

              {/* Action Button to Open Full Screen 2 */}
              <button
                onClick={() => onOpenRouteDetails(currentService.serviceNo)}
                className="w-full py-2 px-3 rounded-lg bg-[#550053] hover:bg-[#741870] text-white text-[12px] font-heading font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs mt-1"
              >
                <span>Open Full Route Visualizer & Sequence Timeline</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Crowd Occupancy Legend Bar */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#51424d] uppercase font-bold tracking-wider">
            Load Guide:
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span className="text-[11px] font-semibold text-[#0b1c30]">Seats</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              <span className="text-[11px] font-semibold text-[#0b1c30]">Standing</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
              <span className="text-[11px] font-semibold text-[#0b1c30]">Limited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Other Services at Orchard Plaza */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-[17px] font-bold text-[#0b1c30]">
            Other Buses at {CURRENT_STOP.name}
          </h3>
          <span className="text-[11px] font-bold text-[#51424d] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
            Live Syncing
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {otherBusesKeys.map((svcKey) => {
            const svc = BUS_SERVICES_AT_STOP[svcKey];
            if (!svc) return null;
            const arr1 = svc.arrivals[0];
            const arr2 = svc.arrivals[1];
            const isStarred = starredBuses.has(svc.serviceNo);

            const crowd1 = getCrowdLabel(arr1.crowd);
            const crowd2 = getCrowdLabel(arr2.crowd);

            return (
              <div
                key={svc.serviceNo}
                onClick={() => {
                  onSelectBus(svc.serviceNo);
                  setSearchInput(svc.serviceNo);
                }}
                className="bg-white rounded-xl shadow-xs border border-[#E2E8F0] p-3.5 flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-9 rounded-lg bg-[#dce9ff] text-[#4A0E48] flex items-center justify-center font-heading text-[18px] font-extrabold tracking-tight flex-shrink-0">
                    {svc.serviceNo}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-[14px] font-bold text-[#0b1c30] truncate">
                      {svc.destination}
                    </span>
                    <div className="flex items-center gap-1 text-[#51424d]">
                      <span className="material-symbols-outlined text-[12px] text-[#0284C7]">
                        accessible
                      </span>
                      <span className="text-[11px] truncate">
                        {svc.via ? `via ${svc.via}` : `${svc.operator} Trunk`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* 1st arrival */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-0.5">
                      <span className={`font-heading text-[17px] font-bold ${crowd1.textCol}`}>
                        {arr1.time}
                      </span>
                      {!arr1.isArr && (
                        <span className="text-[11px] font-bold text-[#51424d]">m</span>
                      )}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${crowd1.dot}`} title={crowd1.text}></span>
                  </div>

                  <span className="text-[#d5c1ce] text-[12px]">•</span>

                  {/* 2nd arrival */}
                  <div className="flex flex-col items-end opacity-75">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-heading text-[14px] font-semibold text-[#0b1c30]">
                        {arr2.time}
                      </span>
                      <span className="text-[10px] text-[#51424d]">m</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${crowd2.dot}`}></span>
                  </div>

                  <button
                    aria-label={`Favorite Bus ${svc.serviceNo}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStarBus(svc.serviceNo);
                    }}
                    className={`ml-1 transition-colors ${
                      isStarred ? 'text-[#741870]' : 'text-[#51424d]/40 hover:text-[#550053]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commuter Notice Banner */}
      <div className="px-4 mt-4">
        <div className="bg-[#F7EEF6] border border-[#741870]/15 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#741870] text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">info</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#4A0E48]">
              Peak Hour Frequency Active
            </span>
            <span className="text-[11px] text-[#51424d]">
              Buses running at 4-7 min intervals along Orchard Corridor.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
