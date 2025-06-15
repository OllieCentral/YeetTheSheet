import React, { useState } from 'react';
    import { useMutation, useQuery } from 'convex/react';
    import { api } from '../../convex/_generated/api';
    import { Id } from '../../convex/_generated/dataModel'; // Import Id type

    const AddExpenseForm: React.FC = () => {
      const [amount, setAmount] = useState('');
      const [categoryId, setCategoryId] = useState<Id<'categories'> | ''>(''); // Use Id type
      const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
      const [description, setDescription] = useState('');
      const [isRecurring, setIsRecurring] = useState(false);

      const categories = useQuery(api.finance.listCategories);
      const addExpense = useMutation(api.finance.addExpense);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !date) return;

        try {
          await addExpense({
            amount: parseFloat(amount),
            categoryId: categoryId as Id<'categories'>, // Assert type here
            date: new Date(date).getTime(),
            description: description || undefined,
            isRecurring,
          });

          // Reset form
          setAmount('');
          setCategoryId('');
          setDate(new Date().toISOString().split('T')[0]);
          setDescription('');
          setIsRecurring(false);
        } catch (error) {
          console.error('Failed to add expense:', error);
          // Add user feedback here, e.g., using a state variable for error message
        }
      };

      if (categories === undefined) { // Check for undefined (loading state)
        return (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <span className="text-gray-400 ml-2">Loading categories...</span>
          </div>
        );
      }

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 pr-12 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
                required
                step="0.01"
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as Id<'categories'>)} // Cast selected value
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon ? `${category.icon} ` : ''}{category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Weekly groceries"
            />
          </div>

          {/* Recurring Checkbox */}
          <div className="flex items-center">
            <input
              id="recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-pink-600 border-gray-500 rounded focus:ring-pink-500"
            />
            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-300">
              Mark as Recurring
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Expense
          </button>
        </form>
      );
    };

    export default AddExpenseForm;
