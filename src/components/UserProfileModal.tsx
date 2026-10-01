import React, { useState } from 'react';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [wabFilter, setWabFilter] = useState(false);
  const [crowdAlertThreshold, setCrowdAlertThreshold] = useState<'any' | 'standing' | 'seats'>('standing');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#550053] to-[#741870] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-heading text-[18px] font-bold">
              SG
            </div>
            <div>
              <h3 className="font-heading text-[17px] font-bold text-white">
                Commuter Profile & Settings
              </h3>
              <p className="text-[12px] text-white/80">
                zatt@activecoolfashion.com.sg
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Notifications */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#51424d] mb-2">
              Alighting & Arrival Alerts
            </h4>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#f8f9ff] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#741870]">
                    volume_up
                  </span>
                  <div>
                    <span className="text-[14px] font-semibold text-[#0b1c30] block">
                      Sound Chime
                    </span>
                    <span className="text-[12px] text-[#51424d]">
                      Play chime when bus is 1 stop away
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#550053] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#f8f9ff] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#741870]">
                    vibration
                  </span>
                  <div>
                    <span className="text-[14px] font-semibold text-[#0b1c30] block">
                      Vibration Alert
                    </span>
                    <span className="text-[12px] text-[#51424d]">
                      Haptic pulse when drop-off stop arrives
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={vibration}
                  onChange={(e) => setVibration(e.target.checked)}
                  className="w-5 h-5 accent-[#550053] rounded"
                />
              </label>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#51424d] mb-2">
              Accessibility & Transit Needs
            </h4>
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#f8f9ff] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#0284C7]">
                  accessible
                </span>
                <div>
                  <span className="text-[14px] font-semibold text-[#0b1c30] block">
                    Wheelchair Accessible Bus (WAB) Only
                  </span>
                  <span className="text-[12px] text-[#51424d]">
                    Highlight only ramp-accessible vehicles
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={wabFilter}
                onChange={(e) => setWabFilter(e.target.checked)}
                className="w-5 h-5 accent-[#0284C7] rounded"
              />
            </label>
          </div>

          {/* Crowd preferences */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#51424d] mb-2">
              Preferred Seating Capacity
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any Load', dot: 'bg-gray-400' },
                { id: 'standing', label: 'Standing OK', dot: 'bg-[#D97706]' },
                { id: 'seats', label: 'Seats Only', dot: 'bg-[#059669]' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCrowdAlertThreshold(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    crowdAlertThreshold === opt.id
                      ? 'border-[#550053] bg-[#F7EEF6] text-[#550053] font-bold'
                      : 'border-[#E2E8F0] text-[#51424d] hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`}></span>
                  <span className="text-[12px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#f8f9ff] flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#CBD5E1] text-[#51424d] font-heading font-semibold text-[13px] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#550053] text-white font-heading font-semibold text-[13px] hover:bg-[#741870] transition-colors shadow-xs"
          >
            {savedSuccess ? 'Preferences Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
