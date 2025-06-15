import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AddCategoryForm: React.FC = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const addCategory = useMutation(api.finance.addCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addCategory({ name: name.trim(), icon: icon.trim() || undefined });
      setName('');
      setIcon('');
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          placeholder="e.g., Groceries"
          required
        />
      </div>
      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-300">
          Icon (emoji)
        </label>
        <input
          type="text"
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          placeholder="e.g., 🛒"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Add Category
      </button>
    </form>
  );
};

export default AddCategoryForm;
