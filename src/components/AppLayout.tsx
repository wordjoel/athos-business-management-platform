import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';

const AppLayout: React.FC = () => {
  const { darkMode, aiPanelOpen, toggleAIPanel } = useApp();

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {aiPanelOpen && <AIAssistant darkMode={darkMode} onClose={toggleAIPanel} />}
    </div>
  );
};

export default AppLayout;