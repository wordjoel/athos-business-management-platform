import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full border-2 border-cyan-500/60 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white tracking-wider">ATHOS</h2>
          <p className="text-xs text-gray-500 mt-1 animate-pulse">Carregando...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;