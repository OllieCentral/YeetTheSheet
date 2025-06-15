import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

const ExpenseList: React.FC = () => {
  const expenses = useQuery(api.finance.listExpenses);
  const deleteExpense = useMutation(api.finance.deleteExpense);

  const handleDelete = async (expenseId: Id<"expenses">) => {
    // Optional: Add a confirmation dialog
    // if (!window.confirm("Are you sure you want to delete this expense?")) {
    //   return;
    // }
    try {
      await deleteExpense({ expenseId });
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error(`Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (expenses === undefined) {
    return (
      <div className="card text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return <div className="card text-center text-gray-400">No expenses logged yet.</div>;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-center text-[#e94560]">Recent Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#4a4a6e] text-gray-300">
            <tr>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 text-right">Amount</th>
              <th className="py-2 px-3 text-center">Recurring</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="border-b border-[#2a2a4e] hover:bg-[#1f1f38]">
                <td className="py-2 px-3">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="py-2 px-3">
                  <span className="mr-1">{exp.categoryIcon}</span>
                  {exp.categoryName}
                </td>
                <td className="py-2 px-3 text-gray-400">{exp.description ?? '-'}</td>
                <td className="py-2 px-3 text-right font-medium">${exp.amount.toFixed(2)}</td>
                <td className="py-2 px-3 text-center">{exp.isRecurring ? 'Yes' : 'No'}</td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:text-red-400 text-xs bg-transparent border-none p-1"
                    title="Delete Expense"
                  >
                    🗑️
                  </button>
                  {/* Add Edit button later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
