import React, { useState } from 'react';
import { MAP_PREVIEW_URL } from '../data/transitData';

interface CorridorMapModalProps {
  onClose: () => void;
  serviceNo?: string;
}

export const CorridorMapModal: React.FC<CorridorMapModalProps> = ({
  onClose,
  serviceNo = '65',
}) => {
  const [selectedPin, setSelectedPin] = useState<string>('Orchard Plaza');

  const stopsOnCorridor = [
    { name: 'Dhoby Ghaut Stn', code: '08031', top: '78%', left: '72%', status: 'passed' },
    { name: 'Orchard Plaza', code: '08137', top: '56%', left: '50%', status: 'current', bus: 'SBS3128T' },
    { name: 'Somerset Stn', code: '08121', top: '44%', left: '38%', status: 'upcoming', eta: '7 min' },
    { name: 'Opp Mandarin Orchard', code: '09037', top: '34%', left: '28%', status: 'upcoming', eta: '12 min' },
    { name: 'Newton Stn Exit B', code: '40181', top: '16%', left: '22%', status: 'upcoming', eta: '19 min' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-2xl h-full sm:h-[88vh] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#4A0E48] text-white flex items-center justify-between z-10 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-heading text-[14px] font-bold">
              {serviceNo}
            </span>
            <div>
              <h3 className="font-heading text-[15px] font-bold">
                Live Corridor Map: Service {serviceNo}
              </h3>
              <p className="text-[11px] text-white/80">
                Orchard Road Transit Corridor • 3 buses tracked live
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Map Viewport Area */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden select-none">
          {/* Base Map Graphic */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 filter saturate-150"
            style={{
              backgroundImage: `url(${MAP_PREVIEW_URL})`,
            }}
          />

          {/* SVG Route Line Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points="100,50 140,120 180,240 240,320 320,440 380,560"
              fill="none"
              stroke="#741870"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
            <polyline
              points="100,50 140,120 180,240 240,320 320,440 380,560"
              fill="none"
              stroke="#ffd7f4"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>

          {/* Stop Pins and Bus Pins */}
          {stopsOnCorridor.map((stop) => {
            const isSelected = selectedPin === stop.name;
            const isHere = stop.status === 'current';

            return (
              <div
                key={stop.code}
                onClick={() => setSelectedPin(stop.name)}
                style={{ top: stop.top, left: stop.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                {/* Pin element */}
                <div
                  className={`relative flex items-center justify-center transition-all ${
                    isHere
                      ? 'w-10 h-10 rounded-full bg-[#550053] text-white shadow-xl ring-4 ring-white'
                      : isSelected
                      ? 'w-8 h-8 rounded-full bg-[#741870] text-white shadow-lg ring-2 ring-white scale-110'
                      : 'w-6 h-6 rounded-full bg-white text-[#550053] shadow-md border-2 border-[#550053]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isHere ? 'directions_bus' : 'navigation'}
                  </span>

                  {isHere && (
                    <span className="animate-ping absolute inset-0 rounded-full bg-[#550053] opacity-60"></span>
                  )}
                </div>

                {/* Micro Label */}
                <div
                  className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all ${
                    isHere
                      ? 'bg-[#550053] text-white ring-1 ring-white/40'
                      : isSelected
                      ? 'bg-white text-[#4A0E48] font-bold'
                      : 'bg-black/70 text-white group-hover:bg-white group-hover:text-black'
                  }`}
                >
                  {stop.name}
                  {stop.eta && ` (${stop.eta})`}
                </div>
              </div>
            );
          })}

          {/* Compass and Recenter Floating Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-30">
            <button
              onClick={() => setSelectedPin('Orchard Plaza')}
              className="w-10 h-10 rounded-xl bg-white text-[#4A0E48] flex items-center justify-center shadow-lg hover:bg-[#eff4ff] active:scale-95 transition-all"
              title="Recenter on You (Orchard Plaza)"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <button
              className="w-10 h-10 rounded-xl bg-white text-[#4A0E48] flex items-center justify-center shadow-lg hover:bg-[#eff4ff] active:scale-95 transition-all"
              title="Compass North"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </button>
          </div>

          {/* Active Legend Card overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#550053] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                </div>
                <div>
                  <h4 className="font-heading text-[13px] font-bold text-[#0b1c30]">
                    Selected: {selectedPin}
                  </h4>
                  <p className="text-[11px] text-[#51424d]">
                    Bus 65 approaching stop • Next arrival: <strong>Arr (Double Decker)</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-[#550053] text-white text-[12px] font-bold hover:bg-[#741870] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
