import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { SignOutButton } from '../SignOutButton';
import { ActiveView } from './Layout'; // Import ActiveView type

interface TopBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  toggleSidebar: () => void; // Add toggle function prop
}

const TopBar: React.FC<TopBarProps> = ({ activeView, setActiveView, toggleSidebar }) => {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const monthlySummary = useQuery(api.summaries.getMonthlySummary, { month: new Date().getMonth(), year: new Date().getFullYear() });
  // Calculate Net Change for display (Income - Expenses)
  const netChange = (monthlySummary?.totalIncome ?? 0) - (monthlySummary?.totalExpenses ?? 0);
  const netChangeColor = netChange >= 0 ? 'text-green-400' : 'text-red-400';


  const getButtonClasses = (view: ActiveView) => {
    return `flex items-center space-x-1 px-3 py-1 rounded ${
      activeView === view ? 'bg-[#4a4a6e] text-white' : 'hover:text-[#e94560]'
    }`;
  };

  return (
    <header className="bg-[#2a2a4e] text-white p-3 md:p-4 flex justify-between items-center border-b border-[#4a4a6e] sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center space-x-2 md:space-x-4">
         {/* Hamburger Menu for Mobile */}
         <button onClick={toggleSidebar} className="lg:hidden p-1 text-gray-300 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>
         </button>
        {/* Logo */}
        <svg className="hidden sm:block" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#e94560" strokeWidth="10"/>
          <path d="M30 70 Q 50 40 70 70" stroke="#34d399" strokeWidth="8" fill="none"/>
          <path d="M35 50 H 65" stroke="#60a5fa" strokeWidth="8"/>
        </svg>
        <span className="text-lg md:text-xl font-semibold hidden sm:inline">Finance Tracker</span>
        {/* Net Change Display */}
        <span className={`text-sm md:text-lg font-medium ${netChangeColor}`}>
           Net Change: ${netChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Center Section - Navigation (Hidden on smaller screens, shown on md+) */}
      <nav className="hidden md:flex space-x-1 bg-[#1a1a2e] p-1 rounded-lg">
        <button
          className={getButtonClasses('dashboard')}
          onClick={() => setActiveView('dashboard')}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button
          className={getButtonClasses('manage')}
          onClick={() => setActiveView('manage')}
        >
          <span>📝</span>
          <span>Log/Manage</span>
        </button>
         <button
          className={getButtonClasses('settings')}
          onClick={() => setActiveView('settings')}
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="hidden sm:inline text-sm">{currentDate}</span>
        <div className="flex items-center space-x-2">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#60a5fa"/>
            <circle cx="50" cy="40" r="15" fill="#1a1a2e"/>
            <path d="M30 75 Q 50 60 70 75" stroke="#1a1a2e" strokeWidth="8" fill="none"/>
          </svg>
          <span className="hidden md:inline text-sm">{loggedInUser?.name ?? loggedInUser?.email ?? 'User'}</span>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
};

export default TopBar;
