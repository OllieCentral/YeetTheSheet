import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api'; // Correct path
import { Id } from '../../convex/_generated/dataModel'; // Correct path
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

// Helper function (consider moving to a utils file)
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '$--.--';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DashboardProps {
  setActiveView: (view: 'dashboard' | 'manage' | 'settings') => void;
}

export default function Dashboard({ setActiveView }: DashboardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch monthly summary data
  const monthlySummary = useQuery(api.summaries.getMonthlySummary, { month: currentMonth, year: currentYear });
  const incomeGoal = useQuery(api.finance.getIncomeGoal);

  // --- Derived Data & Calculations ---

  const totalExpenses = monthlySummary?.totalExpenses ?? 0;
  const totalIncome = monthlySummary?.totalIncome ?? 0;
  const totalNetWorth = monthlySummary?.totalNetWorth ?? 0; // Placeholder calculation for now
  const expensesByCategory = monthlySummary?.expensesByCategory ?? [];
  const incomeBySource = monthlySummary?.incomeBySource ?? [];

  const incomeGoalAmount = incomeGoal?.targetAmount ?? 0;
  const incomeProgress = incomeGoalAmount > 0 ? Math.min((totalIncome / incomeGoalAmount) * 100, 100) : 0;

  // Generate simple tips based on summary data (moved from getSavingsTips query)
  const tips: Array<string> = useMemo(() => {
    const generatedTips: Array<string> = [];
    if (!monthlySummary) return ["Keep tracking your finances to get personalized tips!"];

    // Tip 1: High Spending Category
    if (expensesByCategory.length > 0) {
      const topCategory = expensesByCategory[0];
      if (totalIncome > 0 && topCategory.value > totalIncome * 0.3) {
        generatedTips.push(`Your spending on "${topCategory.name}" (${formatCurrency(topCategory.value)}) seems high this month compared to your income. Look for ways to cut back.`);
      } else if (totalIncome === 0 && topCategory.value > 0) {
         generatedTips.push(`You had expenses in "${topCategory.name}" but no income logged this month. Ensure income is tracked.`);
      } else if (topCategory.value > 500) { // Arbitrary high value if income is low/zero
         generatedTips.push(`Spending on "${topCategory.name}" (${formatCurrency(topCategory.value)}) is significant. Review these expenses.`);
      }
    }

    // Tip 2: Expenses vs Income
    if (totalExpenses > totalIncome && totalIncome > 0) {
      generatedTips.push(`You spent ${formatCurrency(totalExpenses - totalIncome)} more than you earned this month. Review your budget.`);
    } else if (totalIncome > totalExpenses) {
       const savings = totalIncome - totalExpenses;
       generatedTips.push(`Great job saving ${formatCurrency(savings)} this month! Consider allocating it towards goals.`);
    } else if (totalIncome === 0 && totalExpenses > 0) {
        generatedTips.push("You have expenses logged but no income this month. Make sure to log your income sources.");
    }

    // Tip 3: Dining Out Check
    const diningCategory = expensesByCategory.find(cat => cat.name?.toLowerCase().includes("dining"));
    if (diningCategory && diningCategory.value > 150) { // Lowered threshold
        generatedTips.push(`Dining out cost ${formatCurrency(diningCategory.value)} this month. Cooking at home could offer savings.`);
    }

    // Tip 4: General Savings Tip
    generatedTips.push("Review recurring subscriptions. Are there any you no longer need?");
    // generatedTips.push("Try the '50/30/20' budget rule: 50% Needs, 30% Wants, 20% Savings.");

    if (generatedTips.length === 0) {
        generatedTips.push("Keep tracking your finances to get personalized tips!");
    }
    // Return a selection of tips (e.g., max 3)
    return generatedTips.slice(0, 3);
  }, [monthlySummary, expensesByCategory, totalIncome, totalExpenses]);


  // --- Render ---

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Card: Total Net Worth */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-2">💰 Total Net Worth</h3>
        <p className="text-3xl font-bold">{formatCurrency(totalNetWorth)}</p>
        <p className="text-sm opacity-80 mt-1">(Current Month Income - Expenses)</p>
      </div>

      {/* Card: Spendings Summary */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">📊 Spendings</h3>
        <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        <p className="text-sm text-gray-400">This Month</p>
        {/* Mini chart placeholder */}
        <div className="h-16 mt-2 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">Mini Chart Area</div>
      </div>

       {/* Card: Income Summary */}
       <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">💲 Income</h3>
        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
         <p className="text-sm text-gray-400">This Month</p>
         {/* Mini chart placeholder */}
         <div className="h-16 mt-2 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">Mini Chart Area</div>
       </div>

      {/* Card: Income Goal */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">🎯 Income Goal</h3>
        {incomeGoalAmount > 0 ? (
          <>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full"
                style={{ width: `${incomeProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 text-center mb-1">
              {formatCurrency(totalIncome)} / {formatCurrency(incomeGoalAmount)} ({incomeProgress.toFixed(0)}%)
            </p>
            <p className="text-xs text-gray-500 text-center">Monthly Goal Progress</p>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <p>No income goal set.</p>
            <button
              onClick={() => setActiveView('settings')}
              className="text-sm text-blue-400 hover:text-blue-300 mt-2 underline"
            >
              Set one in Settings
            </button>
          </div>
        )}
      </div>

      {/* Card: Spendings by Category List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Spendings by Category</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {expensesByCategory.length > 0 ? expensesByCategory.slice(0, 5).map((cat) => (
            <div key={cat.categoryId} className="flex justify-between items-center text-sm">
              <span className="text-gray-300 flex items-center">
                <span className="mr-2">{cat.icon || '❓'}</span>
                {cat.name}
              </span>
              <span className="font-medium text-red-400">{formatCurrency(cat.value)}</span>
            </div>
          )) : <p className="text-gray-500 text-sm">No expenses logged this month.</p>}
        </div>
         {/* Placeholder for chart */}
         <div className="h-24 mt-4 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">Category Chart Area</div>
      </div>

      {/* Card: Income Sources */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Income Sources</h3>
         <div className="space-y-2 max-h-48 overflow-y-auto">
           {incomeBySource.length > 0 ? incomeBySource.map((src, index) => (
             <div key={index} className="flex justify-between items-center text-sm">
               <span className="text-gray-300">{src.name}</span>
               <span className="font-medium text-green-400">{formatCurrency(src.value)}</span>
             </div>
           )) : <p className="text-gray-500 text-sm">No income logged this month.</p>}
         </div>
         {/* Placeholder for chart */}
         <div className="h-24 mt-4 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">Income Source Chart Area</div>
      </div>


      {/* Card: Notifications / Savings Tips */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">💡 Tips & Suggestions</h3>
        <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Card: Top Expense Category Detail (Placeholder) */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
         <h3 className="text-lg font-semibold mb-3 text-gray-300">
           {expensesByCategory.length > 0 ? `Top Expense: ${expensesByCategory[0].icon || '❓'} ${expensesByCategory[0].name}` : 'Top Expense: N/A'}
         </h3>
         <div className="space-y-1 text-sm text-gray-400 max-h-48 overflow-y-auto">
           {/* Need to fetch individual expenses for the top category here */}
           <p className="text-gray-500 text-xs">(Detailed expenses list coming soon)</p>
         </div>
       </div>

      {/* Card: Income & Expenses Trend (Placeholder) */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">📈 Income & Expenses Trend</h3>
        <div className="h-64 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">
          Chart Area (Requires fetching historical data)
        </div>
      </div>

       {/* Card: Assets Overview (Placeholder) */}
       <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
         <h3 className="text-lg font-semibold mb-3 text-gray-300">🏦 Assets Overview</h3>
         <div className="h-48 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">
           Donut Chart Area (Requires asset tracking)
         </div>
       </div>

    </div>
  );
}
