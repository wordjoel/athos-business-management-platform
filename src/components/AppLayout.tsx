import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 2 + (i % 3) * 2,
  left: ((i * 7 + 3) % 100),
  top: ((i * 13 + 7) % 100),
  delay: i * 0.7,
  duration: 8 + (i % 5) * 2,
}));

const orbs = [
  { size: 600, left: -10, top: -20, delay: 0, duration: 20, opacity: 0.12 },
  { size: 500, left: 60, top: 30, delay: -7, duration: 25, opacity: 0.08 },
  { size: 400, left: 20, top: 60, delay: -14, duration: 18, opacity: 0.1 },
  { size: 350, left: 70, top: -10, delay: -5, duration: 22, opacity: 0.07 },
];

const AppLayout: React.FC = () => {
  const { darkMode, aiPanelOpen, toggleAIPanel } = useApp();

  const orbElements = useMemo(() => orbs.map((orb, i) => (
    <div
      key={i}
      className="absolute rounded-full animate-morph"
      style={{
        width: orb.size,
        height: orb.size,
        left: `${orb.left}%`,
        top: `${orb.top}%`,
        background: `radial-gradient(circle at center, rgba(0, 255, 255, ${orb.opacity}) 0%, rgba(0, 204, 204, ${orb.opacity * 0.5}) 30%, transparent 70%)`,
        animationDuration: `${orb.duration}s`,
        animationDelay: `${orb.delay}s`,
        filter: 'blur(60px)',
        willChange: 'transform',
      }}
    />
  )), []);

  const particleElements = useMemo(() => particles.map(p => (
    <div
      key={p.id}
      className="absolute rounded-full animate-drift"
      style={{
        width: p.size,
        height: p.size,
        left: `${p.left}%`,
        top: `${p.top}%`,
        background: `rgba(0, 255, 255, ${0.15 + (p.id % 3) * 0.1})`,
        boxShadow: `0 0 ${p.size * 2}px rgba(0, 255, 255, 0.2)`,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        willChange: 'transform',
      }}
    />
  )), []);

  return (
    <div className={`flex h-screen overflow-hidden relative ${darkMode ? 'text-white' : 'text-gray-900 light'}`}>
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`} />

      <div className="absolute inset-0 overflow-hidden">
        {orbElements}
      </div>

      <div className="absolute inset-0 bg-grid-subtle" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleElements}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950/80" />

      <div className="relative z-10 flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden backdrop-blur-sm">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
        {aiPanelOpen && <AIAssistant darkMode={darkMode} onClose={toggleAIPanel} />}
      </div>
    </div>
  );
};

export default AppLayout;