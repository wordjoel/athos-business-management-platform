import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4 font-mono">
        <h2 className="text-lg font-bold text-[#33ff00] tracking-wider term-glow">ATHOS</h2>
        <p className="text-xs text-[#3f9e5c]">
          carregando<span className="animate-blink">_</span>
        </p>
        <div className="w-48 h-3 border border-[#1f521f] overflow-hidden">
          <div className="h-full bg-[#33ff00] animate-pulse-glow" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
