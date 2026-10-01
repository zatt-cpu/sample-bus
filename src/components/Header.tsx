import React from 'react';
import { SBS_LOGO_URL } from '../data/transitData';

interface HeaderProps {
  onRefresh: () => void;
  secondsLeft: number;
  isRefreshing: boolean;
  onOpenProfile: () => void;
  gpsActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  secondsLeft,
  isRefreshing,
  onOpenProfile,
  gpsActive = true,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0]">
      <div className="h-16 md:h-20 px-4 max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={SBS_LOGO_URL}
            alt="SBS Transit Arrival Logo"
            className="h-8 md:h-9 w-auto object-contain flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-[17px] md:text-[18px] font-bold text-[#4A0E48] truncate tracking-tight">
                SBS BusArrival
              </span>
              <span className="text-[12px] md:text-[13px] text-[#51424d] font-medium hidden sm:inline">
                • Bus Arrival
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex h-2 w-2 relative flex-shrink-0">
                {gpsActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span className="text-[11px] font-bold text-[#51424d] truncate tracking-wide">
                Dhoby Ghaut / Orchard - GPS Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onRefresh}
            aria-label="Refresh Realtime Arrivals"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#51424d] hover:text-[#550053] hover:bg-[#eff4ff] active:scale-95 transition-all"
            title="Force refresh bus arrivals"
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isRefreshing ? 'animate-spin text-[#741870]' : ''
              }`}
            >
              sync
            </span>
          </button>
          
          <button
            onClick={onOpenProfile}
            aria-label="User Profile and Preferences"
            className="w-8 h-8 rounded-full bg-[#550053] hover:bg-[#741870] flex items-center justify-center shadow-sm text-white active:scale-95 transition-all"
            title="Commuter Settings"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
