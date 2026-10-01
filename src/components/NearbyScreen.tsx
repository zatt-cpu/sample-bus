import React from 'react';
import { NEARBY_STOPS, BUS_SERVICES_AT_STOP } from '../data/transitData';
import { BusStopDetail } from '../types/transit';

interface NearbyScreenProps {
  onSelectStop: (stop: BusStopDetail) => void;
  onSelectBus: (busNo: string) => void;
  onOpenWalkDirections: () => void;
  onOpenCorridorMap: () => void;
  starredStops: Set<string>;
  onToggleStarStop: (stopId: string) => void;
}

export const NearbyScreen: React.FC<NearbyScreenProps> = ({
  onSelectStop,
  onSelectBus,
  onOpenWalkDirections,
  onOpenCorridorMap,
  starredStops,
  onToggleStarStop,
}) => {
  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3 gap-3">
      {/* Location Banner */}
      <div className="bg-gradient-to-r from-[#550053] to-[#741870] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] animate-pulse">my_location</span>
          </div>
          <div>
            <h3 className="font-heading text-[16px] font-bold">Orchard / Somerset Area</h3>
            <p className="text-[12px] text-white/80">GPS accuracy within 5 meters • 5 stops nearby</p>
          </div>
        </div>
        <button
          onClick={onOpenCorridorMap}
          className="px-3 py-1.5 rounded-lg bg-white text-[#550053] text-[12px] font-bold shadow-xs hover:bg-[#eff4ff]"
        >
          View Map
        </button>
      </div>

      <div className="flex items-center justify-between mt-1">
        <h3 className="font-heading text-[17px] font-bold text-[#0b1c30]">
          Nearby Bus Stops
        </h3>
        <span className="text-[11px] font-bold text-[#51424d]">Sorted by walking distance</span>
      </div>

      {/* Stop Cards */}
      <div className="flex flex-col gap-3">
        {NEARBY_STOPS.map((stop, index) => {
          const isCurrent = index === 0;
          const isStarred = starredStops.has(stop.id);

          return (
            <div
              key={stop.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-white border-[#741870]/30 shadow-sm ring-1 ring-[#741870]/10'
                  : 'bg-white border-[#E2E8F0] hover:border-[#741870]/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#059669] text-white text-[10px] font-bold uppercase tracking-wider">
                        Closest Stop
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[11px] font-bold text-[#51424d]">
                      {stop.id}
                    </span>
                  </div>
                  <h4 className="font-heading text-[16px] font-bold text-[#0b1c30] mt-1">
                    {stop.name}
                  </h4>
                  <p className="text-[12px] text-[#51424d]">{stop.road}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleStarStop(stop.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isStarred ? 'text-[#a43e00]' : 'text-gray-400 hover:text-[#550053]'
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

              {/* Distance and Walk Time */}
              <div className="flex items-center gap-3 mt-2 text-[12px] text-[#51424d]">
                <span className="flex items-center gap-1 font-semibold text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[15px] text-[#741870]">
                    directions_walk
                  </span>
                  {stop.walkMinutes} mins walk ({stop.distanceMeters}m)
                </span>
                <span>•</span>
                <span>{stop.services.length} services passing</span>
              </div>

              {/* Services Chip List */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                {stop.services.slice(0, 7).map((s) => {
                  const svcData = BUS_SERVICES_AT_STOP[s];
                  const nextArr = svcData?.arrivals[0];

                  return (
                    <button
                      key={s}
                      onClick={() => onSelectBus(s)}
                      className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#741870] hover:text-white transition-colors text-left flex items-center gap-1"
                    >
                      <span className="font-heading text-[12px] font-bold">{s}</span>
                      {nextArr && (
                        <span className="text-[10px] opacity-80">
                          {nextArr.time}{!nextArr.isArr && 'm'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-1">
                <button
                  onClick={() => onSelectStop(stop)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#550053] text-white text-[12px] font-bold text-center hover:bg-[#741870]"
                >
                  View Arrivals
                </button>
                <button
                  onClick={onOpenWalkDirections}
                  className="py-1.5 px-3 rounded-lg bg-[#e5eeff] text-[#741870] text-[12px] font-semibold text-center hover:bg-[#dce9ff]"
                >
                  Directions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
