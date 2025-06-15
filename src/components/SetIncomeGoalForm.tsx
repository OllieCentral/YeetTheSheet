import React, { useState, useEffect, FormEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const SetIncomeGoalForm: React.FC = () => {
  const currentGoal = useQuery(api.finance.getIncomeGoal);
  const setIncomeGoal = useMutation(api.finance.setIncomeGoal);
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill the form when the current goal data loads
    if (currentGoal !== undefined) {
      setTargetAmount(currentGoal?.targetAmount?.toString() ?? '');
    }
  }, [currentGoal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount for the goal.");
      return;
    }

    setIsLoading(true);
    try {
      await setIncomeGoal({ targetAmount: amount, period: "monthly" });
      setSuccess("Income goal updated successfully!");
      setTimeout(() => setSuccess(null), 3000); // Clear success message
    } catch (err: any) {
      console.error("Failed to set income goal:", err);
      setError(err.message || "Failed to update income goal.");
      setTimeout(() => setError(null), 5000); // Clear error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-[#2a2a4e] rounded-lg border border-[#4a4a6e]">
      <h3 className="text-lg font-medium text-white mb-2">Set Monthly Income Goal</h3>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <div>
        <label htmlFor="income-goal-amount" className="label">Target Amount ($)</label>
        <input
          id="income-goal-amount"
          type="number"
          step="1"
          min="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="e.g., 5000"
          className="input"
          required
          disabled={isLoading || currentGoal === undefined} // Disable while loading initial goal
        />
         {currentGoal === undefined && <p className="text-xs text-gray-400 mt-1">Loading current goal...</p>}
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading || currentGoal === undefined}>
        {isLoading ? 'Saving...' : 'Set Goal'}
      </button>
    </form>
  );
};

export default SetIncomeGoalForm;
