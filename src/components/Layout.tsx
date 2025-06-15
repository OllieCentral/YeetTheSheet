import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ManageView from './ManageView';
import SettingsView from './SettingsView'; // Import SettingsView

export type ActiveView = 'dashboard' | 'manage' | 'settings'; // Add 'settings'

const Layout: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="flex flex-col h-screen bg-[#1a1a2e] text-white">
      <TopBar
        activeView={activeView}
        setActiveView={setActiveView}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} // Pass toggle function
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Conditional rendering for mobile */}
        <div className={`fixed inset-y-0 left-0 z-30 w-48 transform transition-transform duration-300 ease-in-out bg-[#2a2a4e] lg:relative lg:translate-x-0 lg:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <Sidebar setActiveView={setActiveView} closeSidebar={() => setIsSidebarOpen(false)} />
        </div>
         {/* Overlay for mobile sidebar */}
         {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#161625]">
          {/* Pass setActiveView to Dashboard */}
          {activeView === 'dashboard' && <Dashboard setActiveView={setActiveView} />}
          {activeView === 'manage' && <ManageView />}
          {activeView === 'settings' && <SettingsView />} {/* Render SettingsView */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
