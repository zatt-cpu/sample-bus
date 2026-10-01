import React from 'react';

export type NavTab = 'arrival' | 'nearby' | 'routes' | 'saved';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 2,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#E2E8F0]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {/* Arrival */}
        <button
          onClick={() => onTabChange('arrival')}
          aria-current={activeTab === 'arrival' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all ${
            activeTab === 'arrival'
              ? 'text-[#550053] font-bold scale-105'
              : 'text-[#51424d] hover:text-[#550053]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'arrival' ? 'material-symbols-filled' : ''
            }`}
          >
            directions_bus
          </span>
          <span className="text-[11px] font-bold tracking-tight">Arrival</span>
        </button>

        {/* Nearby */}
        <button
          onClick={() => onTabChange('nearby')}
          aria-current={activeTab === 'nearby' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all ${
            activeTab === 'nearby'
              ? 'text-[#550053] font-bold scale-105'
              : 'text-[#51424d] hover:text-[#550053]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'nearby' ? 'material-symbols-filled' : ''
            }`}
          >
            near_me
          </span>
          <span className="text-[11px] font-bold tracking-tight">Nearby</span>
        </button>

        {/* Routes */}
        <button
          onClick={() => onTabChange('routes')}
          aria-current={activeTab === 'routes' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all ${
            activeTab === 'routes'
              ? 'text-[#550053] font-bold scale-105'
              : 'text-[#51424d] hover:text-[#550053]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'routes' ? 'material-symbols-filled' : ''
            }`}
          >
            map
          </span>
          <span className="text-[11px] font-bold tracking-tight">Routes</span>
        </button>

        {/* Saved */}
        <button
          onClick={() => onTabChange('saved')}
          aria-current={activeTab === 'saved' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all ${
            activeTab === 'saved'
              ? 'text-[#550053] font-bold scale-105'
              : 'text-[#51424d] hover:text-[#550053]'
          }`}
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                activeTab === 'saved' ? 'material-symbols-filled' : ''
              }`}
            >
              notifications_active
            </span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#a43e00] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold tracking-tight">Saved</span>
        </button>
      </div>
    </nav>
  );
};
