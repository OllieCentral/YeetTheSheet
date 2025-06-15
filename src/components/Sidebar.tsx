import React from 'react';
import { ActiveView } from './Layout'; // Import ActiveView type

interface SidebarProps {
    setActiveView: (view: ActiveView) => void;
    closeSidebar: () => void; // Function to close sidebar on mobile
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveView, closeSidebar }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleNavigation = (view: ActiveView) => {
      setActiveView(view);
      closeSidebar(); // Close sidebar after navigation on mobile
  }

  return (
    <aside className="w-48 bg-[#2a2a4e] p-4 flex flex-col border-r border-[#4a4a6e] h-full">
       {/* Optional: Add a close button for mobile */}
       <button onClick={closeSidebar} className="absolute top-2 right-2 lg:hidden text-gray-400 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
           </svg>
       </button>

      {/* Main Navigation Links */}
       <nav className="flex-1 space-y-2 mt-8 lg:mt-0">
           <button onClick={() => handleNavigation('dashboard')} className="w-full text-left px-2 py-1 rounded hover:bg-[#4a4a6e] text-gray-300 flex items-center space-x-2">
               <span>📊</span>
               <span>Dashboard</span>
           </button>
           <button onClick={() => handleNavigation('manage')} className="w-full text-left px-2 py-1 rounded hover:bg-[#4a4a6e] text-gray-300 flex items-center space-x-2">
               <span>📝</span>
               <span>Log/Manage</span>
           </button>
           <button onClick={() => handleNavigation('settings')} className="w-full text-left px-2 py-1 rounded hover:bg-[#4a4a6e] text-gray-300 flex items-center space-x-2">
               <span>⚙️</span>
               <span>Settings</span>
           </button>

           <hr className="border-t border-[#4a4a6e] my-4" />

           {/* Month Filter (Functionality TBD) */}
           <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Filter by Month</h3>
           {months.map(month => (
               <button key={month} className="w-full text-left px-2 py-1 rounded hover:bg-[#4a4a6e] text-gray-300 text-sm">
                   {month}
               </button>
           ))}
       </nav>

      {/* Placeholder Decorative SVG */}
      <div className="mt-auto p-2">
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50 Q 25 10 50 30 T 100 0" stroke="#4a4a6e" strokeWidth="3" fill="none"/>
          <path d="M0 40 Q 30 0 60 20 T 100 10" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        </svg>
      </div>
    </aside>
  );
};

export default Sidebar;
