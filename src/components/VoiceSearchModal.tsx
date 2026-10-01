import React, { useState, useEffect } from 'react';

interface VoiceSearchModalProps {
  onClose: () => void;
  onSelectBus: (busNo: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  onClose,
  onSelectBus,
}) => {
  const [statusText, setStatusText] = useState('Listening... Speak a bus number (e.g. "Bus 65")');
  const [detectedVoice, setDetectedVoice] = useState<string | null>(null);

  useEffect(() => {
    // Simulate speech detection
    const timer = setTimeout(() => {
      setDetectedVoice('Bus 65 towards Tampines');
      setStatusText('Detected: "Bus 65"');
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const handleSimulateVoice = (bus: string) => {
    setDetectedVoice(`Bus ${bus}`);
    setStatusText(`Detected: "Bus ${bus}"`);
    setTimeout(() => {
      onSelectBus(bus);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center flex flex-col items-center">
        {/* Pulsing Mic Graphic */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-[#F7EEF6] flex items-center justify-center text-[#741870]">
            <span className="material-symbols-outlined text-[36px] animate-pulse">mic</span>
          </div>
          <span className="absolute inset-0 rounded-full border-2 border-[#741870] animate-ping opacity-40"></span>
          <span className="absolute -inset-2 rounded-full border border-[#741870] animate-pulse opacity-20"></span>
        </div>

        <h3 className="font-heading text-[18px] font-bold text-[#4A0E48] mb-1">
          Transit Voice Search
        </h3>
        <p className="text-[13px] text-[#51424d] mb-4 min-h-[40px] flex items-center justify-center">
          {statusText}
        </p>

        {/* Audio Waveform Animation */}
        <div className="flex items-center justify-center gap-1.5 h-8 mb-6">
          <span className="w-1.5 h-4 bg-[#741870] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-8 bg-[#550053] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-6 bg-[#0284C7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          <span className="w-1.5 h-7 bg-[#741870] rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></span>
          <span className="w-1.5 h-3 bg-[#550053] rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
        </div>

        {detectedVoice ? (
          <button
            onClick={() => {
              onSelectBus('65');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#550053] text-white font-heading font-semibold text-[14px] hover:bg-[#741870] transition-colors mb-3 shadow-sm"
          >
            Confirm "Bus 65"
          </button>
        ) : (
          <div className="w-full space-y-2 mb-4">
            <span className="text-[11px] font-bold text-[#51424d] uppercase tracking-wider block">
              Or tap quick sample:
            </span>
            <div className="flex justify-center gap-2">
              {['65', '14', '106', '175'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSimulateVoice(num)}
                  className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#550053] font-heading font-bold text-[13px] hover:bg-[#dce9ff]"
                >
                  "{num}"
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-[13px] font-semibold text-[#51424d] hover:text-[#550053] transition-colors py-1 px-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
