import React from 'react';
import { BUS_SERVICES_AT_STOP } from '../data/transitData';
import { BusServiceSummary } from '../types/transit';

interface AllServicesModalProps {
  onClose: () => void;
  onSelectService: (serviceNo: string) => void;
  onViewRoute: (serviceNo: string) => void;
}

export const AllServicesModal: React.FC<AllServicesModalProps> = ({
  onClose,
  onSelectService,
  onViewRoute,
}) => {
  const services = Object.values(BUS_SERVICES_AT_STOP);

  const getCrowdColor = (crowd: string) => {
    switch (crowd) {
      case 'seats':
        return 'bg-[#059669] text-[#059669]';
      case 'standing':
        return 'bg-[#D97706] text-[#D97706]';
      case 'limited':
        return 'bg-[#DC2626] text-[#DC2626]';
      default:
        return 'bg-[#059669] text-[#059669]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#741870] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">departure_board</span>
            </div>
            <div>
              <h3 className="font-heading text-[17px] font-bold text-[#4A0E48]">
                All Services at Orchard Plaza
              </h3>
              <p className="text-[12px] text-[#51424d]">
                Bus Stop ID: 08137 • 11 active routes
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

        {/* Legend strip */}
        <div className="px-5 py-2.5 bg-[#f8f9ff] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#51424d]">
          <span className="font-bold uppercase tracking-wider">Crowd Status:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span> Seats
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Standing
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span> Limited
            </span>
          </div>
        </div>

        {/* List of services */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {services.map((svc: BusServiceSummary) => {
            const nextArr = svc.arrivals[0];
            const secondArr = svc.arrivals[1];
            return (
              <div
                key={svc.serviceNo}
                onClick={() => {
                  onSelectService(svc.serviceNo);
                  onClose();
                }}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#eff4ff] hover:border-[#741870]/30 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 rounded-lg bg-[#550053] text-white flex items-center justify-center font-heading text-[18px] font-extrabold tracking-tight flex-shrink-0 group-hover:scale-105 transition-transform">
                    {svc.serviceNo}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-[14px] font-bold text-[#0b1c30] truncate">
                      {svc.destination}
                    </span>
                    <span className="text-[12px] text-[#51424d] truncate">
                      {svc.via ? `via ${svc.via}` : `${svc.operator} Trunk • ${svc.frequencyPeak}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-heading text-[16px] font-bold text-[#0b1c30]">
                        {nextArr.time}
                      </span>
                      {!nextArr.isArr && <span className="text-[11px] text-[#51424d]">m</span>}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${getCrowdColor(nextArr.crowd).split(' ')[0]}`} />
                  </div>

                  <span className="text-[#d5c1ce]">•</span>

                  <div className="flex flex-col items-end opacity-75">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[13px] font-semibold text-[#0b1c30]">
                        {secondArr.time}
                      </span>
                      <span className="text-[10px] text-[#51424d]">m</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${getCrowdColor(secondArr.crowd).split(' ')[0]}`} />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewRoute(svc.serviceNo);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-[#51424d] hover:text-[#550053] hover:bg-[#dce9ff] transition-colors ml-1"
                    title="View route timeline"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#f8f9ff] text-center">
          <p className="text-[11px] text-[#51424d]">
            Tap any service to set as primary queried bus on the home screen.
          </p>
        </div>
      </div>
    </div>
  );
};
