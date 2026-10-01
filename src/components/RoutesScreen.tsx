import React, { useState } from 'react';
import { BUS_SERVICES_AT_STOP } from '../data/transitData';

interface RoutesScreenProps {
  onSelectRoute: (serviceNo: string) => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({ onSelectRoute }) => {
  const [filterOperator, setFilterOperator] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const services = Object.values(BUS_SERVICES_AT_STOP);

  const filtered = services.filter((s) => {
    const matchesOp = filterOperator === 'ALL' || s.operator === filterOperator;
    const matchesQ =
      s.serviceNo.toLowerCase().includes(query.toLowerCase()) ||
      s.destination.toLowerCase().includes(query.toLowerCase()) ||
      (s.via && s.via.toLowerCase().includes(query.toLowerCase()));
    return matchesOp && matchesQ;
  });

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3 gap-3">
      {/* Route Search */}
      <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#E2E8F0] p-1.5 focus-within:border-[#741870]">
        <div className="w-10 h-10 flex items-center justify-center text-[#741870]">
          <span className="material-symbols-outlined text-[22px]">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bus number or destination..."
          className="w-full bg-transparent px-2 py-2 font-heading text-[15px] font-bold text-[#0b1c30] focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Operator Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'All Operators' },
          { id: 'SBST', label: 'SBS Transit' },
          { id: 'SMRT', label: 'SMRT' },
          { id: 'TTS', label: 'Tower Transit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterOperator(tab.id)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              filterOperator === tab.id
                ? 'bg-[#550053] text-white shadow-xs'
                : 'bg-[#e5eeff] text-[#51424d] hover:bg-[#dce9ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Routes List */}
      <div className="flex flex-col gap-2 mt-1">
        {filtered.map((s) => (
          <div
            key={s.serviceNo}
            onClick={() => onSelectRoute(s.serviceNo)}
            className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-[#550053] text-white font-heading font-extrabold text-[18px] flex items-center justify-center">
                {s.serviceNo}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-[14px] font-bold text-[#0b1c30]">
                  {s.origin || 'HarbourFront'} ⇄ {s.destination}
                </span>
                <span className="text-[12px] text-[#51424d]">
                  {s.operatingHours} • {s.frequencyPeak}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[10px] font-bold text-[#741870] border border-[#741870]/20">
                {s.operator}
              </span>
              <span className="material-symbols-outlined text-[20px] text-[#51424d]">
                chevron_right
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
