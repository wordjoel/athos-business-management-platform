import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0B0E14]">
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl text-gradient tracking-wide">ATHOS</h2>
        <p className="text-xs text-[#8B93A6] tracking-wide">Carregando…</p>
        <div className="w-48 h-1.5 rounded-full bg-[#232837] overflow-hidden">
          <div className="h-full rounded-full animate-pulse-glow" style={{ width: '70%', background: 'linear-gradient(90deg, #A98A47, #E0C583)' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
