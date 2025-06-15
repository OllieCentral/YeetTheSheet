import React from 'react';
import AddCategoryForm from './AddCategoryForm';
import CategoryList from './CategoryList';
import SetIncomeGoalForm from './SetIncomeGoalForm'; // Import the new form

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>

      {/* Section for Category Management */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Manage Categories</h2>
        <AddCategoryForm />
        <CategoryList />
      </div>

       {/* Section for Income Goal */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Set Income Goal</h2>
        <SetIncomeGoalForm /> {/* Use the new form component */}
      </div>

      {/* Section for Budget Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">Set Budgets</h2>
        <p className="text-gray-400">Budget setting UI coming soon...</p>
        {/* Budget form/list will go here */}
      </div>

    </div>
  );
};

export default SettingsView;
