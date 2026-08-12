import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';
import LetterGlitch from './LetterGlitch';

const AppLayout: React.FC = () => {
  const { darkMode, aiPanelOpen, toggleAIPanel } = useApp();

  return (
    <div className="flex h-screen overflow-hidden relative text-[#33ff00] bg-[#0a0a0a]">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <LetterGlitch
          glitchColors={['#33ff00', '#1a7a00', '#ffb000']}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />

      <div className="relative z-10 flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
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