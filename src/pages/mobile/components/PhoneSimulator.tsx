import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  deviceType: 'ios' | 'android' | 'raw';
  setDeviceType: (type: 'ios' | 'android' | 'raw') => void;
}

export default function PhoneSimulator({ children, deviceType, setDeviceType }: PhoneSimulatorProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (deviceType === 'raw') {
    return (
      <div className="w-full min-h-screen bg-[#000000] text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      {/* Device Toggle Selector (Visible on Desktop) */}
      <div className="hidden md:flex items-center gap-3 mb-6 bg-slate-900 border border-slate-800 p-1.5 rounded-full z-10">
        <button
          onClick={() => setDeviceType('ios')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition ${
            deviceType === 'ios'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          iPhone Simulator
        </button>
        <button
          onClick={() => setDeviceType('android')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition ${
            deviceType === 'android'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-green-500" />
          Android Simulator
        </button>
        <button
          onClick={() => setDeviceType('raw')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition ${
            (deviceType as string) === 'raw'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Full View
        </button>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[412px] transition-all duration-300">
        {/* Physical Frame (Visible on screens >= sm) */}
        <div className="sm:border-[12px] sm:border-slate-800 sm:rounded-[56px] sm:shadow-2xl overflow-hidden sm:aspect-[9/19.5] sm:h-[840px] bg-[#000000] flex flex-col relative w-full border-slate-700">
          
          {/* iOS Dynamic Island / Notch */}
          {deviceType === 'ios' && (
            <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 items-center justify-between px-3">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-950 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/50"></div>
              </div>
            </div>
          )}

          {/* Android Punch Hole Camera */}
          {deviceType === 'android' && (
            <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-black rounded-full z-50"></div>
          )}

          {/* Top Bar (Status indicators) */}
          <div className="flex justify-between items-center px-6 pt-3.5 pb-2 text-xs font-medium text-white select-none z-40 bg-[#000000]">
            {/* Clock */}
            <div className="flex items-center">
              <span className="font-semibold tracking-tight">{time || '09:41'}</span>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-slate-200" />
              <span className="text-[10px] text-slate-300 mr-0.5">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-200" />
              <div className="flex items-center gap-0.5 ml-1">
                <Battery className="w-4 h-4 text-slate-200" />
              </div>
            </div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#000000] h-full">
            {children}
          </div>

          {/* Home Indicator Bar (iOS/Android gesture bar) */}
          <div className="hidden sm:flex justify-center items-center pb-2 pt-1 bg-[#000000] select-none z-40">
            <div className={`h-1 rounded-full bg-slate-400 ${deviceType === 'ios' ? 'w-36' : 'w-24'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
