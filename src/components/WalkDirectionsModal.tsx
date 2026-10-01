import React from 'react';
import { BusStopDetail } from '../types/transit';

interface WalkDirectionsModalProps {
  stop: BusStopDetail;
  onClose: () => void;
  onViewCorridorMap: () => void;
}

export const WalkDirectionsModal: React.FC<WalkDirectionsModalProps> = ({
  stop,
  onClose,
  onViewCorridorMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#550053] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">directions_walk</span>
            </div>
            <div>
              <h3 className="font-heading text-[17px] font-bold text-[#4A0E48]">
                Walking to {stop.name}
              </h3>
              <p className="text-[12px] text-[#51424d]">
                {stop.distanceMeters}m away • Approx {stop.walkMinutes} mins walk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#51424d] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Path Highlights */}
        <div className="px-5 py-3 bg-[#f8f9ff] border-b border-[#E2E8F0] flex items-center justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#51424d] uppercase tracking-wider">Distance</span>
            <span className="font-heading text-[16px] font-bold text-[#0b1c30]">120 m</span>
          </div>
          <div className="h-6 w-[1px] bg-[#d5c1ce]" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#51424d] uppercase tracking-wider">Est. Time</span>
            <span className="font-heading text-[16px] font-bold text-[#059669]">2 mins</span>
          </div>
          <div className="h-6 w-[1px] bg-[#d5c1ce]" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#51424d] uppercase tracking-wider">Sheltered</span>
            <span className="font-heading text-[16px] font-bold text-[#0284C7]">90% Covered</span>
          </div>
        </div>

        {/* Step-by-step turn guidance */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#550053] font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#741870]/20">
              1
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#0b1c30]">
                Head northwest from Orchard Gateway / Somerset Exit D
              </p>
              <p className="text-[12px] text-[#51424d] mt-0.5">
                Proceed along the sheltered pedestrian walkway towards Koek Road. (45m)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#550053] font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#741870]/20">
              2
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#0b1c30]">
                Cross Koek Road pedestrian signal
              </p>
              <p className="text-[12px] text-[#51424d] mt-0.5">
                Tactile paving and audible street crossing chirp installed. (35m)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#059669] text-white font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">pin_drop</span>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#059669]">
                Arrive at Orchard Plaza Bus Stop (ID: 08137)
              </p>
              <p className="text-[12px] text-[#51424d] mt-0.5">
                Bus shelter is equipped with electronic arrival board and barrier-free ramp. (40m)
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#F7EEF6] rounded-xl flex items-center gap-2.5 text-[#4A0E48] text-[12px]">
            <span className="material-symbols-outlined text-[18px] text-[#741870] flex-shrink-0">
              accessible
            </span>
            <span>
              <strong>Accessibility Note:</strong> Step-free barrier-free route suitable for wheelchairs and strollers.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#f8f9ff] flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onViewCorridorMap();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#eff4ff] text-[#550053] font-heading font-semibold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span>View on Map</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#550053] text-white font-heading font-semibold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#741870] transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
};
