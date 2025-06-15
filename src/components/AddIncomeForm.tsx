import React, { useState, FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

const AddIncomeForm: React.FC = () => {
  const addIncome = useMutation(api.finance.addIncome);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !amount || !source) {
      toast.error('Please fill in Date, Amount, and Source.');
      return;
    }

    const incomeAmount = parseFloat(amount);
    if (isNaN(incomeAmount) || incomeAmount <= 0) {
      toast.error('Please enter a valid positive amount.');
      return;
    }

    setIsLoading(true);
    try {
      await addIncome({
        date: new Date(date).getTime(), // Convert date string to timestamp
        amount: incomeAmount,
        source: source,
      });
      toast.success('Income added successfully!');
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setSource('');
    } catch (error) {
      console.error('Failed to add income:', error);
      toast.error(`Failed to add income: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-lg mx-auto text-left">
      <h2 className="text-xl font-semibold mb-4 text-center text-green-400">Log New Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income-date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            type="date"
            id="income-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="income-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
          <input
            type="number"
            id="income-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 2000.00"
            step="0.01"
            min="0.01"
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="income-source" className="block text-sm font-medium text-gray-300 mb-1">Source</label>
          <input
            type="text"
            id="income-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., Salary, Freelance Project"
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Income'}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm;
