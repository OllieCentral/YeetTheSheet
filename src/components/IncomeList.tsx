import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

const IncomeList: React.FC = () => {
  const incomeList = useQuery(api.finance.listIncome) ?? [];
  const deleteIncome = useMutation(api.finance.deleteIncome); // Use the new mutation

  const handleDelete = async (incomeId: Id<"income">) => {
    // Optional: Add confirmation
    try {
      await deleteIncome({ incomeId });
      toast.success('Income deleted successfully!');
    } catch (error) {
      console.error('Failed to delete income:', error);
      toast.error(`Failed to delete income: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (incomeList === undefined) {
    return (
      <div className="card text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
      </div>
    );
  }

  if (incomeList.length === 0) {
    return <div className="card text-center text-gray-400">No income logged yet.</div>;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-center text-green-400">Recent Income</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#4a4a6e] text-gray-300">
            <tr>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Source</th>
              <th className="py-2 px-3 text-right">Amount</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomeList.map((inc) => (
              <tr key={inc._id} className="border-b border-[#2a2a4e] hover:bg-[#1f1f38]">
                <td className="py-2 px-3">{new Date(inc.date).toLocaleDateString()}</td>
                <td className="py-2 px-3">{inc.source}</td>
                <td className="py-2 px-3 text-right font-medium text-green-400">${inc.amount.toFixed(2)}</td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => handleDelete(inc._id)}
                    className="text-red-500 hover:text-red-400 text-xs bg-transparent border-none p-1"
                    title="Delete Income"
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

export default IncomeList;
