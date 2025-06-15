import React from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import AddIncomeForm from './AddIncomeForm';
import IncomeList from './IncomeList';

const ManageView: React.FC = () => {
  return (
    // Adjusted grid for better stacking on smaller screens
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Column 1: Expenses */}
      <div className="space-y-4 md:space-y-6">
        <AddExpenseForm />
        <ExpenseList />
      </div>

      {/* Column 2: Income */}
      <div className="space-y-4 md:space-y-6">
        <AddIncomeForm />
        <IncomeList />
      </div>
    </div>
  );
};

export default ManageView;
