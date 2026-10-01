import React from 'react';
import { BUS_SERVICES_AT_STOP, NEARBY_STOPS } from '../data/transitData';

interface SavedScreenProps {
  starredBuses: Set<string>;
  starredStops: Set<string>;
  alarmActiveBuses: Set<string>;
  onSelectBus: (busNo: string) => void;
  onOpenRouteDetails: (busNo: string) => void;
  onToggleStarBus: (busNo: string) => void;
  onToggleStarStop: (stopId: string) => void;
  onToggleAlarm: (busNo: string) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  starredBuses,
  starredStops,
  alarmActiveBuses,
  onSelectBus,
  onOpenRouteDetails,
  onToggleStarBus,
  onToggleStarStop,
  onToggleAlarm,
}) => {
  const favoriteBusList = Array.from(starredBuses)
    .map((b) => BUS_SERVICES_AT_STOP[b])
    .filter(Boolean);

  const favoriteStopList = Array.from(starredStops)
    .map((id) => NEARBY_STOPS.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3 gap-4">
      {/* Active Alarms Section */}
      {alarmActiveBuses.size > 0 && (
        <div className="bg-[#4A0E48] text-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#ffd7f4] animate-bounce">
                alarm_on
              </span>
              <h3 className="font-heading text-[15px] font-bold">Active Arrival Alerts</h3>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {alarmActiveBuses.size} Active
            </span>
          </div>
          <div className="space-y-2 mt-3">
            {Array.from(alarmActiveBuses).map((b) => (
              <div
                key={b}
                className="bg-white/10 p-2.5 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#550053] font-bold text-[14px] flex items-center justify-center">
                    {b}
                  </span>
                  <div>
                    <span className="text-[13px] font-bold block">Service {b} Approaching</span>
                    <span className="text-[11px] text-white/75">
                      Chime will sound 1 stop before Orchard Plaza
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleAlarm(b)}
                  className="px-2.5 py-1 rounded-lg bg-red-500/80 text-white text-[11px] font-bold hover:bg-red-500"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarked Bus Services */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-[16px] font-bold text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#741870]">star</span>
            Bookmarked Bus Services
          </h3>
          <span className="text-[11px] text-[#51424d] font-bold">
            {favoriteBusList.length} saved
          </span>
        </div>

        {favoriteBusList.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-dashed border-[#d5c1ce] text-[#51424d] text-[13px]">
            No bookmarked services yet. Tap the star icon on any bus card to save it.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favoriteBusList.map((svc) => (
              <div
                key={svc.serviceNo}
                onClick={() => onSelectBus(svc.serviceNo)}
                className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg bg-[#550053] text-white font-heading font-extrabold text-[18px] flex items-center justify-center">
                    {svc.serviceNo}
                  </div>
                  <div>
                    <span className="font-heading text-[14px] font-bold text-[#0b1c30] block">
                      Towards {svc.destination}
                    </span>
                    <span className="text-[11px] text-[#51424d]">
                      Next: <strong>{svc.arrivals[0].time}</strong> • 2nd: <strong>{svc.arrivals[1].time}m</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRouteDetails(svc.serviceNo);
                    }}
                    className="p-1.5 rounded-lg text-[#51424d] hover:bg-[#dce9ff]"
                    title="View route"
                  >
                    <span className="material-symbols-outlined text-[18px]">route</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStarBus(svc.serviceNo);
                    }}
                    className="p-1.5 rounded-lg text-[#741870] hover:bg-[#dce9ff]"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Bus Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-[16px] font-bold text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#741870]">pin_drop</span>
            Favorite Bus Stops
          </h3>
          <span className="text-[11px] text-[#51424d] font-bold">
            {favoriteStopList.length} saved
          </span>
        </div>

        {favoriteStopList.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-dashed border-[#d5c1ce] text-[#51424d] text-[13px]">
            No favorite stops yet. Tap the star icon on any bus stop card to save it.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favoriteStopList.map((stop) => {
              if (!stop) return null;
              return (
                <div
                  key={stop.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[10px] font-bold text-[#51424d]">
                        {stop.id}
                      </span>
                      <span className="font-heading text-[14px] font-bold text-[#0b1c30] truncate">
                        {stop.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#51424d] mt-0.5">{stop.road}</span>
                  </div>

                  <button
                    onClick={() => onToggleStarStop(stop.id)}
                    className="p-1.5 text-[#a43e00] hover:bg-gray-100 rounded-lg"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
